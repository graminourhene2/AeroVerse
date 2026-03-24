import { Zap, Users, Rocket, Globe } from "lucide-react";

export function Stats() {
  const stats = [
    {
      icon: Zap,
      label: "Performance",
      value: "10x",
      description: "Faster than traditional methods",
    },
    {
      icon: Users,
      label: "Users",
      value: "50K+",
      description: "Active users worldwide",
    },
    {
      icon: Rocket,
      label: "Projects",
      value: "1K+",
      description: "Successfully completed",
    },
    {
      icon: Globe,
      label: "Countries",
      value: "120+",
      description: "Global reach",
    },
  ];

  return (
    <section className="relative py-24 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative p-6 rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-transparent hover:border-purple-400/40 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-purple-600/10 rounded-2xl transition-all" />
                
                <div className="relative">
                  <Icon className="w-8 h-8 text-purple-400 mb-4" />
                  <div className="text-3xl font-bold text-purple-100 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-purple-200/70 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-purple-300/50">
                    {stat.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
