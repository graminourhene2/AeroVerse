import { Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0518] via-[#1a0f2e] to-[#0a0518]" />
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1557264322-b44d383a2906?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWJ1bGElMjBzcGFjZSUyMHB1cnBsZXxlbnwxfHx8fDE3NzAwNjQ2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-300 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/30 backdrop-blur-sm mb-8">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="text-sm text-purple-200">Immersive VR Education</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-b from-purple-100 via-purple-200 to-purple-400 bg-clip-text text-transparent tracking-tight">
          AeroVerse
        </h1>

        <p className="text-xl md:text-2xl text-purple-100 mb-4 max-w-3xl mx-auto leading-relaxed">
          Explore Aeronautics & Space Through Immersive VR
        </p>

        <p className="text-base md:text-lg text-purple-300/80 mb-12 max-w-2xl mx-auto">
          Transform complex aerospace concepts into intuitive learning experiences with virtual museums, real-time simulations, and AI-powered multilingual tutoring.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/simulation">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl shadow-purple-500/20 border border-purple-400/20 transition-all duration-300 flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Launch Platform
            </button>
          </Link>
          <Link to="/education">
            <button className="border border-purple-400/30 text-purple-200 hover:bg-purple-500/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm transition-all duration-300">
              Explore Learning
            </button>
          </Link>
        </div>

        <div className="absolute left-1/4 top-1/4 w-2 h-2 bg-purple-400 rounded-full blur-sm animate-float" />
        <div className="absolute right-1/3 top-1/3 w-3 h-3 bg-purple-300 rounded-full blur-sm animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute left-1/3 bottom-1/4 w-2 h-2 bg-purple-500 rounded-full blur-sm animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
}