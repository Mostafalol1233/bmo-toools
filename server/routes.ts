import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { nanoid } from "nanoid";
import { insertUrlSchema } from "../shared/schema.js";
import { BLOG_SLUGS, SEO_BASE_URL, TOOL_SEO } from "../shared/seo.js";
import FormData from "form-data";
import axios from "axios";

export async function registerRoutes(app: Express, createHttpServer: boolean = true): Promise<Server | null> {
  // Public developer API: free, JSON-only, and easy to call from bots and websites.
  app.use('/api/v1', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  });

  app.get('/api/v1/catalog', (_req, res) => {
    const tools = TOOL_SEO.map((tool) => ({
      slug: tool.slug,
      name: tool.title,
      description: tool.description,
      url: `${SEO_BASE_URL}/tools/${tool.slug}`,
      free: true,
    }));
    return res.json({ name: 'BMO Tools API', version: '1', free: true, tools });
  });

  app.post('/api/v1/calculate/percentage', (req, res) => {
    const value = Number(req.body?.value);
    const percent = Number(req.body?.percent);
    if (!Number.isFinite(value) || !Number.isFinite(percent)) {
      return res.status(400).json({ error: 'أرسل value و percent كأرقام صحيحة.' });
    }
    return res.json({ value, percent, result: value * percent / 100 });
  });

  app.post('/api/v1/calculate/loan', (req, res) => {
    const principal = Number(req.body?.principal);
    const annualRate = Number(req.body?.annualRate);
    const months = Number(req.body?.months);
    if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isFinite(months) || principal <= 0 || months <= 0) {
      return res.status(400).json({ error: 'أرسل principal و annualRate و months بقيم موجبة.' });
    }
    const monthlyRate = annualRate / 100 / 12;
    const payment = monthlyRate === 0 ? principal / months : principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
    return res.json({ principal, annualRate, months, monthlyPayment: payment, totalPayment: payment * months, totalInterest: payment * months - principal });
  });

  // URL Shortener Routes
  app.post('/api/urls', async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validation = insertUrlSchema.safeParse({
        originalUrl: req.body.originalUrl,
        shortCode: '' // Will be generated below
      });
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0]?.message || "Invalid URL" 
        });
      }
      
      const { originalUrl } = validation.data;
      
      // Generate short code with collision handling (max 3 retries)
      let shortCode: string;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        shortCode = nanoid(6);
        const existing = await storage.getUrlByShortCode(shortCode);
        
        if (!existing) {
          break; // Found unique code
        }
        
        attempts++;
        if (attempts === maxAttempts) {
          return res.status(500).json({ 
            error: "Failed to generate unique short code. Please try again." 
          });
        }
      }
      
      const url = await storage.createShortUrl(originalUrl, shortCode!);
      
      return res.status(201).json(url);
    } catch (error) {
      console.error("Error creating short URL:", error);
      return res.status(500).json({ error: "Failed to create short URL" });
    }
  });

  app.get('/api/urls/:shortCode', async (req, res) => {
    try {
      const { shortCode } = req.params;
      
      const url = await storage.getUrlByShortCode(shortCode);
      
      if (!url) {
        return res.status(404).json({ error: "Short URL not found" });
      }
      
      return res.redirect(302, url.originalUrl);
    } catch (error) {
      console.error("Error retrieving short URL:", error);
      return res.status(500).json({ error: "Failed to retrieve short URL" });
    }
  });

  app.get('/api/urls', async (req, res) => {
    try {
      const urls = await storage.getAllUrls();
      return res.json(urls);
    } catch (error) {
      console.error("Error retrieving URLs:", error);
      return res.status(500).json({ error: "Failed to retrieve URLs" });
    }
  });

  app.post('/api/urls/isgd', async (req, res) => {
    try {
      const { originalUrl } = req.body;
      
      if (!originalUrl || typeof originalUrl !== 'string') {
        return res.status(400).json({ error: "Invalid URL" });
      }

      const isGdUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(originalUrl)}`;
      const response = await fetch(isGdUrl);
      const data = await response.json();
      
      if (data.shorturl) {
        return res.json({ shorturl: data.shorturl });
      } else {
        return res.status(400).json({ error: data.errormessage || "Failed to shorten URL" });
      }
    } catch (error) {
      console.error("Error calling is.gd API:", error);
      return res.status(500).json({ error: "Failed to contact is.gd service" });
    }
  });

  app.post('/api/urls/tinyurl', async (req, res) => {
    try {
      const { originalUrl } = req.body;
      
      if (!originalUrl || typeof originalUrl !== 'string') {
        return res.status(400).json({ error: "Invalid URL" });
      }

      const tinyUrlEndpoint = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`;
      const response = await fetch(tinyUrlEndpoint);
      const shortUrl = await response.text();
      
      if (shortUrl && shortUrl.startsWith('http')) {
        return res.json({ shorturl: shortUrl.trim() });
      } else {
        return res.status(400).json({ error: "Failed to shorten URL" });
      }
    } catch (error) {
      console.error("Error calling TinyURL API:", error);
      return res.status(500).json({ error: "Failed to contact TinyURL service" });
    }
  });

  app.post('/api/urls/expand', async (req, res) => {
    try {
      const { shortUrl } = req.body;
      
      if (!shortUrl || typeof shortUrl !== 'string') {
        return res.status(400).json({ error: "Invalid URL" });
      }

      const response = await fetch(shortUrl, {
        method: 'HEAD',
        redirect: 'manual',
      });

      let expandedUrl = shortUrl;
      let redirectCount = 0;
      const maxRedirects = 10;
      let currentUrl = shortUrl;

      while (redirectCount < maxRedirects) {
        const headResponse = await fetch(currentUrl, {
          method: 'HEAD',
          redirect: 'manual',
        });

        if (headResponse.status >= 300 && headResponse.status < 400) {
          const location = headResponse.headers.get('location');
          if (location) {
            currentUrl = location.startsWith('http') ? location : new URL(location, currentUrl).href;
            expandedUrl = currentUrl;
            redirectCount++;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      return res.json({ 
        originalUrl: shortUrl,
        expandedUrl,
        redirectCount
      });
    } catch (error) {
      console.error("Error expanding URL:", error);
      return res.status(500).json({ error: "Failed to expand URL" });
    }
  });

  app.post('/api/background-removal', async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: "Invalid image data" });
      }

      const apiKey = process.env.BACKGROUND_REMOVAL_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Background removal API key not configured" });
      }

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      const formData = new FormData();
      formData.append('image_file', buffer, {
        filename: 'image.png',
        contentType: 'image/png'
      });
      formData.append('size', 'auto');

      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          'X-Api-Key': apiKey,
          ...formData.getHeaders(),
        },
        responseType: 'arraybuffer',
        validateStatus: () => true,
      });

      if (response.status !== 200) {
        const errorText = response.data.toString();
        console.error('Background removal API error:', errorText);
        let errorMessage = 'Background removal failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.errors?.[0]?.title || errorData.error || errorMessage;
        } catch {
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        return res.status(response.status).json({ 
          error: errorMessage,
          details: errorText
        });
      }

      const base64Result = Buffer.from(response.data).toString('base64');
      
      return res.json({ 
        success: true,
        imageBase64: `data:image/png;base64,${base64Result}`
      });
    } catch (error) {
      console.error("Error removing background:", error);
      return res.status(500).json({ error: "Failed to remove background" });
    }
  });

  app.post('/api/designfy', async (req, res) => {
    try {
      const { action, imageBase64, params } = req.body;
      
      if (!action || typeof action !== 'string') {
        return res.status(400).json({ error: "Invalid action" });
      }

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: "Invalid image data" });
      }

      const apiKey = process.env.DESIGNFY_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Designfy API key not configured" });
      }

      const designfyEndpoint = 'https://api.designfy.com/v1/edit';
      
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      
      const requestBody = {
        api_key: apiKey,
        action,
        image_base64: base64Data,
        ...params
      };

      const response = await fetch(designfyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorDetail = JSON.stringify(data);
        console.error('Designfy API error:', errorDetail);
        return res.status(response.status).json({ 
          error: data.error || data.message || 'Designfy operation failed',
          details: errorDetail
        });
      }

      return res.json(data);
    } catch (error) {
      console.error("Error calling Designfy API:", error);
      return res.status(500).json({ error: "Failed to process with Designfy" });
    }
  });

  app.post('/api/ai-image-generate', async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Invalid prompt" });
      }

      const enhancedPrompt = `${prompt}, high quality, detailed, 8k, masterpiece`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&nologo=true&model=flux`;
      
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        console.error('Image generation failed:', response.status, response.statusText);
        return res.status(response.status).json({ 
          error: 'Failed to generate image' 
        });
      }

      const imageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      
      return res.json({ 
        success: true,
        imageUrl: imageUrl,
        imageBase64: `data:image/jpeg;base64,${base64Image}`
      });
    } catch (error) {
      console.error("Error generating AI image:", error);
      return res.status(500).json({ error: "Failed to generate AI image" });
    }
  });

  app.post('/api/urls/check-malicious', async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "Invalid URL" });
      }

      const urlhausApiUrl = 'https://urlhaus-api.abuse.ch/v1/url/';
      const response = await fetch(urlhausApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `url=${encodeURIComponent(url)}`
      });

      const data = await response.json();
      
      let result = {
        url,
        isSafe: true,
        status: 'safe',
        threat: null as string | null,
        details: null as string | null,
        lastSeen: null as string | null,
        tags: [] as string[]
      };

      if (data.query_status === 'ok') {
        result.isSafe = false;
        result.status = 'malicious';
        result.threat = data.threat || 'Unknown threat';
        result.details = data.url_status || 'URL found in malware database';
        result.lastSeen = data.date_added || null;
        result.tags = data.tags || [];
      } else if (data.query_status === 'no_results') {
        result.isSafe = true;
        result.status = 'safe';
        result.details = 'URL not found in malware databases';
      } else {
        result.status = 'unknown';
        result.details = 'Unable to determine URL safety';
      }

      return res.json(result);
    } catch (error) {
      console.error("Error checking malicious URL:", error);
      return res.status(500).json({ 
        error: "Failed to check URL",
        url: req.body.url,
        isSafe: null,
        status: 'error',
        details: 'Service temporarily unavailable'
      });
    }
  });

  // SEO Routes
  app.get('/api/robots', (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /

# Crawl-delay for polite crawling
Crawl-delay: 1

# Block access to API endpoints and admin routes
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow all calculator tools
Allow: /tools/
Allow: /calculator/

# Sitemap location
Sitemap: ${SEO_BASE_URL}/sitemap.xml`;

    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  app.get('/api/sitemap', (req, res) => {
    const baseUrl = SEO_BASE_URL;
    const currentDate = new Date().toISOString().split('T')[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${BLOG_SLUGS.map((slug) => `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${TOOL_SEO.map(({ slug, priority }) => `  <url>
    <loc>${baseUrl}/tools/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  if (!createHttpServer) {
    return null;
  }

  const httpServer = createServer(app);
  return httpServer;
}
