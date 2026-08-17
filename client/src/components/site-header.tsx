import { useState } from "react";
import { ChevronDown, Menu, X, Wrench, Search } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const groups: Array<{ label: string; items: Array<[string, string]> }> = [
  {
    label: "الحاسبات والرياضيات",
    items: [
      ["scientific-calculator", "الآلة العلمية"],
      ["age-calculator", "حاسبة العمر"],
      ["bmi-calculator", "حاسبة BMI"],
      ["percentage-calculator", "النسبة المئوية"],
      ["tax-calculator", "الضريبة"],
      ["gpa-calculator", "المعدل التراكمي"],
      ["loan-calculator", "القروض"],
      ["aspect-ratio", "نسبة العرض والارتفاع"],
    ],
  },
  {
    label: "التحويلات",
    items: [
      ["unit-converter", "محول الوحدات"],
      ["storage-converter", "محول التخزين"],
      ["date-converter", "محول التاريخ"],
      ["color-palette", "منتقي الألوان"],
      ["json-yaml", "JSON و YAML"],
    ],
  },
  {
    label: "الصور والملفات",
    items: [
      ["image-converter", "تحويل الصور"],
      ["image-resizer", "تغيير الحجم"],
      ["image-cropper", "قص الصور"],
      ["image-combiner", "دمج الصور"],
      ["bg-remover", "إزالة الخلفية"],
      ["pdf-merger", "دمج PDF"],
      ["pdf-splitter", "تقسيم PDF"],
    ],
  },
  {
    label: "النصوص والمطورون",
    items: [
      ["text-counter", "عداد النصوص"],
      ["json-formatter", "منسق JSON"],
      ["text-encoder", "تشفير النصوص"],
      ["password-generator", "مولد كلمات المرور"],
      ["qr-code", "مولد QR"],
      ["url-shortener", "اختصار الروابط"],
      ["link-checker", "فحص الروابط"],
    ],
  },
  {
    label: "الوقت والمنوعات",
    items: [
      ["timer", "المؤقت"],
      ["countdown-timer", "العداد التنازلي"],
      ["stopwatch", "ساعة الإيقاف"],
      ["world-clock", "الساعة العالمية"],
      ["random-generator", "الأرقام العشوائية"],
      ["spinner-wheel", "عجلة الاختيار"],
      ["reaction-test", "اختبار رد الفعل"],
    ],
  },
];

export default function SiteHeader() {
  const { t, language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="العودة إلى الصفحة الرئيسية">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-cyan-300 shadow-lg transition-transform group-hover:-rotate-6">
            <Wrench size={19} />
          </span>
          <span className="hidden sm:block">
            <span className="block text-base font-black tracking-tight text-slate-950">{t("site.title")}</span>
            <span className="block text-[10px] font-bold text-slate-500">أدوات رقمية تعمل فعلياً</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="قائمة الأدوات الرئيسية">
          <Link href="/#tools" className="rounded-lg px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700">كل الأدوات</Link>
          {groups.map((group) => (
            <details key={group.label} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700">
                {group.label}<ChevronDown size={15} className="transition group-open:rotate-180" />
              </summary>
              <div className="absolute right-0 top-full mt-2 grid w-[24rem] grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/15">
                {group.items.map(([slug, label]) => (
                  <Link key={slug} href={`/tools/${slug}`} className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800">
                    {label}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          <Link href="/blog" className="rounded-lg px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700">المدونة</Link>
          <Link href="/pricing" className="rounded-lg bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-800 transition hover:bg-cyan-100">الأسعار: مجاني</Link>
          <Link href="/api-docs" className="rounded-lg px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700">API</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/#tools" className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 sm:block" aria-label="البحث عن أداة"><Search size={18} /></Link>
          <button type="button" onClick={() => setLanguage(language === "ar" ? "en" : "ar")} className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 sm:block">{t("lang.switch")}</button>
          <button type="button" onClick={() => setMobileOpen((open) => !open)} className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden" aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 lg:hidden">
          <div className="grid gap-1 sm:grid-cols-2">
            {groups.flatMap((group) => group.items).map(([slug, label]) => (
              <Link key={slug} href={`/tools/${slug}`} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-cyan-50 hover:text-cyan-800">{label}</Link>
            ))}
          </div>
          <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl bg-slate-950 px-3 py-2 text-center text-sm font-black text-white">المدونة</Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl bg-cyan-600 px-3 py-2 text-center text-sm font-black text-white">مجاني</Link>
            <Link href="/api-docs" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-black text-slate-700">API</Link>
            <button type="button" onClick={() => setLanguage(language === "ar" ? "en" : "ar")} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700">{t("lang.switch")}</button>
          </div>
        </div>
      )}
    </header>
  );
}
