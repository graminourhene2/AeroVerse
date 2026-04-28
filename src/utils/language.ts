// Language management system
type Language = 'en' | 'fr';

export const getLanguage = (): Language => {
  const stored = localStorage.getItem('language');
  return (stored as Language) || 'en';
};

export const setLanguage = (lang: Language) => {
  localStorage.setItem('language', lang);
  // Force page reload to apply language
  window.location.reload();
};

export const t = (key: string): string => {
  const language = getLanguage();
  const translations: Record<string, Record<Language, string>> = {
    // Navigation
    'nav.home': { en: 'Home', fr: 'Accueil' },
    'nav.simulation': { en: 'Simulation', fr: 'Simulation' },
    'nav.builder': { en: 'Builder', fr: 'Builder' },
    'nav.education': { en: 'Education', fr: 'Éducation' },
    'nav.ai-tutor': { en: 'AI Tutor', fr: 'Tuteur IA' },
    'nav.profile': { en: 'Profile', fr: 'Profil' },
    'nav.admin': { en: 'Admin', fr: 'Admin' },
    'nav.login': { en: 'Sign In', fr: 'Connexion' },

    // Auth
    'auth.login': { en: 'Sign In', fr: 'Connexion' },
    'auth.signup': { en: 'Sign Up', fr: 'S\'inscrire' },
    'auth.email': { en: 'Email', fr: 'Email' },
    'auth.password': { en: 'Password', fr: 'Mot de passe' },
    'auth.fullname': { en: 'Full Name', fr: 'Nom complet' },
    'auth.signin_desc': { en: 'Sign in to your AeroVerse account', fr: 'Connectez-vous à votre compte AeroVerse' },
    'auth.signup_desc': { en: 'Create an account to get started', fr: 'Créez un compte pour commencer' },

    // Buttons
    'btn.back': { en: 'Back', fr: 'Retour' },
    'btn.next': { en: 'Next', fr: 'Suivant' },
    'btn.save': { en: 'Save', fr: 'Sauvegarder' },
    'btn.cancel': { en: 'Cancel', fr: 'Annuler' },
    'btn.delete': { en: 'Delete', fr: 'Supprimer' },
    'btn.submit': { en: 'Submit', fr: 'Envoyer' },

    // Messages
    'msg.welcome': { en: 'Welcome', fr: 'Bienvenue' },
    'msg.loading': { en: 'Loading...', fr: 'Chargement...' },
    'msg.error': { en: 'Error', fr: 'Erreur' },
    'msg.success': { en: 'Success', fr: 'Succès' },
  };

  return translations[key]?.[language] || key;
};
