import { Button } from "./components/ui/button";
import { Rocket, Menu, Sparkles, Wrench, GraduationCap, Bot, User, X, Users, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    
    if (token) {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    } else {
      setUser(null);
    }
  }, [location]);
  
  const navItems = [
    { path: "/simulation", label: "Simulation", icon: Sparkles },
    { path: "/builder", label: "Builder", icon: Wrench },
    { path: "/education", label: "Education", icon: GraduationCap },
    { path: "/ai-tutor", label: "AI Tutor", icon: Bot },
  ];

  const userItems = [
    { path: "/about", label: "About", icon: Users },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between rounded-2xl border border-purple-400/20 bg-[#0a0518]/80 backdrop-blur-xl px-6 py-4 shadow-lg shadow-purple-500/5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-purple-100">
              AeroVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-purple-200/70 hover:text-purple-100 hover:bg-purple-500/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section - User & CTA */}
          <div className="flex items-center gap-3">
            {/* User/About Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {userItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "text-purple-200/70 hover:text-purple-100 hover:bg-purple-500/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <span className="hidden md:block text-sm text-purple-200 px-3">
                    {user?.username}
                  </span>
                  <Button 
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/authentication" className="hidden md:block">
                    <Button 
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/authentication?mode=signup" className="hidden md:block">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 border-purple-400/50 text-purple-200 hover:bg-purple-500/10 rounded-xl"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden text-purple-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 rounded-xl border border-purple-400/20 bg-[#0a0518]/90 backdrop-blur-xl p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-purple-200/70 hover:text-purple-100 hover:bg-purple-500/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <hr className="border-purple-500/20 my-2" />
            {userItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-purple-200/70 hover:text-purple-100 hover:bg-purple-500/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <hr className="border-purple-500/20 my-2" />
            {isAuthenticated ? (
              <Button 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Link to="/authentication" className="block">
                  <Button 
                    className="w-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/authentication" className="block">
                  <Button 
                    variant="outline"
                    className="w-full flex items-center gap-2 border-purple-400/50 text-purple-200 hover:bg-purple-500/10 rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}