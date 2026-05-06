import { Navigation } from "../Navigation";
import { useState, useEffect } from "react";
import { CheckCircle2, Award, Brain, Play, X, BookOpen, FileText, Download, GraduationCap, ScrollText } from "lucide-react";
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

interface Doc {
  id: number;
  title: string;
  type: "PDF" | "Course" | "Paper";
  source: string;
  description: string;
  url: string;
}

const DOCS: Record<number, Doc[]> = {
  1: [
    {
      id: 1,
      title: "Fundamentals of Orbital Mechanics",
      type: "PDF",
      source: "NASA",
      description: "Introduction to Keplerian orbits, orbital elements, and trajectory planning for space missions.",
      url: "/docs/module1/orbital-mechanics.pdf",
    },
    {
      id: 2,
      title: "Astrodynamics — Lecture Notes",
      type: "Course",
      source: "MIT",
      description: "Full lecture notes and problem sets from MIT's 16.346 Astrodynamics course.",
      url: "/docs/module1/astrodynamics-notes.pdf",
    },
    {
      id: 3,
      title: "ISS Technical Description",
      type: "PDF",
      source: "NASA",
      description: "Official NASA document describing the International Space Station systems and orbital parameters.",
      url: "/docs/module1/iss-technical.pdf",
    },
    {
      id: 4,
      title: "Rocket Propulsion Elements",
      type: "Paper",
      source: "NASA NTRS",
      description: "Key chapters covering thrust, specific impulse, and engine cycles from the classic Sutton & Biblarz reference.",
      url: "/docs/module1/rocket-propulsion.pdf",
    },
  ],
  2: [
    {
      id: 1,
      title: "Lunar Mission Design Handbook",
      type: "PDF",
      source: "NASA",
      description: "Trajectory design and mission planning for Earth–Moon transfers including Hohmann and free-return trajectories.",
      url: "/docs/module2/lunar-mission.pdf",
    },
    {
      id: 2,
      title: "Artemis Program Overview",
      type: "PDF",
      source: "NASA",
      description: "Official NASA Artemis architecture document covering SLS, Orion, and Gateway planning.",
      url: "/docs/module2/artemis-overview.pdf",
    },
    {
      id: 3,
      title: "Interplanetary Mission Design",
      type: "Course",
      source: "JPL / Caltech",
      description: "Course material on designing missions to the Moon, Mars and beyond using gravity assists.",
      url: "/docs/module2/interplanetary-design.pdf",
    },
    {
      id: 4,
      title: "Microgravity Science — ESA Overview",
      type: "Paper",
      source: "ESA",
      description: "European Space Agency paper on the effects of microgravity on human physiology and materials science.",
      url: "/docs/module2/microgravity-esa.pdf",
    },
  ],
  3: [
    {
      id: 1,
      title: "Spacecraft Systems Engineering",
      type: "PDF",
      source: "ESA",
      description: "Comprehensive guide to satellite bus design: power, thermal, attitude control, and communications.",
      url: "/docs/module3/spacecraft-systems.pdf",
    },
    {
      id: 2,
      title: "SpaceX Raptor Engine — Technical Brief",
      type: "Paper",
      source: "SpaceX",
      description: "Published overview of the Raptor full-flow staged combustion engine architecture and performance data.",
      url: "/docs/module3/raptor-engine.pdf",
    },
    {
      id: 3,
      title: "Satellite Thermal Control Handbook",
      type: "PDF",
      source: "NASA JPL",
      description: "JPL handbook covering passive and active thermal control techniques for Earth-orbiting spacecraft.",
      url: "/docs/module3/thermal-control.pdf",
    },
    {
      id: 4,
      title: "Small Satellite Design — Course Notes",
      type: "Course",
      source: "MIT",
      description: "Course notes on CubeSat and small satellite design from concept to launch.",
      url: "/docs/module3/small-satellite.pdf",
    },
  ],
  4: [
    {
      id: 1,
      title: "Interplanetary Navigation — Deep Space",
      type: "PDF",
      source: "NASA JPL",
      description: "JPL technical report on autonomous navigation, optical nav, and radiometric tracking for deep space missions.",
      url: "/docs/module4/deep-space-nav.pdf",
    },
    {
      id: 2,
      title: "Hohmann Transfers & Orbital Maneuvers",
      type: "Paper",
      source: "NASA NTRS",
      description: "In-depth paper on fuel-optimal orbital transfers, bi-elliptic transfers, and plane changes.",
      url: "/docs/module4/hohmann-transfers.pdf",
    },
    {
      id: 3,
      title: "Black Holes & Extreme Gravity",
      type: "Paper",
      source: "Research",
      description: "Accessible review paper on stellar-mass and supermassive black holes, event horizons, and observational evidence.",
      url: "/docs/module4/black-holes.pdf",
    },
    {
      id: 4,
      title: "The Future of Human Spaceflight",
      type: "PDF",
      source: "NASA",
      description: "NASA's strategic vision document for long-duration exploration, Moon to Mars architecture and beyond.",
      url: "/docs/module4/nasa-vision.pdf",
    },
  ],
};

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
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"videos" | "docs">("videos");

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
    setActiveTab("videos");
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
                  {/* Tab switcher */}
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setActiveTab("videos")}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        activeTab === "videos"
                          ? "bg-purple-600/40 border-purple-400/60 text-white"
                          : "bg-purple-900/20 border-purple-400/20 text-purple-300/60 hover:border-purple-400/40 hover:text-purple-200"
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      Videos
                    </button>
                    <button
                      onClick={() => setActiveTab("docs")}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        activeTab === "docs"
                          ? "bg-blue-600/40 border-blue-400/60 text-white"
                          : "bg-purple-900/20 border-purple-400/20 text-purple-300/60 hover:border-purple-400/40 hover:text-purple-200"
                      }`}
                    >
                      <ScrollText className="w-4 h-4" />
                      Documentation
                      <span className="ml-1 px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs">
                        {(DOCS[selectedModule.id] || []).length}
                      </span>
                    </button>
                  </div>

                  {activeTab === "videos" ? (
                    /* ── VIDEO PLAYER ── */
                    <Card className="overflow-hidden rounded-2xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-900/40 to-blue-900/40">
                      <div className="aspect-video w-full bg-black">
                        <iframe
                          key={selectedLesson.videoId}
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${selectedLesson.videoId}?rel=0&modestbranding=1`}
                          title={selectedLesson.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
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
                  ) : (
                    /* ── DOCUMENTATION ── */
                    <Card className="rounded-2xl border-2 border-blue-400/30 bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <GraduationCap className="w-5 h-5 text-blue-300" />
                        <h3 className="text-lg font-bold text-white">
                          {selectedModule.title} — Resources
                        </h3>
                        <span className="ml-auto text-xs text-blue-300/60">
                          {(DOCS[selectedModule.id] || []).length} documents
                        </span>
                      </div>

                      <div className="space-y-4">
                        {(DOCS[selectedModule.id] || []).map((doc) => {
                          const typeStyle =
                            doc.type === "PDF"
                              ? { badge: "bg-red-500/20 border-red-400/30 text-red-300", icon: <FileText className="w-5 h-5 text-red-300" /> }
                              : doc.type === "Course"
                              ? { badge: "bg-green-500/20 border-green-400/30 text-green-300", icon: <GraduationCap className="w-5 h-5 text-green-300" /> }
                              : { badge: "bg-yellow-500/20 border-yellow-400/30 text-yellow-300", icon: <ScrollText className="w-5 h-5 text-yellow-300" /> };

                          return (
                            <div
                              key={doc.id}
                              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/30 transition-all"
                            >
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mt-0.5">
                                {typeStyle.icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${typeStyle.badge}`}>
                                    {doc.type}
                                  </span>
                                  <span className="text-xs text-purple-300/50">{doc.source}</span>
                                </div>
                                <p className="text-sm font-semibold text-white mb-1">{doc.title}</p>
                                <p className="text-xs text-purple-300/60 leading-relaxed">{doc.description}</p>
                              </div>

                              <a
                                href={doc.url}
                                download
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-blue-200 text-xs font-medium transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Download
                              </a>
                            </div>
                          );
                        })}
                      </div>

                      <Button
                        onClick={() => { setShowQuiz(true); setQuizAnswers({}); setQuizScore(null); }}
                        className="w-full mt-6 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold rounded-xl"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Take Module Quiz
                      </Button>
                    </Card>
                  )}

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
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center border border-purple-500/20 bg-purple-500/10">
                    <BookOpen className={`w-8 h-8 ${quizScore >= 80 ? "text-green-400" : "text-yellow-400"}`} />
                  </div>
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
