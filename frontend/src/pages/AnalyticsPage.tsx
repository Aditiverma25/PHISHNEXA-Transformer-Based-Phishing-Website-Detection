import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import {
  BarChart3,
  Database,
  Cpu,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info
} from "lucide-react";
import type { BenchmarkReport } from "@/types";

export default function AnalyticsPage() {
  const { data: report, isLoading } = useQuery<BenchmarkReport>({
    queryKey: ["benchmarks-report"],
    queryFn: () => apiGet<BenchmarkReport>("/benchmarks")
  });

  const models = report?.models ?? [];
  const confusionMatrices = report?.confusion_matrices ?? [];
  const rocCurve = report?.roc_curve ?? [];
  const prCurve = report?.pr_curve ?? [];
  const featureImportance = report?.feature_importance ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4A515A]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00ADB5]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
              Model Analytics & Research Benchmarks
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A8B0B8] mt-1">
            Empirical evaluation of DistilBERT, BERT-base, and RoBERTa on 50,000 URL test distributions.
          </p>
        </div>

        <span className="text-[11px] font-mono bg-[#393E46] text-[#A8B0B8] border border-[#4A515A] px-3 py-1.5 rounded-xl">
          Demo Evaluation Data
        </span>
      </div>

      {/* Model Benchmark Table */}
      <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
          <h3 className="text-base font-bold text-[#EEEEEE]">
            Transformer Architecture Performance Comparison
          </h3>
          <span className="text-[11px] font-mono text-[#00ADB5]">
            N = 50,000 Samples
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#4A515A] text-[#A8B0B8] text-[11px] uppercase">
                <th className="py-2.5 px-3">Model Architecture</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Precision</th>
                <th className="py-2.5 px-3">Recall</th>
                <th className="py-2.5 px-3">F1 Score</th>
                <th className="py-2.5 px-3">ROC-AUC</th>
                <th className="py-2.5 px-3">FPR</th>
                <th className="py-2.5 px-3 text-right">Inference Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4A515A]/40">
              {models.map((m) => (
                <tr key={m.model_id} className="hover:bg-[#2B3139]/60">
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#EEEEEE]">{m.name}</div>
                    <div className="text-[10px] text-[#A8B0B8]">{m.architecture}</div>
                  </td>
                  <td className="py-3 px-3 text-[#22C55E] font-bold">{m.accuracy}%</td>
                  <td className="py-3 px-3 text-[#EEEEEE]">{m.precision}%</td>
                  <td className="py-3 px-3 text-[#00ADB5] font-bold">{m.recall}%</td>
                  <td className="py-3 px-3 text-[#EEEEEE]">{m.f1_score}%</td>
                  <td className="py-3 px-3 text-[#EEEEEE]">{m.roc_auc}</td>
                  <td className="py-3 px-3 text-[#EF4444]">{m.false_positive_rate}%</td>
                  <td className="py-3 px-3 text-right font-bold text-[#00ADB5]">
                    {m.avg_latency_ms} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why Recall Matters Educational Card */}
      <div className="bg-[#0B3B40] border border-[#00ADB5]/50 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#00ADB5]">
          <Info className="w-4 h-4" />
          <span>Why Recall Matters in Phishing Detection</span>
        </div>
        <p className="text-xs text-[#EEEEEE] leading-relaxed">
          "A missed phishing URL can expose users to serious security risks. Therefore, phishing detection should prioritize strong recall while maintaining an acceptable false-positive rate so legitimate websites are not unnecessarily blocked."
        </p>
      </div>

      {/* Confusion Matrices Row */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#EEEEEE] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#00ADB5]" />
          <span>Confusion Matrices (DistilBERT vs BERT vs RoBERTa)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {confusionMatrices.map((cm) => (
            <div
              key={cm.model_id}
              className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-5 space-y-3 font-mono text-xs"
            >
              <div className="font-bold text-[#00ADB5] uppercase text-center pb-2 border-b border-[#4A515A]">
                {cm.model_id.toUpperCase()}
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 p-2.5 rounded-xl">
                  <div className="text-[10px] text-[#A8B0B8]">True Positive</div>
                  <div className="text-base font-bold text-[#22C55E] mt-1">
                    {cm.true_positive.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 p-2.5 rounded-xl">
                  <div className="text-[10px] text-[#A8B0B8]">False Positive</div>
                  <div className="text-base font-bold text-[#EF4444] mt-1">
                    {cm.false_positive.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 p-2.5 rounded-xl">
                  <div className="text-[10px] text-[#A8B0B8]">False Negative</div>
                  <div className="text-base font-bold text-[#EF4444] mt-1">
                    {cm.false_negative.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 p-2.5 rounded-xl">
                  <div className="text-[10px] text-[#A8B0B8]">True Negative</div>
                  <div className="text-base font-bold text-[#22C55E] mt-1">
                    {cm.true_negative.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance Bar Chart */}
      <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-[#EEEEEE]">
          Hybrid Feature Fusion Importance Breakdown
        </h3>
        <p className="text-xs text-[#A8B0B8]">
          Relative contribution of deep Transformer attention vectors vs statistical & structural features.
        </p>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={featureImportance}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 140, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4A515A" horizontal={false} />
              <XAxis type="number" domain={[0, 1]} stroke="#A8B0B8" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="feature"
                stroke="#A8B0B8"
                tick={{ fontSize: 11 }}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222831",
                  borderColor: "#4A515A",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#EEEEEE"
                }}
              />
              <Bar dataKey="importance" fill="#00ADB5" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
