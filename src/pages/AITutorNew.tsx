import { Navigation } from "../Navigation";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState, useRef, useEffect } from "react";
import { api } from "../api";

export function AITutorNew() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Tutor. How can I help you with aerospace today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const currentMessages = messages;
    setMessages(prev => [...prev, { id: prev.length + 1, text: userMessage, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    try {
      const history = currentMessages
        .filter(m => m.sender !== "bot" || m.id !== 1)
        .map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text }));

      const res = await api.sendMessage(userMessage, history);

      if (res?.reply) {
        setMessages(prev => [...prev, { id: prev.length + 1, text: res.reply, sender: "bot" }]);
      } else {
        const errorText = res?.error || "Unable to reach the AI tutor. Make sure the backend is running.";
        setMessages(prev => [...prev, { id: prev.length + 1, text: errorText, sender: "bot" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: prev.length + 1, text: "Connection error. Please start the backend server.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-hidden">
      <Navigation />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-32 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10 pt-24 px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-200 via-teal-200 to-green-200 bg-clip-text text-transparent leading-tight">
              AI Tutor
            </h1>
            
            <p className="text-lg text-emerald-200/70">
              Your Intelligent Assistant for Aerospace Learning
            </p>
          </div>

          {/* Chat Container */}
          <Card className="bg-gradient-to-br from-emerald-900/20 via-teal-900/30 to-green-900/20 border-2 border-emerald-500/30 p-8 h-[600px] flex flex-col shadow-2xl shadow-emerald-500/20">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-5 mb-6 scroll-smooth pr-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-2xl px-6 py-4 rounded-xl text-base leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-none shadow-lg shadow-emerald-500/20"
                        : "bg-emerald-900/50 text-emerald-50 border border-emerald-500/40 rounded-bl-none shadow-lg shadow-teal-500/10"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center bg-emerald-900/50 text-emerald-100 border border-emerald-500/40 px-6 py-4 rounded-xl rounded-bl-none shadow-lg shadow-teal-500/10">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-3 pt-4 border-t border-emerald-500/20">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything about aerospace..."
                className="flex-1 bg-emerald-900/30 border border-emerald-500/40 text-white placeholder:text-emerald-400/50 rounded-lg px-4 py-3 text-base outline-none focus:border-emerald-500/70 focus:bg-emerald-900/40 transition-all"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? "Thinking..." : "Send"}
              </Button>
            </div>
          </Card>

          {/* Info Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-500/30 p-6 hover:border-emerald-500/60 transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              <h3 className="text-lg font-bold text-white mb-3">Available Features</h3>
              <ul className="space-y-2 text-emerald-200/70 text-sm">
                <li>Real-time AI responses</li>
                <li>Multilingual support</li>
                <li>Aerospace Q&A</li>
                <li>Study recommendations</li>
              </ul>
            </Card>

            <Card className="bg-gradient-to-br from-teal-900/30 to-green-900/20 border border-teal-500/30 p-6 hover:border-teal-500/60 transition-all hover:shadow-lg hover:shadow-teal-500/20">
              <h3 className="text-lg font-bold text-white mb-3">How to Use</h3>
              <ul className="space-y-2 text-teal-200/70 text-sm">
                <li>Type your aerospace question</li>
                <li>Get AI-powered answers instantly</li>
                <li>Ask follow-up questions</li>
                <li>• Explore learning paths</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
