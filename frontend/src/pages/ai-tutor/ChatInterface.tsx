import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "../../components/ui/input";

export function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bonjour! Je suis AeroBot, votre tuteur en aérospatiale. Comment puis-je vous aider?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");

    const newMessages = [...messages, { id: Date.now(), text: userText, sender: "user" }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages
        .filter(m => m.id !== 1)
        .slice(-10)
        .map(m => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text
        }));

      const response = await fetch("http://127.0.0.1:5000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history })
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.reply || "Erreur de réponse",
        sender: "bot"
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Impossible de contacter le serveur. Vérifiez que Flask tourne.",
        sender: "bot"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Interface Chat</h2>

      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6 h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-900/50 text-purple-100 border border-purple-500/30"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-purple-900/50 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-lg">
                AeroBot est en train d'écrire...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Posez votre question sur l'aérospatiale..."
            className="flex-1 bg-purple-900/30 border-purple-500/30 text-white placeholder:text-purple-300/50"
          />
          <Button
            onClick={sendMessage}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}