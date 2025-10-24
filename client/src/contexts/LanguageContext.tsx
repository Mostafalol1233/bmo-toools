import { createContext, useContext, useState } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Header
    'site.title': 'BMO Tools',
    'site.description': 'مجموعة شاملة من أدوات التحويل والتحرير والتحليل - مجاناً',
    'tools.select': 'اختر الأداة المناسبة لك',
    'search.placeholder': 'ابحث عن أداة...',
    'category.all': 'الكل',
    'category.time': 'الوقت',
    'category.calculators': 'حاسبات',
    'category.converters': 'محولات',
    'category.media': 'الوسائط',
    'category.pdf': 'PDF',
    'category.utilities': 'أدوات',
    
    // Time Tools
    'timer.title': 'مؤقت',
    'timer.desc': 'مؤقت بسيط لتتبع الوقت',
    'world-clock.title': 'ساعة عالمية',
    'world-clock.desc': 'اعرض الوقت في مدن مختلفة حول العالم',
    'stopwatch.title': 'ساعة إيقاف',
    'stopwatch.desc': 'ساعة إيقاف دقيقة لقياس الوقت',
    'countdown-timer.title': 'عداد تنازلي',
    'countdown-timer.desc': 'عداد تنازلي لأي تاريخ أو وقت',
    
    // Calculators
    'scientific-calculator.title': 'آلة حاسبة علمية',
    'scientific-calculator.desc': 'آلة حاسبة علمية متقدمة مع دوال رياضية',
    'age-calculator.title': 'حاسبة العمر',
    'age-calculator.desc': 'احسب عمرك بدقة بالسنوات والشهور والأيام',
    'bmi-calculator.title': 'حاسبة BMI',
    'bmi-calculator.desc': 'احسب مؤشر كتلة الجسم والوزن المثالي',
    'percentage-calculator.title': 'حاسبة النسبة المئوية',
    'percentage-calculator.desc': 'احسب النسب المئوية بطرق مختلفة',
    'tax-calculator.title': 'حاسبة الضريبة',
    'tax-calculator.desc': 'احسب السعر بعد إضافة الضريبة',
    'sqrt-calculator.title': 'حاسبة الجذر التربيعي',
    'sqrt-calculator.desc': 'احسب الجذر التربيعي لأي رقم',
    'gpa-calculator.title': 'حاسبة المعدل التراكمي',
    'gpa-calculator.desc': 'احسب معدلك التراكمي GPA',
    'date-difference.title': 'الفرق بين التواريخ',
    'date-difference.desc': 'احسب الفرق بين تاريخين بالأيام',
    
    // Converters
    'date-converter.title': 'تحويل التاريخ',
    'date-converter.desc': 'تحويل دقيق بين التاريخ الهجري والميلادي',
    'unit-converter.title': 'محول الوحدات',
    'unit-converter.desc': 'تحويل بين وحدات القياس المختلفة',
    'color-palette.title': 'منتقي الألوان',
    'color-palette.desc': 'اختيار الألوان وتحويل بين أنظمة الألوان',
    
    // Media Tools
    'image-converter.title': 'محول الصور',
    'image-converter.desc': 'تحويل بين JPG، PNG، WebP',
    'image-resizer.title': 'تغيير حجم الصور',
    'image-resizer.desc': 'تغيير حجم الصور بسهولة',
    'image-cropper.title': 'قص الصور',
    'image-cropper.desc': 'قص الصور بأبعاد مخصصة',
    'image-combiner.title': 'دمج الصور',
    'image-combiner.desc': 'دمج عدة صور في صورة واحدة',
    'bg-remover.title': 'إزالة الخلفية',
    'bg-remover.desc': 'إزالة خلفية الصور تلقائياً',
    
    // PDF Tools
    'pdf-merger.title': 'دمج PDF',
    'pdf-merger.desc': 'دمج عدة ملفات PDF في ملف واحد',
    'pdf-splitter.title': 'تقسيم PDF',
    'pdf-splitter.desc': 'تقسيم ملف PDF إلى صفحات منفصلة',
    
    // Utilities
    'random-generator.title': 'مولد الأرقام العشوائية',
    'random-generator.desc': 'توليد أرقام عشوائية مع خيارات متقدمة',
    'password-generator.title': 'مولد كلمات المرور',
    'password-generator.desc': 'إنشاء كلمات مرور قوية وآمنة',
    'text-encoder.title': 'مشفر النصوص',
    'text-encoder.desc': 'تشفير وفك تشفير النصوص بطرق مختلفة',
    'qr-code.title': 'مولد وقارئ رموز QR',
    'qr-code.desc': 'إنشاء وقراءة رموز QR بسهولة',
    'url-shortener.title': 'اختصار الروابط',
    'url-shortener.desc': 'اختصار الروابط الطويلة',
    'link-checker.title': 'فاحص الروابط الخبيثة',
    'link-checker.desc': 'فحص الروابط ضد قواعد البرمجيات الخبيثة',
    'designfy.title': 'أداة Designfy',
    'designfy.desc': 'تحرير وتحسين الصور باستخدام Designfy API',
    'ai-image-generator.title': 'مولد الصور بالذكاء الاصطناعي',
    'ai-image-generator.desc': 'إنشاء صور باستخدام الذكاء الاصطناعي مجاناً',
    
    // Sections
    'about.title': 'من نحن',
    'contact.title': 'اتصل بنا',
    'ads.text': 'منطقة إعلانية - يمكن وضع Google AdSense هنا',
    
    // Language toggle
    'lang.switch': 'English',
  },
  en: {
    // Header
    'site.title': 'BMO Tools',
    'site.description': 'A comprehensive collection of conversion, editing, and analysis tools - Free',
    'tools.select': 'Choose the right tool for you',
    'search.placeholder': 'Search for a tool...',
    'category.all': 'All',
    'category.time': 'Time',
    'category.calculators': 'Calculators',
    'category.converters': 'Converters',
    'category.media': 'Media',
    'category.pdf': 'PDF',
    'category.utilities': 'Utilities',
    
    // Time Tools
    'timer.title': 'Timer',
    'timer.desc': 'Simple timer to track time',
    'world-clock.title': 'World Clock',
    'world-clock.desc': 'Display time in different cities around the world',
    'stopwatch.title': 'Stopwatch',
    'stopwatch.desc': 'Accurate stopwatch for time measurement',
    'countdown-timer.title': 'Countdown Timer',
    'countdown-timer.desc': 'Countdown timer for any date or time',
    
    // Calculators
    'scientific-calculator.title': 'Scientific Calculator',
    'scientific-calculator.desc': 'Advanced scientific calculator with mathematical functions',
    'age-calculator.title': 'Age Calculator',
    'age-calculator.desc': 'Calculate your age accurately in years, months, and days',
    'bmi-calculator.title': 'BMI Calculator',
    'bmi-calculator.desc': 'Calculate body mass index and ideal weight',
    'percentage-calculator.title': 'Percentage Calculator',
    'percentage-calculator.desc': 'Calculate percentages in different ways',
    'tax-calculator.title': 'Tax Calculator',
    'tax-calculator.desc': 'Calculate price after adding tax',
    'sqrt-calculator.title': 'Square Root Calculator',
    'sqrt-calculator.desc': 'Calculate the square root of any number',
    'gpa-calculator.title': 'GPA Calculator',
    'gpa-calculator.desc': 'Calculate your cumulative GPA',
    'date-difference.title': 'Date Difference',
    'date-difference.desc': 'Calculate the difference between two dates in days',
    
    // Converters
    'date-converter.title': 'Date Converter',
    'date-converter.desc': 'Accurate conversion between Hijri and Gregorian dates',
    'unit-converter.title': 'Unit Converter',
    'unit-converter.desc': 'Convert between different units of measurement',
    'color-palette.title': 'Color Picker',
    'color-palette.desc': 'Pick colors and convert between color systems',
    
    // Media Tools
    'image-converter.title': 'Image Converter',
    'image-converter.desc': 'Convert between JPG, PNG, WebP',
    'image-resizer.title': 'Image Resizer',
    'image-resizer.desc': 'Resize images easily',
    'image-cropper.title': 'Image Cropper',
    'image-cropper.desc': 'Crop images with custom dimensions',
    'image-combiner.title': 'Image Combiner',
    'image-combiner.desc': 'Combine multiple images into one',
    'bg-remover.title': 'Background Remover',
    'bg-remover.desc': 'Remove image background automatically',
    
    // PDF Tools
    'pdf-merger.title': 'PDF Merger',
    'pdf-merger.desc': 'Merge multiple PDF files into one',
    'pdf-splitter.title': 'PDF Splitter',
    'pdf-splitter.desc': 'Split PDF into separate pages',
    
    // Utilities
    'random-generator.title': 'Random Number Generator',
    'random-generator.desc': 'Generate random numbers with advanced options',
    'password-generator.title': 'Password Generator',
    'password-generator.desc': 'Generate strong and secure passwords',
    'text-encoder.title': 'Text Encoder',
    'text-encoder.desc': 'Encrypt and decrypt text using various methods',
    'qr-code.title': 'QR Code Generator & Reader',
    'qr-code.desc': 'Create and read QR codes easily',
    'url-shortener.title': 'URL Shortener',
    'url-shortener.desc': 'Shorten long URLs',
    'link-checker.title': 'Malicious Link Checker',
    'link-checker.desc': 'Check links against malware databases',
    'designfy.title': 'Designfy Tool',
    'designfy.desc': 'Edit and enhance images using Designfy API',
    'ai-image-generator.title': 'AI Image Generator',
    'ai-image-generator.desc': 'Generate images using AI for free',
    
    // Sections
    'about.title': 'About Us',
    'contact.title': 'Contact Us',
    'ads.text': 'Advertisement Area - Google AdSense can be placed here',
    
    // Language toggle
    'lang.switch': 'العربية',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  const contextValue = {
    language,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    },
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
