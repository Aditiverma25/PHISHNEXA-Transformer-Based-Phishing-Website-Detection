import { useState } from "react";
import { Link } from "react-router-dom";
import { BackgroundNetwork } from "@/components/common/BackgroundNetwork";
import { UrlScanner } from "@/components/scanner/UrlScanner";
import { FullResultView } from "@/components/result/FullResultView";
import {
  Shield,
  Cpu,
  Network,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  Lock,
  GitBranch,
  FileCheck,
  ChevronRight
} from "lucide-react";
import type { ScanResult } from "@/types";

export default function Landing() {
  const [activeScanResult, setActiveScanResult] = useState<ScanResult | null>(null);

  const capabilities = [
    {
      title: "TRANSFORMER-BASED DETECTION",
      icon: Cpu,
      desc: "Bidirectional self-attention encoders analyze subword token sequences to detect subtle structural perturbations."
    },
    {
      title: "CONTEXTUAL URL ANALYSIS",
      icon: Network,
      desc: "Understands relational dependencies between subdomains, domain authorities, paths, and obfuscated query parameters."
    },
    {
      title: "EXPLAINABLE RISK ASSESSMENT",
      icon: Eye,
      desc: "Generates human-readable counterfactual insights explaining why a link is risky and how to mitigate exposure."
    },
    {
      title: "PHISHING VS LEGITIMATE CLASSIFICATION",
      icon: Shield,
      desc: "Robust classification threshold tuned for ultra-high recall to prevent sensitive credential and banking leaks."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "ENTER URL",
      desc: "User enters any suspicious link, shortener, or internationalized domain for analysis."
    },
    {
      num: "02",
      title: "PREPROCESS & TOKENIZE",
      desc: "URL is normalized and decomposed into subword tokens with positional embeddings."
    },
    {
      num: "03",
      title: "TRANSFORMER ANALYSIS",
      desc: "DistilBERT / BERT multi-head self-attention models compute contextual threat representations."
    },
    {
      num: "04",
      title: "CLASSIFICATION & VERDICT",
      desc: "System outputs risk score (0-100), confidence meter, threat indicators, and counterfactuals."
    }
  ];

  return (
    <div className="relative min-h-screen space-y-20 pb-20 overflow-hidden">
      <BackgroundNetwork />

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 z-10">
        {/* Small Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3B40] border border-[#00ADB5]/40 text-[#00ADB5] text-xs font-mono font-semibold tracking-wider uppercase animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-POWERED CYBERSECURITY</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#EEEEEE] leading-[1.15]">
            Detect Phishing URLs <br />
            with <span className="text-[#00ADB5] drop-shadow-[0_0_20px_rgba(0,173,181,0.35)]">Transformer Intelligence</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A8B0B8] max-w-2xl mx-auto leading-relaxed">
            PHISHNEXA analyzes URL structure, contextual patterns, and Transformer representations to identify suspicious websites before sensitive information is exposed.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#live-scanner-section"
            data-testid="hero-primary-cta"
            className="bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-[#00ADB5]/25 flex items-center gap-2 cursor-pointer"
          >
            <span>Analyze a URL</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/models"
            data-testid="hero-secondary-cta"
            className="bg-[#393E46] hover:bg-[#4A515A] border border-[#4A515A] text-[#EEEEEE] font-semibold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2"
          >
            <span>Explore Technology</span>
            <ChevronRight className="w-4 h-4 text-[#00ADB5]" />
          </Link>
        </div>

        {/* Hero Pipeline Visualizer */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="bg-[#393E46]/80 backdrop-blur-md border border-[#4A515A] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#A8B0B8] pb-2 border-b border-[#4A515A]/60">
              <span className="flex items-center gap-1.5 text-[#00ADB5]">
                <Cpu className="w-3.5 h-3.5" />
                TRANSFORMER INFERENCE PIPELINE
              </span>
              <span>12-Head Self-Attention</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs font-mono">
              {[
                { title: "RAW URL", sub: "Input Stream" },
                { title: "TOKENIZATION", sub: "WordPiece / BPE" },
                { title: "TRANSFORMER", sub: "Encoder Layers" },
                { title: "CONTEXT EMBED", sub: "768-dim Vector" },
                { title: "CLASSIFICATION", sub: "Dense MLP Head" },
                { title: "VERDICT", sub: "Risk & Explainability" }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="bg-[#2B3139] border border-[#4A515A] hover:border-[#00ADB5]/50 p-2.5 rounded-xl transition-all"
                >
                  <div className="font-bold text-[#EEEEEE] text-[11px]">{step.title}</div>
                  <div className="text-[9px] text-[#00ADB5] truncate">{step.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Scanner Section */}
      <section
        id="live-scanner-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-10"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
            Live Security Analysis
          </h2>
          <p className="text-xs sm:text-sm text-[#A8B0B8]">
            Test our Transformer detection engine on real-time phishing and legitimate URLs.
          </p>
        </div>

        {activeScanResult ? (
          <FullResultView
            scan={activeScanResult}
            onResetScan={() => setActiveScanResult(null)}
          />
        ) : (
          <UrlScanner onScanResult={(res) => setActiveScanResult(res)} />
        )}
      </section>

      {/* Capabilities 4-Card Bento Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10">
        <div className="text-center space-y-2">
          <div className="text-xs uppercase font-mono font-bold text-[#00ADB5] tracking-wider">
            Core Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#EEEEEE]">
            Engineered for High Precision & Generalization
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                data-testid={`capability-card-${idx}`}
                className="bg-[#393E46] border border-[#4A515A] hover:border-[#00ADB5]/60 hover:-translate-y-1 rounded-2xl p-6 shadow-xl transition-all duration-300 space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2B3139] border border-[#4A515A] flex items-center justify-center text-[#00ADB5] group-hover:bg-[#0B3B40] group-hover:border-[#00ADB5]/40 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold font-mono text-[#EEEEEE] tracking-tight">
                  {cap.title}
                </h3>
                <p className="text-xs text-[#A8B0B8] leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works 4-Step Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10">
        <div className="text-center space-y-2">
          <div className="text-xs uppercase font-mono font-bold text-[#00ADB5] tracking-wider">
            How It Works
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#EEEEEE]">
            From URL to Security Verdict
          </h2>
          <p className="text-xs sm:text-sm text-[#A8B0B8]">
            PHISHNEXA transforms a raw URL into an interpretable security assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-3 relative overflow-hidden"
            >
              <div className="text-3xl font-black font-mono text-[#00ADB5]/30">
                {st.num}
              </div>
              <h3 className="text-sm font-bold font-mono text-[#EEEEEE]">
                {st.title}
              </h3>
              <p className="text-xs text-[#A8B0B8] leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Traditional vs Transformer Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
            Traditional Heuristics vs PHISHNEXA Transformer
          </h2>
          <p className="text-xs sm:text-sm text-[#A8B0B8]">
            Why deep contextual representation outperforms static blacklist rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Card */}
          <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
              <span className="text-xs font-mono font-bold uppercase text-[#EF4444]">
                TRADITIONAL DETECTION
              </span>
              <span className="text-[10px] text-[#A8B0B8] font-mono">Legacy Approach</span>
            </div>

            <ul className="space-y-3 text-xs text-[#A8B0B8]">
              <li className="flex items-center gap-2.5">
                <span className="text-[#EF4444]">✕</span>
                <span>Static blacklists become obsolete within hours of campaign launch</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#EF4444]">✕</span>
                <span>Handcrafted regex rules fail on unseen typosquatting & unicode tricks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#EF4444]">✕</span>
                <span>Zero contextual awareness between path parameters and domain tokens</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#EF4444]">✕</span>
                <span>High false negative rate against multi-stage redirection attacks</span>
              </li>
            </ul>
          </div>

          {/* PHISHNEXA Card */}
          <div className="bg-[#393E46] border border-[#00ADB5]/60 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ADB5]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
              <span className="text-xs font-mono font-bold uppercase text-[#00ADB5] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                PHISHNEXA APPROACH
              </span>
              <span className="text-[10px] text-[#00ADB5] font-mono font-bold">Transformer Intelligence</span>
            </div>

            <ul className="space-y-3 text-xs text-[#EEEEEE]">
              <li className="flex items-center gap-2.5">
                <span className="text-[#22C55E]">✓</span>
                <span>Bidirectional self-attention captures intricate subword token correlations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#22C55E]">✓</span>
                <span>Hybrid fusion joins deep embeddings with lexical, entropy & homoglyph metrics</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#22C55E]">✓</span>
                <span>Superior generalization against novel zero-day deceptive links</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#22C55E]">✓</span>
                <span>Interpretable counterfactual explanations for security operations teams</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
