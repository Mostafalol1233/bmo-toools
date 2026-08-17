import { useEffect, useMemo, useRef, useState } from "react";

type ToolSlug =
  | "loan-calculator"
  | "aspect-ratio"
  | "progress-calculator"
  | "storage-converter"
  | "json-yaml"
  | "text-counter"
  | "json-formatter"
  | "spinner-wheel"
  | "reaction-test";

export const BATCH_TOOL_SLUGS: ToolSlug[] = [
  "loan-calculator",
  "aspect-ratio",
  "progress-calculator",
  "storage-converter",
  "json-yaml",
  "text-counter",
  "json-formatter",
  "spinner-wheel",
  "reaction-test",
];

export function isBatchToolSlug(slug: string): slug is ToolSlug {
  return BATCH_TOOL_SLUGS.includes(slug as ToolSlug);
}

const panelClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";
const buttonClass = "rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass = "rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-500 hover:bg-cyan-50 active:scale-[.98]";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm font-semibold text-slate-700">{children}</label>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-bold text-slate-900">{value}</div>
    </div>
  );
}

function LoanCalculator() {
  const [amount, setAmount] = useState("100000");
  const [annualRate, setAnnualRate] = useState("8");
  const [months, setMonths] = useState("60");
  const [extra, setExtra] = useState("0");

  const result = useMemo(() => {
    const principal = Math.max(0, Number(amount) || 0);
    const monthlyRate = Math.max(0, Number(annualRate) || 0) / 100 / 12;
    const term = Math.max(1, Math.floor(Number(months) || 1));
    const extraPayment = Math.max(0, Number(extra) || 0);
    const basePayment = monthlyRate === 0 ? principal / term : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -term));
    let balance = principal;
    let totalInterest = 0;
    let totalPaid = 0;
    const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    for (let month = 1; month <= term && balance > 0.01; month += 1) {
      const interest = balance * monthlyRate;
      const regularPrincipal = Math.min(balance, Math.max(0, basePayment - interest));
      const principalPaid = Math.min(balance, regularPrincipal + extraPayment);
      const payment = principalPaid + interest;
      balance = Math.max(0, balance - principalPaid);
      totalInterest += interest;
      totalPaid += payment;
      schedule.push({ month, payment, principal: principalPaid, interest, balance });
    }
    return { basePayment, totalInterest, totalPaid, schedule };
  }, [amount, annualRate, months, extra]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <div><Label>مبلغ القرض</Label><input className={inputClass} type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        <div><Label>الفائدة السنوية %</Label><input className={inputClass} type="number" min="0" step="0.01" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} /></div>
        <div><Label>المدة بالأشهر</Label><input className={inputClass} type="number" min="1" value={months} onChange={(e) => setMonths(e.target.value)} /></div>
        <div><Label>دفعة إضافية شهرية</Label><input className={inputClass} type="number" min="0" value={extra} onChange={(e) => setExtra(e.target.value)} /></div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="القسط الأساسي" value={`${result.basePayment.toFixed(2)}`} />
        <Stat label="إجمالي الفائدة" value={`${result.totalInterest.toFixed(2)}`} />
        <Stat label="إجمالي المدفوع" value={`${result.totalPaid.toFixed(2)}`} />
      </div>
      <div className={panelClass}>
        <h3 className="mb-3 font-bold text-slate-900">جدول إطفاء الدين</h3>
        <div className="max-h-80 overflow-auto"><table className="w-full text-right text-sm"><thead className="sticky top-0 bg-white"><tr className="border-b"><th className="p-2">الشهر</th><th className="p-2">القسط</th><th className="p-2">الأصل</th><th className="p-2">الفائدة</th><th className="p-2">المتبقي</th></tr></thead><tbody>{result.schedule.map((row) => <tr key={row.month} className="border-b border-slate-100"><td className="p-2">{row.month}</td><td className="p-2">{row.payment.toFixed(2)}</td><td className="p-2">{row.principal.toFixed(2)}</td><td className="p-2">{row.interest.toFixed(2)}</td><td className="p-2">{row.balance.toFixed(2)}</td></tr>)}</tbody></table></div>
      </div>
      <p className="text-xs text-slate-500">هذه حاسبة تقديرية للقسط الثابت، ولا تشمل الرسوم أو الضرائب أو شروط الجهة المقرضة.</p>
    </div>
  );
}

function AspectRatioTool() {
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const result = useMemo(() => {
    const w = Math.abs(Number(width) || 0);
    const h = Math.abs(Number(height) || 0);
    if (!w || !h) return { ratio: "—", decimal: "—" };
    let a = w; let b = h;
    while (b) { const next = a % b; a = b; b = next; }
    return { ratio: `${w / a}:${h / a}`, decimal: (w / h).toFixed(4) };
  }, [width, height]);
  return <div className="space-y-5"><div className="grid gap-4 md:grid-cols-2"><div><Label>العرض</Label><input className={inputClass} type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)} /></div><div><Label>الارتفاع</Label><input className={inputClass} type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} /></div></div><div className="grid gap-3 sm:grid-cols-2"><Stat label="النسبة المبسطة" value={result.ratio} /><Stat label="النسبة العشرية" value={result.decimal} /></div><div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-3xl font-black text-white">{result.ratio}</div></div>;
}

function ProgressCalculator() {
  const [done, setDone] = useState("15");
  const [total, setTotal] = useState("30");
  const [deadline, setDeadline] = useState("");
  const percentage = Math.min(100, Math.max(0, (Number(done) || 0) / Math.max(1, Number(total) || 1) * 100));
  const daysLeft = deadline ? Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000) : null;
  return <div className="space-y-5"><div className="grid gap-4 md:grid-cols-3"><div><Label>المنجز</Label><input className={inputClass} type="number" min="0" value={done} onChange={(e) => setDone(e.target.value)} /></div><div><Label>الإجمالي</Label><input className={inputClass} type="number" min="1" value={total} onChange={(e) => setTotal(e.target.value)} /></div><div><Label>الموعد النهائي اختياري</Label><input className={inputClass} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></div></div><div className={panelClass}><div className="mb-2 flex items-center justify-between"><span className="font-bold">نسبة الإنجاز</span><span className="text-2xl font-black text-cyan-700">{percentage.toFixed(1)}%</span></div><div className="h-5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-gradient-to-l from-cyan-500 to-blue-600 transition-all" style={{ width: `${percentage}%` }} /></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><Stat label="المتبقي" value={`${Math.max(0, (Number(total) || 0) - (Number(done) || 0))}`} />{daysLeft !== null && <Stat label={daysLeft >= 0 ? "الأيام المتبقية" : "الأيام منذ الموعد"} value={`${Math.abs(daysLeft)}`} />}</div></div></div>;
}

const storageUnits = [
  ["B", 1], ["KB", 1024], ["MB", 1024 ** 2], ["GB", 1024 ** 3], ["TB", 1024 ** 4], ["PB", 1024 ** 5],
] as const;
function StorageConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("GB");
  const [to, setTo] = useState("MB");
  const result = (Number(value) || 0) * (storageUnits.find(([unit]) => unit === from)?.[1] ?? 1) / (storageUnits.find(([unit]) => unit === to)?.[1] ?? 1);
  return <div className="space-y-5"><div className="grid gap-4 md:grid-cols-3"><div><Label>القيمة</Label><input className={inputClass} type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} /></div><div><Label>من</Label><select className={inputClass} value={from} onChange={(e) => setFrom(e.target.value)}>{storageUnits.map(([unit]) => <option key={unit}>{unit}</option>)}</select></div><div><Label>إلى</Label><select className={inputClass} value={to} onChange={(e) => setTo(e.target.value)}>{storageUnits.map(([unit]) => <option key={unit}>{unit}</option>)}</select></div></div><div className="rounded-2xl bg-cyan-50 p-8 text-center"><div className="text-sm text-cyan-800">النتيجة</div><div className="mt-2 text-4xl font-black text-cyan-900">{result.toLocaleString(undefined, { maximumFractionDigits: 8 })} {to}</div></div></div>;
}

function JsonYamlTool() {
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
  const [input, setInput] = useState('{"name":"BMO Tools","free":true}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const convert = async () => {
    setError("");
    try {
      const { parse, stringify } = await import("yaml");
      if (mode === "json-to-yaml") outputSet(stringify(JSON.parse(input)));
      else outputSet(JSON.stringify(parse(input), null, 2));
    } catch (err) { setError(err instanceof Error ? err.message : "تعذر تحويل النص"); }
  };
  const outputSet = (value: string) => setOutput(value);
  return <div className="space-y-4"><div className="flex flex-wrap gap-2"><button className={mode === "json-to-yaml" ? buttonClass : secondaryButtonClass} onClick={() => setMode("json-to-yaml")}>JSON إلى YAML</button><button className={mode === "yaml-to-json" ? buttonClass : secondaryButtonClass} onClick={() => setMode("yaml-to-json")}>YAML إلى JSON</button><button className={buttonClass} onClick={convert}>تحويل</button></div><div className="grid gap-4 md:grid-cols-2"><div><Label>النص المدخل</Label><textarea className={`${inputClass} min-h-64 font-mono text-xs`} value={input} onChange={(e) => setInput(e.target.value)} /></div><div><Label>النتيجة</Label><textarea readOnly className={`${inputClass} min-h-64 bg-slate-50 font-mono text-xs`} value={output} /></div></div>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}</div>;
}

function TextCounter() {
  const [text, setText] = useState(() => localStorage.getItem("bmo-text-counter") ?? "");
  useEffect(() => { localStorage.setItem("bmo-text-counter", text); }, [text]);
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const sentences = text.split(/[.!؟?]+/).filter((part) => part.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter((part) => part.trim()).length;
    const lines = text ? text.split(/\n/).length : 0;
    const letters = Array.from(text).filter((char) => /[A-Za-z0-9\u0600-\u06FF]/.test(char)).length;
    const frequencies = new Map<string, number>();
    words.forEach((word) => { const clean = word.toLowerCase().replace(/[^A-Za-z0-9\u0600-\u06FF]/g, ""); if (clean) frequencies.set(clean, (frequencies.get(clean) ?? 0) + 1); });
    const top = Array.from(frequencies.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { words, sentences, paragraphs, lines, letters, top, minutes: Math.max(0, Math.ceil(words.length / 200)) };
  }, [text]);
  return <div className="space-y-5"><textarea className={`${inputClass} min-h-64`} value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب أو الصق النص هنا..." /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat label="الكلمات" value={`${stats.words.length}`} /><Stat label="الحروف بدون المسافات" value={`${stats.letters}`} /><Stat label="الجمل" value={`${stats.sentences}`} /><Stat label="الفقرات / الأسطر" value={`${stats.paragraphs} / ${stats.lines}`} /></div><div className={panelClass}><h3 className="font-bold">الكلمات الأكثر تكراراً</h3><div className="mt-3 flex flex-wrap gap-2">{stats.top.length ? stats.top.map(([word, count]) => <span key={word} className="rounded-full bg-cyan-50 px-3 py-1 text-sm text-cyan-800">{word}: {count}</span>) : <span className="text-sm text-slate-500">ستظهر النتائج بعد إدخال النص.</span>}</div><p className="mt-4 text-sm text-slate-600">وقت القراءة المقدر: {stats.minutes} دقيقة</p></div></div>;
}

function JsonFormatter() {
  const [input, setInput] = useState('{"hello":"world","items":[1,2,3]}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const run = (compact = false) => { try { const parsed = JSON.parse(input); setOutput(JSON.stringify(parsed, null, compact ? 0 : 2)); setError(""); } catch (err) { setOutput(""); setError(err instanceof Error ? err.message : "JSON غير صالح"); } };
  return <div className="space-y-4"><div className="flex flex-wrap gap-2"><button className={buttonClass} onClick={() => run(false)}>تنسيق JSON</button><button className={secondaryButtonClass} onClick={() => run(true)}>تصغير JSON</button><button className={secondaryButtonClass} onClick={() => run(false)}>تحقق من الصحة</button><button className={secondaryButtonClass} onClick={() => navigator.clipboard?.writeText(output)}>نسخ النتيجة</button></div><div className="grid gap-4 md:grid-cols-2"><div><Label>JSON المدخل</Label><textarea className={`${inputClass} min-h-64 font-mono text-xs`} value={input} onChange={(e) => setInput(e.target.value)} /></div><div><Label>النتيجة</Label><textarea readOnly className={`${inputClass} min-h-64 bg-slate-50 font-mono text-xs`} value={output} /></div></div>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">JSON غير صالح: {error}</p>}</div>;
}

function SpinnerWheel() {
  const [items, setItems] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("bmo-spinner-items") ?? "[]"); } catch { return []; } });
  const [draft, setDraft] = useState("");
  const [winner, setWinner] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [excludeWinner, setExcludeWinner] = useState(true);
  const [color, setColor] = useState("#06b6d4");
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => { localStorage.setItem("bmo-spinner-items", JSON.stringify(items)); }, [items]);
  const add = () => { const values = draft.split(/\n|,/).map((item) => item.trim()).filter(Boolean); if (values.length) { setItems((current) => [...current, ...values]); setDraft(""); } };
  const spin = () => { if (spinning || !items.length) return; const index = Math.floor(Math.random() * items.length); setSpinning(true); setWinner(""); setRotation((value) => value + 1440 + Math.floor(Math.random() * 720) + index * 20); window.setTimeout(() => { const selected = items[index]; setWinner(selected); setSpinning(false); if (excludeWinner) setItems((current) => current.filter((_, itemIndex) => itemIndex !== index)); }, 2200); };
  const importFile = (file: File) => { const reader = new FileReader(); reader.onload = () => setItems(String(reader.result).split(/\n|,/).map((item) => item.trim()).filter(Boolean)); reader.readAsText(file); };
  const segment = items.length ? `conic-gradient(${items.map((_, index) => `${index % 2 ? "#0e7490" : color} ${(index / items.length) * 100}% ${((index + 1) / items.length) * 100}%`).join(",")})` : "conic-gradient(#cbd5e1 0 100%)";
  return <div className="grid gap-6 lg:grid-cols-[1fr_360px]"><div className="space-y-4"><textarea className={`${inputClass} min-h-36`} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="اكتب خياراً أو الصق قائمة، كل خيار في سطر..." /><div className="flex flex-wrap gap-2"><button className={buttonClass} onClick={add}>إضافة الخيارات</button><button className={secondaryButtonClass} onClick={() => fileRef.current?.click()}>استيراد TXT / CSV</button><input ref={fileRef} type="file" accept=".txt,.csv" className="hidden" onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} /><button className={secondaryButtonClass} onClick={() => setItems([])}>مسح القائمة</button></div><div className="flex items-center gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={excludeWinner} onChange={(e) => setExcludeWinner(e.target.checked)} /> استبعاد الفائز تلقائياً</label><label className="flex items-center gap-2 text-sm">لون العجلة <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label></div><div className="flex flex-wrap gap-2">{items.map((item, index) => <span key={`${item}-${index}`} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{item}</span>)}</div></div><div className="flex flex-col items-center justify-center gap-4"><div className="relative flex h-64 w-64 items-center justify-center"><div className="absolute -top-2 z-10 text-2xl text-slate-800">▼</div><div className={`h-60 w-60 rounded-full border-8 border-white shadow-xl transition-transform ${spinning ? "duration-[2200ms] ease-out" : "duration-300"}`} style={{ background: segment, transform: `rotate(${rotation}deg)` }} /><button className="absolute rounded-full bg-white px-4 py-3 text-sm font-black text-slate-900 shadow" onClick={spin} disabled={spinning || !items.length}>{spinning ? "تدور..." : "تدوير"}</button></div>{winner && <div className="rounded-2xl bg-amber-100 px-6 py-3 text-center text-lg font-black text-amber-900">الفائز: {winner}</div>}{!items.length && <p className="text-center text-sm text-slate-500">أضف خيارات أولاً.</p>}</div></div>;
}

function ReactionTest() {
  const [status, setStatus] = useState<"idle" | "waiting" | "go" | "result">("idle");
  const [reaction, setReaction] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  const start = () => { if (timer.current) window.clearTimeout(timer.current); setReaction(null); setStatus("waiting"); timer.current = window.setTimeout(() => setStatus("go"), 1500 + Math.random() * 3500); };
  const click = () => { if (status === "waiting") { if (timer.current) window.clearTimeout(timer.current); setStatus("idle"); setReaction(-1); } else if (status === "go") { setReaction(performance.now()); setStatus("result"); } };
  const [startedAt, setStartedAt] = useState(0);
  useEffect(() => { if (status === "go") setStartedAt(performance.now()); }, [status]);
  const value = reaction !== null && reaction >= 0 && startedAt ? reaction - startedAt : null;
  return <div className="space-y-5 text-center"><p className="text-slate-600">اضغط بدء، ثم اضغط على المساحة عندما تتحول إلى اللون الأخضر. لا تضغط مبكراً.</p><button className={buttonClass} onClick={start}>بدء الاختبار</button><button className={`flex min-h-64 w-full items-center justify-center rounded-3xl text-2xl font-black text-white transition ${status === "go" ? "bg-emerald-500" : status === "waiting" ? "bg-rose-500" : "bg-slate-700"}`} onClick={click}>{status === "go" ? "اضغط الآن" : status === "waiting" ? "انتظر اللون الأخضر" : "اضغط هنا"}</button>{reaction === -1 && <p className="font-bold text-rose-700">ضغطت مبكراً. حاول مرة أخرى.</p>}{value !== null && <p className="text-2xl font-black text-cyan-700">زمن رد الفعل: {value.toFixed(0)} مللي ثانية</p>}</div>;
}

export default function BatchToolSuite({ slug }: { slug: string }) {
  switch (slug) {
    case "loan-calculator": return <LoanCalculator />;
    case "aspect-ratio": return <AspectRatioTool />;
    case "progress-calculator": return <ProgressCalculator />;
    case "storage-converter": return <StorageConverter />;
    case "json-yaml": return <JsonYamlTool />;
    case "text-counter": return <TextCounter />;
    case "json-formatter": return <JsonFormatter />;
    case "spinner-wheel": return <SpinnerWheel />;
    case "reaction-test": return <ReactionTest />;
    default: return null;
  }
}
