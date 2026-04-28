# 🛠️ AeroVerse Platform - Guide Développeur

## 📦 Stack Technique

### Frontend
- **Framework** : React 18 avec TypeScript
- **Routing** : React Router v6
- **Styling** : Tailwind CSS + Shadcn UI
- **Build** : Vite 5
- **Icons** : Lucide React

### Backend (À développer)
- **API REST** : Flask/FastAPI (Python)
- **AI** : OpenAI API
- **Vision** : Computer Vision Pipeline (Python)
- **3D** : Unity WebGL Export
- **Database** : PostgreSQL

### DevOps
- **Version Control** : Git
- **Package Manager** : npm
- **Build Tool** : Vite

## 🚀 Démarrage Rapide

### Installation
```bash
# Cloner le repository
git clone <repo-url>

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le serveur sera disponible sur `http://localhost:5173` (ou le prochain port disponible).

### Build pour production
```bash
npm run build
npm run preview
```

## 📁 Structure du Projet

```
src/
├── App.tsx                      # Composant racine
├── main.tsx                     # Point d'entrée
├── routes.ts                    # Configuration des routes
├── Navigation.tsx               # Barre de navigation
├── Hero.tsx                     # Section héro
├── Stats.tsx                    # Statistiques
├── Features.tsx                 # Fonctionnalités
├── CTA.tsx                      # Call-to-Action
├── Footer.tsx                   # Pied de page
│
├── pages/                       # Pages principales
│   ├── Home.tsx
│   ├── Authentication.tsx
│   ├── UserProfile.tsx
│   ├── Administration.tsx
│   ├── VirtualMuseum.tsx
│   ├── SpaceSimulation.tsx
│   ├── Builder.tsx              # (Page principale - À étendre)
│   ├── Education.tsx            # (Page principale - À étendre)
│   ├── AITutor.tsx              # (Page principale - À étendre)
│   │
│   ├── builder/                 # Sous-modules Builder
│   │   ├── BuilderModuleHub.tsx (Intègre les onglets)
│   │   ├── ComponentLibrary.tsx
│   │   ├── AssemblyZone.tsx
│   │   └── ComputerVisionCapture.tsx
│   │
│   ├── education/               # Sous-modules Éducation
│   │   ├── EducationModuleHub.tsx (Intègre les onglets)
│   │   ├── CourseCatalog.tsx
│   │   ├── InteractiveLessons.tsx
│   │   └── QuizEvaluation.tsx
│   │
│   ├── ai-tutor/                # Sous-modules AI Tutor
│   │   ├── AITutorModuleHub.tsx (Intègre les onglets)
│   │   ├── ChatInterface.tsx
│   │   └── LanguageSelection.tsx
│   │
│   ├── simulation/              # Sous-modules Simulation (À créer)
│   └── styles/
│       └── globals.css
│
├── components/
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   └── ui/                      # Composants Shadcn réutilisables
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── tabs.tsx
│       └── ...
│
└── index.html                   # Point d'entrée HTML

config files:
├── vite.config.ts              # Configuration Vite
├── tailwind.config.ts           # Configuration Tailwind
├── postcss.config.js            # Configuration PostCSS
├── tsconfig.json                # Configuration TypeScript
└── package.json                 # Dépendances et scripts
```

## 🔄 Patterns & Conventions

### Organisation des Modules
Chaque module principal (Builder, Education, AI Tutor) suit cette structure :

```typescript
// BuilderModuleHub.tsx (Page hub avec onglets)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ComponentLibrary } from "./ComponentLibrary";
import { AssemblyZone } from "./AssemblyZone";

export function BuilderModuleHub() {
  return (
    <Tabs defaultValue="library">
      <TabsList>
        <TabsTrigger value="library">Bibliothèque</TabsTrigger>
        <TabsTrigger value="assembly">Zone d'Assemblage</TabsTrigger>
      </TabsList>
      <TabsContent value="library">
        <ComponentLibrary />
      </TabsContent>
      <TabsContent value="assembly">
        <AssemblyZone />
      </TabsContent>
    </Tabs>
  );
}

// ComponentLibrary.tsx (Sous-composant)
export function ComponentLibrary() {
  // Logique spécifique
}
```

### Convention de Nommage
- **Pages** : PascalCase (ex: `UserProfile.tsx`)
- **Composants** : PascalCase (ex: `ComponentLibrary.tsx`)
- **Fichiers utilitaires** : camelCase (ex: `utils.ts`)
- **Variables** : camelCase (ex: `selectedComponent`)
- **Constantes** : UPPER_SNAKE_CASE (ex: `MAX_FILE_SIZE`)

### Imports
```typescript
// Imports dans l'ordre :
// 1. React et libs externes
import { useState } from "react";
import { Link } from "react-router-dom";

// 2. Composants internes
import { Navigation } from "../Navigation";
import { Card } from "../components/ui/card";

// 3. Icônes
import { User, Settings } from "lucide-react";
```

## 🎨 Système de Couleurs

### Palette Tailwind Utilisée
```typescript
// Primaire (Purple)
bg-purple-900, bg-purple-600, text-purple-200

// Secondaire (Pink)
bg-pink-600, bg-pink-900

// Admin (Blue)
bg-blue-600, bg-blue-900, text-blue-400

// Admin (Blue foncé)
bg-slate-700, bg-slate-800

// Accents
bg-cyan-500, bg-green-600, bg-red-600

// Background
bg-[#0a0518]  // Navy très foncé
```

### Classe de Carte Standard
```typescript
<Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6 hover:border-purple-500/50 transition-all">
  {/* Contenu */}
</Card>
```

## 🔌 Intégration APIs

### Structure recommandée pour les appels API
```typescript
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Services/api.ts
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter le token d'authentification
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### OpenAI Integration (À faire)
```typescript
// Exemple d'intégration
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: userMessage }],
  }),
});
```

## 📊 État Global (À mettre en place)

### Recommandation : Zustand ou Context API

```typescript
// store/useAuthStore.ts
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (email, password) => {
    // Logique login
  },
  logout: () => set({ user: null }),
}));
```

## 🧪 Testing (À mettre en place)

### Configuration recommandée
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Exemple de test
```typescript
import { render, screen } from '@testing-library/react';
import { Home } from '../pages/Home';

describe('Home Page', () => {
  it('renders navigation', () => {
    render(<Home />);
    expect(screen.getByText('AeroVerse')).toBeInTheDocument();
  });
});
```

## 🔑 Variables d'Environnement

Créer un fichier `.env.local` :
```env
VITE_API_URL=http://localhost:8000
VITE_OPENAI_API_KEY=sk-...
VITE_APP_NAME=AeroVerse
```

Accès en React :
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🚢 Déploiement

### Vercel (Recommandé pour un projet React)
```bash
npm install -g vercel
vercel
```

### Docker (Alternative)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📚 Ressources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Vite Docs](https://vitejs.dev/)

## 🤝 Contribution

### Guidelines
1. Créer une branche : `git checkout -b feature/ma-feature`
2. Committes : `git commit -am 'Ajout de ma feature'`
3. Push : `git push origin feature/ma-feature`
4. Pull Request sur `main`

### Code Quality
- Utiliser ESLint + Prettier (à configurer)
- Tester avant de committer
- Commenter le code complexe

---

**Dernière mise à jour** : Février 2026  
**Maintaineur** : Nour Mrabet
