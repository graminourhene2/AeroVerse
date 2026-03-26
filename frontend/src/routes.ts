import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Authentication } from "./pages/Authentication";
import { UserProfile } from "./pages/UserProfile";
import { SpaceSimulationNew } from "./pages/SpaceSimulationNew";
import { BuilderNew } from "./pages/BuilderNew";
import { EducationNew } from "./pages/EducationNew";
import { AITutorNew } from "./pages/AITutorNew";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  // Access Layer
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/authentication",
    Component: Authentication,
  },
  {
    path: "/auth",
    Component: Authentication,
  },
  {
    path: "/profile",
    Component: UserProfile,
  },
  
  // Main Modules
  {
    path: "/simulation",
    Component: SpaceSimulationNew,
  },
  {
    path: "/builder",
    Component: BuilderNew,
  },
  {
    path: "/education",
    Component: EducationNew,
  },
  {
    path: "/ai-tutor",
    Component: AITutorNew,
  },

  // 404 Fallback
  {
    path: "*",
    Component: NotFound,
  },
]);
