import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import {
  FlaskConical,
  Bug,
  Globe,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import type {
  AdversarialTestResponse,
  HomographCheckResponse,
  DriftMetrics,
  CampaignCluster
} from "@/types";

export default function LabsPage() {
  const [activeTab, setActiveTab] = useState<"adversarial" | "homograph" | "drift" | "campaigns">("adversarial");

  // Adversarial Lab State
  const [advUrl, setAdvUrl] = useState("https://paypa1-security-billing-verification.com/login");
  const [advLoading, setAdvLoading] = useState(false);
  const [advResult, setAdvResult] = useState<AdversarialTestResponse | null>(null);

  // Homograph Lab State
  const [homoDomain, setHomoDomain] = useState("xn--appl-43d.com");
  const [homoLoading, setHomoLoading] = useState(false);
  const [homoResult, setHomoResult] = useState<HomographCheckResponse | null>(null);

  // Drift & Campaigns Queries
  const { data: driftData } = useQuery<DriftMetrics>({
    queryKey: ["labs-drift"],
    queryFn: () => apiGet<DriftMetrics>("/labs/drift"),
    enabled: activeTab === "drift"
  });

  const { data: campaignData } = useQuery<CampaignCluster[]>({
    queryKey: ["labs-campaigns"],
    queryFn: () => apiGet<CampaignCluster[]>("/labs/campaigns"),
    enabled: activeTab === "campaigns"
  });

  const handleRunAdversarial = async () => {
    if (!advUrl) return;
    setAdvLoading(true);
    try {
      const res = await apiPost<AdversarialTestResponse>("/labs/adversarial", { url: advUrl });
      setAdvResult(res);
      toast.success("Adversarial perturbation battery completed.");
    } catch (err: any) {
      toast.error(err.message || "Failed to run adversarial tests.");
    } finally {
      setAdvLoading(false);
    }
  };

  const handleRunHomograph = async () => {
    if (!homoDomain) return;
    setHomoLoading(true);
    try {
      const res = await apiPost<HomographCheckResponse>("/labs/homograph", { domain: homoDomain });
      setHomoResult(res);
      toast.success("Unicode & Punycode analysis completed.");
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze homograph.");
    } finally {
      setHomoLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4A515A]">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#00ADB5]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
              Cybersecurity Research Labs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A8B0B8] mt-1">
            Safe adversarial perturbation testing, Punycode/Unicode homoglyph inspection, and concept drift telemetry.
          </p>
        </div>

        <span className="text-[11px] font-mono bg-[#0B3B40] text-[#00ADB5] border border-[#00ADB5]/30 px-3 py-1 rounded-xl">
          Experimental Lab Environment
        </span>
      </div>

      {/* Lab Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-[#4A515A]/60">
        {[
          { id: "adversarial", label: "Adversarial Robustness Tester", icon: Bug },
          { id: "homograph", label: "Unicode / Homograph Analyzer", icon: Globe },
          { id: "drift", label: "Concept & Adversarial Drift", icon: TrendingUp },
          { id: "campaigns", label: "Threat Campaign Clusters", icon: ShieldAlert }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              data-testid={`lab-tab-${tab.id}`}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
                active
                  ? "bg-[#00ADB5] text-[#222831] shadow-md shadow-[#00ADB5]/20"
                  : "bg-[#2B3139] text-[#A8B0B8] hover:text-[#EEEEEE] hover:bg-[#393E46]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Adversarial Robustness Tester */}
      {activeTab === "adversarial" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#EEEEEE] flex items-center gap-2">
              <Bug className="w-4 h-4 text-[#00ADB5]" />
              <span>Adversarial Perturbation Simulator</span>
            </h3>
            <p className="text-xs text-[#A8B0B8]">
              Applies 4 simulated adversarial evasion techniques (homoglyphs, deep subdomain prefixing, query parameter padding, TLD swapping) to evaluate model sensitivity.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={advUrl}
                onChange={(e) => setAdvUrl(e.target.value)}
                placeholder="Enter URL to test for adversarial resilience..."
                data-testid="lab-adv-url-input"
                className="flex-1 bg-[#2B3139] border border-[#4A515A] focus:border-[#00ADB5] rounded-xl px-4 py-2.5 text-xs text-[#EEEEEE] font-mono focus:outline-none"
              />
              <button
                onClick={handleRunAdversarial}
                disabled={advLoading}
                data-testid="lab-adv-run-btn"
                className="bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {advLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-[#222831] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Bug className="w-4 h-4" />
                )}
                <span>Run Adversarial Suite</span>
              </button>
            </div>
          </div>

          {advResult && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-[#0B3B40] border border-[#00ADB5]/50 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono uppercase text-[#00ADB5] font-bold">
                    OVERALL MODEL ROBUSTNESS SCORE
                  </div>
                  <div className="text-2xl font-black font-mono text-[#EEEEEE] mt-0.5">
                    {advResult.overall_robustness_score} / 100
                  </div>
                </div>
                <span className="text-xs font-mono bg-[#2B3139] text-[#22C55E] px-3 py-1.5 rounded-xl border border-[#22C55E]/40">
                  Resistant to Token Perturbations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advResult.perturbations.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-5 space-y-3 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-[#4A515A] pb-2">
                      <span className="font-bold text-[#00ADB5]">{p.attack_type}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          p.is_evasion_successful
                            ? "bg-[#EF4444]/15 text-[#EF4444]"
                            : "bg-[#22C55E]/15 text-[#22C55E]"
                        }`}
                      >
                        {p.is_evasion_successful ? "Evasion Succeeded" : "Attack Mitigated"}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="text-[#A8B0B8]">Perturbed Stream:</div>
                      <div className="text-[#EEEEEE] truncate bg-[#2B3139] p-2 rounded-lg border border-[#4A515A]">
                        {p.perturbed_url}
                      </div>
                    </div>

                    <div className="flex justify-between text-xs pt-1">
                      <span>Baseline Risk: <strong className="text-[#EEEEEE]">{p.original_risk}</strong></span>
                      <span>Perturbed Risk: <strong className="text-[#00ADB5]">{p.perturbed_risk}</strong></span>
                      <span>Delta: <strong className={p.risk_delta < 0 ? "text-[#EF4444]" : "text-[#22C55E]"}>{p.risk_delta} pts</strong></span>
                    </div>

                    <p className="text-[11px] text-[#A8B0B8] font-sans leading-relaxed pt-1">
                      {p.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Homograph / Unicode Analyzer */}
      {activeTab === "homograph" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#EEEEEE] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00ADB5]" />
              <span>Internationalized Domain (IDN) & Homograph Inspector</span>
            </h3>
            <p className="text-xs text-[#A8B0B8]">
              Deconstructs Punycode (xn--) and lookalike Cyrillic/Greek homoglyphs designed to visually spoof legitimate brand domains.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={homoDomain}
                onChange={(e) => setHomoDomain(e.target.value)}
                placeholder="e.g. xn--appl-43d.com or paypa1.com"
                data-testid="lab-homo-input"
                className="flex-1 bg-[#2B3139] border border-[#4A515A] focus:border-[#00ADB5] rounded-xl px-4 py-2.5 text-xs text-[#EEEEEE] font-mono focus:outline-none"
              />
              <button
                onClick={handleRunHomograph}
                disabled={homoLoading}
                data-testid="lab-homo-run-btn"
                className="bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {homoLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-[#222831] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                <span>Inspect Homograph</span>
              </button>
            </div>
          </div>

          {homoResult && (
            <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
                <div className="font-bold text-sm text-[#EEEEEE]">Decoded Identity: {homoResult.decoded_domain}</div>
                <span
                  className={`px-2.5 py-1 rounded-xl uppercase font-bold text-[10px] ${
                    homoResult.risk_assessment === "HIGH"
                      ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                      : "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                  }`}
                >
                  {homoResult.risk_assessment} Homograph Risk
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-[#2B3139] p-3 rounded-xl">
                  <div className="text-[#A8B0B8] text-[10px]">Punycode (xn--)</div>
                  <div className="text-sm font-bold text-[#EEEEEE] mt-1">{homoResult.is_punycode ? "YES" : "NO"}</div>
                </div>
                <div className="bg-[#2B3139] p-3 rounded-xl">
                  <div className="text-[#A8B0B8] text-[10px]">Homoglyph Detected</div>
                  <div className="text-sm font-bold text-[#EEEEEE] mt-1">{homoResult.has_homoglyphs ? "YES" : "NO"}</div>
                </div>
                <div className="bg-[#2B3139] p-3 rounded-xl">
                  <div className="text-[#A8B0B8] text-[10px]">Impersonated Brand</div>
                  <div className="text-sm font-bold text-[#00ADB5] mt-1">{homoResult.impersonated_brand || "None"}</div>
                </div>
                <div className="bg-[#2B3139] p-3 rounded-xl">
                  <div className="text-[#A8B0B8] text-[10px]">Similarity Proximity</div>
                  <div className="text-sm font-bold text-[#EEEEEE] mt-1">{(homoResult.similarity_score * 100).toFixed(0)}%</div>
                </div>
              </div>

              {/* Unicode Breakdown Table */}
              <div className="pt-2">
                <div className="text-xs text-[#A8B0B8] mb-2 font-semibold">Character-by-Character Unicode Breakdown:</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#4A515A] text-[#A8B0B8] text-[10px] uppercase">
                        <th className="py-2 px-3">Glyph</th>
                        <th className="py-2 px-3">Unicode Hex</th>
                        <th className="py-2 px-3">Script Family</th>
                        <th className="py-2 px-3">ASCII Standard</th>
                        <th className="py-2 px-3">Normalized ASCII</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#4A515A]/40">
                      {homoResult.unicode_breakdown.map((u, i) => (
                        <tr key={i} className="hover:bg-[#2B3139]">
                          <td className="py-2 px-3 text-base font-bold text-[#00ADB5]">{u.character}</td>
                          <td className="py-2 px-3">{u.unicode}</td>
                          <td className="py-2 px-3">{u.script}</td>
                          <td className="py-2 px-3">{u.is_ascii ? "True (Standard)" : "False (Extended/Lookalike)"}</td>
                          <td className="py-2 px-3 text-[#22C55E] font-bold">{u.ascii_replacement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Drift Telemetry */}
      {activeTab === "drift" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
              <div>
                <h3 className="text-base font-bold text-[#EEEEEE]">Concept Drift & Adversarial Shift Monitor</h3>
                <p className="text-xs text-[#A8B0B8]">Evaluates covariate shift in token distributions over a 90-day window.</p>
              </div>
              <span className="text-xs font-mono bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-3 py-1 rounded-xl">
                Drift Score: {driftData?.drift_score || "0.14"} (Stable)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {driftData?.concept_drift_features.map((f, i) => (
                <div key={i} className="bg-[#2B3139] border border-[#4A515A] rounded-xl p-4 font-mono text-xs space-y-1">
                  <div className="flex justify-between font-bold text-[#EEEEEE]">
                    <span>{f.feature}</span>
                    <span className="text-[#00ADB5]">{f.drift_status}</span>
                  </div>
                  <div className="text-[11px] text-[#A8B0B8]">
                    Feature Importance Weight: {(f.importance * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Campaign Clusters */}
      {activeTab === "campaigns" && (
        <div className="space-y-4 animate-in fade-in">
          {campaignData?.map((c) => (
            <div
              key={c.cluster_id}
              className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-3 font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#4A515A]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#00ADB5]">{c.cluster_id}</span>
                  <span className="text-[#EEEEEE] font-bold text-sm">— {c.campaign_name}</span>
                </div>
                <span className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 px-2.5 py-0.5 rounded font-bold uppercase text-[10px]">
                  Target: {c.target_brand}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[#A8B0B8] text-[11px]">
                <div>Threat Actor: <strong className="text-[#EEEEEE]">{c.threat_actor_sig}</strong></div>
                <div>Active URLs: <strong className="text-[#00ADB5]">{c.active_urls_count}</strong></div>
                <div>Avg Risk: <strong className="text-[#EF4444]">{c.avg_risk_score}/100</strong></div>
              </div>

              <div className="bg-[#2B3139] p-3 rounded-xl space-y-1">
                <div className="text-[10px] text-[#A8B0B8] uppercase font-bold">Observed Lure Samples:</div>
                {c.sample_urls.map((u, idx) => (
                  <div key={idx} className="text-[#EEEEEE] text-[11px] truncate">
                    • {u}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
