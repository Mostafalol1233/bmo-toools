import { ArrowRight, CheckCircle2, Home as HomeIcon, LockKeyhole } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation, useRoute } from "wouter";
import CalculatorModal from "@/components/calculator-modal";
import BatchToolSuite, { isBatchToolSlug } from "@/components/batch-tool-suite";
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
    return [...TOOL_SEO.slice(toolIndex + 1), ...TOOL_SEO.slice(0, toolIndex)].slice(0, 3);
  }, [tool]);

  if (!tool) return <NotFound />;

  const cleanTitle = tool.title.replace(" | BMO Tools", "");
  const title = language === "ar" ? tool.title : tool.title;
  const description = tool.description;

  return (
    <>
      <MetaTags title={title} description={description} keywords={tool.keywords} url={`/tools/${tool.slug}`} type="website" />
      <SEOSchema type="tool" toolName={cleanTitle} toolDescription={description} toolSlug={tool.slug} />
      <main className="min-h-screen bg-[#f6f8fb] pb-16">
        <div className="border-b border-slate-200 bg-white/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-cyan-700"><HomeIcon size={16} /> الصفحة الرئيسية</Link>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600"><LockKeyhole size={14} /> معالجة داخل المتصفح</span>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <nav aria-label="مسار التنقل" className="mb-7 flex items-center gap-2 text-sm font-semibold text-slate-400">
            <Link href="/" className="transition hover:text-cyan-700">الرئيسية</Link><ArrowRight size={15} className="rotate-180" /><span className="text-slate-600">{cleanTitle}</span>
          </nav>
          <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-950/10 sm:px-10 sm:py-10">
            <div className="absolute -left-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden="true"></div>
            <div className="relative max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-black text-cyan-200"><CheckCircle2 size={14} /> أداة مجانية وسريعة</span>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">{cleanTitle}</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">{description}</p>
            </div>
          </section>
          <section aria-label="الأداة" className="relative z-10 mx-auto -mt-5 max-w-6xl">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 sm:p-8">
              {isBatchToolSlug(tool.slug) ? <BatchToolSuite slug={tool.slug} /> : <CalculatorModal toolId={tool.slug} onClose={() => navigate("/")} />}
            </div>
          </section>
          <section className="mx-auto mt-10 max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black text-slate-950">أدوات قد تهمك</h2><Link href="/#tools" className="text-sm font-bold text-cyan-700 hover:text-cyan-900">عرض الكل</Link></div>
            <div className="grid gap-3 md:grid-cols-3">{relatedTools.map((relatedTool) => <Link key={relatedTool.slug} href={`/tools/${relatedTool.slug}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800">{relatedTool.title.replace(" | BMO Tools", "")}</Link>)}</div>
          </section>
        </div>
      </main>
    </>
  );
}
