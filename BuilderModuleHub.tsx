import { Navigation } from "../../Navigation";
import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ComponentLibrary } from "./ComponentLibrary";
import { AssemblyZone } from "./AssemblyZone";
import { ComputerVisionCapture } from "./ComputerVisionCapture";
import { Package, Zap, Camera } from "lucide-react";

export function BuilderModuleHub() {
  return (
    <div className="min-h-screen bg-[#0a0518]">
      <Navigation />
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Module: Builder (Constructeur)
            </h1>
            <p className="text-purple-200/70">
              Interface de conception de vaisseaux spatiaux avec Computer Vision intégré
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="library" className="w-full">
            <TabsList className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-1 mb-8">
              <TabsTrigger value="library" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Bibliothèque
              </TabsTrigger>
              <TabsTrigger value="assembly" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Zone d'Assemblage
              </TabsTrigger>
              <TabsTrigger value="vision" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Vision
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library">
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
                <ComponentLibrary />
              </Card>
            </TabsContent>

            <TabsContent value="assembly">
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
                <AssemblyZone />
              </Card>
            </TabsContent>

            <TabsContent value="vision">
              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
                <ComputerVisionCapture />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
