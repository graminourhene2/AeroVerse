import { Link, useLocation } from "react-router-dom";
import { Lock, LogIn, Sparkles } from "lucide-react";
import { Navigation } from "../Navigation";

const PAGE_INFO: Record<string, { icon: string; title: string; description: string }> = {
  "/builder":    { icon: "🛸", title: "Space Builder",       description: "Design and save your own spacecraft from real components." },
  "/education":  { icon: "🎓", title: "Aerospace Academy",   description: "Watch curated video courses and test your knowledge with quizzes." },
  "/ai-tutor":   { icon: "🤖", title: "AI Tutor",            description: "Chat with an AI expert on aerospace science and engineering." },
  "/simulation": { icon: "🌌", title: "Space Simulation",    description: "Explore an interactive 3D simulation of space and orbital mechanics." },
  "/profile":    { icon: "👤", title: "Your Profile",        description: "View your progress, quiz scores, and saved spacecraft." },
};

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (localStorage.getItem("token")) {
    return <>{children}</>;
  }

  const info = PAGE_INFO[location.pathname] ?? {
    icon: "🔒",
    title: "This page",
    description: "This feature is available to AeroVerse members.",
  };

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-hidden">
      <Navigation />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-600/8 rounded-full blur-3xl" />
        {[...Array(40)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: i % 5 === 0 ? "2px" : "1px",
              height: i % 5 === 0 ? "2px" : "1px",
              left: `${(i * 23 + 5) % 100}%`,
              top: `${(i * 17 + 11) % 100}%`,
              opacity: 0.2 + (i % 4) * 0.1,
            }} />
        ))}
      </div>

      {/* Center content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md text-center">

          {/* Page icon */}
          <div className="text-6xl mb-6 animate-pulse">{info.icon}</div>

          {/* Lock badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 mb-5">
            <Lock className="w-3.5 h-3.5 text-purple-300" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Members only</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-3">
            Sign in to access <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{info.title}</span>
          </h1>

          {/* Description */}
          <p className="text-purple-200/60 text-base mb-8 leading-relaxed">
            {info.description}
            <br />
            <span className="text-purple-300/50 text-sm">Create a free account or sign in to continue.</span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/authentication?redirect=${encodeURIComponent(location.pathname)}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02]"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              to={`/authentication?mode=signup&redirect=${encodeURIComponent(location.pathname)}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-purple-400/40 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400/70 font-semibold transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Create Account
            </Link>
          </div>

          {/* Divider + home link */}
          <div className="mt-8 pt-6 border-t border-purple-400/10">
            <Link to="/" className="text-sm text-purple-400/60 hover:text-purple-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
