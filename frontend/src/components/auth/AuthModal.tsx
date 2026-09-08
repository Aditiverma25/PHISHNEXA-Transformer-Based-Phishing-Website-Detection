import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Shield, Lock, Mail, User as UserIcon, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function AuthModal() {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    googleLogin
  } = useAuth();

  const [email, setEmail] = useState("analyst@phishnexa.ai");
  const [password, setPassword] = useState("CyberSec2026!");
  const [name, setName] = useState("SOC Lead Analyst");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authModalMode === "signup") {
        await signup(name, email, password);
        toast.success("Account created successfully. SOC Dashboard unlocked!");
      } else {
        await login(email, password);
        toast.success("Welcome back! Full SOC privileges active.");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await googleLogin();
      toast.success("Signed in with Google authentication successfully!");
    } catch (err: any) {
      toast.error(err.message || "Google auth failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-testid="auth-modal-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#393E46] border border-[#4A515A] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          data-testid="auth-modal-close-button"
          className="absolute top-4 right-4 text-[#A8B0B8] hover:text-[#EEEEEE] p-1.5 rounded-lg bg-[#2B3139] border border-[#4A515A]"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0B3B40] border border-[#00ADB5]/40 text-[#00ADB5] mb-1">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#EEEEEE] tracking-tight">
            {authModalMode === "demo_limit"
              ? "Free Demo Scan Completed"
              : authModalMode === "signup"
              ? "Create SOC Analyst Account"
              : "Sign In to PHISHNEXA"}
          </h3>
          <p className="text-xs text-[#A8B0B8]">
            {authModalMode === "demo_limit"
              ? "Sign in with test credentials or create an account to unlock unlimited Transformer scans, scan history persistence, and PDF report downloads."
              : "Access the full cyber threat intelligence platform & Transformer diagnostics."}
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Helper */}
        <div className="bg-[#2B3139] border border-[#00ADB5]/30 rounded-xl p-3 text-xs flex items-center justify-between">
          <div>
            <div className="font-semibold text-[#00ADB5] font-mono text-[11px]">DEMO TEST ACCOUNT</div>
            <div className="text-[#A8B0B8] text-[11px]">analyst@phishnexa.ai / CyberSec2026!</div>
          </div>
          <button
            type="button"
            data-testid="auth-quick-fill-demo"
            onClick={() => {
              setEmail("analyst@phishnexa.ai");
              setPassword("CyberSec2026!");
              setName("SOC Lead Analyst");
              toast.info("Demo credentials loaded.");
            }}
            className="text-[11px] bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-bold px-2 py-1 rounded-lg"
          >
            Auto Fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#EEEEEE]">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B0B8]" />
                <input
                  type="text"
                  required
                  data-testid="auth-input-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Security Analyst"
                  className="w-full bg-[#2B3139] border border-[#4A515A] rounded-xl pl-9 pr-3 py-2 text-xs text-[#EEEEEE] focus:outline-none focus:border-[#00ADB5]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#EEEEEE]">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B0B8]" />
              <input
                type="email"
                required
                data-testid="auth-input-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@organization.com"
                className="w-full bg-[#2B3139] border border-[#4A515A] rounded-xl pl-9 pr-3 py-2 text-xs text-[#EEEEEE] focus:outline-none focus:border-[#00ADB5]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#EEEEEE]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B0B8]" />
              <input
                type="password"
                required
                data-testid="auth-input-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#2B3139] border border-[#4A515A] rounded-xl pl-9 pr-3 py-2 text-xs text-[#EEEEEE] focus:outline-none focus:border-[#00ADB5]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="auth-submit-button"
            className="w-full bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#222831] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {authModalMode === "signup" ? "Create Account & Unlock" : "Sign In & Unlock Full Access"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#4A515A]" />
          <span className="absolute bg-[#393E46] px-2 text-[10px] text-[#A8B0B8] uppercase font-mono">
            Or continue with
          </span>
        </div>

        {/* Google OAuth Simulation Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          data-testid="auth-google-button"
          className="w-full bg-[#2B3139] hover:bg-[#4A515A] border border-[#4A515A] text-[#EEEEEE] font-medium py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17C3.7 20.6 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>Continue with Google Workspace</span>
        </button>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-[#A8B0B8]">
          {authModalMode === "signup" ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthModalMode("login")}
                className="text-[#00ADB5] hover:underline font-semibold"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Need a new account?{" "}
              <button
                type="button"
                onClick={() => setAuthModalMode("signup")}
                className="text-[#00ADB5] hover:underline font-semibold"
              >
                Create One
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
