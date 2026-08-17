import { Link, useRoute } from "wouter";
import MetaTags from "@/components/meta-tags";
import { getArticle, BLOG_ARTICLES } from "@/content/blog";
import { getToolSeo } from "@shared/seo";

function ArticleSchema({ article }: { article: ReturnType<typeof getArticle> }) {
  if (!article) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { "@type": "Organization", name: "BMO Tools" },
    publisher: { "@type": "Organization", name: "BMO Tools" },
    mainEntityOfPage: `https://bmo-tools.vercel.app/blog/${article.slug}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Blog() {
  const [, articleParams] = useRoute("/blog/:slug");
  const article = articleParams?.slug ? getArticle(articleParams.slug) : undefined;

  if (articleParams?.slug && !article) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 text-center">
        <MetaTags title="المقال غير موجود | BMO Tools" description="المقال المطلوب غير موجود." url={`/blog/${articleParams.slug}`} />
        <h1 className="text-3xl font-bold text-slate-900">المقال غير موجود</h1>
        <Link href="/blog" className="mt-6 inline-block text-cyan-700 underline">العودة إلى المدونة</Link>
      </main>
    );
  }

  if (article) {
    const relatedTools = article.relatedToolSlugs
      .map((slug) => getToolSeo(slug))
      .filter(Boolean);
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 py-10">
        <MetaTags
          title={`${article.title} | BMO Tools`}
          description={article.description}
          url={`/blog/${article.slug}`}
          type="article"
        />
        <ArticleSchema article={article} />
        <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg md:p-10">
          <nav className="mb-8 text-sm text-slate-600" aria-label="مسار التنقل">
            <Link href="/" className="hover:text-cyan-700 hover:underline">الرئيسية</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-cyan-700 hover:underline">المدونة</Link>
          </nav>
          <p className="mb-3 text-sm text-slate-500">{article.publishedAt}</p>
          <h1 className="mb-5 text-3xl font-bold leading-relaxed text-slate-900">{article.title}</h1>
          <p className="mb-8 text-lg leading-loose text-slate-600">{article.description}</p>
          <div className="space-y-6 text-base leading-loose text-slate-700">
            {article.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <section className="mt-10 border-t border-slate-200 pt-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">أدوات مرتبطة بالموضوع</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {relatedTools.map((tool) => tool && (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="rounded-lg border border-slate-200 p-4 text-cyan-800 hover:bg-cyan-50">
                  {tool.title.replace(" | BMO Tools", "")}
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 py-10">
      <MetaTags
        title="مدونة BMO Tools: شروحات الأدوات والحسابات"
        description="اقرأ شروحات عملية لاستخدام أدوات BMO Tools في الحساب والتحويل ومعالجة الصور وتنظيم الوقت."
        url="/blog"
      />
      <section className="mx-auto max-w-5xl">
        <nav className="mb-8 text-sm text-slate-600" aria-label="مسار التنقل">
          <Link href="/" className="hover:text-cyan-700 hover:underline">الرئيسية</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>المدونة</span>
        </nav>
        <header className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-3 text-3xl font-bold text-slate-900">مدونة BMO Tools</h1>
          <p className="text-slate-600">شروحات ونصائح عملية للاستفادة من الأدوات المجانية في الدراسة والعمل والمهام اليومية.</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {BLOG_ARTICLES.map((item) => (
            <article key={item.slug} className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-3 text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="mb-5 leading-relaxed text-slate-600">{item.description}</p>
              <Link href={`/blog/${item.slug}`} className="font-semibold text-cyan-700 hover:underline">اقرأ المقال</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
