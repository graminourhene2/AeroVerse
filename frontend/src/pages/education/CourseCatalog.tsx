import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";

export function CourseCatalog() {
  const courses = [
    { id: 1, title: "Fondamentaux du Spatial", modules: 12, duration: "8h" },
    { id: 2, title: "Mécanique Orbitale", modules: 8, duration: "6h" },
    { id: 3, title: "Design de Satellites", modules: 10, duration: "7h" },
    { id: 4, title: "Propulsion Spatiale", modules: 9, duration: "6h30" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Catalogue de Cours</h2>
        <p className="text-purple-200/70">Liste des modules disponibles (fusées, satellites, vol, missions)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6 hover:border-purple-500/50 transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <BookOpen className="w-8 h-8 text-purple-500" />
              <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 hover:bg-purple-700">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
            <div className="flex justify-between text-sm text-purple-200/70">
              <span>{course.modules} modules</span>
              <span>{course.duration}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
