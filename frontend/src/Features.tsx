import { Building2, Gauge, Brain, Users } from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Virtual Aerospace Museum",
    description: "Explore historic aircraft and spacecraft in stunning 3D environments. Walk through immersive exhibits that bring aerospace history to life.",
    image: "https://images.unsplash.com/photo-1582462170922-0307614f8f82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBhZXJvc3BhY2V8ZW58MXx8fHwxNzcwMDY0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Gauge,
    title: "Real-Time Simulations",
    description: "Master flight mechanics and space operations through interactive simulations. Practice complex maneuvers in a safe virtual environment.",
    image: "https://images.unsplash.com/photo-1758523670550-223a01cd7764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWUiUyMGhlYWRzZXQlMjBmdXR1cmlzdGljfGVufDF8fHx8MTc3MDA2NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Brain,
    title: "AI-Powered Tutor",
    description: "Learn from an intelligent multilingual tutor that adapts to your pace. Get personalized explanations in English and French.",
    image: "https://images.unsplash.com/photo-1738003667850-a2fb736e31b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBuZXVyYWx8ZW58MXx8fHwxNzcwMDY0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description: "Connect with peers in multi-user sessions. Explore together using VR headsets or AR mobile extensions for accessible learning.",
    image: "https://images.unsplash.com/photo-1728023881214-1d71a7a30a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmslMjBzdHVkZW50c3xlbnwxfHx8fDE3NzAwNjQ3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export function Features() {
  return (
    <section className="relative py-32 px-6">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0518] via-[#150a28] to-[#0a0518] opacity-50" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-purple-200/70 max-w-2xl mx-auto">
            Everything you need to transform aerospace education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-900/20 to-purple-950/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-500"
            >
              {/* Image background */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="relative p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-500/20 border border-purple-400/30 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-7 h-7 text-purple-300" />
                </div>

                <h3 className="text-2xl font-semibold text-purple-100 mb-4">
                  {feature.title}
                </h3>

                <p className="text-purple-200/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-purple-400/10 rounded-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
