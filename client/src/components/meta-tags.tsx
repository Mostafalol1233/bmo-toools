import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export default function MetaTags({
  title,
  description,
  keywords,
  image = '/generated-icon.png',
  url = '/',
  type = 'website'
}: MetaTagsProps) {
  const { language } = useLanguage();

  const baseUrl = 'https://bmo-tools.vercel.app';
  const fullUrl = `${baseUrl}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const defaultTitle = language === 'ar' 
    ? 'BMO Tools - أدوات BMO المتقدمة'
    : 'BMO Tools - Advanced Calculation & Utility Tools';

  const defaultDescription = language === 'ar'
    ? 'BMO Tools - مجموعة شاملة من الأدوات الحسابية والتقنية المتقدمة: حاسبة علمية، مؤقت ذكي، ساعة عالمية، تحويل الصور، PDF، QR، اختصار الروابط، وأكثر من 20 أداة مجانية.'
    : 'BMO Tools - Comprehensive collection of advanced calculation and technical tools: scientific calculator, smart timer, world clock, image converter, PDF tools, QR codes, URL shortener, and more than 20 free tools.';

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || (language === 'ar' 
    ? 'bmo tools, حاسبة علمية, أدوات حسابية, تحويل وحدات, حساب العمر, BMI, مولد كلمات مرور, تشفير BMO, QR code, PDF tools, URL shortener, scientific calculator'
    : 'bmo tools, scientific calculator, calculation tools, unit converter, age calculator, BMI, password generator, BMO encryption, QR code, PDF tools, URL shortener');

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', language === 'ar' ? 'Arabic' : 'English');

    // Open Graph tags
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:image', fullImageUrl, true);
    updateMetaTag('og:locale', language === 'ar' ? 'ar_AR' : 'en_US', true);
    updateMetaTag('og:site_name', language === 'ar' ? 'BMO Tools' : 'BMO Tools', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', fullImageUrl);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

  }, [finalTitle, finalDescription, finalKeywords, fullUrl, fullImageUrl, type, language]);

  return null;
}