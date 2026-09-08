import { Layers, CheckCircle2, XCircle, Globe, Terminal, FileCode, Hash, Link as LinkIcon } from "lucide-react";
import type { URLAnatomy } from "@/types";

interface UrlAnatomyProps {
  anatomy: URLAnatomy;
}

export function UrlAnatomyComponent({ anatomy }: UrlAnatomyProps) {
  const fields = [
    {
      label: "Protocol",
      val: anatomy.protocol,
      status: anatomy.has_https ? "secure" : "insecure",
      icon: LockStatusIcon(anatomy.has_https)
    },
    { label: "Host Name", val: anatomy.host, icon: Globe },
    { label: "Root Domain", val: anatomy.domain, icon: LinkIcon },
    {
      label: "Subdomains",
      val: anatomy.subdomain || "(None)",
      highlight: Boolean(anatomy.subdomain)
    },
    { label: "Top-Level Domain", val: anatomy.tld, icon: FileCode },
    { label: "Resource Path", val: anatomy.path, icon: Terminal },
    {
      label: "Query Parameters",
      val: anatomy.num_params > 0 ? `${anatomy.num_params} param(s)` : "(None)",
      highlight: anatomy.num_params > 0
    },
    {
      label: "Shannon Entropy",
      val: `${anatomy.entropy.toFixed(2)} bits`,
      highlight: anatomy.entropy > 4.2
    },
    { label: "Total URL Length", val: `${anatomy.url_length} chars` },
    { label: "Special Characters", val: `${anatomy.special_chars_count} count` }
  ];

  function LockStatusIcon(hasHttps: boolean) {
    return hasHttps ? CheckCircle2 : XCircle;
  }

  return (
    <div
      data-testid="url-anatomy-card"
      className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#00ADB5]" />
          <h3 className="text-base font-bold text-[#EEEEEE]">URL Structural Anatomy</h3>
        </div>
        <span className="text-[11px] font-mono text-[#A8B0B8] bg-[#2B3139] px-2.5 py-1 rounded-xl border border-[#4A515A]">
          10 Structural Vectors
        </span>
      </div>

      {/* Grid of anatomy items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {fields.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#2B3139] border border-[#4A515A] rounded-xl p-3 space-y-1"
          >
            <div className="text-[11px] font-medium text-[#A8B0B8] flex items-center justify-between">
              <span>{item.label}</span>
              {item.status === "secure" && <span className="text-[#22C55E] text-[10px]">TLS OK</span>}
              {item.status === "insecure" && <span className="text-[#EF4444] text-[10px]">HTTP!</span>}
            </div>
            <div
              className={`text-xs font-mono font-semibold truncate ${
                item.highlight ? "text-[#00ADB5]" : "text-[#EEEEEE]"
              }`}
              title={item.val}
            >
              {item.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
