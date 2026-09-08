import { HelpCircle, Sparkles, Sliders, ArrowDownRight } from "lucide-react";
import type { CounterfactualItem } from "@/types";

interface ExplainableAiProps {
  counterfactuals: CounterfactualItem[];
}

export function ExplainableAi({ counterfactuals }: ExplainableAiProps) {
  const featureWeights = [
    { label: "Transformer Contextual Token Attention", pct: 88, desc: "Learned bidirectional representations" },
    { label: "Targeted Brand Impersonation Proximity", pct: 82, desc: "Levenshtein distance vs trusted brands" },
    { label: "Punycode & Homoglyph Anomaly", pct: 76, desc: "Lookalike Unicode glyph analysis" },
    { label: "Subdomain Depth & Path Obfuscation", pct: 71, desc: "Hierarchy nesting & redirection patterns" },
    { label: "Lexical & Character Entropy", pct: 64, desc: "Randomness index across token tree" }
  ];

  return (
    <div
      data-testid="explainable-ai-card"
      className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-6"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#00ADB5]" />
          <div>
            <h3 className="text-base font-bold text-[#EEEEEE]">
              Explainable AI: Why was this classified this way?
            </h3>
            <p className="text-xs text-[#A8B0B8]">
              Interpretable feature attribution & counterfactual security reasoning.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono bg-[#0B3B40] text-[#00ADB5] px-2.5 py-1 rounded-xl border border-[#00ADB5]/30">
          SHAP / Attention Fused
        </span>
      </div>

      {/* Feature Attribution Horizontal Bars */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase font-mono font-semibold text-[#A8B0B8] tracking-wider">
          Top Model Attribution Factors
        </h4>
        <div className="space-y-2.5">
          {featureWeights.map((f, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#EEEEEE] font-medium">{f.label}</span>
                <span className="font-mono text-[#00ADB5] font-bold">{f.pct}%</span>
              </div>
              <div className="w-full bg-[#2B3139] h-2 rounded-full overflow-hidden border border-[#4A515A]">
                <div
                  className="bg-gradient-to-r from-[#00ADB5] to-[#19C3CC] h-full rounded-full transition-all duration-700"
                  style={{ width: `${f.pct}%` }}
                />
              </div>
              <div className="text-[10px] text-[#A8B0B8]">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Counterfactuals Section */}
      <div className="pt-3 border-t border-[#4A515A] space-y-3">
        <h4 className="text-xs uppercase font-mono font-semibold text-[#A8B0B8] tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#00ADB5]" />
          <span>Counterfactual Analysis ("What Would Lower Risk?")</span>
        </h4>

        <div className="space-y-2">
          {counterfactuals.map((cf, idx) => (
            <div
              key={idx}
              className="bg-[#2B3139] border border-[#4A515A] rounded-xl p-3 text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-[#EEEEEE]">{cf.factor}</span>
                <span className="text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/30 flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>{cf.delta_risk}% Risk Score</span>
                </span>
              </div>
              <p className="text-[#A8B0B8] text-[11px] leading-relaxed">
                {cf.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
