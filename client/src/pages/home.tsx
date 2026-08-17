import { useState, useMemo } from "react";
import ToolCard from "@/components/tool-card";
import SEOSchema from "@/components/seo-schema";
import MetaTags from "@/components/meta-tags";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpLeft, Filter, Layers3, Search, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Link } from "wouter";
import SiteHeader from "@/components/site-header";

interface Tool {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  color: string;
  category: string;
}

const tools: Tool[] = [
  // Time Tools
  {
    id: "timer",
    titleKey: "timer.title",
    descKey: "timer.desc",
    icon: "fas fa-hourglass-half",
    color: "blue",
    category: "time"
  },
  {
    id: "world-clock",
    titleKey: "world-clock.title",
    descKey: "world-clock.desc",
    icon: "fas fa-globe",
    color: "cyan",
    category: "time"
  },
  {
    id: "stopwatch",
    titleKey: "stopwatch.title",
    descKey: "stopwatch.desc",
    icon: "fas fa-stopwatch",
    color: "teal",
    category: "time"
  },
  {
    id: "countdown-timer",
    titleKey: "countdown-timer.title",
    descKey: "countdown-timer.desc",
    icon: "fas fa-clock",
    color: "indigo",
    category: "time"
  },
  
  // Calculators
  {
    id: "scientific-calculator",
    titleKey: "scientific-calculator.title",
    descKey: "scientific-calculator.desc",
    icon: "fas fa-calculator",
    color: "indigo",
    category: "calculators"
  },
  {
    id: "age-calculator",
    titleKey: "age-calculator.title",
    descKey: "age-calculator.desc",
    icon: "fas fa-birthday-cake",
    color: "purple",
    category: "calculators"
  },
  {
    id: "bmi-calculator",
    titleKey: "bmi-calculator.title",
    descKey: "bmi-calculator.desc",
    icon: "fas fa-weight",
    color: "amber",
    category: "calculators"
  },
  {
    id: "percentage-calculator",
    titleKey: "percentage-calculator.title",
    descKey: "percentage-calculator.desc",
    icon: "fas fa-percentage",
    color: "pink",
    category: "calculators"
  },
  {
    id: "tax-calculator",
    titleKey: "tax-calculator.title",
    descKey: "tax-calculator.desc",
    icon: "fas fa-money-bill",
    color: "green",
    category: "calculators"
  },
  {
    id: "sqrt-calculator",
    titleKey: "sqrt-calculator.title",
    descKey: "sqrt-calculator.desc",
    icon: "fas fa-square-root-alt",
    color: "orange",
    category: "calculators"
  },
  {
    id: "gpa-calculator",
    titleKey: "gpa-calculator.title",
    descKey: "gpa-calculator.desc",
    icon: "fas fa-graduation-cap",
    color: "violet",
    category: "calculators"
  },
  {
    id: "date-difference",
    titleKey: "date-difference.title",
    descKey: "date-difference.desc",
    icon: "fas fa-calendar-check",
    color: "rose",
    category: "calculators"
  },
  
  // Converters
  {
    id: "date-converter",
    titleKey: "date-converter.title",
    descKey: "date-converter.desc",
    icon: "fas fa-calendar-alt",
    color: "emerald",
    category: "converters"
  },
  {
    id: "unit-converter",
    titleKey: "unit-converter.title",
    descKey: "unit-converter.desc",
    icon: "fas fa-exchange-alt",
    color: "sky",
    category: "converters"
  },
  {
    id: "color-palette",
    titleKey: "color-palette.title",
    descKey: "color-palette.desc",
    icon: "fas fa-palette",
    color: "fuchsia",
    category: "converters"
  },
  
  // Media Tools
  {
    id: "image-converter",
    titleKey: "image-converter.title",
    descKey: "image-converter.desc",
    icon: "fas fa-image",
    color: "lime",
    category: "media"
  },
  {
    id: "image-resizer",
    titleKey: "image-resizer.title",
    descKey: "image-resizer.desc",
    icon: "fas fa-expand-arrows-alt",
    color: "yellow",
    category: "media"
  },
  {
    id: "bg-remover",
    titleKey: "bg-remover.title",
    descKey: "bg-remover.desc",
    icon: "fas fa-cut",
    color: "red",
    category: "media"
  },
  {
    id: "image-cropper",
    titleKey: "image-cropper.title",
    descKey: "image-cropper.desc",
    icon: "fas fa-crop",
    color: "purple",
    category: "media"
  },
  {
    id: "image-combiner",
    titleKey: "image-combiner.title",
    descKey: "image-combiner.desc",
    icon: "fas fa-layer-group",
    color: "indigo",
    category: "media"
  },
  
  // PDF Tools
  {
    id: "pdf-merger",
    titleKey: "pdf-merger.title",
    descKey: "pdf-merger.desc",
    icon: "fas fa-file-pdf",
    color: "red",
    category: "pdf"
  },
  {
    id: "pdf-splitter",
    titleKey: "pdf-splitter.title",
    descKey: "pdf-splitter.desc",
    icon: "fas fa-scissors",
    color: "orange",
    category: "pdf"
  },
  
  // Utilities
  {
    id: "random-generator",
    titleKey: "random-generator.title",
    descKey: "random-generator.desc",
    icon: "fas fa-dice",
    color: "slate",
    category: "utilities"
  },
  {
    id: "password-generator",
    titleKey: "password-generator.title",
    descKey: "password-generator.desc",
    icon: "fas fa-key",
    color: "gray",
    category: "utilities"
  },
  {
    id: "text-encoder",
    titleKey: "text-encoder.title",
    descKey: "text-encoder.desc",
    icon: "fas fa-lock",
    color: "zinc",
    category: "utilities"
  },
  {
    id: "qr-code",
    titleKey: "qr-code.title",
    descKey: "qr-code.desc",
    icon: "fas fa-qrcode",
    color: "blue",
    category: "utilities"
  },
  {
    id: "url-shortener",
    titleKey: "url-shortener.title",
    descKey: "url-shortener.desc",
    icon: "fas fa-link",
    color: "indigo",
    category: "utilities"
  },
  {
    id: "link-checker",
    titleKey: "link-checker.title",
    descKey: "link-checker.desc",
    icon: "fas fa-shield-alt",
    color: "red",
    category: "utilities"
  },
  {
    id: "designfy",
    titleKey: "designfy.title",
    descKey: "designfy.desc",
    icon: "fas fa-magic",
    color: "purple",
    category: "media"
  },
  {
    id: "ai-image-generator",
    titleKey: "ai-image-generator.title",
    descKey: "ai-image-generator.desc",
    icon: "fas fa-robot",
    color: "indigo",
    category: "media"
  },
  {
    id: "loan-calculator",
    titleKey: "loan-calculator.title",
    descKey: "loan-calculator.desc",
    icon: "fas fa-money-check-alt",
    color: "emerald",
    category: "calculators"
  },
  {
    id: "aspect-ratio",
    titleKey: "aspect-ratio.title",
    descKey: "aspect-ratio.desc",
    icon: "fas fa-expand",
    color: "sky",
    category: "calculators"
  },
  {
    id: "progress-calculator",
    titleKey: "progress-calculator.title",
    descKey: "progress-calculator.desc",
    icon: "fas fa-tasks",
    color: "violet",
    category: "calculators"
  },
  {
    id: "storage-converter",
    titleKey: "storage-converter.title",
    descKey: "storage-converter.desc",
    icon: "fas fa-hdd",
    color: "blue",
    category: "converters"
  },
  {
    id: "json-yaml",
    titleKey: "json-yaml.title",
    descKey: "json-yaml.desc",
    icon: "fas fa-exchange-alt",
    color: "amber",
    category: "utilities"
  },
  {
    id: "text-counter",
    titleKey: "text-counter.title",
    descKey: "text-counter.desc",
    icon: "fas fa-font",
    color: "teal",
    category: "utilities"
  },
  {
    id: "json-formatter",
    titleKey: "json-formatter.title",
    descKey: "json-formatter.desc",
    icon: "fas fa-code",
    color: "slate",
    category: "utilities"
  },
  {
    id: "spinner-wheel",
    titleKey: "spinner-wheel.title",
    descKey: "spinner-wheel.desc",
    icon: "fas fa-sync-alt",
    color: "pink",
    category: "utilities"
  },
  {
    id: "reaction-test",
    titleKey: "reaction-test.title",
    descKey: "reaction-test.desc",
    icon: "fas fa-bolt",
    color: "orange",
    category: "utilities"
  }
];

const categories = ["all", "time", "calculators", "converters", "media", "pdf", "utilities"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { t, language, setLanguage } = useLanguage();

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
      const matchesSearch = 
        t(tool.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(tool.descKey).toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, t]);

  return (
    <>
      <MetaTags />
      <SEOSchema type="website" />
      <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
        <div className="border-b border-slate-200/80 bg-white/70">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-semibold text-slate-500 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> أدوات تعمل داخل متصفحك وخصوصيتك محفوظة</span>
            <Link href="/blog" className="hidden text-cyan-700 transition-colors hover:text-cyan-900 sm:inline">نصائح وشروحات الأدوات</Link>
          </div>
        </div>

        <SiteHeader />

        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute -right-24 -top-36 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden="true"></div>
          <div className="absolute -bottom-48 left-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true"></div>
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
            <div className="text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200">
                <Sparkles size={16} /> مساحة عمل رقمية مجانية
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.2] tracking-tight sm:text-6xl">كل الأدوات التي تحتاجها، <span className="text-cyan-300">في مكان واحد.</span></h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{t('site.description')} أنجز حساباتك، حوّل ملفاتك، ونظّم أفكارك بسرعة ومن دون تعقيد أو رفع ملفاتك إلى خادم.</p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-slate-300">
                <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">{tools.length} أداة جاهزة</span>
                <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">خصوصية أولاً</span>
                <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">دعم عربي كامل</span>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white p-5 shadow-2xl shadow-black/25 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div><p className="text-sm font-bold text-cyan-700">ابحث عن أداة</p><p className="mt-1 text-2xl font-black text-slate-950">ماذا تريد أن تنجز اليوم؟</p></div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300"><Zap size={22} /></span>
              </div>
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input type="text" placeholder={t('search.placeholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 pr-12 text-base shadow-inner focus:border-cyan-400 focus:ring-cyan-400" data-testid="input-search" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button key={category} onClick={() => setSelectedCategory(category)} variant="outline" className={`rounded-xl border-slate-200 px-3 text-sm font-bold transition-all ${selectedCategory === category ? 'border-slate-950 bg-slate-950 text-white hover:bg-slate-800 hover:text-white' : 'bg-white text-slate-600 hover:border-cyan-400 hover:bg-cyan-50'}`} data-testid={`button-category-${category}`}>
                    <Filter className="ml-1.5" size={14} />{t(`category.${category}`)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <main id="tools" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <section className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-black text-cyan-700"><Layers3 size={18} /> مكتبة الأدوات</div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">اختر الأداة المناسبة لمهمتك</h2>
              <p className="mt-3 max-w-2xl text-slate-500">كل أداة مصممة لتنجز مهمة محددة بأقل عدد من الخطوات، مع نتائج فورية داخل المتصفح.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><p className="text-2xl font-black text-slate-950">{tools.length}</p><p className="text-xs font-bold text-slate-500">إجمالي الأدوات</p></div>
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><p className="text-2xl font-black text-emerald-600">{filteredTools.length}</p><p className="text-xs font-bold text-slate-500">نتيجة البحث</p></div>
              <div className="col-span-2 rounded-2xl border border-cyan-100 bg-cyan-50 px-5 py-4 shadow-sm sm:col-span-1"><p className="text-2xl font-black text-cyan-700">١٠٠٪</p><p className="text-xs font-bold text-slate-500">داخل المتصفح</p></div>
            </div>
          </section>

          {filteredTools.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
              <i className="fas fa-search mb-4 text-5xl text-slate-300"></i>
              <p className="text-xl font-bold text-slate-600">لم يتم العثور على أداة مطابقة</p>
              <p className="mt-2 text-slate-400">جرّب كلمة بحث أخرى أو اختر تصنيفاً مختلفاً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
            </div>
          )}

          <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl bg-cyan-50 px-6 py-7 text-center sm:flex-row sm:text-right">
            <div><p className="text-lg font-black text-slate-950">هل تبحث عن طريقة استخدام؟</p><p className="mt-1 text-sm font-semibold text-slate-600">اكتشف الشروحات والأفكار العملية في مدونة BMO Tools.</p></div>
            <Link href="/blog" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700">اقرأ المدونة <ArrowUpLeft size={17} /></Link>
          </div>
        </main>

        {/* About Section */}
        <section id="about" className="bg-white py-12 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">من نحن</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <i className="fas fa-user text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">مصطفى</h3>
                <p className="text-blue-600 font-medium mb-4">مطور ويب ومصمم واجهات</p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  مرحباً! أنا مصطفى، مطور ويب متخصص في إنشاء أدوات مفيدة وعملية للمستخدمين العرب. 
                  أسعى لتقديم حلول تقنية بسيطة وفعالة تساعد في الحياة اليومية.
                </p>
                <div className="flex justify-center space-x-4 space-x-reverse">
                  <a href="https://mustaf.vercel.app/" target="_blank" rel="noopener noreferrer"
                     className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center">
                    <i className="fas fa-globe ml-2"></i>
                    زيارة موقعي الشخصي
                  </a>
                  <a href="#" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200 flex items-center">
                    <i className="fas fa-tree ml-2"></i>
                    Linktree
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-slate-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">اتصل بنا</h2>
              <p className="text-slate-300 mb-8">هل لديك اقتراح لأداة جديدة أو تحسين? نحن نحب سماع آرائكم!</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors">
                  <i className="fas fa-envelope text-blue-400 text-2xl mb-3"></i>
                  <h3 className="font-semibold mb-2">البريد الإلكتروني</h3>
                  <p className="text-slate-300 text-sm">contact@mustaf.vercel.app</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors">
                  <i className="fas fa-code text-green-400 text-2xl mb-3"></i>
                  <h3 className="font-semibold mb-2">GitHub</h3>
                  <p className="text-slate-300 text-sm">تابع مشاريعنا المفتوحة</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors">
                  <i className="fas fa-comments text-purple-400 text-2xl mb-3"></i>
                  <h3 className="font-semibold mb-2">الملاحظات</h3>
                  <p className="text-slate-300 text-sm">شاركنا تجربتك واقتراحاتك</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">أدوات ويب مجانية</h3>
              <p className="text-slate-400">أدوات مجانية ومفيدة للجميع</p>
              <Link href="/blog" className="mt-3 inline-block text-cyan-300 hover:text-cyan-200 hover:underline">اقرأ مدونة الأدوات والشروحات</Link>
            </div>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-slate-400 text-sm">
                &copy; 2024-2025 جميع الحقوق محفوظة | تم التطوير بواسطة 
                <a href="https://mustaf.vercel.app/" className="text-blue-400 hover:text-blue-300 mr-1">مصطفى</a>
              </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
