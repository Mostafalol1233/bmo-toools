import { useMemo } from "react";
import { Link, useLocation, useRoute } from "wouter";
import CalculatorModal from "@/components/calculator-modal";
import MetaTags from "@/components/meta-tags";
import SEOSchema from "@/components/seo-schema";
import { useLanguage } from "@/contexts/LanguageContext";
import { getToolSeo, TOOL_SEO } from "@shared/seo";
import NotFound from "@/pages/not-found";

export default function ToolPage() {
  const [, params] = useRoute("/tools/:slug");
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const slug = params?.slug ?? "";
  const tool = getToolSeo(slug);

  const relatedTools = useMemo(() => {
    if (!tool) return [];
    const toolIndex = TOOL_SEO.findIndex((item) => item.slug === tool.slug);
    return [...TOOL_SEO.slice(toolIndex + 1), ...TOOL_SEO.slice(0, toolIndex)]
      .slice(0, 3);
  }, [tool]);

  if (!tool) return <NotFound />;

  const title = language === "ar" ? tool.title : tool.title.replace(" | BMO Tools", " | BMO Tools");
  const description = tool.description;

  return (
    <>
      <MetaTags
        title={title}
        description={description}
        keywords={tool.keywords}
        url={`/tools/${tool.slug}`}
        type="website"
      />
      <SEOSchema
        type="tool"
        toolName={title.replace(" | BMO Tools", "")}
        toolDescription={description}
        toolSlug={tool.slug}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-10">
        <div className="container mx-auto px-4">
          <nav aria-label="مسار التنقل" className="mb-6 text-sm text-slate-600">
            <Link href="/" className="hover:text-cyan-700 hover:underline">
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>{title.replace(" | BMO Tools", "")}</span>
          </nav>

          <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-lg md:p-8">
            <h1 className="mb-3 text-3xl font-bold text-slate-900">{title.replace(" | BMO Tools", "")}</h1>
            <p className="max-w-3xl text-slate-600">{description}</p>
          </section>

          <section aria-label="الأداة" className="mt-6">
            <CalculatorModal toolId={tool.slug} onClose={() => navigate("/")} />
          </section>

          <section className="mx-auto mt-8 max-w-4xl rounded-2xl bg-white p-6 shadow-lg md:p-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {language === "ar" ? "أدوات قد تهمك" : "Related tools"}
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/tools/${relatedTool.slug}`}
                  className="rounded-lg border border-slate-200 p-4 text-slate-700 transition-colors hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-800"
                >
                  {relatedTool.title.replace(" | BMO Tools", "")}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
