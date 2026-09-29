import { BRAND, BRAND_SUB } from "@/data/site";

export const Logo = ({ light = false, sub = true, className = "" }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg width="42" height="34" viewBox="0 0 42 34" fill="none" className="shrink-0">
      <path d="M4 8 C4 20, 14 30, 14 30 M20 4 C20 22, 8 22, 8 15"
            stroke={light ? "#fff" : "#0A1330"} strokeWidth="3.2" strokeLinecap="round" fill="none"/>
      <path d="M14 17 L18 17 L20.5 9 L24 25 L26.5 17 L38 17"
            stroke="#E23B2E" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
    <div className="leading-none">
      <div className={`font-display font-extrabold tracking-tight text-[17px] uppercase ${light ? "text-white" : "text-navy-900"}`}>{BRAND}</div>
      {sub && <div className="text-[9px] tracking-[0.35em] text-pulse font-semibold mt-0.5">{BRAND_SUB}</div>}
    </div>
  </div>
);
