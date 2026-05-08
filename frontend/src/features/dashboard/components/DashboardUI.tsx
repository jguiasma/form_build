import { motion } from "framer-motion";

export const SidebarLink = ({
  icon,
  label,
  active = false,
  badge,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  onClick: () => void;
}) => (
  <a
    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
      active
        ? "bg-[#0033cc]/10 text-[#1148ad] shadow-sm"
        : "hover:bg-slate-50 text-slate-500 hover:text-slate-900 font-medium"
    }`}
    href="#"
    onClick={(e) => { e.preventDefault(); onClick(); }}
  >
    <div className="flex items-center gap-3.5">
      <span
        className={`material-symbols-outlined transition-all ${
          active
            ? "text-[#1148ad] fill-current font-bold"
            : "text-slate-400 group-hover:text-[#1148ad]"
        }`}
      >
        {icon}
      </span>
      <span className={`text-[13px] tracking-tight ${active ? "font-black" : "font-bold"}`}>
        {label}
      </span>
    </div>
    {badge && (
      <span className="text-[9px] font-black bg-[#1148ad] text-white px-1.5 py-0.5 rounded-[6px]">
        {badge}
      </span>
    )}
    {active && (
      <div className="size-1.5 rounded-full bg-[#1148ad] ring-4 ring-blue-100/50"></div>
    )}
  </a>
);

export const StatCard = ({ label, value, icon, trend, trendIcon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: delay / 1000, duration: 0.5 }}
    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 group cursor-default"
  >
    <div className="flex justify-between items-start mb-8">
      <div className="p-3 bg-blue-50/50 rounded-2xl text-[#1148ad] group-hover:bg-[#1148ad] group-hover:text-white transition-all duration-500 shadow-inner">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      {trend && (
        <span
          className={`flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-xl ${
            trend.startsWith("+")
              ? "text-emerald-600 bg-emerald-50"
              : "text-rose-600 bg-rose-50"
          }`}
        >
          <span className="material-symbols-outlined text-sm leading-none">{trendIcon}</span>{" "}
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">
        {label}
      </p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

export const Bar = ({
  value,
  current,
  label,
}: {
  value: number;
  current: number;
  label: string;
}) => (
  <div className="flex-1 flex flex-col items-center gap-4 h-full group">
    <div className="w-full flex-1 bg-slate-50/50 rounded-2xl relative overflow-hidden flex flex-col justify-end">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${value}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-x-0 bottom-0 bg-slate-200/50 rounded-2xl transition-all group-hover:bg-slate-300/50"
      />
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${current}%` }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0033cc] to-[#1148ad] rounded-2xl shadow-lg ring-1 ring-white/10 group-hover:brightness-110 transition-all border-t-[3px] border-blue-400/20"
      />
      <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
        <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg pointer-events-none shadow-xl">
          {current}%
        </div>
      </div>
    </div>
    <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{label}</span>
  </div>
);

export const LegendItem = ({ label, color }: { label: string; color: string }) => (
  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
    <span className="size-2 rounded-full ring-2 ring-slate-100" style={{ backgroundColor: color }}></span>{" "}
    {label}
  </div>
);

export const DeviceStat = ({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: string;
  color: string;
}) => (
  <div className="flex items-center justify-between gap-4 group cursor-default">
    <div className="flex items-center gap-3">
      <div
        className="size-2.5 rounded-full shadow-sm ring-4 ring-slate-50"
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-[13px] font-bold text-slate-700">{label}</span>
    </div>
    <div className="flex items-center gap-4 flex-1 justify-end">
      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: percentage }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-black text-slate-900 w-8 text-right font-mono">
        {percentage}
      </span>
    </div>
  </div>
);

export const HealthRow = ({ name, meta, percentage, color }: any) => (
  <div className="group cursor-default">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div
          className={`size-2 rounded-full ${
            color === "emerald"
              ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
              : color === "blue"
              ? "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]"
              : "bg-indigo-500 shadow-[0_0_12px_rgba(79,70,229,0.4)]"
          }`}
        ></div>
        <p className="text-sm font-black text-slate-800">{name}</p>
      </div>
      <span
        className={`text-[11px] font-black ${
          color === "emerald" ? "text-emerald-600" : "text-slate-900 font-mono"
        }`}
      >
        {percentage}%
      </span>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-5">{meta}</p>
      <div className="w-24 h-1 bg-slate-50 rounded-full relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5 }}
          className={`absolute inset-y-0 left-0 rounded-full ${
            color === "emerald"
              ? "bg-emerald-500"
              : color === "blue"
              ? "bg-blue-500"
              : "bg-indigo-500"
          }`}
        />
      </div>
    </div>
  </div>
);

export const TableRow = ({
  initial,
  name,
  form,
  time,
  pending = false,
  color,
}: any) => (
  <tr className="group hover:bg-blue-50/20 transition-all border-b border-transparent hover:border-blue-100">
    <td className="px-8 py-5">
      <div className="flex items-center gap-4">
        <div
          className={`size-10 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center text-xs font-black shadow-inner border border-white group-hover:scale-110 transition-transform duration-300`}
        >
          {initial}
        </div>
        <div>
          <span className="text-sm font-black text-slate-900 block leading-tight">{name}</span>
          <span className="text-[10px] text-slate-400 font-bold">Verified</span>
        </div>
      </div>
    </td>
    <td className="px-8 py-5 text-sm font-black text-slate-700 tracking-tight">{form}</td>
    <td className="px-8 py-5 text-xs text-slate-400 font-bold uppercase tracking-tight">{time}</td>
    <td className="px-8 py-5">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
          pending
            ? "bg-amber-50 text-amber-600 border-amber-100"
            : "bg-emerald-50 text-emerald-600 border-emerald-100"
        }`}
      >
        <div
          className={`size-1.5 rounded-full ${pending ? "bg-amber-500" : "bg-emerald-500"}`}
        ></div>
        <span className="text-[10px] font-black uppercase tracking-widest">
          {pending ? "Processing" : "Confirmed"}
        </span>
      </div>
    </td>
    <td className="px-8 py-5 text-right">
      <button className="p-2.5 bg-slate-50 text-slate-400 hover:bg-[#1148ad] hover:text-white rounded-xl text-xs font-black transition-all shadow-sm active:scale-90 border border-transparent hover:border-blue-100">
        <span className="material-symbols-outlined text-sm leading-none">arrow_forward_ios</span>
      </button>
    </td>
  </tr>
);

export const FooterLink = ({ label }: { label: string }) => (
  <a
    className="hover:text-[#1148ad] hover:scale-105 transition-all relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#1148ad] hover:after:w-full after:transition-all"
    href="#"
    onClick={(e) => e.preventDefault()}
  >
    {label}
  </a>
);

export const MiniChart = ({ data }: { data: { date: string, count: number }[] }) => {
  if (!data || data.length === 0) return (
    <div className="h-16 w-full flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No data</span>
    </div>
  );
  
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1.5 h-16 w-full">
      {data.map((d, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(d.count / max) * 100}%` }}
          transition={{ delay: i * 0.03, duration: 0.6, ease: "easeOut" }}
          className="flex-1 bg-gradient-to-t from-[#1148ad] to-blue-400 rounded-t-md hover:brightness-110 transition-all relative group"
        >
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10 ring-4 ring-black/5">
            {d.count} subs • {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
