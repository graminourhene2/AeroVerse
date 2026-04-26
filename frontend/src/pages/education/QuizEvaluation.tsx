import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function QuizEvaluation() {
  const questions = [
    { id: 1, text: "Quelle est la vitesse orbitale de l'ISS?", answered: true, correct: true },
    { id: 2, text: "À quelle altitude se trouve le géostationnaire?", answered: true, correct: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz d'Évaluation</h2>
          <p className="text-purple-200/70">Questions interactives pour tester la compréhension</p>
        </div>
        <span className="text-2xl font-bold text-purple-400">2/4</span>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <Card key={q.id} className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-4">
            <div className="flex items-start gap-4">
              <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-1 ${q.correct ? "text-green-500" : "text-red-500"}`} />
              <div className="flex-1">
                <p className="text-white font-medium">{q.text}</p>
                <p className={`text-sm mt-1 ${q.correct ? "text-green-400" : "text-red-400"}`}>
                  {q.correct ? "✓ Correct!" : "✗ Incorrect"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-semibold">
        Continuer vers la question suivante
      </Button>
    </div>
  );
}
