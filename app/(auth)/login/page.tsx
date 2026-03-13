"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { SplashScreen } from "@/components/auth/splash-screen";
import { AuthBackground } from "@/components/auth/auth-background";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Show form only after splash screen is mostly done (2s total)
    const timer = setTimeout(() => setShowForm(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await api.auth.login(email, password);
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
    setLoading(false);
  };

  const handleDemoLogin = () => {
    localStorage.setItem("token", "dummy-dev-token");
    router.push("/dashboard");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 selection:bg-[#D9FF00] selection:text-black">
      <SplashScreen />
      <AuthBackground />

      <div className={cn(
        "w-full max-w-md space-y-12 transition-opacity duration-1000",
        showForm ? "opacity-100" : "opacity-0"
      )}>
        {/* Logo/Icon Area */}
        <div className="text-center space-y-2 animate-fadeInUp">
          <div className="inline-block px-4 py-1 rounded-full border border-[#D9FF00]/30 bg-[#D9FF00]/10 text-[#D9FF00] text-xs font-mono uppercase tracking-widest mb-4">
            Security Protocol 071
          </div>
          <h1 className="text-[#F4F4ED] font-serif text-6xl md:text-7xl leading-tight tracking-tighter">
            SIGN <span className="text-[#D9FF00]">IN</span>
          </h1>
          <p className="text-muted-foreground/60 font-medium tracking-tight">
            Access the high-performance command center.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-8 animate-fadeInUp delay-200">
          <div className="space-y-6">
            {/* Email Field */}
            <div className="group relative">
              <label className="absolute left-0 -top-3.5 text-xs font-mono text-muted-foreground/50 uppercase tracking-widest transition-all group-focus-within:text-[#D9FF00]">
                Identification
              </label>
              <div className="flex items-center border-b border-[#F4F4ED]/20 py-2 transition-all group-focus-within:border-[#D9FF00]">
                <Mail className="h-4 w-4 text-[#F4F4ED]/30 mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="block w-full bg-transparent border-none text-[#F4F4ED] placeholder:text-[#F4F4ED]/10 focus:ring-0 sm:text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group relative">
              <label className="absolute left-0 -top-3.5 text-xs font-mono text-muted-foreground/50 uppercase tracking-widest transition-all group-focus-within:text-[#D9FF00]">
                Access Key
              </label>
              <div className="flex items-center border-b border-[#F4F4ED]/20 py-2 transition-all group-focus-within:border-[#D9FF00]">
                <Lock className="h-4 w-4 text-[#F4F4ED]/30 mr-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full bg-transparent border-none text-[#F4F4ED] placeholder:text-[#F4F4ED]/10 focus:ring-0 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono uppercase tracking-wide bg-red-400/10 p-2 rounded">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <button
              onClick={handleDemoLogin}
              type="button"
              className="w-full flex justify-center items-center py-2 px-4 border border-[#D9FF00]/30 rounded-full text-[10px] font-mono font-bold text-[#D9FF00] hover:bg-[#D9FF00]/10 transition-all duration-300 mb-2"
            >
              BYPASS PROTOCOL (DEMO)
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full text-sm font-bold bg-[#D9FF00] text-black hover:bg-white transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "INITIALIZING..." : "COMMENCE ENTRY"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
              <Link
                href="/forgot-password"
                className="hover:text-[#D9FF00] transition-colors"
              >
                Access Denied?
              </Link>
              <span className="cursor-not-allowed italic">New Pilot Registry Locked</span>
            </div>
          </div>
        </form>

        {/* Footer info */}
        <div className="pt-12 text-center text-[10px] font-mono text-muted-foreground/20 uppercase tracking-[0.4em] animate-fadeIn">
          Powering High-Performance Workflows // V2.4.0
        </div>
      </div>
    </main>
  );
}
