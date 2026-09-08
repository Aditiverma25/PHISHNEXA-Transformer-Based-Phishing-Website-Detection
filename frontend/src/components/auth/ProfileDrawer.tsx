import { useAuth } from "@/context/AuthContext";
import { Shield, Key, Database, LogOut, Check, Copy, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const { user, logout } = useAuth();
  const [copiedKey, setCopiedKey] = useState(false);

  if (!open || !user) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(user.api_key);
    setCopiedKey(true);
    toast.success("API Key copied to clipboard!");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    toast.info("Logged out successfully.");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-testid="profile-drawer-dialog"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-sm bg-[#393E46] border-l border-[#4A515A] h-full p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#4A515A]">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00ADB5]" />
              <h3 className="text-base font-bold text-[#EEEEEE]">Analyst Profile</h3>
            </div>
            <button
              onClick={onClose}
              data-testid="profile-drawer-close"
              className="text-[#A8B0B8] hover:text-[#EEEEEE] text-sm p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 bg-[#2B3139] p-4 rounded-2xl border border-[#4A515A]">
            <div className="w-12 h-12 rounded-full bg-[#00ADB5] text-[#222831] font-bold text-lg flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-bold text-[#EEEEEE]">{user.name}</div>
              <div className="text-xs text-[#A8B0B8]">{user.email}</div>
              <span className="inline-block text-[10px] uppercase font-mono bg-[#0B3B40] text-[#00ADB5] px-2 py-0.5 rounded mt-1">
                {user.role}
              </span>
            </div>
          </div>

          {/* Scans Count */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#2B3139] p-3 rounded-xl border border-[#4A515A] text-center">
              <div className="text-xs text-[#A8B0B8]">Scans Executed</div>
              <div className="text-xl font-bold font-mono text-[#00ADB5] mt-0.5">
                {user.scans_count || 18}
              </div>
            </div>
            <div className="bg-[#2B3139] p-3 rounded-xl border border-[#4A515A] text-center">
              <div className="text-xs text-[#A8B0B8]">Access Tier</div>
              <div className="text-xs font-bold font-mono text-[#22C55E] mt-1.5">
                UNLIMITED SOC
              </div>
            </div>
          </div>

          {/* API Key Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#EEEEEE] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#00ADB5]" />
              <span>Programmatic API Key</span>
            </label>
            <div className="bg-[#2B3139] p-2.5 rounded-xl border border-[#4A515A] flex items-center justify-between font-mono text-xs text-[#A8B0B8]">
              <span className="truncate max-w-[200px]">{user.api_key}</span>
              <button
                onClick={handleCopyKey}
                data-testid="profile-copy-apikey"
                className="p-1.5 rounded-lg bg-[#393E46] text-[#00ADB5] hover:bg-[#4A515A] cursor-pointer"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-[#A8B0B8]">
              Use this key in Authorization headers for automated Python & PyTorch backend integrations.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#4A515A] space-y-2">
          <button
            onClick={handleLogout}
            data-testid="profile-logout-button"
            className="w-full bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
