import { Navigation } from "../Navigation";
import { useState } from "react";
import { BookOpen, CheckCircle2, Lock, Play, Clock, Award, Star } from "lucide-react";
import { Button } from "../components/ui/button";

const courses = [
  {
    id: "basics",
    title: "Space Flight Basics",
    description: "Learn the fundamentals of space travel and orbital mechanics",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrZXQlMjBsYXVuY2h8ZW58MXx8fHwxNzcwMDEzMjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lessons: 8,
    duration: "2.5 hours",
    difficulty: "Beginner",
    completed: 6,
    locked: false,
  },
  {
    id: "satellites",
    title: "Satellite Technology",
    description: "Understand how satellites work and their applications",
    image: "https://images.unsplash.com/photo-1597120081843-631bddc57076?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBvcmJpdHxlbnwxfHx8fDE3NzAwNjUzNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lessons: 10,
    duration: "3 hours",
    difficulty: "Intermediate",
    completed: 3,
    locked: false,
  },
  {
    id: "planets",
    title: "Planetary Science",
    description: "Explore the planets and moons of our solar system",
    image: "https://images.unsplash.com/photo-1520257328559-2062fc7de0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHN5c3RlbSUyMHBsYW5ldHN8ZW58MXx8fHwxNzcwMDA2Njg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lessons: 12,
    duration: "4 hours",
    difficulty: "Intermediate",
    completed: 0,
    locked: false,
  },
  {
    id: "advanced",
    title: "Advanced Propulsion",
    description: "Master rocket science and propulsion systems",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrZXQlMjBsYXVuY2h8ZW58MXx8fHwxNzcwMDEzMjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lessons: 15,
    duration: "5 hours",
    difficulty: "Advanced",
    completed: 0,
    locked: true,
  },
];

const achievements = [
  { icon: "🎯", name: "First Steps", earned: true },
  { icon: "🚀", name: "Rocket Scientist", earned: true },
  { icon: "🌟", name: "Star Student", earned: true },
  { icon: "🔭", name: "Explorer", earned: false },
  { icon: "🏆", name: "Master", earned: false },
];

export function Education() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-400 bg-green-500/20 border-green-400/30";
      case "Intermediate": return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
      case "Advanced": return "text-red-400 bg-red-500/20 border-red-400/30";
      default: return "text-purple-400 bg-purple-500/20 border-purple-400/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0518]">
      <Navigation />
      
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 bg-clip-text text-transparent">
              Education Hub
            </h1>
            <p className="text-purple-200/70">
              Master aerospace concepts through interactive lessons
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Featured Course */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl">
                <div className="aspect-video relative">
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  
                  {/* Play Button */}
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:scale-110 transition-all group">
                    <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                  </button>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(selectedCourse.difficulty)}`}>
                        {selectedCourse.difficulty}
                      </span>
                      {selectedCourse.locked && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-300 border border-gray-400/30 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      )}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-white/80 mb-4">
                      {selectedCourse.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {selectedCourse.lessons} Lessons
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedCourse.duration}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                {!selectedCourse.locked && (
                  <div className="p-6 border-t border-purple-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-200 text-sm">Progress</span>
                      <span className="text-purple-100 font-semibold text-sm">
                        {Math.round((selectedCourse.completed / selectedCourse.lessons) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-purple-950/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${(selectedCourse.completed / selectedCourse.lessons) * 100}%` }}
                      />
                    </div>
                    <div className="mt-4">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        {selectedCourse.completed === 0 ? "Start Course" : "Continue Learning"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className={`relative overflow-hidden rounded-xl border-2 transition-all text-left group ${
                      selectedCourse.id === course.id
                        ? "border-purple-400/60 shadow-lg shadow-purple-500/20"
                        : "border-purple-400/20 hover:border-purple-400/40"
                    }`}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      
                      {course.locked && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-gray-300" />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 border ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </div>
                        <h3 className="text-white font-semibold mb-1">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-white/70">
                          <span>{course.lessons} lessons</span>
                          <span>•</span>
                          <span>{course.duration}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-6">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Your Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/70">Courses Started</span>
                    <span className="text-2xl font-bold text-purple-100">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/70">Lessons Completed</span>
                    <span className="text-2xl font-bold text-green-400">9</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/70">Study Time</span>
                    <span className="text-2xl font-bold text-blue-400">4.2h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/70">Achievements</span>
                    <span className="text-2xl font-bold text-yellow-400">3</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6">
                <h3 className="text-lg font-semibold text-blue-100 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h3>
                <div className="space-y-2">
                  {achievements.map((achievement, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        achievement.earned
                          ? "bg-yellow-500/10 border-yellow-400/30"
                          : "bg-gray-500/5 border-gray-400/10 opacity-50"
                      }`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">
                          {achievement.name}
                        </div>
                      </div>
                      {achievement.earned ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl rounded-2xl border border-green-400/30 p-6">
                <h3 className="text-lg font-semibold text-green-100 mb-4">
                  Quick Access
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-green-400/30 text-green-200 hover:bg-green-500/10">
                    <BookOpen className="w-4 h-4 mr-2" />
                    My Courses
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-green-400/30 text-green-200 hover:bg-green-500/10">
                    <Star className="w-4 h-4 mr-2" />
                    Favorites
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-green-400/30 text-green-200 hover:bg-green-500/10">
                    <Clock className="w-4 h-4 mr-2" />
                    Continue Watching
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
