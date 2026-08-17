import { Copy, Code2, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import SiteHeader from "@/components/site-header";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/catalog",
    title: "فهرس الأدوات",
    description: "يعيد قائمة الأدوات وروابطها وحالة كونها مجانية.",
    example: "fetch('https://bmo-toools-three.vercel.app/api/v1/catalog')",
  },
  {
    method: "POST",
    path: "/api/v1/calculate/percentage",
    title: "حساب النسبة المئوية",
    description: "أرسل value و percent لتحصل على النتيجة الرقمية.",
    example: "fetch('/api/v1/calculate/percentage', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({value: 250, percent: 15}) })",
  },
  {
    method: "POST",
    path: "/api/v1/calculate/loan",
    title: "حساب القسط الشهري",
    description: "أرسل principal و annualRate و months لحساب القسط والفائدة والإجمالي.",
    example: "fetch('/api/v1/calculate/loan', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({principal: 100000, annualRate: 12, months: 36}) })",
  },
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10">
          <div className="flex flex-wrap items-center gap-3 text-cyan-200"><Code2 size={22} /><span className="text-sm font-black">واجهة المطورين</span></div>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">API مجانية وسهلة الدمج</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">استخدم المسارات التالية من موقعك أو بوتك عبر طلبات JSON عادية. لا تحتاج إلى تشغيل واجهة BMO Tools داخل مشروعك، ويمكنك البدء بالمسارات العامة الموثقة أدناه.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-black"><span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-4 py-2 text-emerald-200"><ShieldCheck size={16} /> مجانية حالياً</span><span className="rounded-full bg-white/10 px-4 py-2 text-slate-200">إصدار 1</span></div>
        </section>

        <section className="mt-8 grid gap-5">
          {endpoints.map((endpoint) => (
            <article key={endpoint.path} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
              <div className="flex flex-wrap items-center gap-3"><span className={`rounded-lg px-3 py-1.5 text-xs font-black ${endpoint.method === "GET" ? "bg-emerald-100 text-emerald-800" : "bg-violet-100 text-violet-800"}`}>{endpoint.method}</span><code className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-800">{endpoint.path}</code></div>
              <h2 className="mt-5 text-2xl font-black">{endpoint.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{endpoint.description}</p>
              <div className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-left" dir="ltr"><code className="whitespace-pre-wrap break-all text-xs leading-7 text-cyan-200">{endpoint.example}</code></div>
              <button type="button" onClick={() => navigator.clipboard?.writeText(endpoint.example)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"><Copy size={16} /> نسخ المثال</button>
            </article>
          ))}
        </section>

        <div className="mt-8 flex flex-wrap gap-3"><Link href="/pricing" className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-black text-white hover:bg-cyan-700">عرض التسعير</Link><a href="https://github.com/Mostafalol1233/bmo-toools" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:border-cyan-300"><ExternalLink size={16} /> المستودع والتوثيق</a></div>
      </main>
    </div>
  );
}
