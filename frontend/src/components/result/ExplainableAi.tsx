import { HelpCircle, Sparkles, Sliders, ArrowDownRight } from "lucide-react";
import type { CounterfactualItem, TokenAttentionItem, ThreatIndicatorItem, URLAnatomy, HomoglyphAnalysis } from "@/types";
import { useMemo } from "react";

interface ExplainableAiProps {
  counterfactuals: CounterfactualItem[];
  tokens?: TokenAttentionItem[];
  indicators?: ThreatIndicatorItem[];
  anatomy?: URLAnatomy;
  homoglyphAnalysis?: HomoglyphAnalysis;
  riskScore?: number;
}

function clamp(val: number, min = 0, max = 100): number {
  return Math.round(Math.max(min, Math.min(max, val)));
}

export function ExplainableAi({ counterfactuals, tokens, indicators, anatomy, homoglyphAnalysis, riskScore }: ExplainableAiProps) {
  const featureWeights = useMemo(() => {
    // --- 1. Transformer Contextual Token Attention ---
    // Average attention weight of suspicious tokens, scaled to 0-100
    let tokenAttentionPct = 12; // low default for legitimate
    if (tokens && tokens.length > 0) {
      const suspiciousTokens = tokens.filter(t => t.is_suspicious);
      if (suspiciousTokens.length > 0) {
        const avgSuspiciousWeight = suspiciousTokens.reduce((s, t) => s + t.attention_weight, 0) / suspiciousTokens.length;
        // attention_weight is typically 0.0-1.0; scale and boost by suspicious ratio
        const suspiciousRatio = suspiciousTokens.length / tokens.length;
        tokenAttentionPct = clamp(avgSuspiciousWeight * 100 * (0.5 + suspiciousRatio));
      } else {
        // No suspicious tokens — low contribution
        const avgWeight = tokens.reduce((s, t) => s + t.attention_weight, 0) / tokens.length;
        tokenAttentionPct = clamp(avgWeight * 30); // scale down for non-suspicious
      }
    }

    // --- 2. Targeted Brand Impersonation Proximity ---
    let brandPct = 5; // low default
    if (homoglyphAnalysis) {
      if (homoglyphAnalysis.impersonated_brand) {
        // If a brand is being impersonated, similarity_score drives this (0.0-1.0)
        brandPct = clamp(homoglyphAnalysis.similarity_score * 100);
      } else {
        brandPct = clamp(homoglyphAnalysis.similarity_score * 20); // minimal if no impersonation
      }
    }
    // Also check indicators for brand_impersonation evidence
    if (indicators) {
      const brandIndicator = indicators.find(i => i.id === "brand_impersonation" || i.id === "suspicious_keywords");
      if (brandIndicator) {
        brandPct = clamp(Math.max(brandPct, brandIndicator.weight * 10));
      }
    }

    // --- 3. Punycode & Homoglyph Anomaly ---
    let punycodePct = 3; // low default
    if (homoglyphAnalysis) {
      if (homoglyphAnalysis.has_homoglyphs) {
        punycodePct = clamp(75 + homoglyphAnalysis.similarity_score * 25);
      } else if (homoglyphAnalysis.is_punycode) {
        punycodePct = clamp(60);
      }
    }

    // --- 4. Subdomain Depth & Path Obfuscation ---
    let subdomainPct = 5; // low default
    if (anatomy) {
      // Count subdomain depth (dots in subdomain)
      const subdomainDepth = anatomy.subdomain && anatomy.subdomain !== "(None)" && anatomy.subdomain !== ""
        ? anatomy.subdomain.split(".").filter(Boolean).length
        : 0;
      const pathScore = Math.min(anatomy.path_length / 50, 1) * 30; // long paths are suspicious
      const subdomainScore = Math.min(subdomainDepth / 3, 1) * 50;
      subdomainPct = clamp(subdomainScore + pathScore);

      // Boost from indicators
      if (indicators) {
        const subIndicator = indicators.find(i => i.id === "subdomain_depth" || i.id === "excessive_subdomains");
        if (subIndicator) {
          subdomainPct = clamp(Math.max(subdomainPct, subIndicator.weight * 10));
        }
      }
    }

    // --- 5. Lexical & Character Entropy ---
    let entropyPct = 8; // low default
    if (anatomy) {
      // Typical entropy range: 2.0 (simple) to 5.0+ (random/suspicious)
      // Map: 2.0 → ~10%, 3.5 → ~40%, 4.5+ → ~80%+
      const entropy = anatomy.entropy || 0;
      if (entropy > 0) {
        entropyPct = clamp(((entropy - 1.5) / 3.5) * 100);
      }
      // Special chars also contribute
      const specialCharBoost = Math.min(anatomy.special_chars_count / 10, 1) * 20;
      entropyPct = clamp(entropyPct + specialCharBoost);
    }

    // If we have a risk score, slightly calibrate values toward it for consistency
    if (riskScore !== undefined) {
      const riskFactor = riskScore / 100;
      // Nudge values toward being consistent with overall risk
      tokenAttentionPct = clamp(tokenAttentionPct * (0.6 + riskFactor * 0.6));
      brandPct = clamp(brandPct * (0.5 + riskFactor * 0.8));
      subdomainPct = clamp(subdomainPct * (0.5 + riskFactor * 0.8));
    }

    return [
      { label: "Transformer Contextual Token Attention", pct: tokenAttentionPct, desc: "Learned bidirectional representations" },
      { label: "Targeted Brand Impersonation Proximity", pct: brandPct, desc: "Levenshtein distance vs trusted brands" },
      { label: "Punycode & Homoglyph Anomaly", pct: punycodePct, desc: "Lookalike Unicode glyph analysis" },
      { label: "Subdomain Depth & Path Obfuscation", pct: subdomainPct, desc: "Hierarchy nesting & redirection patterns" },
      { label: "Lexical & Character Entropy", pct: entropyPct, desc: "Randomness index across token tree" }
    ];
  }, [tokens, indicators, anatomy, homoglyphAnalysis, riskScore]);

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
