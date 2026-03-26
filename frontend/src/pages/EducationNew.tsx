import { Navigation } from "../Navigation";
import { useState, useEffect } from "react";
import { BookOpen, CheckCircle2, Lock, Play, Clock, Award, Loader, Brain } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { api } from "../api";

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  image_url: string;
  lessons_count: number;
}

interface Lesson {
  id: number;
  title: string;
  order: number;
  video_url: string;
  content: string;
}

interface CourseDetail extends Course {
  lessons: Lesson[];
}

interface ProgressItem {
  module_id: number;
  completed: boolean;
  score: number;
  time_spent: number;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function EducationNew() {
  const [modules, setModules] = useState<Course[]>([]);
  const [selectedModule, setSelectedModule] = useState<CourseDetail | null>(null);
  const [progress, setProgress] = useState<Record<number, ProgressItem>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  // Aerospace Quiz Questions
  const QUIZ_QUESTIONS: Record<number, QuizQuestion[]> = {
    1: [
      { id: 1, question: "What is a geostationary orbit?", options: ["An orbit at 36,000 km altitude", "An orbit at 400 km altitude", "A lunar orbit", "An orbit at 10,000 km altitude"], correctAnswer: 0 },
      { id: 2, question: "What is Earth's escape velocity?", options: ["11.2 km/s", "7.8 km/s", "5.5 km/s", "15.3 km/s"], correctAnswer: 0 },
      { id: 3, question: "At what altitude does the ISS orbit?", options: ["Approximately 400 km", "Approximately 1000 km", "Approximately 200 km", "Approximately 600 km"], correctAnswer: 0 },
      { id: 4, question: "What is the primary factor affecting orbital period?", options: ["Altitude and primary body mass", "Satellite color", "Space temperature", "Mission age"], correctAnswer: 0 },
      { id: 5, question: "What is a launch window?", options: ["The viable time period to launch a rocket", "An opening in rocket fuselage", "A physics theory", "A navigation system type"], correctAnswer: 0 },
    ],
    2: [
      { id: 1, question: "What fuel do modern rockets primarily use?", options: ["Kerosene and liquid oxygen", "Pure gasoline", "Diesel", "Propane only"], correctAnswer: 0 },
      { id: 2, question: "How long does it take to reach the Moon?", options: ["3-4 days", "1 week", "2 weeks", "1 month"], correctAnswer: 0 },
      { id: 3, question: "What is specific impulse (Isp) for a rocket?", options: ["Rocket fuel efficiency measure", "Mass ratio", "Exhaust velocity", "Energy density"], correctAnswer: 0 },
      { id: 4, question: "What is lunar gravity compared to Earth?", options: ["1/6 as strong", "1/2 as strong", "1/10 as strong", "1/4 as strong"], correctAnswer: 0 },
      { id: 5, question: "What is a Lagrange point?", options: ["Gravitational equilibrium point between two bodies", "Solar system region", "Rocket type", "Polar orbit"], correctAnswer: 0 },
    ],
    3: [
      { id: 1, question: "What is the main role of thermal radiators on a satellite?", options: ["Dissipate excess heat", "Generate energy", "Amplify radio signals", "Protect from impacts"], correctAnswer: 0 },
      { id: 2, question: "How much power do solar panels generate per square meter?", options: ["~1400 W/m²", "~500 W/m²", "~2000 W/m²", "~1000 W/m²"], correctAnswer: 0 },
      { id: 3, question: "What system controls satellite orientation?", options: ["Attitude control system", "Propulsion system", "Communication system", "Storage system"], correctAnswer: 0 },
      { id: 4, question: "What is the purpose of a rocket combustion chamber?", options: ["Burn fuel and create thrust", "Store fuel", "Cool hot gases", "Measure pressure"], correctAnswer: 0 },
      { id: 5, question: "How many sensors can a spacecraft have?", options: ["Dozens to thousands", "Maximum 10", "Only 1 or 2", "Satellites have no sensors"], correctAnswer: 0 },
    ],
    4: [
      { id: 1, question: "What is a Hohmann transfer orbit?", options: ["Fuel-efficient orbit between two orbits", "Polar orbit", "Straight line trajectory", "Atmospheric reentry"], correctAnswer: 0 },
      { id: 2, question: "How many Falcon 9 rockets has SpaceX flown?", options: ["Over 200", "Less than 50", "Exactly 100", "Only 10"], correctAnswer: 0 },
      { id: 3, question: "What is the main challenge of Mars exploration?", options: ["Distance and transit time", "Lack of fuel", "Poor trajectory", "No technology"], correctAnswer: 0 },
      { id: 4, question: "At what speed does Earth orbit the Sun?", options: ["~30 km/s", "~100 km/s", "~10 km/s", "~50 km/s"], correctAnswer: 0 },
      { id: 5, question: "What is the purpose of mid-course correction?", options: ["Adjust course to reach target", "Reduce speed", "Turn spacecraft", "Check sensors"], correctAnswer: 0 },
    ],
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const modulesData = await api.getModules();
      setModules(modulesData);
      
      if (modulesData.length > 0) {
        const detail = await api.getModule(modulesData[0].id);
        setSelectedModule(detail);
        // Aller directement au quiz
        setShowQuiz(true);
      }
      
      if (api.isAuthenticated()) {
        const progressData = await api.getProgress();
        const progressMap: Record<number, ProgressItem> = {};
        if (progressData) {
          (Array.isArray(progressData) ? progressData : progressData.details || []).forEach((p: ProgressItem) => {
            progressMap[p.module_id] = p;
          });
          setProgress(progressMap);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectModule = async (moduleId: number) => {
    try {
      const detail = await api.getModule(moduleId);
      setSelectedModule(detail);
      // Aller directement au quiz
      setShowQuiz(true);
      setQuizScore(null);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const submitQuiz = () => {
    if (!selectedModule) return;
    
    const questions = QUIZ_QUESTIONS[selectedModule.id] || [];
    let score = 0;
    
    questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    
    const percentage = Math.round((score / questions.length) * 100);
    setQuizScore(percentage);
    
    // Sauvegarder la progression
    handleCompleteLesson(selectedModule.id, percentage);
  };

  const handleCompleteLesson = async (moduleId: number, score: number) => {
    if (!api.isAuthenticated()) {
      alert("Veuillez vous connecter pour sauvegarder votre progression");
      return;
    }

    try {
      setSaving(true);
      await api.saveProgress({
        module_id: moduleId,
        completed: score >= 80,
        score: score,
        time_spent: 60
      });
      
      await loadData();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setSaving(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner": return "text-green-400 bg-green-500/20 border-green-400/30";
      case "Intermediate": return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
      case "Advanced": return "text-red-400 bg-red-500/20 border-red-400/30";
      default: return "text-purple-400 bg-purple-500/20 border-purple-400/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0518] flex items-center justify-center">
        <Loader className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0518]" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}>
      <Navigation />
      
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 bg-clip-text text-transparent" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              🚀 Aerospace Academy
            </h1>
            <p className="text-purple-200/70 text-lg" style={{ fontWeight: 500 }}>
              Master the concepts of aerospace engineering and space exploration
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Featured Module */}
              {selectedModule && (
                <Card className="relative overflow-hidden rounded-2xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl">
                  <div className="aspect-video relative bg-gradient-to-br from-purple-950 to-blue-950">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">�️</div>
                        <h2 className="text-3xl font-bold text-white" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>{selectedModule.title}</h2>
                      </div>
                    </div>
                    
                    <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:scale-110 transition-all group">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${getDifficultyColor(selectedModule.level)}`}>
                        {selectedModule.level}
                      </span>
                      <p className="text-white/80 mb-4">
                        {selectedModule.description}
                      </p>
                    </div>
                  </div>

                  {/* Quiz or Content */}
                  <div className="p-6 border-t border-purple-400/20">
                    {showQuiz && !quizScore ? (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontWeight: 700 }}>
                          <Brain className="w-7 h-7 text-yellow-400" />
                          Module Quiz: {selectedModule.title}
                        </h3>
                        
                        <div className="bg-purple-500/10 border border-purple-400/20 rounded-lg p-4 mb-4">
                          <p className="text-purple-200/70 text-sm" style={{ fontWeight: 500 }}>
                            ⏱️ Answer all questions. Minimum passing score: <span className="font-bold text-purple-100">80%</span>
                          </p>
                        </div>

                        {(QUIZ_QUESTIONS[selectedModule.id] || []).map((q, idx) => (
                          <div key={q.id} className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/30 rounded-lg p-6 hover:border-purple-400/60 transition-all">
                            <p className="text-lg font-bold text-white mb-4">
                              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Q{idx + 1}.</span> {q.question}
                            </p>
                            <div className="space-y-3">
                              {q.options.map((option, optIdx) => (
                                <label key={optIdx} className="flex items-center gap-4 p-3 cursor-pointer bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-400/40 rounded-lg transition-all group">
                                  <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    checked={quizAnswers[q.id] === optIdx}
                                    onChange={() => setQuizAnswers({...quizAnswers, [q.id]: optIdx})}
                                    className="w-5 h-5 accent-purple-500 cursor-pointer"
                                  />
                                  <span className="text-purple-100 group-hover:text-purple-50 font-medium">{option}</span>
                                  {quizAnswers[q.id] === optIdx && (
                                    <span className="ml-auto text-purple-400 font-bold">✓ Sélectionné</span>
                                  )}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}

                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={submitQuiz}
                            disabled={Object.keys(quizAnswers).length < (QUIZ_QUESTIONS[selectedModule.id] || []).length}
                            className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg"
                          >
                            ✅ Submit Quiz ({Object.keys(quizAnswers).length} / {(QUIZ_QUESTIONS[selectedModule.id] || []).length})
                          </Button>
                        </div>
                      </div>
                    ) : quizScore ? (
                      <div className="text-center py-8 space-y-6">
                        <div className={`text-6xl mb-4 ${quizScore >= 80 ? "animate-bounce" : ""}`}>
                          {quizScore >= 80 ? "🎉" : "📚"}
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2" style={{ fontWeight: 700 }}>Your Score: <span className={quizScore >= 80 ? "text-green-400" : "text-yellow-400"}>{quizScore}%</span></h3>
                          <p className={`text-lg font-semibold ${quizScore >= 80 ? "text-green-300" : "text-yellow-300"}`} style={{ fontWeight: 600 }}>
                            {quizScore >= 80 
                              ? "🚀 Excellent! Module completed successfully!"
                              : "📚 You can retry to improve your score."}
                          </p>
                        </div>
                        
                        {quizScore >= 80 && (
                          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg p-4">
                            <p className="text-green-100 font-semibold">✓ Module marked as completed!</p>
                          </div>
                        )}

                        <div className="flex gap-3 justify-center flex-wrap">
                          <Button
                            onClick={() => {
                              setShowQuiz(false);
                              setQuizScore(null);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                          >
                            ← Back to Modules
                          </Button>
                          {quizScore < 80 && (
                            <Button
                              onClick={startQuiz}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg"
                            >
                              🔄 Retry
                            </Button>
                          )}
                          <Button
                            onClick={() => window.location.href = "/builder"}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                          >
                            → Go to Builder
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3" style={{ fontWeight: 600 }}>📖 Module Content</h3>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {selectedModule.lessons.map((lesson) => (
                              <div 
                                key={lesson.id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-400/20 hover:bg-purple-500/20 transition-all"
                              >
                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white">{lesson.title}</p>
                                  <p className="text-xs text-purple-300">{lesson.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button 
                          onClick={startQuiz}
                          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold"
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          Start Quiz
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Module Grid */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4" style={{ fontWeight: 600 }}>📚 More Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => handleSelectModule(module.id)}
                      className={`relative overflow-hidden rounded-xl border-2 transition-all text-left group h-48 ${
                        selectedModule?.id === module.id
                          ? "border-purple-400/60 shadow-lg shadow-purple-500/20"
                          : "border-purple-400/20 hover:border-purple-400/40"
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-purple-950 to-blue-950 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                        🛰️
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 border ${getDifficultyColor(module.level)}`}>
                          {module.level}
                        </span>
                        <h4 className="text-white font-semibold mb-1 line-clamp-2" style={{ fontWeight: 600 }}>
                          {module.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                          <span>{module.lessons_count} lessons</span>
                          <span>•</span>
                          <span>{module.duration}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats */}
              <Card className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-xl border border-purple-400/30 p-6">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2" style={{ fontWeight: 600 }}>
                  <Award className="w-5 h-5 text-purple-300" />
                  📊 Your Stats
                </h3>
                <div className="space-y-4">
                  <div className="bg-purple-500/10 rounded-lg p-3">
                    <p className="text-purple-200/70 text-sm" style={{ fontWeight: 500 }}>Modules Started</p>
                    <p className="text-3xl font-bold text-purple-100" style={{ fontWeight: 700 }}>{Object.keys(progress).length}</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-3">
                    <p className="text-green-200/70 text-sm" style={{ fontWeight: 500 }}>Modules Completed</p>
                    <p className="text-3xl font-bold text-green-400" style={{ fontWeight: 700 }}>
                      {Object.values(progress).filter(p => p.completed).length}
                    </p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <p className="text-blue-200/70 text-sm" style={{ fontWeight: 500 }}>Average Score</p>
                    <p className="text-3xl font-bold text-blue-400" style={{ fontWeight: 700 }}>
                      {Object.keys(progress).length > 0 
                        ? Math.round(Object.values(progress).reduce((a, b) => a + b.score, 0) / Object.keys(progress).length)
                        : 0}%
                    </p>
                  </div>
                </div>
              </Card>

              {/* Tips */}
              <Card className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-xl border border-blue-400/30 p-6">
                <h3 className="text-lg font-semibold text-blue-100 mb-3" style={{ fontWeight: 600 }}>💡 Tips</h3>
                <ul className="text-blue-200/70 text-sm space-y-2" style={{ fontWeight: 500 }}>
                  <li>✓ Complete all modules</li>
                  <li>✓ Score 80%+ on quizzes</li>
                  <li>✓ Apply your knowledge</li>
                  <li>✓ in Builder and Tutor</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
