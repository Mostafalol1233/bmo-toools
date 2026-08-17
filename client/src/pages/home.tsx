import { useState, useMemo } from "react";
import ToolCard from "@/components/tool-card";
import SEOSchema from "@/components/seo-schema";
import MetaTags from "@/components/meta-tags";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Link } from "wouter";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Advertisement Area Top */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-gray-200 py-2">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-dashed border-gray-300">
              <i className="fas fa-ad text-gray-400 text-2xl mb-2"></i>
              <p className="text-gray-500 text-sm">{t('ads.text')}</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="bg-white shadow-lg sticky top-0 z-40 backdrop-blur-sm bg-white/95">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-slide-up">
                  <i className="fas fa-tools text-blue-500 ml-3"></i>
                  {t('site.title')}
                </h1>
                <p className="text-slate-600 text-lg">{t('site.description')}</p>
              </div>
            
            {/* Language Toggle */}
            <Button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              variant="outline"
              className="flex items-center gap-2"
              data-testid="button-language-toggle"
            >
              <i className="fas fa-language"></i>
              {t('lang.switch')}
            </Button>
          </div>
          </div>
        </header>

        {/* Search and Filter Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 py-6 text-lg shadow-lg border-2"
                data-testid="input-search"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`transition-all ${
                    selectedCategory === category 
                      ? 'shadow-lg scale-105' 
                      : 'hover:shadow-md hover:scale-102'
                  }`}
                  data-testid={`button-category-${category}`}
                >
                  <Filter className="ml-2" size={16} />
                  {t(`category.${category}`)}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Tools Grid */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
              {filteredTools.length} {t('tools.select')}
            </h2>
          
            {filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-search text-gray-300 text-6xl mb-4"></i>
                <p className="text-gray-500 text-xl">لم يتم العثور على أدوات</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Advertisement Area Middle */}
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-gray-300 text-center">
              <i className="fas fa-ad text-gray-400 text-3xl mb-3"></i>
              <p className="text-gray-500">منطقة إعلانية وسطى - مساحة 728x90</p>
            </div>
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
