import { useLanguage } from '@/contexts/LanguageContext';

interface SEOSchemaProps {
  type?: 'website' | 'tool';
  toolName?: string;
  toolDescription?: string;
}

export default function SEOSchema({ type = 'website', toolName, toolDescription }: SEOSchemaProps) {
  const { language } = useLanguage();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": language === 'ar' ? "BMO Tools - أدوات BMO" : "BMO Tools",
    "description": language === 'ar' 
      ? "BMO Tools - مجموعة شاملة من الأدوات الحسابية والتقنية المتقدمة: حاسبة علمية، مؤقت ذكي، ساعة عالمية، تحويل الصور، PDF، QR، اختصار الروابط، وأكثر من 20 أداة مجانية"
      : "BMO Tools - Comprehensive collection of advanced calculation and technical tools: scientific calculator, smart timer, world clock, image converter, PDF tools, QR codes, URL shortener, and more than 20 free tools",
    "url": "https://bmo-tools.vercel.app",
    "inLanguage": language === 'ar' ? "ar" : "en",
    "author": {
      "@type": "Organization",
      "name": "BMO Tools"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bmo-tools.vercel.app/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BMO Tools",
    "url": "https://bmo-tools.vercel.app",
    "logo": "https://bmo-tools.vercel.app/generated-icon.png",
    "description": language === 'ar'
      ? "منصة رقمية متقدمة توفر أكثر من 20 أداة حسابية وتقنية مجانية باللغة العربية والإنجليزية"
      : "Advanced digital platform providing more than 20 free calculation and technical tools in Arabic and English",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Arabic", "English"]
    }
  };

  const toolSchema = toolName ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolName,
    "description": toolDescription,
    "url": `https://bmo-tools.vercel.app/tools/${toolName.toLowerCase().replace(/\s+/g, '-')}`,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "BMO Tools"
    }
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": language === 'ar' ? "الرئيسية" : "Home",
        "item": "https://bmo-tools.vercel.app"
      },
      ...(toolName ? [{
        "@type": "ListItem",
        "position": 2,
        "name": toolName,
        "item": `https://bmo-tools.vercel.app/tools/${toolName.toLowerCase().replace(/\s+/g, '-')}`
      }] : [])
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": language === 'ar' ? "ما هو نظام تشفير BMO؟" : "What is BMO encryption system?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar' 
            ? "نظام تشفير BMO هو نظام تشفير متقدم ومبتكر يوفر حماية عالية للنصوص والبيانات الحساسة"
            : "BMO encryption system is an advanced and innovative encryption system that provides high protection for texts and sensitive data"
        }
      },
      {
        "@type": "Question", 
        "name": language === 'ar' ? "هل الأدوات مجانية؟" : "Are the tools free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": language === 'ar'
            ? "نعم، جميع الأدوات متاحة مجاناً بدون أي قيود أو رسوم"
            : "Yes, all tools are available for free without any restrictions or fees"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {type === 'website' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {toolSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
        />
      )}
    </>
  );
}