import { Navigation } from "../Navigation";
import { Footer } from "../Footer";
import { Card } from "../components/ui/card";
import { Users, Target, Lightbulb, Rocket } from "lucide-react";

export function About() {
  const team = [
    {
      name: "Nour Mrabet",
      role: "Engineering Student",
      school: "ENSI - National School of Computer Science",
      image: "/images/nour.jpg",
      
    },
    {
      name: "Wiem Belhaj Salah Bouhdid",
      role: "Engineering Student",
      school: "ENSI - National School of Computer Science",
      image: "/images/wiem.jfif",
      
    },
    {
      name: "Nourhene Grami",
      role: "Engineering Student",
      school: "ENSI - National School of Computer Science",
      image: "/images/nourhene.jfif",
      
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-hidden">
      <Navigation />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
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
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 mt-8">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
              <p className="text-sm font-semibold text-purple-300">About AeroVerse</p>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              About Us
            </h1>

            <p className="text-lg md:text-xl text-purple-200/70 max-w-3xl mx-auto">
              A dedicated team of engineering students creating the future of aerospace education
            </p>
          </div>

          {/* Who Are We Section */}
          <div className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                  <Target className="w-10 h-10 text-cyan-400" />
                  Who Are We
                </h2>
                <p className="text-lg text-purple-200/70 mb-4">
                  We are a passionate team of engineering students from the National School of Computer Science (ENSI), dedicated to revolutionizing aerospace education through cutting-edge technology.
                </p>
                <p className="text-lg text-purple-200/70 mb-4">
                  Our mission is to create immersive, interactive learning experiences that make aerospace engineering accessible, engaging, and fun for everyone.
                </p>
                <p className="text-lg text-purple-200/70">
                  With a combination of 3D simulation, AI-powered tutoring, and interactive building tools, AeroVerse brings the universe closer to aspiring engineers.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-500/30 p-6">
                  <Lightbulb className="w-8 h-8 text-cyan-400 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Our Vision</h3>
                  <p className="text-cyan-200/70">To democratize aerospace education and inspire the next generation of innovators and engineers worldwide.</p>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 p-6">
                  <Rocket className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Our Goal</h3>
                  <p className="text-purple-200/70">Build intelligent, immersive platforms that transform how people learn about space, physics, and engineering.</p>
                </Card>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-4 flex items-center justify-center gap-3">
              <Users className="w-10 h-10 text-purple-400" />
              Our Team
            </h2>
            <p className="text-center text-purple-200/70 mb-12 text-lg">
              Engineering students from ENSI collaborating to create AeroVerse
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl p-8 overflow-hidden group hover:border-white/30 transition-all">
                  <div className="relative mb-6 mt-12 h-64 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-dashed border-white/20">
                        <Users className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-purple-300 font-semibold mb-2">{member.role}</p>
                  <p className="text-sm text-white/50">{member.school}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* ENSI Section */}
          <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-white/10 backdrop-blur-xl rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">National School of Computer Science (ENSI)</h2>
            <p className="text-lg text-purple-200/70 max-w-2xl mx-auto">
              ENSI is a leading engineering school in Tunisia, known for fostering innovation and technological excellence. Our team leverages cutting-edge education to create transformative learning platforms.
            </p>
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
      <Footer />
    </div>
  );
}