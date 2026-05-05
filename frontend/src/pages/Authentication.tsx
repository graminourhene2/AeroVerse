import { useState, useEffect } from "react";
import { api } from "../api";
import { useLocation, Link } from "react-router-dom";

export function Authentication() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getRedirectPath = () => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/";
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = getRedirectPath();
      return;
    }
    const params = new URLSearchParams(location.search);
    if (params.get("mode") === "signup") setIsLogin(false);
  }, [location]);

  const getUsers = (): { id: number; email: string; username: string; password: string }[] =>
    JSON.parse(localStorage.getItem("aeroverse_users") || "[]");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const users = getUsers();
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) {
          const result = await api.login({ email, password }).catch(() => ({ error: "offline" }));
          if (result?.token) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            setTimeout(() => { window.location.href = getRedirectPath(); }, 300);
          } else {
            setError("Incorrect email or password.");
          }
        } else {
          localStorage.setItem("token", `local_${Date.now()}`);
          localStorage.setItem("user", JSON.stringify({ id: user.id, email: user.email, username: user.username }));
          setTimeout(() => { window.location.href = getRedirectPath(); }, 300);
        }
      } else {
        if (!username.trim()) { setError("Username is required."); setLoading(false); return; }
        if (!email.includes("@") || !email.includes(".")) { setError("Enter a valid email address."); setLoading(false); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
        const users = getUsers();
        if (users.find((u) => u.email === email)) { setError("Email already registered."); setLoading(false); return; }
        users.push({ id: Date.now(), email, username, password });
        localStorage.setItem("aeroverse_users", JSON.stringify(users));
        api.register({ email, password, username }).catch(() => {});
        setError("success");
        setTimeout(() => { setIsLogin(true); setEmail(""); setPassword(""); setUsername(""); setError(""); }, 1500);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0518] flex items-center justify-center overflow-hidden relative">

      {/* Ambient orbs — same as rest of site */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute rounded-full blur-3xl"
          style={{ top: "-5%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(139,92,246,0.22) 0%, transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl"
          style={{ bottom: "0%", left: "-10%", width: 500, height: 500, background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl"
          style={{ top: "20%", right: "-5%", width: 400, height: 400, background: "radial-gradient(ellipse, rgba(236,72,153,0.12) 0%, transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl"
          style={{ bottom: "10%", right: "10%", width: 350, height: 350, background: "radial-gradient(ellipse, rgba(6,182,212,0.10) 0%, transparent 70%)" }} />
      </div>

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(70)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{
            width: i % 8 === 0 ? 2 : 1,
            height: i % 8 === 0 ? 2 : 1,
            left: `${(i * 17 + 11) % 100}%`,
            top: `${(i * 23 + 7) % 100}%`,
            opacity: 0.1 + (i % 5) * 0.08,
            animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${(i % 4) * 0.9}s`,
          }} />
        ))}
      </div>

      {/* Center form */}
      <div className="relative z-10 w-full flex flex-col items-center px-6 py-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-10 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L8.5 8H4l4.5 4-2 7L12 16l5.5 3-2-7L20 8h-4.5L12 2z" fill="white" />
            </svg>
          </div>
          <span className="text-white font-bold text-base tracking-tight group-hover:text-purple-200 transition-colors">
            AeroVerse
          </span>
        </Link>

        {/* Glass card */}
        <div className="w-full max-w-sm rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
          }}>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm mb-7" style={{ color: "rgba(167,139,250,0.65)" }}>
            {isLogin ? "Sign in to your AeroVerse account." : "Start your aerospace journey today."}
          </p>

          {/* Fields */}
          <div className="flex flex-col gap-4">

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl text-white text-sm outline-none transition-all"
                  style={{ padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.7)", e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.12)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.10)", e.target.style.boxShadow = "none")}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full rounded-xl text-white text-sm outline-none transition-all"
                style={{ padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", boxSizing: "border-box" }}
                onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.7)", e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.12)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.10)", e.target.style.boxShadow = "none")}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full rounded-xl text-white text-sm outline-none transition-all"
                style={{ padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", boxSizing: "border-box" }}
                onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.7)", e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.12)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.10)", e.target.style.boxShadow = "none")}
              />
            </div>

            {error && (
              <div className="rounded-xl text-xs text-center py-3 px-4" style={
                error === "success"
                  ? { background: "rgba(16,185,129,0.10)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.25)" }
                  : { background: "rgba(239,68,68,0.10)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)" }
              }>
                {error === "success" ? "Account created — redirecting..." : error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all mt-1"
              style={{
                padding: "11px 0",
                background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.35)",
              }}
            >
              {loading
                ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : isLogin ? "Sign in" : "Create account"
              }
            </button>
          </div>

          {/* Toggle */}
          <p className="text-center mt-6 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {isLogin ? "No account? " : "Already registered? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); setEmail(""); setPassword(""); setUsername(""); }}
              className="font-semibold transition-colors"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#a78bfa", padding: 0, fontSize: 12 }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Back home */}
        <Link to="/" className="mt-6 text-xs transition-colors"
          style={{ color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(167,139,250,0.7)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
        >
          ← Back to home
        </Link>
      </div>

      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.08; } 50% { opacity: 0.4; } }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>
    </div>
  );
}
