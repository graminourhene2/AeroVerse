import { Rocket, Github, Twitter, Linkedin, Mail, Heart, Code2, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-[#0a0518] via-purple-950/20 to-[#0a0518] border-t border-purple-400/20 py-16 px-6">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/images/Blue and Red Illustrative Rocket Launch Logo.png" 
                alt="AeroVerse Logo" 
                className="h-12 w-auto hover:scale-110 transition-transform"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                AeroVerse
              </span>
            </div>
            <p className="text-purple-300/70 max-w-sm mb-6 leading-relaxed">
              Transform your understanding of aerospace through immersive simulations, interactive education, and advanced AI tools.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <a href="#" className="p-2 bg-purple-500/10 hover:bg-purple-500/30 rounded-lg transition-all hover:scale-110">
                  <Github className="w-5 h-5 text-purple-300" />
                </a>
                <a href="#" className="p-2 bg-purple-500/10 hover:bg-purple-500/30 rounded-lg transition-all hover:scale-110">
                  <Twitter className="w-5 h-5 text-purple-300" />
                </a>
                <a href="#" className="p-2 bg-purple-500/10 hover:bg-purple-500/30 rounded-lg transition-all hover:scale-110">
                  <Linkedin className="w-5 h-5 text-purple-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Modules */}
          <div>
            <h4 className="font-bold text-purple-100 mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Modules
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Simulation", path: "/simulation" },
                { label: "Builder", path: "/builder" },
                { label: "Education", path: "/education" },
                { label: "AI Tutor", path: "/ai-tutor" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-purple-300/70 hover:text-purple-200 hover:translate-x-1 transition-all inline-block"
                  >
                    → {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-purple-100 mb-5 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              Ressources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-purple-300/70 hover:text-purple-200 hover:translate-x-1 transition-all inline-block">
                  → À propos
                </Link>
              </li>
              <li>
                <a href="#" className="text-purple-300/70 hover:text-purple-200 hover:translate-x-1 transition-all inline-block">
                  → Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-300/70 hover:text-purple-200 hover:translate-x-1 transition-all inline-block">
                  → API Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-300/70 hover:text-purple-200 hover:translate-x-1 transition-all inline-block">
                  → Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-purple-100 mb-5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-pink-400" />
              Newsletter
            </h4>
            <p className="text-purple-300/70 text-sm mb-3">
              Restez informé des nouveaux modules et mises à jour.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-purple-900/30 border border-purple-500/30 rounded-l-lg text-sm text-purple-100 placeholder:text-purple-400/50 focus:outline-none focus:border-purple-500/60"
              />
              <button className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-r-lg text-white transition-all">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-purple-300/70 text-sm flex items-center gap-2">
            <span>© {currentYear} AeroVerse.</span>
            <span>Fait avec</span>
            <Heart className="w-4 h-4 text-red-400 animate-pulse" />
            <span>pour l'éducation spatiale</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-purple-300/70">
            <a href="#" className="hover:text-purple-200 transition-colors">
              Confidentialité
            </a>
            <span>•</span>
            <a href="#" className="hover:text-purple-200 transition-colors">
              Conditions
            </a>
            <span>•</span>
            <a href="#" className="hover:text-purple-200 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}
            <h4 className="font-semibold text-purple-100 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-purple-300/70 hover:text-purple-200 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-300/70 hover:text-purple-200 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-300/70 hover:text-purple-200 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-300/70 hover:text-purple-200 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-purple-400/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-purple-300/60 text-sm">
            © 2026 AeroVerse. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="w-10 h-10 rounded-lg border border-purple-400/20 bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 transition-colors"
            >
              <Twitter className="w-4 h-4 text-purple-300" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-lg border border-purple-400/20 bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 transition-colors"
            >
              <Github className="w-4 h-4 text-purple-300" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-lg border border-purple-400/20 bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-purple-300" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
