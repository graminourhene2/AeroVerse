import { Navigation } from "../Navigation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Wrench,
  ArrowRight,
  BookOpen,
  MessageCircle
} from "lucide-react";

export function Home() {
  const modules = [
    {
      id: 1,
      title: "Space Simulation",
      description: "Explore immersive 3D space environments with advanced physics",
      icon: Sparkles,
      color: "from-cyan-500 to-blue-500",
      path: "/simulation",
      stats: "1000+ Objects",
    },
    {
      id: 2,
      title: "Builder",
      description: "Design and assemble aerospace components with precision tools",
      icon: Wrench,
      color: "from-purple-500 to-pink-500",
      path: "/builder",
      stats: "500+ Parts",
    },
    {
      id: 3,
      title: "Education",
      description: "Comprehensive learning paths and interactive tutorials",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      path: "/education",
      stats: "200+ Courses",
    },
    {
      id: 4,
      title: "AI Tutor",
      description: "Intelligent assistant for personalized aerospace learning and real-time guidance",
      icon: MessageCircle,
      color: "from-emerald-500 to-teal-500",
      path: "/ai-tutor",
      stats: "24/7 Support",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-hidden">
      <Navigation />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Floating stars */}
        <div className="absolute inset-0">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* SVG Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#6366f1" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - with Logo */}
          <div className="text-center mb-16 mt-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              AeroVerse
            </h1>

            <p className="text-lg md:text-xl text-purple-200/70 max-w-2xl mx-auto mb-8">
              Immersive learning environment combining advanced simulation, AI tutoring, and interactive education for aerospace enthusiasts
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/authentication">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-lg group font-semibold">
                  Sign In for AeroVerse <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/ai-tutor">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-lg">
                  Try AeroVerse AI Tutor for Free →
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: "Active Students", value: "1k+" },
              { label: "Simulations Completed", value: "200+" },
              { label: "Learning Hours Tracked", value: "128+" },
              { label: "Projects Built", value: "3120+" },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl p-6 text-center hover:border-white/20 hover:bg-white/20 transition-all"
              >
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-2">
                  {feature.value}
                </p>
                <p className="text-sm font-semibold text-white/80">{feature.label}</p>
              </Card>
            ))}
          </div>

          {/* Modules Carousel */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Main Modules</h2>
            <div className="overflow-hidden">
              <div className="flex gap-6 animate-scroll">
                {[...modules, ...modules].map((module, idx) => {
                  const Icon = module.icon;
                  return (
                    <Link key={idx} to={module.path} className="flex-shrink-0 w-[450px]">
                      <Card className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl p-8 hover:border-white/30 hover:bg-white/20 transition-all h-full cursor-pointer overflow-hidden">
                        {/* Gradient background on hover */}
                        <div className={`absolute -inset-full bg-gradient-to-r ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-3xl`} />

                        <div className="relative">
                          <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${module.color} mb-4 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${module.color} group-hover:bg-clip-text transition-all">
                            {module.title}
                          </h3>

                          <p className="text-white/60 mb-6">{module.description}</p>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-white/40">{module.stats}</span>
                            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-2 transition-all" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Why Choose Our Platform</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-500/30 p-8 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Immersive Experience</h3>
                <p className="text-cyan-200/70">Advanced 3D rendering with realistic physics simulation</p>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 p-8 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI-Powered Learning</h3>
                <p className="text-purple-200/70">Personalized assistance from intelligent tutoring system</p>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 p-8 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20 transition-all">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Structured Learning</h3>
                <p className="text-green-200/70">Comprehensive curriculum designed for all levels</p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-20 blur-3xl rounded-3xl" />
            <Card className="relative bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-white/10 backdrop-blur-xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
              <p className="text-lg text-white/70 mb-8">Choose a module and begin exploring the world of aerospace</p>
              <Link to="/simulation">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-lg">
                  Get Started Now
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
