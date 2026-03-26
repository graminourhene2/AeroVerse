import { Navigation } from "../Navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { useState, useEffect } from "react";
import { api } from "../api";
import { useLocation } from "react-router-dom";

export function Authentication() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("mode") === "signup") {
      setIsLogin(false);
    }
  }, [location]);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await api.login({ email, password });
        if (result.error) {
          // Sanitize and show user-friendly error messages
          const errorMsg = result.error.toLowerCase();
          if (errorMsg.includes("incorrect") || errorMsg.includes("invalid")) {
            setError("❌ Email or password is incorrect.");
          } else if (errorMsg.includes("not found")) {
            setError("❌ User not found. Please create an account.");
          } else {
            // Show generic error instead of backend details
            setError("❌ Unable to sign in. Please try again.");
          }
        } else if (result.token) {
          // Logout first if already connected
          const existingToken = localStorage.getItem("token");
          if (existingToken) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
          
          // Store new credentials
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));
          
          // Redirect to homepage
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        }
      } else {
        // Sign Up
        if (!username.trim()) {
          setError("❌ Username is required.");
          setLoading(false);
          return;
        }
        
        const result = await api.register({ email, password, username });
        if (result.error) {
          // Sanitize registration errors
          const errorMsg = result.error.toLowerCase();
          if (errorMsg.includes("already") || errorMsg.includes("registered")) {
            setError("❌ This email is already registered. Please sign in instead.");
          } else if (errorMsg.includes("invalid email")) {
            setError("❌ Please enter a valid email address.");
          } else if (errorMsg.includes("password")) {
            setError("❌ Password must be at least 6 characters long.");
          } else {
            // Show generic error instead of backend details
            setError("❌ Unable to create account. Please try again.");
          }
        } else if (result.message) {
          setError("✅ Account created! Switching to sign in...");
          // Reset and switch to login with smooth transition
          setTimeout(() => {
            setIsLogin(true);
            setEmail("");
            setPassword("");
            setUsername("");
            setError("");
          }, 1200);
        }
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError("❌ Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-x-hidden">
      <Navigation />
      <div className="pt-32 px-6">
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Sign In" : "Sign Up"}
            </h1>
            <p className="text-purple-200/70 mb-6">
              {isLogin
                ? "Sign in to your AeroVerse account"
                : "Create an account to get started"}
            </p>

            <div className="space-y-4">
              {!isLogin && (
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-purple-900/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="bg-purple-900/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="bg-purple-900/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
              />

              {error && (
                <p className="text-sm text-center" style={{
                  color: error.includes("✅") ? "#86efac" : "#f87171"
                }}>
                  {error}
                </p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl mt-6"
              >
                {loading ? "Loading..." : (isLogin ? "Sign In" : "Sign Up")}
              </Button>
            </div>

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setEmail("");
                setPassword("");
                setUsername("");
              }}
              className="w-full text-center text-purple-300 hover:text-purple-100 text-sm mt-4 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}