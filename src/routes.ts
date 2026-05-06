import { createBrowserRouter } from "react-router-dom";
import { createElement } from "react";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Authentication } from "./pages/Authentication";
import { UserProfile } from "./pages/UserProfile";
import { SpaceSimulationNew } from "./pages/SpaceSimulationNew";
import { BuilderNew } from "./pages/BuilderNew";
import { BuilderHub } from "./pages/BuilderHub";
import { EducationNew } from "./pages/EducationNew";
import { AITutorNew } from "./pages/AITutorNew";
import { Administration } from "./pages/Administration";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

function protect(Component: React.ComponentType) {
  return function ProtectedPage() {
    return createElement(ProtectedRoute, null, createElement(Component));
  };
}

export const router = createBrowserRouter([
  // Public pages
  { path: "/",            Component: Home },
  { path: "/about",       Component: About },
  { path: "/authentication", Component: Authentication },
  { path: "/auth",        Component: Authentication },

  // Public education & AI tutor — no authentication needed
  { path: "/education",   Component: EducationNew },
  { path: "/ai-tutor",    Component: AITutorNew },

  // Protected pages — require sign-in
  { path: "/admin",       Component: protect(Administration) },
  { path: "/profile",     Component: protect(UserProfile) },
  { path: "/simulation",  Component: protect(SpaceSimulationNew) },
  { path: "/builder",          Component: protect(BuilderHub) },
  { path: "/builder/:type",    Component: protect(BuilderNew) },

  // 404
  { path: "*", Component: NotFound },
], { basename: import.meta.env.BASE_URL });
