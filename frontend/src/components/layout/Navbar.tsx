import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { ProfileDrawer } from "@/components/auth/ProfileDrawer";
import {
  ShieldCheck,
  Cpu,
  Layers,
  FlaskConical,
  BarChart3,
  Sliders,
  Menu,
  X,
  Sparkles,
  BookOpen,
  User as UserIcon,
  Search,
  Scale
} from "lucide-react";
import type { ModelType } from "@/types";

export function Navbar() {
  const location = useLocation();
  const { user, selectedModel, setSelectedModel, demoScansUsed, setAuthModalOpen, setAuthModalMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Scanner", path: "/scanner" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Labs", path: "/labs", badge: "New" },
    { label: "Batch Scan", path: "/batch" },
    { label: "Compare", path: "/compare" },
    { label: "Analytics", path: "/analytics" },
    { label: "Models", path: "/models" },
    { label: "Research", path: "/research" },
    { label: "Settings", path: "/settings" }
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#222831]/90 border-b border-[#4A515A]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? "text-[#00ADB5] bg-[#0B3B40]/60 border border-[#00ADB5]/40 shadow-sm"
                      : "text-[#A8B0B8] hover:text-[#EEEEEE] hover:bg-[#393E46]/50"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] uppercase px-1 py-0.2 bg-[#00ADB5] text-[#222831] font-bold rounded">
                      {link.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#00ADB5] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Center */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Model Selector Dropdown Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#2B3139] border border-[#4A515A] rounded-xl px-2.5 py-1 text-xs">
              <Cpu className="w-3.5 h-3.5 text-[#00ADB5]" />
              <span className="text-[#A8B0B8] text-[11px] hidden md:inline">Model:</span>
              <select
                aria-label="Active Transformer Model"
                data-testid="nav-model-selector"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                className="bg-transparent text-[#EEEEEE] font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value="DistilBERT" className="bg-[#393E46] text-[#EEEEEE]">DistilBERT (Fast)</option>
                <option value="BERT" className="bg-[#393E46] text-[#EEEEEE]">BERT-Base</option>
                <option value="RoBERTa" className="bg-[#393E46] text-[#EEEEEE]">RoBERTa-Large</option>
              </select>
            </div>

            {/* Quick Demo Scan Counter or User Profile */}
            {user ? (
              <button
                onClick={() => setProfileDrawerOpen(true)}
                data-testid="nav-profile-button"
                className="flex items-center gap-2 bg-[#393E46] hover:bg-[#4A515A] border border-[#00ADB5]/40 text-[#EEEEEE] px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-[#00ADB5] text-[#222831] font-bold flex items-center justify-center text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline font-mono text-xs">{user.name.split(" ")[0]}</span>
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" title="Active SOC Session" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode("login");
                    setAuthModalOpen(true);
                  }}
                  data-testid="nav-login-button"
                  className="bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-semibold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-md hover:shadow-[#00ADB5]/20 flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>SOC Sign In</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="nav-mobile-toggle"
              className="lg:hidden p-2 rounded-xl bg-[#393E46] text-[#EEEEEE] border border-[#4A515A]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#222831] border-b border-[#4A515A] px-4 py-4 space-y-2">
            <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]/60">
              <span className="text-xs text-[#A8B0B8]">Active Model:</span>
              <select
                aria-label="Mobile Transformer Model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                className="bg-[#393E46] text-[#EEEEEE] font-mono text-xs p-1 rounded border border-[#4A515A]"
              >
                <option value="DistilBERT">DistilBERT (Fast)</option>
                <option value="BERT">BERT-Base</option>
                <option value="RoBERTa">RoBERTa-Large</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      active
                        ? "text-[#00ADB5] bg-[#0B3B40] border border-[#00ADB5]/40"
                        : "text-[#A8B0B8] bg-[#393E46]/40 hover:bg-[#393E46] text-[#EEEEEE]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] bg-[#00ADB5] text-[#222831] px-1 rounded font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal />

      {/* User Profile Drawer */}
      <ProfileDrawer open={profileDrawerOpen} onClose={() => setProfileDrawerOpen(false)} />
    </>
  );
}
