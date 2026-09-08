import { Shield, Network } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export function Logo({ size = "md", showTagline = false }: LogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-11 h-11"
  };

  const textSizes = {
    sm: "text-lg font-bold",
    md: "text-xl font-extrabold",
    lg: "text-3xl font-black"
  };

  return (
    <Link
      to="/"
      data-testid="brand-logo-link"
      className="flex items-center gap-3 group focus:outline-none"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-[#00ADB5]/25 blur-md rounded-xl group-hover:bg-[#00ADB5]/40 transition-all duration-300" />
        
        {/* Shield Container */}
        <div className="relative bg-[#2B3139] border border-[#00ADB5]/40 rounded-xl p-2 flex items-center justify-center shadow-lg group-hover:border-[#00ADB5] transition-colors">
          <Shield className={`${iconSizes[size]} text-[#00ADB5] stroke-[2.2]`} />
          <Network className="absolute w-3.5 h-3.5 text-[#EEEEEE] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`${textSizes[size]} tracking-tight text-[#EEEEEE] font-mono`}>
            PHISH<span className="text-[#00ADB5]">NEXA</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#0B3B40] text-[#00ADB5] border border-[#00ADB5]/30">
            AI SOC
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-[#A8B0B8] tracking-normal font-sans">
            Transformer Intelligence for Safer Web Navigation
          </span>
        )}
      </div>
    </Link>
  );
}
