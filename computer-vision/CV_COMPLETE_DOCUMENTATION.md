# 🚀 AeroVerse Computer Vision System - Documentation Complète

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du système](#architecture-du-système)
3. [Modèles utilisés](#modèles-utilisés)
4. [Structure des fichiers](#structure-des-fichiers)
5. [Composants principaux](#composants-principaux)
6. [Flux de travail](#flux-de-travail)
7. [API Endpoints](#api-endpoints)
8. [Base de données des composants](#base-de-données-des-composants)
9. [Guide d'utilisation](#guide-dutilisation)

---

## 🎯 Vue d'ensemble

Le système Computer Vision d'AeroVerse permet d'identifier automatiquement des objets spatiaux (planètes, satellites, fusées) dans une simulation Unity 3D en utilisant l'intelligence artificielle.

### Objectifs du projet
- ✅ Identifier automatiquement les composants spatiaux par analyse d'image
- ✅ Fournir des informations détaillées sur chaque objet
- ✅ Intégrer avec le Builder pour assembler des vaisseaux spatiaux
- ✅ Offrir une expérience éducative interactive

### Technologies utilisées
- **Backend:** Flask (Python)
- **Vision AI:** GPT-4o Vision (OpenAI)
- **Machine Learning:** TensorFlow/Keras (modèle custom)
- **Traitement d'image:** OpenCV, PIL
- **Frontend:** React + TypeScript

---

## 🏗️ Architecture du Système

```
┌─────────────────┐
│  React Frontend │ (Capture d'écran Unity)
└────────┬────────┘
         │ HTTP POST /api/cv/identify-component
         ▼
┌─────────────────────────┐
│   Flask Backend API     │
│  (aeroverse_app.py)     │
└────────┬────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ GPT-4o  │ │ TensorFlow   │
│ Vision  │ │ Model (H5)   │
└─────────┘ └──────────────┘
    │            │
    └────┬───────┘
         ▼
   ┌─────────────┐
   │ Component   │
   │ Database    │
   └─────────────┘
```

---

## 🤖 Modèles Utilisés

### 1. **GPT-4o Vision** (OpenAI) - Modèle Principal

**Fichier:** `services/openai_service.py`

**Fonctionnement:**
- Reçoit une image capturée de la simulation Unity
- Analyse visuellement l'objet au centre de l'image
- Identifie le composant spatial en comparant avec une liste prédéfinie
- Retourne le nom, la catégorie et un niveau de confiance

**Avantages:**
- ✅ Très précis avec de bonnes images
- ✅ Comprend le contexte visuel
- ✅ Pas besoin d'entraînement

**Inconvénients:**
- ❌ Coûte des crédits API OpenAI (~$0.01 par identification)
- ❌ Nécessite une connexion internet
- ❌ Performances variables selon la qualité de l'image

**Prompt utilisé:**
```python
"""
You are an aerospace component identification AI. 
Analyze the image and identify the aerospace object at the CENTER.

Available objects:
- Planets: Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune
- Spacecraft: Rocket, Satellite
- Phenomena: Black Hole

Return JSON ONLY:
{
  "component_id": "earth",
  "component_name": "Earth", 
  "category": "Planet",
  "confidence": 0.95,
  "reasoning": "Blue sphere with visible clouds and continents"
}
"""
```

---

### 2. **TensorFlow Custom Model** (aerospace_classifier.h5)

**Fichier:** `models/aerospace_classifier.h5` (11.4 MB)

**Type:** CNN (Convolutional Neural Network)

**Architecture estimée:**
```
Input (224x224x3 RGB image)
    ↓
Conv2D + ReLU + MaxPooling
    ↓
Conv2D + ReLU + MaxPooling
    ↓
Flatten
    ↓
Dense (512 neurons)
    ↓
Dropout (0.5)
    ↓
Output (15 classes - softmax)
```

**Classes disponibles** (`models/class_labels.json`):
```json
{
  "0": "sun",
  "1": "mercury",
  "2": "venus",
  "3": "earth",
  "4": "mars",
  "5": "jupiter",
  "6": "saturn",
  "7": "uranus",
  "8": "neptune",
  "9": "rocket",
  "10": "rocket_engine",
  "11": "satellite",
  "12": "turbofan_engine",
  "13": "black_hole",
  "14": "eris"
}
```

**Données d'entraînement:** 
- **Source:** `training_data/` (15 dossiers)
- **Images par classe:** Variable (estimé 50-200 images par catégorie)
- **Provenance:** Images NASA, rendus 3D, simulations

**Utilisation actuelle:** 
⚠️ **NON UTILISÉ dans la version actuelle** - GPT-4o Vision a été préféré pour sa précision supérieure

**Pour l'utiliser:**
```python
from services.cv_service import CVService

cv = CVService()
result = cv.predict_component(image_path)
# Returns: {'class': 'earth', 'confidence': 0.89}
```

---

## 📁 Structure des Fichiers

```
computer-vision/backend/
│
├── aeroverse_app.py              # 🔴 API Flask principale (35 KB)
├── app.py                        # Archive ancienne version
├── app_diagnostic.py             # Outil de diagnostic
├── api_test.py                   # Tests API
│
├── data/
│   └── Component database.json   # Base de données des composants
│
├── models/
│   ├── aerospace_classifier.h5   # Modèle TensorFlow (11.4 MB)
│   └── class_labels.json         # Labels des classes
│
├── services/
│   ├── openai_service.py         # 🔴 Service GPT-4o Vision (14 KB)
│   ├── cv_service.py             # Service TensorFlow (7.8 KB)
│   ├── cv_diagnostic_service.py  # Diagnostics avancés
│   └── Database service.py       # Gestion base de données
│
├── training_data/                # 🔴 Dataset d'entraînement
│   ├── sun/
│   ├── earth/
│   ├── mars/
│   ├── jupiter/
│   ├── saturn/
│   ├── rocket/
│   ├── satellite/
│   ├── black_hole/
│   └── ... (15 catégories)
│
├── uploads/                      # Images capturées temporaires
│
├── utils/
│   ├── Image processing.txt      # Documentation traitement d'images
│   └── Model loader.py           # Chargeur de modèles
│
├── requirements.txt              # Dépendances Python
├── cv_requirements.txt           # Dépendances CV spécifiques
└── .env                          # Clé API OpenAI (SECRET!)
```

---

## 🧩 Composants Principaux

### 1. **aeroverse_app.py** (API Flask)

**Rôle:** Point d'entrée principal, gère toutes les requêtes HTTP

**Endpoints principaux:**

#### `POST /api/cv/identify-component`
Identifie un composant à partir d'une image capturée.

**Requête:**
```json
{
  "image": "base64_encoded_image_data",
  "format": "png"
}
```

**Réponse:**
```json
{
  "component_id": "earth",
  "component_name": "Earth",
  "category": "Planet",
  "emoji": "🌍",
  "confidence": 0.95,
  "detection_method": "gpt4o_vision",
  "description": "The third planet from the Sun...",
  "technical_specs": ["Diameter: 12,742 km", ...],
  "fun_facts": ["Earth is the densest planet...", ...],
  "can_add_to_builder": false,
  "builder_component_id": null
}
```

#### `GET /api/components/<component_id>`
Récupère les informations d'un composant par ID (utilisé par Unity Raycast).

**Réponse:** Même structure que ci-dessus, mais `confidence: 1.0` et `detection_method: "unity_raycast"`

---

### 2. **openai_service.py** (Service GPT-4o)

**Classe principale:** `OpenAIVisionService`

**Fonctions clés:**

#### `identify_component(image_base64: str) -> dict`
Identifie un composant spatial via GPT-4o Vision.

**Paramètres:**
- `image_base64`: Image encodée en base64

**Retour:**
```python
{
    'component_id': 'earth',
    'component_name': 'Earth',
    'category': 'Planet',
    'confidence': 0.95,
    'reasoning': 'Blue sphere with clouds...'
}
```

**Processus interne:**
```python
1. Décode l'image base64
2. Construit le prompt avec liste des objets disponibles
3. Envoie à OpenAI API (gpt-4o model)
4. Parse la réponse JSON
5. Valide le component_id
6. Retourne les résultats
```

**Gestion d'erreurs:**
- ✅ Retry automatique (3 tentatives)
- ✅ Validation JSON
- ✅ Fallback vers "unknown" si échec
- ✅ Logging détaillé

---

### 3. **cv_service.py** (Service TensorFlow)

**Classe principale:** `CVService`

**Fonctions clés:**

#### `load_model()`
Charge le modèle TensorFlow H5 et les labels.

#### `preprocess_image(image_path: str) -> np.array`
Prépare l'image pour le modèle:
```python
1. Charge l'image
2. Redimensionne à 224x224 pixels
3. Normalise les pixels (0-255 → 0-1)
4. Expand dimensions pour batch
```

#### `predict_component(image_path: str) -> dict`
Prédit le composant avec le modèle TensorFlow.

**Retour:**
```python
{
    'class': 'earth',
    'confidence': 0.89,
    'all_predictions': {
        'earth': 0.89,
        'mars': 0.05,
        'jupiter': 0.03,
        ...
    }
}
```

---

### 4. **Component Database** (COMPONENT_DB)

**Structure complète dans `aeroverse_app.py`:**

```python
COMPONENT_DB = {
    'earth': {
        'component_name': 'Earth',
        'component_id': 'earth',
        'category': 'Planet',
        'emoji': '🌍',
        'description': 'The third planet from the Sun...',
        'how_to_use': 'In simulations, Earth serves as...',
        'technical_specs': [
            'Diameter: 12,742 km',
            'Mass: 5.97 × 10²⁴ kg',
            'Orbital Period: 365.25 days',
            ...
        ],
        'fun_facts': [
            'Earth is the densest planet...',
            '70% covered by water',
            ...
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    # ... 8 autres planètes + satellites + fusées
}
```

**Composants disponibles:**
- ✅ 9 planètes (Sun → Neptune)
- ✅ Satellites
- ✅ Fusées
- ✅ Black Hole
- ✅ Unknown (fallback)

---

## 🔄 Flux de Travail Complet

### Méthode 1: GPT-4o Vision (actuelle)

```
1. User clique sur Unity → React capture screenshot
   └─> html2canvas() génère PNG

2. Frontend envoie image au backend
   └─> POST /api/cv/identify-component
   └─> Body: { image: "base64..." }

3. Backend décode l'image
   └─> base64 → bytes → PIL Image

4. OpenAI Service analyse
   └─> GPT-4o Vision reçoit l'image
   └─> Prompt: "Identifie cet objet spatial"
   └─> Réponse: { component_id: "earth", confidence: 0.95 }

5. Backend enrichit avec COMPONENT_DB
   └─> Ajoute description, specs, fun facts

6. Backend retourne JSON complet
   └─> Frontend affiche popup avec infos
```

---

### Méthode 2: Unity Raycast (nouvelle - en développement)

```
1. User clique sur Unity → Unity Raycast détecte objet 3D
   └─> Physics.Raycast() retourne GameObject.name

2. Unity envoie nom exact à React
   └─> SendObjectToReact("Earth")
   └─> window.onUnityObjectClicked("Earth")

3. React mappe Unity → Component ID
   └─> mapUnityNameToComponentId("Earth") → "earth"

4. React appelle backend
   └─> GET /api/components/earth

5. Backend retourne infos
   └─> COMPONENT_DB['earth']
   └─> confidence: 1.0 (100% précis!)

6. Frontend affiche popup
```

---

## 📊 Comparaison des Méthodes

| Critère | GPT-4o Vision | Unity Raycast | TensorFlow Custom |
|---------|---------------|---------------|-------------------|
| **Précision** | 80-90% | 100% | 70-85% |
| **Coût** | ~$0.01/call | Gratuit | Gratuit |
| **Vitesse** | 2-5 sec | <0.1 sec | 0.5-1 sec |
| **Internet requis** | ✅ Oui | ❌ Non | ❌ Non |
| **Zoom/Rotation** | ❌ Sensible | ✅ Robuste | ❌ Sensible |
| **Setup** | Simple | Complexe (Unity) | Moyen |

---

## 🔑 Variables d'Environnement (.env)

```bash
# OpenAI API Key (OBLIGATOIRE pour GPT-4o)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Configuration Flask
FLASK_ENV=development
FLASK_DEBUG=True

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:5173
```

---

## 📦 Installation & Démarrage

### Prérequis
```bash
Python 3.8+
pip
virtualenv
```

### Installation

```bash
cd computer-vision/backend

# Créer environnement virtuel
python -m venv venv

# Activer (Windows)
venv\Scripts\activate

# Installer dépendances
pip install -r cv_requirements.txt

# Configurer .env
echo "OPENAI_API_KEY=your_key_here" > .env
```

### Démarrage

```bash
# Activer venv
venv\Scripts\activate

# Lancer Flask
python aeroverse_app.py

# Server démarre sur http://127.0.0.1:5000
```

---

## 🧪 Tests

### Test manuel API

```bash
# Test endpoint santé
curl http://localhost:5000/api/health

# Test identification (avec image base64)
curl -X POST http://localhost:5000/api/cv/identify-component \
  -H "Content-Type: application/json" \
  -d '{"image": "iVBORw0KGgo...", "format": "png"}'

# Test récupération composant
curl http://localhost:5000/api/components/earth
```

---

## 🐛 Problèmes Connus & Solutions

### Problème 1: Images trop sombres
**Symptôme:** GPT-4o retourne "Unknown" ou "Black Hole"
**Cause:** Crop capture trop d'espace noir
**Solution:** Augmenter taille du crop (1000x1000px minimum)

### Problème 2: Détection imprécise avec zoom
**Symptôme:** Mauvaise identification quand caméra bouge
**Cause:** Détection basée sur position fixe
**Solution:** Utiliser Unity Raycast au lieu de GPT-4o

### Problème 3: Erreur OpenAI API
**Symptôme:** `Error: OpenAI API key not found`
**Solution:** Vérifier `.env` avec `OPENAI_API_KEY=sk-proj-...`

---

## 📈 Améliorations Futures

### Court terme
- [ ] Implémenter Unity Raycast (en cours)
- [ ] Améliorer calibration détection position
- [ ] Ajouter plus de composants (planètes naines, lunes)

### Moyen terme
- [ ] Fine-tuner le modèle TensorFlow
- [ ] Ajouter détection multi-objets
- [ ] Cache des résultats pour économiser API calls

### Long terme
- [ ] Modèle custom on-device (pas d'API)
- [ ] Détection temps réel (vidéo stream)
- [ ] AR intégration (mobile)

---

## 📝 Changelog

### v2.0 (27 Avril 2026)
- ✅ Ajout Unity Raycast bridge
- ✅ Endpoint GET /api/components/<id>
- ✅ Mapper Unity → Component IDs
- ✅ Documentation complète

### v1.5 (25 Avril 2026)
- ✅ Migration vers GPT-4o Vision
- ✅ Amélioration prompts
- ✅ COMPONENT_DB étendue

### v1.0 (Mars 2026)
- ✅ Version initiale
- ✅ Modèle TensorFlow custom
- ✅ API Flask basique

---

## 👥 Contributeurs

- **Nourhene** - Développement principal
- **Claude (Anthropic)** - Architecture & debugging

---

## 📄 License

Projet académique ENSI 2025/2026 - Usage éducatif uniquement

---

**Dernière mise à jour:** 27 Avril 2026
