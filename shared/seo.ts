export const SEO_BASE_URL = "https://bmo-tools.vercel.app";

export interface ToolSeoDefinition {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  priority: number;
}

export const TOOL_SEO: ToolSeoDefinition[] = [
  {
    slug: "timer",
    title: "مؤقت أونلاين مجاني | BMO Tools",
    description: "استخدم المؤقت المجاني من BMO Tools لقياس مدة زمنية بسهولة، مع واجهة عربية سريعة تعمل مباشرة من المتصفح.",
    keywords: "مؤقت, مؤقت أونلاين, عداد وقت, BMO Tools",
    priority: 0.7,
  },
  {
    slug: "world-clock",
    title: "ساعة عالمية لمعرفة الوقت في المدن | BMO Tools",
    description: "اعرف الوقت الحالي في المدن والمناطق الزمنية المختلفة باستخدام الساعة العالمية المجانية من BMO Tools.",
    keywords: "ساعة عالمية, الوقت الآن, المناطق الزمنية, BMO Tools",
    priority: 0.7,
  },
  {
    slug: "stopwatch",
    title: "ساعة إيقاف دقيقة أونلاين | BMO Tools",
    description: "قس الوقت بدقة باستخدام ساعة الإيقاف المجانية من BMO Tools، وهي مناسبة للتدريب والدراسة والمهام اليومية.",
    keywords: "ساعة إيقاف, كرونومتر, قياس الوقت, BMO Tools",
    priority: 0.7,
  },
  {
    slug: "countdown-timer",
    title: "عداد تنازلي للفعاليات والمواعيد | BMO Tools",
    description: "أنشئ عداداً تنازلياً لموعد أو مناسبة قادمة واعرف الأيام والساعات والدقائق والثواني المتبقية بسهولة.",
    keywords: "عداد تنازلي, مؤقت مناسبة, حساب الوقت المتبقي, BMO Tools",
    priority: 0.7,
  },
  {
    slug: "scientific-calculator",
    title: "آلة حاسبة علمية أونلاين مجانية | BMO Tools",
    description: "استخدم الآلة الحاسبة العلمية المجانية لإجراء العمليات الحسابية المعقدة والجذور والأسس واللوغاريتمات والدوال المثلثية.",
    keywords: "آلة حاسبة علمية, حاسبة أونلاين, الجذور, اللوغاريتمات, BMO Tools",
    priority: 1.0,
  },
  {
    slug: "age-calculator",
    title: "حاسبة العمر بدقة بالسنوات والأيام | BMO Tools",
    description: "احسب عمرك بدقة بالسنوات والشهور والأيام باستخدام حاسبة العمر المجانية من BMO Tools.",
    keywords: "حاسبة العمر, حساب العمر, العمر بالسنوات والأيام, BMO Tools",
    priority: 0.9,
  },
  {
    slug: "bmi-calculator",
    title: "حاسبة مؤشر كتلة الجسم BMI | BMO Tools",
    description: "احسب مؤشر كتلة الجسم BMI وتعرّف إلى تصنيف الوزن بطريقة سهلة ومباشرة من خلال حاسبة BMO Tools المجانية.",
    keywords: "حاسبة BMI, مؤشر كتلة الجسم, الوزن المثالي, BMO Tools",
    priority: 0.9,
  },
  {
    slug: "percentage-calculator",
    title: "حاسبة النسبة المئوية أونلاين | BMO Tools",
    description: "احسب النسبة المئوية والزيادة والنقصان والخصومات بسرعة باستخدام حاسبة النسبة المئوية المجانية.",
    keywords: "حاسبة النسبة المئوية, حساب الخصم, نسبة الزيادة, BMO Tools",
    priority: 0.9,
  },
  {
    slug: "tax-calculator",
    title: "حاسبة الضريبة والقيمة المضافة | BMO Tools",
    description: "احسب قيمة الضريبة والسعر النهائي بعد الإضافة بسهولة باستخدام حاسبة الضريبة المجانية من BMO Tools.",
    keywords: "حاسبة الضريبة, ضريبة القيمة المضافة, VAT, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "sqrt-calculator",
    title: "حاسبة الجذر التربيعي أونلاين | BMO Tools",
    description: "احسب الجذر التربيعي للأرقام بسرعة ودقة باستخدام أداة الجذر التربيعي المجانية من BMO Tools.",
    keywords: "حاسبة الجذر التربيعي, الجذر, حاسبة رياضيات, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "gpa-calculator",
    title: "حاسبة المعدل التراكمي GPA | BMO Tools",
    description: "احسب معدلك التراكمي GPA من الدرجات والساعات الدراسية باستخدام حاسبة الطلاب المجانية من BMO Tools.",
    keywords: "حاسبة GPA, المعدل التراكمي, حاسبة الطلاب, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "date-difference",
    title: "حاسبة الفرق بين تاريخين | BMO Tools",
    description: "احسب الفرق بين تاريخين بالأيام والشهور والسنوات باستخدام أداة التاريخ المجانية من BMO Tools.",
    keywords: "الفرق بين تاريخين, حاسبة الأيام, حساب المدة, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "date-converter",
    title: "محول التاريخ الهجري والميلادي | BMO Tools",
    description: "حوّل التاريخ بين التقويم الهجري والميلادي بسهولة باستخدام محول التاريخ المجاني من BMO Tools.",
    keywords: "تحويل التاريخ الهجري, تحويل التاريخ الميلادي, محول التاريخ, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "unit-converter",
    title: "محول الوحدات الشامل أونلاين | BMO Tools",
    description: "حوّل بين وحدات الطول والوزن والحجم والمساحة ودرجة الحرارة باستخدام محول الوحدات الشامل المجاني.",
    keywords: "محول الوحدات, تحويل الطول, تحويل الوزن, تحويل الحرارة, BMO Tools",
    priority: 0.9,
  },
  {
    slug: "color-palette",
    title: "منتقي الألوان وتحويل Hex وRGB وHSL | BMO Tools",
    description: "اختر الألوان وحوّل بينها في أنظمة Hex وRGB وHSL باستخدام أداة الألوان المجانية للمصممين والمطورين.",
    keywords: "منتقي الألوان, محول Hex RGB, HSL, ألوان التصميم, BMO Tools",
    priority: 0.7,
  },
  {
    slug: "image-converter",
    title: "محول الصور بين JPG وPNG وWebP | BMO Tools",
    description: "حوّل الصور بين JPG وPNG وWebP مباشرة داخل المتصفح دون الحاجة إلى رفع الملفات إلى خادم خارجي.",
    keywords: "محول الصور, تحويل JPG PNG, تحويل WebP, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "image-resizer",
    title: "تغيير حجم الصور أونلاين بدون رفع | BMO Tools",
    description: "غيّر أبعاد الصور بسهولة مع الحفاظ على النسبة المناسبة، وكل المعالجة تتم داخل المتصفح لحماية ملفاتك.",
    keywords: "تغيير حجم الصور, تصغير الصور, تكبير الصور, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "bg-remover",
    title: "إزالة خلفية الصور مجاناً | BMO Tools",
    description: "أزل خلفية الصور بسرعة باستخدام أداة BMO Tools، مع معالجة مباشرة من المتصفح وبدون رفع الصورة إلى خادم خارجي.",
    keywords: "إزالة الخلفية, تفريغ الصور, إزالة خلفية الصورة, BMO Tools",
    priority: 0.9,
  },
  {
    slug: "image-cropper",
    title: "قص الصور بأبعاد مخصصة | BMO Tools",
    description: "اقصص صورك بأبعاد مخصصة مباشرة من المتصفح، واحصل على ملف جاهز للاستخدام في التصميم أو النشر.",
    keywords: "قص الصور, اقتصاص الصور, أبعاد الصور, BMO Tools",
    priority: 0.7,
  },
  {
    slug: "image-combiner",
    title: "دمج الصور في صورة واحدة | BMO Tools",
    description: "ادمج عدة صور في ملف واحد بسهولة باستخدام أداة دمج الصور المجانية من BMO Tools.",
    keywords: "دمج الصور, تركيب الصور, جمع الصور, BMO Tools",
    priority: 0.7,
  },
  {
    slug: "pdf-merger",
    title: "دمج ملفات PDF مجاناً | BMO Tools",
    description: "ادمج عدة ملفات PDF في ملف واحد مباشرة من المتصفح باستخدام أداة BMO Tools المجانية.",
    keywords: "دمج PDF, جمع ملفات PDF, PDF مجاني, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "pdf-splitter",
    title: "تقسيم ملفات PDF إلى صفحات | BMO Tools",
    description: "قسّم ملفات PDF واستخرج الصفحات المطلوبة بسهولة باستخدام أداة تقسيم PDF المجانية من BMO Tools.",
    keywords: "تقسيم PDF, استخراج صفحات PDF, PDF مجاني, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "random-generator",
    title: "مولد أرقام عشوائية أونلاين | BMO Tools",
    description: "ولّد أرقاماً عشوائية ضمن نطاق تختاره مع خيارات متعددة باستخدام مولد الأرقام المجاني من BMO Tools.",
    keywords: "مولد أرقام عشوائية, رقم عشوائي, اختيار عشوائي, BMO Tools",
    priority: 0.7,
  },
  {
    slug: "password-generator",
    title: "مولد كلمات مرور قوية وآمنة | BMO Tools",
    description: "أنشئ كلمات مرور قوية قابلة للتخصيص لحماية حساباتك باستخدام مولد كلمات المرور المجاني من BMO Tools.",
    keywords: "مولد كلمات المرور, كلمة مرور قوية, حماية الحسابات, BMO Tools",
    priority: 0.9,
  },
  {
    slug: "text-encoder",
    title: "تشفير وفك تشفير النصوص | BMO Tools",
    description: "شفّر النصوص وفك تشفيرها باستخدام أدوات متعددة داخل المتصفح مع تجربة سهلة وسريعة من BMO Tools.",
    keywords: "تشفير النصوص, فك التشفير, Base64, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "qr-code",
    title: "مولد وقارئ رمز QR مجاناً | BMO Tools",
    description: "أنشئ رموز QR واقرأها من الصور بسهولة باستخدام أداة BMO Tools المجانية التي تعمل مباشرة في المتصفح.",
    keywords: "مولد QR, قارئ QR, رمز الاستجابة السريعة, BMO Tools",
    priority: 0.9,
  },
  {
    slug: "url-shortener",
    title: "اختصار الروابط الطويلة مجاناً | BMO Tools",
    description: "اختصر الروابط الطويلة بسرعة وأنشئ رابطاً أقصر للمشاركة، مع واجهة عربية سهلة الاستخدام من BMO Tools.",
    keywords: "اختصار الروابط, رابط قصير, تقصير الروابط, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "link-checker",
    title: "فحص الروابط المشبوهة والخبيثة | BMO Tools",
    description: "افحص الرابط قبل فتحه وتعرّف إلى مؤشرات الخطر المحتملة باستخدام أداة فحص الروابط من BMO Tools.",
    keywords: "فحص الروابط, رابط خبيث, حماية من التصيد, BMO Tools",
    priority: 0.8,
  },
  {
    slug: "designfy",
    title: "تحسين الصور وتحريرها | BMO Tools",
    description: "حسّن صورك وأجرِ تعديلات سريعة باستخدام أداة الصور من BMO Tools، مع تجربة مبسطة للمستخدم العربي.",
    keywords: "تحسين الصور, تحرير الصور, أداة صور, BMO Tools",
    priority: 0.6,
  },
  {
    slug: "ai-image-generator",
    title: "مولد الصور بالذكاء الاصطناعي | BMO Tools",
    description: "أنشئ صوراً من وصف نصي باستخدام أداة توليد الصور من BMO Tools، وجرّب أفكاراً إبداعية بسرعة.",
    keywords: "مولد الصور, صور بالذكاء الاصطناعي, إنشاء الصور, BMO Tools",
    priority: 0.8,
  },
];

export function getToolSeo(slug: string) {
  return TOOL_SEO.find((tool) => tool.slug === slug);
}

export function getToolUrl(slug: string) {
  return `${SEO_BASE_URL}/tools/${slug}`;
}

export const BLOG_SLUGS = [
  "using-scientific-calculator",
  "free-tools-for-students",
  "bmi-calculation-guide",
  "currency-conversion-tips",
  "free-background-removal-tools",
] as const;
