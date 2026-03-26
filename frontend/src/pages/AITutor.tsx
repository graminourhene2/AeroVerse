'use client';

import { useState } from 'react';
import { api } from '../api';
import { Send, Mic } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'stella';
  timestamp: string;
}

interface Language {
  code: 'en' | 'fr';
  name: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' }
];

const quickQuestions = {
  en: [
    "How do rockets escape Earth's gravity?",
    "Explain orbital mechanics",
    "What is the difference between LEO and GEO?",
    "How does a satellite stay in orbit?",
    "What powers the International Space Station?"
  ],
  fr: [
    "Comment les fusées échappent-elles à la gravité terrestre?",
    "Expliquez la mécanique orbitale",
    "Quelle est la différence entre LEO et GEO?",
    "Comment un satellite reste-t-il en orbite?",
    "Qu'est-ce qui alimente la Station spatiale internationale?"
  ]
};

const helpCategories = {
  en: [
    { icon: '📚', title: 'Concept Explanation', description: 'Breaking down complex topics' },
    { icon: '💡', title: 'Problem Solving', description: 'Step-by-step solutions' },
    { icon: '🌍', title: 'Multilingual', description: 'English & French support' }
  ],
  fr: [
    { icon: '📚', title: 'Explication des concepts', description: 'Décomposer les sujets complexes' },
    { icon: '💡', title: 'Résolution de problèmes', description: 'Solutions étape par étape' },
    { icon: '🌍', title: 'Multilingue', description: 'Support en anglais et français' }
  ]
};

const stellaProfile = {
  en: {
    title: 'Stella',
    status: 'Online',
    bio: "I'm an AI tutor specialized in aerospace education. I can explain concepts in English and French! 🌟"
  },
  fr: {
    title: 'Stella',
    status: 'En ligne',
    bio: 'Je suis un tuteur IA spécialisé dans l\'éducation aérospatiale. Je peux expliquer les concepts en anglais et en français! 🌟'
  }
};

export function AITutor() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'en'
        ? "Hello! I'm Stella, your AI aerospace tutor. I'm here to help you understand the fascinating world of space and aeronautics. What would you like to learn about today? 🌟"
        : "Bonjour! Je suis Stella, votre tuteur IA en aérospatiale. Je suis ici pour vous aider à comprendre le fascinant monde de l'espace et de l'aéronautique. Qu'aimeriez-vous apprendre aujourd'hui? 🌟",
      sender: 'stella',
      timestamp: '11:09 AM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await api.sendMessage(messageText);
      const reply = res?.reply || (language === 'en' ? "Sorry, I couldn't get a response from the AI." : "Désolé, je n'ai pas pu obtenir de réponse de l'IA.");
      const stellaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: 'stella',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, stellaMessage]);
    } catch (error) {
      const stellaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'en' ? "Sorry, there was an error contacting the AI." : "Désolé, une erreur s'est produite lors de la communication avec l'IA.",
        sender: 'stella',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, stellaMessage]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0518] via-[#1a0f2e] to-[#0a0518] text-white">
      {/* Language Selector */}
      <div className="flex justify-end gap-3 p-6 absolute top-6 right-6">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
              language === lang.code
                ? 'bg-purple-600 text-white'
                : 'bg-transparent border border-gray-500 text-gray-300 hover:border-purple-400'
            }`}
          >
            🌐 {lang.name}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 pt-8">
          <h1 className="text-5xl font-bold mb-2">
            {language === 'en' ? 'AI Tutor - Stella' : 'Tuteur IA - Stella'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Your personal aerospace learning assistant' : 'Votre assistant personnel d\'apprentissage en aérospatiale'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            {/* Chat Messages */}
            <div className="bg-gradient-to-r from-[#1a0f2e] to-[#2d1b4e] rounded-2xl p-6 mb-6 border border-purple-900/30 min-h-96 max-h-96 overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-[#2d1b4e] border border-cyan-500/30 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'stella' && <p className="text-cyan-400 text-sm font-semibold mb-1">✨ Stella AI</p>}
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs mt-1 opacity-60">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="mb-6">
                <p className="text-yellow-400 flex items-center gap-2 mb-3">
                  💡 {language === 'en' ? 'Quick questions:' : 'Questions rapides:'}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {quickQuestions[language].map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(question)}
                      className="text-left px-4 py-3 rounded-lg border border-purple-600 bg-purple-600/10 hover:bg-purple-600/20 text-white transition-all"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-3 items-center bg-[#1a0f2e] rounded-full p-2 border border-purple-900/30">
              <button className="p-3 text-gray-400 hover:text-white transition-all">
                <Mic size={20} />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={language === 'en' ? 'Ask me anything about aerospace...' : 'Posez-moi toute question sur l\'aérospatiale...'}
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 px-2"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-all disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Stella Profile */}
            <div className="bg-gradient-to-r from-[#1a0f2e] to-[#2d1b4e] rounded-2xl p-6 border border-cyan-500/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-xl">✨</div>
                <div>
                  <h3 className="font-bold text-lg">{stellaProfile[language].title}</h3>
                  <p className="text-cyan-400 text-sm">● {stellaProfile[language].status}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">{stellaProfile[language].bio}</p>
            </div>

            {/* I Can Help With */}
            <div className="bg-gradient-to-r from-[#1a0f2e] to-[#2d1b4e] rounded-2xl p-6 border border-purple-900/30">
              <h3 className="font-bold text-lg mb-4">
                {language === 'en' ? 'I Can Help With:' : 'Je peux aider avec:'}
              </h3>
              <div className="space-y-4">
                {helpCategories[language].map((category, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm">{category.title}</h4>
                      <p className="text-gray-400 text-xs">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}