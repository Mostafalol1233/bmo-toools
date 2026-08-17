import { useLanguage } from "@/contexts/LanguageContext";
import { SEO_BASE_URL } from "@shared/seo";

interface SEOSchemaProps {
  type?: "website" | "tool";
  toolName?: string;
  toolDescription?: string;
  toolSlug?: string;
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function SEOSchema({
  type = "website",
  toolName,
  toolDescription,
  toolSlug,
}: SEOSchemaProps) {
  const { language } = useLanguage();
  const toolUrl = toolSlug ? `${SEO_BASE_URL}/tools/${toolSlug}` : SEO_BASE_URL;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: language === "ar" ? "BMO Tools - أدوات BMO" : "BMO Tools",
    description:
      language === "ar"
        ? "منصة مجانية للأدوات الحسابية والتقنية وأدوات الصور والنصوص باللغة العربية والإنجليزية."
        : "A free platform for calculation, technical, image, and text tools in Arabic and English.",
    url: SEO_BASE_URL,
    inLanguage: language,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SEO_BASE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BMO Tools",
    url: SEO_BASE_URL,
    logo: `${SEO_BASE_URL}/generated-icon.png`,
    description:
      language === "ar"
        ? "منصة رقمية توفر أدوات مجانية مفيدة للمستخدمين العرب."
        : "A digital platform providing useful free tools for Arabic-speaking users.",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: language === "ar" ? "الرئيسية" : "Home",
        item: SEO_BASE_URL,
      },
      ...(toolName && toolSlug
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: toolName,
              item: toolUrl,
            },
          ]
        : []),
    ],
  };

  const toolSchema =
    type === "tool" && toolName && toolDescription && toolSlug
      ? {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: toolName,
          description: toolDescription,
          url: toolUrl,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "All",
          browserRequirements: "Requires JavaScript",
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }
      : null;

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={breadcrumbSchema} />
      {toolSchema && <JsonLd data={toolSchema} />}
    </>
  );
}
