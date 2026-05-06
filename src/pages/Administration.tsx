import { Navigation } from "../Navigation";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { api } from "../api";
import {
  Users, Shield, ShieldCheck, Trash2, RefreshCw,
  Rocket, BarChart3, CheckCircle2, AlertCircle, Loader, Plus, Edit2, BookOpen,
} from "lucide-react";

interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: string;
  created_at: string | null;
  builds_count: number;
  progress_count: number;
}

interface Build {
  id: number;
  user_id: number;
  username: string;
  name: string;
  components: string[];
  created_at: string;
}

interface Module {
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
  content: string;
  video_url: string;
  order: number;
}

interface Stats {
  total_users: number;
  total_builds: number;
  total_progress: number;
  completed_modules: number;
}

type Tab = "overview" | "users" | "builds" | "modules" | "lessons";

const LOCAL_MODULES: Module[] = [
  { id: 1, title: "Space Orbits & Mechanics",      description: "Learn about orbital mechanics, escape velocity, and the ISS.", level: "Beginner",     duration: "2h",   image_url: "", lessons_count: 5 },
  { id: 2, title: "Moon & Deep Space Missions",    description: "Explore lunar missions, fuel types, and deep space navigation.", level: "Intermediate", duration: "2.5h", image_url: "", lessons_count: 5 },
  { id: 3, title: "Satellite & Spacecraft Systems",description: "Understand satellite systems, attitude control, and propulsion.", level: "Intermediate", duration: "3h",   image_url: "", lessons_count: 5 },
  { id: 4, title: "Advanced Space Navigation",     description: "Master orbital transfers, SpaceX missions, and interplanetary travel.", level: "Advanced", duration: "3.5h", image_url: "", lessons_count: 5 },
];

function getLocalUsers(): AdminUser[] {
  const raw = JSON.parse(localStorage.getItem("aeroverse_users") || "[]");
  return raw.map((u: { id: number; email: string; username: string; role?: string }) => ({
    id: u.id,
    email: u.email,
    username: u.username,
    role: u.role || "student",
    created_at: null,
    builds_count: 0,
    progress_count: 0,
  }));
}

export function Administration() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Form states
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "", level: "", duration: "", image_url: "" });
  const [lessonForm, setLessonForm] = useState({ title: "", content: "", video_url: "", order: 0 });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    if (!user || user.role !== "admin") {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setIsAdmin(true);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes, buildsRes, modulesRes] = await Promise.all([
        api.adminGetStats(),
        api.adminGetUsers(),
        api.adminGetBuilds(),
        api.adminGetModules(),
      ]);
      if (statsRes && !statsRes.error) setStats(statsRes);
      if (Array.isArray(usersRes) && usersRes.length > 0) {
        setUsers(usersRes);
      } else {
        setUsers(getLocalUsers());
      }
      if (Array.isArray(buildsRes)) setBuilds(buildsRes);
      if (Array.isArray(modulesRes) && modulesRes.length > 0) {
        setModules(modulesRes);
      } else {
        setModules(LOCAL_MODULES);
      }
    } catch {
      setUsers(getLocalUsers());
      setModules(LOCAL_MODULES);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (user: AdminUser) => {
    const newRole = user.role === "admin" ? "student" : "admin";
    setActionLoading(user.id);
    const res = await api.adminUpdateRole(user.id, newRole);
    if (res && !res.error) {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    }
    setActionLoading(null);
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    setActionLoading(user.id);
    const res = await api.adminDeleteUser(user.id);
    if (res && !res.error) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      if (stats) setStats({ ...stats, total_users: stats.total_users - 1 });
    }
    setActionLoading(null);
  };

  const handleCreateModule = async () => {
    if (!moduleForm.title) return alert("Module title is required");
    setActionLoading(-1);
    const res = await api.adminCreateModule(moduleForm);
    if (res && !res.error) {
      setModuleForm({ title: "", description: "", level: "", duration: "", image_url: "" });
      setShowModuleForm(false);
      loadAll();
    }
    setActionLoading(null);
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    setActionLoading(moduleId);
    const res = await api.adminDeleteModule(moduleId);
    if (res && !res.error) {
      setModules(prev => prev.filter(m => m.id !== moduleId));
    }
    setActionLoading(null);
  };

  const handleLoadLessons = async (moduleId: number) => {
    setSelectedModule(moduleId);
    setActionLoading(moduleId);
    const res = await api.adminGetLessons(moduleId);
    if (Array.isArray(res)) setLessons(res);
    setActionLoading(null);
  };

  const handleCreateLesson = async () => {
    if (!selectedModule || !lessonForm.title) return alert("Module and lesson title are required");
    setActionLoading(-2);
    const res = await api.adminCreateLesson(selectedModule, lessonForm);
    if (res && !res.error) {
      setLessonForm({ title: "", content: "", video_url: "", order: 0 });
      setShowLessonForm(false);
      handleLoadLessons(selectedModule);
    }
    setActionLoading(null);
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm("Delete this lesson?")) return;
    setActionLoading(lessonId);
    const res = await api.adminDeleteLesson(lessonId);
    if (res && !res.error) {
      setLessons(prev => prev.filter(l => l.id !== lessonId));
    }
    setActionLoading(null);
  };

  // ── Access denied ──────────────────────────────────────────────────────────
  if (!loading && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0518]">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Shield className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
            <p className="text-purple-200/60 mb-6">
              This page is restricted to administrators only.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-x-hidden">
      <Navigation />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 pt-28 px-6 pb-12">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Admin Panel</span>
              </div>
              <h1 className="text-4xl font-bold text-white">Administration</h1>
              <p className="text-purple-200/60 mt-1">Manage users, builds, and platform activity</p>
            </div>
            <Button
              onClick={loadAll}
              disabled={loading}
              variant="outline"
              className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10 rounded-xl flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-200 text-sm">{error}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-purple-900/30 border border-purple-500/20 rounded-xl mb-8 w-fit overflow-x-auto">
            {[
              { id: "overview" as Tab, label: "Overview", Icon: BarChart3 },
              { id: "users" as Tab, label: `Users (${users.length})`, Icon: Users },
              { id: "builds" as Tab, label: `Builds (${builds.length})`, Icon: Rocket },
              { id: "modules" as Tab, label: `Modules (${modules.length})`, Icon: BookOpen },
              { id: "lessons" as Tab, label: "Lessons", Icon: Edit2 },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  tab === id
                    ? "bg-purple-600 text-white shadow"
                    : "text-purple-300/70 hover:text-purple-200 hover:bg-purple-500/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          )}

          {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
          {!loading && tab === "overview" && (
            <div className="space-y-8">
              {/* Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Users",        value: stats?.total_users ?? users.length,             color: "blue",   Icon: Users },
                  { label: "Spacecraft Built",   value: stats?.total_builds ?? builds.length,           color: "purple", Icon: Rocket },
                  { label: "Learning Sessions",  value: stats?.total_progress ?? "—",                   color: "green",  Icon: BarChart3 },
                  { label: "Modules Completed",  value: stats?.completed_modules ?? "—",                color: "yellow", Icon: CheckCircle2 },
                ].map(({ label, value, color, Icon: StatIcon }) => (
                  <Card
                    key={label}
                    className={`bg-${color}-900/20 border border-${color}-500/25 p-5 flex flex-col gap-3`}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-${color}-500/15 flex items-center justify-center`}>
                      <StatIcon className={`w-5 h-5 text-${color}-400`} />
                    </div>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-xs text-purple-300/60 font-medium">{label}</p>
                  </Card>
                ))}
              </div>

              {/* Role breakdown */}
              {users.length > 0 && (
                <Card className="bg-purple-900/20 border border-purple-500/20 p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    User Roles
                  </h3>
                  <div className="flex gap-6">
                    {["admin", "student"].map(role => {
                      const count = users.filter(u => u.role === role).length;
                      const pct = users.length ? Math.round((count / users.length) * 100) : 0;
                      return (
                        <div key={role} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${role === "admin" ? "bg-blue-400" : "bg-purple-400"}`} />
                          <span className="text-purple-200 text-sm capitalize">{role}</span>
                          <span className="text-white font-bold">{count}</span>
                          <span className="text-purple-400/60 text-xs">({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-purple-900/50 overflow-hidden">
                    {users.length > 0 && (
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${Math.round((users.filter(u => u.role === "admin").length / users.length) * 100)}%` }}
                      />
                    )}
                  </div>
                </Card>
              )}

              {/* Recent builds preview */}
              {builds.length > 0 && (
                <Card className="bg-purple-900/20 border border-purple-500/20 p-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-purple-400" />
                    Latest Spacecraft Builds
                  </h3>
                  <div className="space-y-2">
                    {builds.slice(0, 5).map(b => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-white">{b.name}</p>
                          <p className="text-xs text-purple-300/50">by {b.username} · {b.components.length} components</p>
                        </div>
                        <p className="text-xs text-purple-400/50">{new Date(b.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ── USERS ─────────────────────────────────────────────────────── */}
          {!loading && tab === "users" && (
            <Card className="bg-purple-900/20 border border-purple-500/20 overflow-hidden">
              {users.length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
                  <p className="text-purple-300/50">No users found (backend may be offline)</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-500/20 text-left">
                        <th className="px-5 py-3 text-xs font-semibold text-purple-300/60 uppercase tracking-wider">User</th>
                        <th className="px-5 py-3 text-xs font-semibold text-purple-300/60 uppercase tracking-wider">Role</th>
                        <th className="px-5 py-3 text-xs font-semibold text-purple-300/60 uppercase tracking-wider">Builds</th>
                        <th className="px-5 py-3 text-xs font-semibold text-purple-300/60 uppercase tracking-wider">Progress</th>
                        <th className="px-5 py-3 text-xs font-semibold text-purple-300/60 uppercase tracking-wider">Joined</th>
                        <th className="px-5 py-3 text-xs font-semibold text-purple-300/60 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, idx) => (
                        <tr
                          key={u.id}
                          className={`border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors ${idx % 2 === 0 ? "" : "bg-purple-900/10"}`}
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-white text-sm">{u.username}</p>
                            <p className="text-xs text-purple-300/50">{u.email}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              u.role === "admin"
                                ? "bg-blue-500/20 border-blue-400/30 text-blue-300"
                                : "bg-purple-500/20 border-purple-400/30 text-purple-300"
                            }`}>
                              {u.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-purple-200">{u.builds_count}</td>
                          <td className="px-5 py-4 text-sm text-purple-200">{u.progress_count} modules</td>
                          <td className="px-5 py-4 text-xs text-purple-300/50">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRoleToggle(u)}
                                disabled={actionLoading === u.id}
                                className={`text-xs h-7 px-2.5 rounded-lg ${
                                  u.role === "admin"
                                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                              >
                                {actionLoading === u.id ? (
                                  <Loader className="w-3 h-3 animate-spin" />
                                ) : u.role === "admin" ? (
                                  "Demote"
                                ) : (
                                  "Promote"
                                )}
                              </Button>
                              <button
                                onClick={() => handleDelete(u)}
                                disabled={actionLoading === u.id}
                                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* ── BUILDS ────────────────────────────────────────────────────── */}
          {!loading && tab === "builds" && (
            <div className="space-y-3">
              {builds.length === 0 ? (
                <Card className="bg-purple-900/20 border border-purple-500/20 py-16 text-center">
                  <Rocket className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
                  <p className="text-purple-300/50">No spacecraft builds found</p>
                </Card>
              ) : (
                builds.map(b => (
                  <Card
                    key={b.id}
                    className="bg-purple-900/20 border border-purple-500/20 p-5 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{b.name}</p>
                      <p className="text-xs text-purple-300/50 mt-0.5">
                        by <span className="text-purple-300">{b.username}</span> · {b.components.length} components
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {b.components.slice(0, 6).map((c, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/15 text-purple-300 capitalize">
                            {c}
                          </span>
                        ))}
                        {b.components.length > 6 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/15 text-purple-400">
                            +{b.components.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-purple-400/50 flex-shrink-0">
                      {new Date(b.created_at).toLocaleDateString()}
                    </p>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* ── MODULES ───────────────────────────────────────────────────── */}
          {!loading && tab === "modules" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Manage Modules</h2>
                <Button
                  onClick={() => setShowModuleForm(!showModuleForm)}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Module
                </Button>
              </div>

              {showModuleForm && (
                <Card className="bg-purple-900/30 border border-purple-500/30 p-5">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Module Title"
                      value={moduleForm.title}
                      onChange={e => setModuleForm({...moduleForm, title: e.target.value})}
                      className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-300/40 outline-none"
                    />
                    <textarea
                      placeholder="Description"
                      value={moduleForm.description}
                      onChange={e => setModuleForm({...moduleForm, description: e.target.value})}
                      className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-300/40 outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Level (e.g., Beginner)"
                        value={moduleForm.level}
                        onChange={e => setModuleForm({...moduleForm, level: e.target.value})}
                        className="px-3 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-300/40 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g., 2 hours)"
                        value={moduleForm.duration}
                        onChange={e => setModuleForm({...moduleForm, duration: e.target.value})}
                        className="px-3 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-300/40 outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateModule}
                        disabled={actionLoading === -1}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                      >
                        {actionLoading === -1 ? <Loader className="w-4 h-4 animate-spin" /> : "Create"}
                      </Button>
                      <Button
                        onClick={() => setShowModuleForm(false)}
                        variant="outline"
                        className="flex-1 border-purple-400/30 text-purple-200 rounded-lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <div className="space-y-2">
                {modules.length === 0 ? (
                  <Card className="bg-purple-900/20 border border-purple-500/20 py-12 text-center">
                    <BookOpen className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
                    <p className="text-purple-300/50">No modules found</p>
                  </Card>
                ) : (
                  modules.map(m => (
                    <Card key={m.id} className="bg-purple-900/20 border border-purple-500/20 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-white">{m.title}</p>
                          <p className="text-xs text-purple-300/50 mt-1">{m.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">{m.level}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-300">{m.duration}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">{m.lessons_count} lessons</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            onClick={() => handleLoadLessons(m.id)}
                            disabled={actionLoading === m.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs h-7 px-3"
                          >
                            {actionLoading === m.id ? <Loader className="w-3 h-3 animate-spin" /> : "Manage"}
                          </Button>
                          <button
                            onClick={() => handleDeleteModule(m.id)}
                            disabled={actionLoading === m.id}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── LESSONS ───────────────────────────────────────────────────── */}
          {!loading && tab === "lessons" && (
            <div className="space-y-4">
              {!selectedModule ? (
                <div>
                  <p className="text-purple-200 mb-4">Select a module to manage lessons</p>
                  <div className="space-y-2">
                    {modules.length === 0 ? (
                      <Card className="bg-purple-900/20 border border-purple-500/20 py-8 text-center">
                        <p className="text-purple-300/50">No modules available</p>
                      </Card>
                    ) : (
                      modules.map(m => (
                        <Card key={m.id} className="bg-purple-900/20 border border-purple-500/20 p-3 flex items-center justify-between cursor-pointer hover:border-purple-500/40">
                          <div onClick={() => handleLoadLessons(m.id)}>
                            <p className="font-semibold text-white text-sm">{m.title}</p>
                            <p className="text-xs text-purple-300/50">{m.lessons_count} lessons</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleLoadLessons(m.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs h-7 px-3"
                          >
                            Select
                          </Button>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      onClick={() => setSelectedModule(null)}
                      variant="outline"
                      className="border-purple-400/30 text-purple-200 rounded-lg text-xs"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => setShowLessonForm(!showLessonForm)}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Lesson
                    </Button>
                  </div>

                  {showLessonForm && (
                    <Card className="bg-purple-900/30 border border-purple-500/30 p-5 mb-4">
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Lesson Title"
                          value={lessonForm.title}
                          onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
                          className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-300/40 outline-none"
                        />
                        <textarea
                          placeholder="Lesson Content"
                          value={lessonForm.content}
                          onChange={e => setLessonForm({...lessonForm, content: e.target.value})}
                          className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-300/40 outline-none min-h-20"
                        />
                        <input
                          type="text"
                          placeholder="Video URL"
                          value={lessonForm.video_url}
                          onChange={e => setLessonForm({...lessonForm, video_url: e.target.value})}
                          className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-300/40 outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Order"
                          value={lessonForm.order}
                          onChange={e => setLessonForm({...lessonForm, order: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-300/40 outline-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleCreateLesson}
                            disabled={actionLoading === -2}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                          >
                            {actionLoading === -2 ? <Loader className="w-4 h-4 animate-spin" /> : "Create"}
                          </Button>
                          <Button
                            onClick={() => setShowLessonForm(false)}
                            variant="outline"
                            className="flex-1 border-purple-400/30 text-purple-200 rounded-lg"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  <div className="space-y-2">
                    {lessons.length === 0 ? (
                      <Card className="bg-purple-900/20 border border-purple-500/20 py-8 text-center">
                        <p className="text-purple-300/50">No lessons in this module</p>
                      </Card>
                    ) : (
                      lessons.map(l => (
                        <Card key={l.id} className="bg-purple-900/20 border border-purple-500/20 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-white text-sm">{l.title}</p>
                              <p className="text-xs text-purple-300/50 mt-1 line-clamp-2">{l.content}</p>
                              {l.video_url && <p className="text-xs text-blue-300 mt-2">📹 Has video</p>}
                            </div>
                            <button
                              onClick={() => handleDeleteLesson(l.id)}
                              disabled={actionLoading === l.id}
                              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50 flex-shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
