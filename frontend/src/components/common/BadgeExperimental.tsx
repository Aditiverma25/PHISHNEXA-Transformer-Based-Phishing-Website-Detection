import { Sparkles, FlaskConical, Database, ShieldAlert } from "lucide-react";

interface BadgeExperimentalProps {
  type?: "demo_eval" | "demo_analysis" | "experimental" | "mock_metric";
  label?: string;
  size?: "sm" | "md";
}

export function BadgeExperimental({
  type = "demo_analysis",
  label,
  size = "sm"
}: BadgeExperimentalProps) {
  const configs = {
    demo_analysis: {
      text: label || "Demo Analysis",
      icon: Sparkles,
      className: "bg-[#0B3B40] text-[#00ADB5] border-[#00ADB5]/40"
    },
    demo_eval: {
      text: label || "Demo Evaluation Data",
      icon: Database,
      className: "bg-[#393E46] text-[#A8B0B8] border-[#4A515A]"
    },
    experimental: {
      text: label || "Experimental Feature",
      icon: FlaskConical,
      className: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
    },
    mock_metric: {
      text: label || "Simulated Metric",
      icon: ShieldAlert,
      className: "bg-[#2B3139] text-[#A8B0B8] border-[#4A515A]"
    }
  };

  const current = configs[type] || configs.demo_analysis;
  const Icon = current.icon;
  const sizeCls = size === "sm" ? "text-[11px] px-2 py-0.5 gap-1.5" : "text-xs px-2.5 py-1 gap-2";

  return (
    <span
      data-testid={`badge-${type}`}
      className={`inline-flex items-center font-medium rounded-md border tracking-wide uppercase font-mono ${current.className} ${sizeCls}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{current.text}</span>
    </span>
  );
}
