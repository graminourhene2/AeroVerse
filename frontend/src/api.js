const BASE_URL = "http://127.0.0.1:5000/api";

// Fonction utilitaire pour les requêtes
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Ajouter le token JWT si disponible
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Retourner l'erreur du serveur au lieu de la lancer
      return { error: data.error || `Error ${response.status}`, status: response.status };
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    // Retourner l'erreur de connexion
    return { error: "Connection error. Please check your internet and try again." };
  }
};

export const api = {
  // ========== AUTHENTIFICATION ==========
  register: (data) =>
    fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data) =>
    fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => fetchAPI("/auth/me"),

  // ========== MODULES EDUCATIFS ==========
  getModules: () =>
    fetchAPI("/modules/", {
      method: "GET",
    }),

  getModule: (id) =>
    fetchAPI(`/modules/${id}`, {
      method: "GET",
    }),

  saveProgress: (data) =>
    fetchAPI("/modules/progress", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProgress: () =>
    fetchAPI("/modules/progress", {
      method: "GET",
    }),

  // ========== VAISSEAUX SPATIAUX ==========
  saveSpacecraft: (data) =>
    fetchAPI("/spacecraft/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getSpacecrafts: () =>
    fetchAPI("/spacecraft/", {
      method: "GET",
    }),

  deleteSpacecraft: (id) =>
    fetchAPI(`/spacecraft/${id}`, {
      method: "DELETE",
    }),

  // ========== CHAT / TUTEUR IA ==========
  sendMessage: (message, history = []) =>
    fetchAPI("/chat/", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    }),

  getChatHistory: () =>
    fetchAPI("/chat/history", {
      method: "GET",
    }),

  // ========== VISION PAR ORDINATEUR ==========
  analyzeImage: (imageData) =>
    fetchAPI("/cv/analyze", {
      method: "POST",
      body: JSON.stringify({ image: imageData }),
    }),

  // ========== QUIZ ==========
  getQuiz: (moduleId) =>
    fetchAPI(`/quiz/${moduleId}`, {
      method: "GET",
    }),

  submitQuiz: (moduleId, answers) =>
    fetchAPI(`/quiz/${moduleId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  // ========== UTILISATEUR ==========
  getUserProfile: () =>
    fetchAPI("/auth/me", {
      method: "GET",
    }),

  updateUserProfile: (data) =>
    fetchAPI("/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // ========== GESTION DES ERREURS ==========
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  },

  isAuthenticated: () => !!localStorage.getItem("token"),

  getToken: () => localStorage.getItem("token"),
};