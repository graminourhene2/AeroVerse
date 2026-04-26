import { Navigation } from "../../Navigation";
import { Card } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ChatInterface } from "./ChatInterface";
import { LanguageSelection } from "./LanguageSelection";
import { MessageCircle, Globe, Clock } from "lucide-react";

export function AITutorModuleHub() {
  return (
    <div className="min-h-screen bg-[#0a0518]">
      <Navigation />
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Module: Tuteur IA
            </h1>
            <p className="text-purple-200/70">
              Assistant intelligent multilingue pour accompagnement personnalisé
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-1 mb-8">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Langue
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Historique
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
                <ChatInterface />
              </Card>
            </TabsContent>

            <TabsContent value="language">
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
                <LanguageSelection />
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Historique des Conversations</h2>
                  <p className="text-purple-200/70">Vos conversations précédentes apparaîtront ici</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
