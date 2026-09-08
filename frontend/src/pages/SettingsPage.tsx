import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sliders, Cpu, Shield, Server, Check, Key, Bell, Database } from "lucide-react";
import { toast } from "sonner";
import type { ModelType } from "@/types";

export default function SettingsPage() {
  const {
    selectedModel,
    setSelectedModel,
    confidenceThreshold,
    setConfidenceThreshold,
    user
  } = useAuth();

  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:8000/api");
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [enableAlerts, setEnableAlerts] = useState(true);

  const handleSave = () => {
    toast.success("Settings updated successfully.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-[#4A515A]">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#00ADB5]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
            System Settings & ML Configuration
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#A8B0B8] mt-1">
          Tune Transformer detection thresholds, model defaults, and API integration endpoints.
        </p>
      </div>

      <div className="space-y-6">
        {/* Model & Inference Settings */}
        <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-[#EEEEEE] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00ADB5]" />
            <span>Transformer Model Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A8B0B8]">Default Active Transformer</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                data-testid="settings-model-select"
                className="w-full bg-[#2B3139] border border-[#4A515A] rounded-xl px-3 py-2 text-xs text-[#EEEEEE] font-mono focus:outline-none cursor-pointer"
              >
                <option value="DistilBERT">DistilBERT (Fastest, ~18ms latency)</option>
                <option value="BERT">BERT-Base (Deep Attention, ~45ms)</option>
                <option value="RoBERTa">RoBERTa-Large (High Precision, ~62ms)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#A8B0B8]">Classification Threshold:</span>
                <span className="font-mono text-[#00ADB5]">{(confidenceThreshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.30"
                max="0.80"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                data-testid="settings-threshold-slider"
                className="w-full accent-[#00ADB5] cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-[#A8B0B8] font-mono">
                <span>Higher Recall (30%)</span>
                <span>Balanced (50%)</span>
                <span>Higher Precision (80%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Backend & API Connectivity */}
        <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-[#EEEEEE] flex items-center gap-2">
            <Server className="w-4 h-4 text-[#00ADB5]" />
            <span>API Server & Engine Status</span>
          </h3>

          {/* Status Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-[#2B3139] p-3 rounded-xl border border-[#4A515A]">
              <div className="text-[#A8B0B8] text-[10px]">Frontend UI</div>
              <div className="font-bold text-[#22C55E] mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                Connected
              </div>
            </div>

            <div className="bg-[#2B3139] p-3 rounded-xl border border-[#4A515A]">
              <div className="text-[#A8B0B8] text-[10px]">FastAPI Backend</div>
              <div className="font-bold text-[#22C55E] mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                Operational (:8000)
              </div>
            </div>

            <div className="bg-[#2B3139] p-3 rounded-xl border border-[#4A515A]">
              <div className="text-[#A8B0B8] text-[10px]">Inference Mode</div>
              <div className="font-bold text-[#00ADB5] mt-1">
                Demo Analysis
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-[#A8B0B8]">Target API Base URL</label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="w-full bg-[#2B3139] border border-[#4A515A] focus:border-[#00ADB5] rounded-xl px-3 py-2 text-xs font-mono text-[#EEEEEE] focus:outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            data-testid="save-settings-button"
            className="bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md hover:shadow-[#00ADB5]/20 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save ML Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}
