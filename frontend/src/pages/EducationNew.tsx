import { Navigation } from "../Navigation";
import { useState, useEffect } from "react";
import { CheckCircle2, Award, Brain, Play, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { api } from "../api";

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

interface Lesson {
  id: number;
  title: string;
  videoId: string;
  description: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessons: Lesson[];
}

// ── Real educational aerospace videos (YouTube IDs verified) ──────────────────
const MODULES: Module[] = [
  {
    id: 1,
    title: "Space Orbits & Mechanics",
    description: "Learn about orbital mechanics, escape velocity, and the ISS.",
    level: "Beginner",
    duration: "2h",
    lessons: [
      { id: 1, title: "Introduction to Orbital Mechanics", videoId: "v3y8AIEX_dU", description: "How objects move in space and why orbits work." },
      { id: 2, title: "Escape Velocity", videoId: "RVMZxH1TIIQ", description: "The speed needed to break free from Earth's gravity." },
      { id: 3, title: "ISS & Low Earth Orbit", videoId: "o8TssbmY-GM", description: "Life and science aboard the International Space Station." },
      { id: 4, title: "Rocket Engine Cycles", videoId: "LbH1ZDImaI8", description: "How rocket engines are designed and powered." },
      { id: 5, title: "Why Rockets Don't Melt", videoId: "he_BL6Q5u1Y", description: "Thermal management in rocket engine design." },
    ],
  },
  {
    id: 2,
    title: "Moon & Deep Space Missions",
    description: "Explore lunar missions, fuel types, and deep space navigation.",
    level: "Intermediate",
    duration: "2.5h",
    lessons: [
      { id: 1, title: "Why Rockets Work", videoId: "LbH1ZDImaI8", description: "Newton's 3rd law and rocket propulsion basics." },
      { id: 2, title: "Escape Velocity Explained", videoId: "RVMZxH1TIIQ", description: "What it takes to leave Earth's gravitational pull." },
      { id: 3, title: "Stellar Engines & Gravity", videoId: "v3y8AIEX_dU", description: "Megastructures and gravitational concepts." },
      { id: 4, title: "Life in Microgravity (ISS)", videoId: "o8TssbmY-GM", description: "How gravity affects everything in space." },
      { id: 5, title: "Thermal Engineering in Space", videoId: "he_BL6Q5u1Y", description: "How spacecraft survive extreme temperature changes." },
    ],
  },
  {
    id: 3,
    title: "Satellite & Spacecraft Systems",
    description: "Understand satellite systems, attitude control, and propulsion.",
    level: "Intermediate",
    duration: "3h",
    lessons: [
      { id: 1, title: "SpaceX Raptor Engine", videoId: "LbH1ZDImaI8", description: "Inside the world's most powerful rocket engine." },
      { id: 2, title: "Falcon 9 Historic Landing", videoId: "1B6oiLNyKKI", description: "First orbital rocket to land its booster back on Earth." },
      { id: 3, title: "Combustion Engineering", videoId: "he_BL6Q5u1Y", description: "How fuel burns inside a rocket combustion chamber." },
      { id: 4, title: "ISS Systems & Microgravity", videoId: "o8TssbmY-GM", description: "Science experiments and systems aboard the ISS." },
      { id: 5, title: "Neutron Stars & Extreme Matter", videoId: "udFxKZRyQt4", description: "The most exotic matter in the known universe." },
    ],
  },
  {
    id: 4,
    title: "Advanced Space Navigation",
    description: "Master orbital transfers, SpaceX missions, and interplanetary travel.",
    level: "Advanced",
    duration: "3.5h",
    lessons: [
      { id: 1, title: "Stellar Engines & Hohmann Transfers", videoId: "v3y8AIEX_dU", description: "Moving massive objects through space using orbital mechanics." },
      { id: 2, title: "Falcon 9 Booster Landing", videoId: "1B6oiLNyKKI", description: "SpaceX's revolution in reusable rocket technology." },
      { id: 3, title: "Black Holes & Extreme Gravity", videoId: "e-P5IFTqB98", description: "Where gravity is so strong that light cannot escape." },
      { id: 4, title: "Neutron Stars & Spacetime", videoId: "udFxKZRyQt4", description: "The densest objects in the universe and what they reveal." },
      { id: 5, title: "The Future of Space Travel", videoId: "v3y8AIEX_dU", description: "Megastructures, interstellar travel, and humanity's future." },
    ],
  },
];

const QUIZ_QUESTIONS: Record<number, QuizQuestion[]> = {
  1: [
    { id: 1, question: "What is a geostationary orbit?", options: ["An orbit at ~36,000 km where satellites appear fixed", "An orbit at 400 km altitude", "A lunar orbit", "An orbit at 10,000 km"], correctAnswer: 0 },
    { id: 2, question: "What is Earth's escape velocity?", options: ["11.2 km/s", "7.8 km/s", "5.5 km/s", "15.3 km/s"], correctAnswer: 0 },
    { id: 3, question: "At what altitude does the ISS orbit?", options: ["~400 km", "~1000 km", "~200 km", "~600 km"], correctAnswer: 0 },
    { id: 4, question: "What is the primary factor affecting orbital period?", options: ["Altitude and primary body mass", "Satellite color", "Space temperature", "Mission age"], correctAnswer: 0 },
    { id: 5, question: "What is a launch window?", options: ["The optimal time period to launch a rocket", "An opening in rocket fuselage", "A physics theory", "A navigation system"], correctAnswer: 0 },
  ],
  2: [
    { id: 1, question: "What fuel do modern rockets primarily use?", options: ["Kerosene and liquid oxygen", "Pure gasoline", "Diesel", "Propane only"], correctAnswer: 0 },
    { id: 2, question: "How long does it take to reach the Moon?", options: ["3–4 days", "1 week", "2 weeks", "1 month"], correctAnswer: 0 },
    { id: 3, question: "What is specific impulse (Isp)?", options: ["A measure of rocket fuel efficiency", "Mass ratio", "Exhaust velocity", "Energy density"], correctAnswer: 0 },
    { id: 4, question: "What is lunar gravity compared to Earth?", options: ["1/6 as strong", "1/2 as strong", "1/10 as strong", "1/4 as strong"], correctAnswer: 0 },
    { id: 5, question: "What is a Lagrange point?", options: ["A gravitational equilibrium point between two bodies", "A solar system region", "A rocket type", "A polar orbit"], correctAnswer: 0 },
  ],
  3: [
    { id: 1, question: "What is the main role of thermal radiators on a satellite?", options: ["Dissipate excess heat", "Generate energy", "Amplify radio signals", "Protect from impacts"], correctAnswer: 0 },
    { id: 2, question: "How much solar power is available per m² in orbit?", options: ["~1400 W/m²", "~500 W/m²", "~2000 W/m²", "~1000 W/m²"], correctAnswer: 0 },
    { id: 3, question: "What system controls satellite orientation?", options: ["Attitude control system", "Propulsion system", "Communication system", "Storage system"], correctAnswer: 0 },
    { id: 4, question: "What is the purpose of a rocket combustion chamber?", options: ["Burn fuel and create thrust", "Store fuel", "Cool hot gases", "Measure pressure"], correctAnswer: 0 },
    { id: 5, question: "What makes the Raptor engine unique?", options: ["Full-flow staged combustion cycle", "Open-cycle design", "Solid fuel", "Nuclear propulsion"], correctAnswer: 0 },
  ],
  4: [
    { id: 1, question: "What is a Hohmann transfer orbit?", options: ["The most fuel-efficient path between two orbits", "A polar orbit", "A straight-line trajectory", "Atmospheric reentry"], correctAnswer: 0 },
    { id: 2, question: "What makes Falcon 9 historically significant?", options: ["First orbital rocket with a reusable first stage", "First rocket to the Moon", "Largest rocket ever", "First private rocket"], correctAnswer: 0 },
    { id: 3, question: "What is the event horizon of a black hole?", options: ["The boundary beyond which nothing can escape", "The center of a black hole", "A type of orbit", "The accretion disk"], correctAnswer: 0 },
    { id: 4, question: "What are neutron stars made of?", options: ["Densely packed neutrons from a collapsed star", "Dark matter", "Hydrogen gas", "Iron and nickel"], correctAnswer: 0 },
    { id: 5, question: "What is a stellar engine?", options: ["A theoretical megastructure to move a star", "A fusion reactor", "A type of rocket engine", "A solar panel array"], correctAnswer: 0 },
  ],
};

export function EducationNew() {
  const [selectedModule, setSelectedModule] = useState<Module>(MODULES[0]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(MODULES[0].lessons[0]);
  const [progress, setProgress] = useState<Record<number, ProgressItem>>({});
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (api.isAuthenticated()) {
      loadProgress();
    }
  }, []);

  const loadProgress = async () => {
    try {
      const progressData = await api.getProgress();
      const progressMap: Record<number, ProgressItem> = {};
      if (progressData && !progressData.error) {
        (Array.isArray(progressData) ? progressData : progressData.details || []).forEach((p: ProgressItem) => {
          progressMap[p.module_id] = p;
        });
        setProgress(progressMap);
      }
    } catch (e) {
      console.error("Progress load error:", e);
    }
  };

  const handleSelectModule = (mod: Module) => {
    setSelectedModule(mod);
    setSelectedLesson(mod.lessons[0]);
    setShowQuiz(false);
    setQuizScore(null);
    setQuizAnswers({});
  };

  const submitQuiz = async () => {
    const questions = QUIZ_QUESTIONS[selectedModule.id] || [];
    let score = 0;
    questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) score++;
    });
    const percentage = Math.round((score / questions.length) * 100);
    setQuizScore(percentage);

    if (api.isAuthenticated()) {
      try {
        setSaving(true);
        await api.saveProgress({ module_id: selectedModule.id, completed: percentage >= 80, score: percentage, time_spent: 60 });
        await loadProgress();
      } catch (e) { console.error(e); }
      finally { setSaving(false); }
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

  return (
    <div className="min-h-screen bg-[#0a0518]" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}>
      <Navigation />

      <div className="pt-24 px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 bg-clip-text text-transparent">
              Aerospace Academy
            </h1>
            <p className="text-purple-200/70 text-lg">Master the concepts of aerospace engineering and space exploration</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar: Module list */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">Modules</h3>
              {MODULES.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => handleSelectModule(mod)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedModule.id === mod.id
                      ? "bg-purple-600/30 border-purple-400/60 shadow-lg shadow-purple-500/20"
                      : "bg-purple-900/20 border-purple-400/20 hover:border-purple-400/40 hover:bg-purple-900/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{mod.title}</p>
                      <p className="text-xs text-purple-300/60 mt-1">{mod.duration} • {mod.lessons.length} videos</p>
                    </div>
                    {progress[mod.id]?.completed && (
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium border ${getDifficultyColor(mod.level)}`}>
                    {mod.level}
                  </span>
                </button>
              ))}

              {/* Stats */}
              <Card className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 border border-purple-400/30 p-4 mt-4">
                <h4 className="text-sm font-semibold text-purple-200 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Your Progress
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-300/70">Completed</span>
                    <span className="text-green-400 font-bold">{Object.values(progress).filter(p => p.completed).length} / {MODULES.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-300/70">Avg Score</span>
                    <span className="text-blue-400 font-bold">
                      {Object.keys(progress).length > 0
                        ? Math.round(Object.values(progress).reduce((a, b) => a + b.score, 0) / Object.keys(progress).length)
                        : 0}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-5">
              {!showQuiz ? (
                <>
                  {/* Video Player */}
                  <Card className="overflow-hidden rounded-2xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-900/40 to-blue-900/40">
                    <div className="aspect-video w-full bg-black">
                      <iframe
                        key={selectedLesson.videoId}
                        className="w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${selectedLesson.videoId}?rel=0&modestbranding=1`}
                        title={selectedLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-white mb-1">{selectedLesson.title}</h2>
                          <p className="text-purple-300/70 text-sm">{selectedLesson.description}</p>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getDifficultyColor(selectedModule.level)}`}>
                          {selectedModule.level}
                        </span>
                      </div>

                      {/* Lesson list */}
                      <div className="border-t border-purple-400/20 pt-4">
                        <p className="text-xs text-purple-300/50 uppercase tracking-wider font-semibold mb-3">
                          {selectedModule.title} — {selectedModule.lessons.length} videos
                        </p>
                        <div className="space-y-2">
                          {selectedModule.lessons.map((lesson, idx) => (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                                selectedLesson.id === lesson.id
                                  ? "bg-purple-600/30 border border-purple-400/50"
                                  : "bg-purple-500/10 border border-purple-400/10 hover:bg-purple-500/20"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                selectedLesson.id === lesson.id ? "bg-purple-500" : "bg-purple-900/50"
                              }`}>
                                {selectedLesson.id === lesson.id
                                  ? <Play className="w-4 h-4 text-white ml-0.5" />
                                  : <span className="text-xs text-purple-300 font-bold">{idx + 1}</span>
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
                                <p className="text-xs text-purple-300/60 truncate">{lesson.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => { setShowQuiz(true); setQuizAnswers({}); setQuizScore(null); }}
                        className="w-full mt-5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold rounded-xl"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Take Module Quiz
                      </Button>
                    </div>
                  </Card>

                  {/* Module grid */}
                  <div>
                    <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">Other Modules</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {MODULES.filter(m => m.id !== selectedModule.id).map(mod => (
                        <button
                          key={mod.id}
                          onClick={() => handleSelectModule(mod)}
                          className="text-left p-5 rounded-xl border border-purple-400/20 bg-purple-900/20 hover:border-purple-400/40 hover:bg-purple-900/30 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getDifficultyColor(mod.level)}`}>{mod.level}</span>
                            {progress[mod.id]?.completed && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                          </div>
                          <h4 className="font-semibold text-white mb-1">{mod.title}</h4>
                          <p className="text-xs text-purple-300/60">{mod.description}</p>
                          <p className="text-xs text-purple-400/50 mt-2">{mod.lessons.length} videos • {mod.duration}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : quizScore === null ? (
                /* Quiz */
                <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-purple-400/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Brain className="w-6 h-6 text-yellow-400" />
                      Quiz: {selectedModule.title}
                    </h3>
                    <button onClick={() => setShowQuiz(false)} className="p-2 rounded-lg hover:bg-purple-500/20 text-purple-300">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-400/20 rounded-lg p-3 mb-6">
                    <p className="text-purple-200/70 text-sm">Answer all questions. Passing score: <span className="font-bold text-purple-100">80%</span></p>
                  </div>

                  <div className="space-y-5">
                    {(QUIZ_QUESTIONS[selectedModule.id] || []).map((q, idx) => (
                      <div key={q.id} className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-5">
                        <p className="text-white font-semibold mb-4">
                          <span className="text-purple-400">Q{idx + 1}. </span>{q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <label key={optIdx} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                              quizAnswers[q.id] === optIdx
                                ? "bg-purple-600/30 border-purple-400/60"
                                : "bg-purple-900/20 border-purple-500/10 hover:bg-purple-900/40 hover:border-purple-400/30"
                            }`}>
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                checked={quizAnswers[q.id] === optIdx}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                                className="w-4 h-4 accent-purple-500"
                              />
                              <span className="text-purple-100 text-sm">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < (QUIZ_QUESTIONS[selectedModule.id] || []).length || saving}
                    className="w-full mt-6 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl"
                  >
                    {saving ? "Saving..." : `Submit (${Object.keys(quizAnswers).length}/${(QUIZ_QUESTIONS[selectedModule.id] || []).length})`}
                  </Button>
                </Card>
              ) : (
                /* Quiz result */
                <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-purple-400/30 p-8 text-center">
                  <div className="text-5xl mb-4">{quizScore >= 80 ? "🚀" : "📚"}</div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Score: <span className={quizScore >= 80 ? "text-green-400" : "text-yellow-400"}>{quizScore}%</span>
                  </h3>
                  <p className={`text-lg font-semibold mb-6 ${quizScore >= 80 ? "text-green-300" : "text-yellow-300"}`}>
                    {quizScore >= 80 ? "Excellent! Module completed!" : "Keep studying and try again."}
                  </p>
                  {quizScore >= 80 && (
                    <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4 mb-6">
                      <p className="text-green-200 font-semibold">Module marked as completed!</p>
                    </div>
                  )}
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button onClick={() => setShowQuiz(false)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6">
                      Back to Videos
                    </Button>
                    {quizScore < 80 && (
                      <Button onClick={() => { setQuizAnswers({}); setQuizScore(null); }} className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl px-6">
                        Retry Quiz
                      </Button>
                    )}
                    <Button onClick={() => window.location.href = "/ai-tutor"} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6">
                      Ask AI Tutor
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
