import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import { insertUrlSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml

# Host specification
Host: ${req.protocol}://${req.get('host')}`;

    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  app.get('/api/sitemap', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const currentDate = new Date().toISOString().split('T')[0];
    
    const tools = [
      'age-calculator',
      'bmi-calculator', 
      'unit-converter',
      'password-generator',
      'bmo-encryption',
      'cipher-detector',
      'percentage-calculator',
      'random-number-generator',
      'date-difference',
      'tax-calculator',
      'square-root',
      'gpa-calculator'
    ];

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
${tools.map(tool => `  <url>
    <loc>${baseUrl}/tools/${tool}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  const httpServer = createServer(app);

  return httpServer;
}
