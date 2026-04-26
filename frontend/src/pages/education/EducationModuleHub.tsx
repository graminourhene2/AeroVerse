import { Navigation } from "../../Navigation";
import { Card } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { CourseCatalog } from "./CourseCatalog";
import { InteractiveLessons } from "./InteractiveLessons";
import { QuizEvaluation } from "./QuizEvaluation";
import { BookOpen, BookMarked, HelpCircle } from "lucide-react";

export function EducationModuleHub() {
  return (
    <div className="min-h-screen bg-[#0a0518]">
      <Navigation />
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Module: Éducation
            </h1>
            <p className="text-purple-200/70">
              Modules éducatifs structurés avec évaluations interactives
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="catalog" className="w-full">
            <TabsList className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-1 mb-8">
              <TabsTrigger value="catalog" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Catalogue
              </TabsTrigger>
              <TabsTrigger value="lessons" className="flex items-center gap-2">
                <BookMarked className="w-4 h-4" />
                Leçons
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog">
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
                <CourseCatalog />
              </Card>
            </TabsContent>

            <TabsContent value="lessons">
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
                <InteractiveLessons />
              </Card>
            </TabsContent>

            <TabsContent value="quiz">
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
                <QuizEvaluation />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
