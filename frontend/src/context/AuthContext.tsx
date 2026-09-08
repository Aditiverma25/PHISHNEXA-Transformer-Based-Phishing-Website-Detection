import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, ModelType } from "@/types";
import { apiGet, apiPost } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  demoScansUsed: number;
  canScan: boolean;
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  confidenceThreshold: number;
  setConfidenceThreshold: (val: number) => void;
  login: (email: string, pass: string) => Promise<User>;
  signup: (name: string, email: string, pass: string) => Promise<User>;
  googleLogin: (name?: string, email?: string) => Promise<User>;
  logout: () => Promise<void>;
  recordScanAttempt: () => boolean;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: "login" | "signup" | "demo_limit";
  setAuthModalMode: (mode: "login" | "signup" | "demo_limit") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_SCAN_KEY = "phishnexa_demo_scans_v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoScansUsed, setDemoScansUsed] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(DEMO_SCAN_KEY);
      return stored ? parseInt(stored, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [selectedModel, setSelectedModel] = useState<ModelType>("DistilBERT");
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.50);

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup" | "demo_limit">("login");

  // Check current session on mount
  useEffect(() => {
    apiGet<User>("/auth/me")
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const res = await apiPost<User>("/auth/login", { email, password: pass });
    setUser(res);
    setAuthModalOpen(false);
    return res;
  };

  const signup = async (name: string, email: string, pass: string): Promise<User> => {
    const res = await apiPost<User>("/auth/signup", { name, email, password: pass });
    setUser(res);
    setAuthModalOpen(false);
    return res;
  };

  const googleLogin = async (name = "Security Analyst", email = "analyst@phishnexa.ai"): Promise<User> => {
    const res = await apiPost<User>("/auth/google", { name, email });
    setUser(res);
    setAuthModalOpen(false);
    return res;
  };

  const logout = async () => {
    try {
      await apiPost("/auth/logout", {});
    } catch {
      // ignore
    }
    setUser(null);
  };

  const canScan = user !== null || demoScansUsed < 1;

  const recordScanAttempt = (): boolean => {
    if (user) {
      return true;
    }
    if (demoScansUsed >= 1) {
      setAuthModalMode("demo_limit");
      setAuthModalOpen(true);
      return false;
    }
    const nextVal = demoScansUsed + 1;
    setDemoScansUsed(nextVal);
    try {
      localStorage.setItem(DEMO_SCAN_KEY, nextVal.toString());
    } catch {
      // ignore
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        demoScansUsed,
        canScan,
        selectedModel,
        setSelectedModel,
        confidenceThreshold,
        setConfidenceThreshold,
        login,
        signup,
        googleLogin,
        logout,
        recordScanAttempt,
        isAuthModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
