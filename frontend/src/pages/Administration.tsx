import { Navigation } from "../Navigation";
import { Card } from "../components/ui/card";
import { Users, Package, FileText, Settings, Activity, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";

export function Administration() {
  const adminSections = [
    {
      icon: Users,
      title: "User Management",
      description: "CRUD for user accounts and permissions",
    },
    {
      icon: Package,
      title: "3D Assets Management",
      description: "Upload and organize 3D models",
    },
    {
      icon: FileText,
      title: "Content Management",
      description: "Add/modify educational modules",
    },
    {
      icon: Settings,
      title: "System Configuration",
      description: "Performance settings and languages",
    },
    {
      icon: ExternalLink,
      title: "External Services",
      description: "Configure APIs and integrations",
    },
    {
      icon: Activity,
      title: "Monitoring",
      description: "Performance and usage metrics",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-x-hidden">
      <Navigation />
      <div className="pt-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Administration Panel</h1>
            <p className="text-purple-200/70">Manage all aspects of the platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30 p-6 hover:border-blue-500/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{section.title}</h3>
                  <p className="text-blue-200/70 text-sm mb-4">{section.description}</p>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full"
                  >
                    Access
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
