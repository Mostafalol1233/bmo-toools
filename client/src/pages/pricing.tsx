import { Check, Code2, Globe2, Sparkles, Wrench } from "lucide-react";
import { Link } from "wouter";
import SiteHeader from "@/components/site-header";

const features = [
  "الوصول إلى الأدوات الحسابية والتحويلية والنصية",
  "تشغيل المعالجة داخل المتصفح عندما تكون الأداة محلية",
  "لا حاجة إلى تسجيل حساب للاستخدام الأساسي",
  "صفحة مستقلة لكل أداة وروابط لأدوات مشابهة",
  "دعم عربي وإنجليزي وتصميم متجاوب",
  "تحديثات وتحسينات مستمرة للمكونات والوظائف",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white shadow-2xl sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200">
              <Sparkles size={16} /> مجاني للاستخدام الأساسي
            </div>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl">أدوات عملية بدون تعقيد أو اشتراك إلزامي</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">استخدم أدوات BMO مباشرة من المتصفح، واستفد من الصفحات المستقلة والنتائج السريعة والخصوصية في الأدوات التي تعمل محلياً. لا نضع جدار دفع أمام الأدوات الأساسية.</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <article className="rounded-3xl border-2 border-cyan-500 bg-white p-7 shadow-xl shadow-cyan-900/10 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-cyan-700">الخطة الحالية</p>
                <h2 className="mt-2 text-3xl font-black">الخطة المجانية</h2>
                <p className="mt-2 text-slate-600">مناسبة للاستخدام اليومي والمشاريع الصغيرة والتجارب السريعة.</p>
              </div>
              <div className="rounded-2xl bg-slate-950 px-5 py-3 text-center text-white"><span className="block text-3xl font-black">0</span><span className="text-xs font-bold text-slate-300">بدون رسوم</span></div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => <div key={feature} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700"><Check className="mt-0.5 shrink-0 text-emerald-600" size={18} />{feature}</div>)}
            </div>
            <Link href="/#tools" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-6 py-3.5 text-sm font-black text-white transition hover:bg-cyan-700"><Wrench size={18} /> ابدأ باستخدام الأدوات</Link>
          </article>

          <div className="grid gap-6">
            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Code2 size={23} /></div>
              <h2 className="mt-5 text-2xl font-black">واجهات برمجة سهلة</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">نجهز مسارات API موحدة للأدوات التي يمكن تشغيلها على الخادم، مع أمثلة للطلب والاستجابة لتسهيل دمجها في المواقع والبوتات.</p>
              <Link href="/api" className="mt-5 inline-flex items-center gap-2 font-black text-violet-700 hover:text-violet-900">استعراض واجهة البرمجة <Globe2 size={17} /></Link>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><Globe2 size={23} /></div>
              <h2 className="mt-5 text-2xl font-black">شفافية الاستخدام</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">كل أداة تعرض وصفها، وطريقة استخدامها، وأدوات مشابهة لها. سنوضح دائماً أي حدود مرتبطة بخدمة خارجية أو بمولد الصور.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
