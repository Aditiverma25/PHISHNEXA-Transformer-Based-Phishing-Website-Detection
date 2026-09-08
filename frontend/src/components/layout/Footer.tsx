import { Shield, ExternalLink, Cpu, Terminal, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full bg-[#222831] border-t border-[#4A515A]/70 text-[#A8B0B8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#4A515A]/50">
          {/* Col 1: Brand & Academic Statement */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00ADB5]" />
              <span className="text-lg font-bold font-mono text-[#EEEEEE]">
                PHISH<span className="text-[#00ADB5]">NEXA</span>
              </span>
            </div>
            <p className="text-xs text-[#A8B0B8] leading-relaxed max-w-lg">
              Academic Title: <strong className="text-[#EEEEEE]">"Transformer-Based Phishing Website Detection and URL Classification"</strong>.
              A next-generation cybersecurity platform combining deep Transformer contextual embeddings (DistilBERT, BERT, RoBERTa) with lexical and structural URL feature fusion for explainable threat intelligence.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-[#0B3B40] text-[#00ADB5] px-2 py-0.5 rounded border border-[#00ADB5]/30">
                Research Capstone Edition
              </span>
              <span className="text-[10px] font-mono text-[#A8B0B8]">
                v1.4.2 • March 2026
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Shortcuts */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#EEEEEE] mb-3 font-mono">
              Intelligence Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/scanner" className="hover:text-[#00ADB5] transition-colors">
                  URL Security Scanner
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#00ADB5] transition-colors">
                  Security Intelligence Dashboard
                </Link>
              </li>
              <li>
                <Link to="/labs" className="hover:text-[#00ADB5] transition-colors">
                  Cybersecurity Research Labs
                </Link>
              </li>
              <li>
                <Link to="/batch" className="hover:text-[#00ADB5] transition-colors">
                  Batch CSV URL Analysis
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#00ADB5] transition-colors">
                  Side-by-Side URL Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Models */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#EEEEEE] mb-3 font-mono">
              Research & Science
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/models" className="hover:text-[#00ADB5] transition-colors">
                  Inside the Transformer
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-[#00ADB5] transition-colors">
                  Model Analytics & Benchmarks
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-[#00ADB5] transition-colors">
                  Methodology & Whitepaper
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-[#00ADB5] transition-colors">
                  API & Backend Connect
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A8B0B8] gap-4">
          <p>
            © 2026 PHISHNEXA Security Research. Detection results represent model predictions and should not be treated as an absolute guarantee of website safety.
          </p>
          <div className="flex items-center gap-4 shrink-0 font-mono">
            <span className="flex items-center gap-1 text-[#00ADB5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ADB5] animate-ping" />
              Transformer Engine Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
