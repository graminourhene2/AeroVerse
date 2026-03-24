import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Globe } from "lucide-react";
import { useState } from "react";

export function LanguageSelection() {
  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const [selected, setSelected] = useState("fr");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-white">Sélection Langue</h2>
      </div>
      <p className="text-purple-200/70 mb-4">Choix entre Français et Anglais</p>

      <div className="grid md:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <Card
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={`p-6 cursor-pointer transition-all border-2 ${
              selected === lang.code
                ? "bg-purple-600/20 border-purple-500"
                : "bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{lang.flag}</span>
              <h3 className="text-lg font-semibold text-white">{lang.name}</h3>
            </div>
            {selected === lang.code && (
              <p className="text-purple-400 text-sm">✓ Sélectionné</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
