import { ArrowUpLeft, LockKeyhole } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

interface Tool {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  color: string;
  category?: string;
}

interface ToolCardProps {
  tool: Tool;
}

const colorClasses: Record<string, { icon: string; glow: string }> = {
  blue: { icon: "bg-blue-50 text-blue-700", glow: "group-hover:border-blue-200" },
  emerald: { icon: "bg-emerald-50 text-emerald-700", glow: "group-hover:border-emerald-200" },
  amber: { icon: "bg-amber-50 text-amber-700", glow: "group-hover:border-amber-200" },
  purple: { icon: "bg-violet-50 text-violet-700", glow: "group-hover:border-violet-200" },
  red: { icon: "bg-rose-50 text-rose-700", glow: "group-hover:border-rose-200" },
  indigo: { icon: "bg-indigo-50 text-indigo-700", glow: "group-hover:border-indigo-200" },
  teal: { icon: "bg-teal-50 text-teal-700", glow: "group-hover:border-teal-200" },
  green: { icon: "bg-green-50 text-green-700", glow: "group-hover:border-green-200" },
  orange: { icon: "bg-orange-50 text-orange-700", glow: "group-hover:border-orange-200" },
  pink: { icon: "bg-pink-50 text-pink-700", glow: "group-hover:border-pink-200" },
  cyan: { icon: "bg-cyan-50 text-cyan-700", glow: "group-hover:border-cyan-200" },
  gray: { icon: "bg-slate-100 text-slate-700", glow: "group-hover:border-slate-300" },
  violet: { icon: "bg-violet-50 text-violet-700", glow: "group-hover:border-violet-200" },
  rose: { icon: "bg-rose-50 text-rose-700", glow: "group-hover:border-rose-200" },
  sky: { icon: "bg-sky-50 text-sky-700", glow: "group-hover:border-sky-200" },
  fuchsia: { icon: "bg-fuchsia-50 text-fuchsia-700", glow: "group-hover:border-fuchsia-200" },
  lime: { icon: "bg-lime-50 text-lime-700", glow: "group-hover:border-lime-200" },
  yellow: { icon: "bg-yellow-50 text-yellow-700", glow: "group-hover:border-yellow-200" },
  zinc: { icon: "bg-zinc-100 text-zinc-700", glow: "group-hover:border-zinc-300" },
  slate: { icon: "bg-slate-100 text-slate-700", glow: "group-hover:border-slate-300" },
};

export default function ToolCard({ tool }: ToolCardProps) {
  const { t } = useLanguage();
  const palette = colorClasses[tool.color] ?? colorClasses.blue;

  return (
    <Link
      href={`/tools/${tool.id}`}
      className="group block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-4"
      aria-label={t(tool.titleKey)}
    >
      <article className={`relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${palette.glow}`}>
        <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-[2.5]" aria-hidden="true"></div>
        <div className="relative flex items-start justify-between">
          <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-sm ${palette.icon}`}>
            <i className={tool.icon} aria-hidden="true"></i>
          </span>
          <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-black text-slate-500">مجاني</span>
        </div>
        <div className="relative mt-6 flex-1">
          <h3 className="text-lg font-black leading-7 text-slate-950 transition-colors group-hover:text-cyan-800">{t(tool.titleKey)}</h3>
          <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-slate-500">{t(tool.descKey)}</p>
        </div>
        <div className="relative mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">
          <span className="inline-flex items-center gap-1.5"><LockKeyhole size={13} className="text-emerald-500" /> يعمل محلياً</span>
          <span className="inline-flex items-center gap-1 text-cyan-700 transition-transform group-hover:-translate-x-1">فتح الأداة <ArrowUpLeft size={15} /></span>
        </div>
      </article>
    </Link>
  );
}
