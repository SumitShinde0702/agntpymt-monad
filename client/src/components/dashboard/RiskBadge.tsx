import { ShieldAlert, ShieldCheck, ShieldOff, ShieldQuestion } from "lucide-react";

export type RiskTier = "low" | "medium" | "high" | "blocked" | "unchecked";

const STYLES: Record<RiskTier, { label: string; className: string; Icon: typeof ShieldCheck }> = {
  low: { label: "Low risk", className: "bg-emerald-100 text-emerald-800", Icon: ShieldCheck },
  medium: { label: "Medium risk", className: "bg-amber-100 text-amber-800", Icon: ShieldQuestion },
  high: { label: "High risk", className: "bg-orange-100 text-orange-800", Icon: ShieldAlert },
  blocked: { label: "Blocked", className: "bg-red-100 text-red-700", Icon: ShieldOff },
  unchecked: { label: "Not checked", className: "bg-slate-100 text-slate-600", Icon: ShieldQuestion },
};

export function isRiskTier(value: unknown): value is RiskTier {
  return typeof value === "string" && value in STYLES;
}

export function RiskBadge({ tier }: { tier: RiskTier }) {
  const { label, className, Icon } = STYLES[tier];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
