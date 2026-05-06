# 🎮 AeroVerse — Unity 3D Application

This module contains the **Unity project**, the core of the AeroVerse experience. It handles the 3D virtual museum, navigation, interactive hotspots, educational modules, and the rocket assembly simulation.

---

## 📁 Structure

```
unity/Assets/
├── Scripts/
│   ├── Player/
│   │   ├── PlayerController.cs       # Keyboard & mouse navigation
│   │   └── CameraController.cs       # First/third-person camera
│   │
│   ├── UI/
│   │   ├── MainMenuManager.cs         # Main menu logic
│   │   ├── HUDManager.cs              # In-experience HUD
│   │   └── AITutorPanel.cs            # Chat panel for AI tutor
│   │
│   ├── Hotspots/
│   │   ├── HotspotManager.cs          # Manages all hotspot interactions
│   │   ├── HotspotTrigger.cs          # Raycast-based click detection
│   │   └── InfoPanelController.cs     # Displays component information
│   │
│   ├── Modules/
│   │   ├── ModuleLoader.cs            # Loads content from backend API
│   │   ├── QuizManager.cs             # Quiz logic and scoring
│   │   └── ProgressTracker.cs         # Sends progress to backend
│   │
│   └── Assembly/
│       ├── AssemblyManager.cs         # Rocket assembly game logic
│       ├── ComponentDragDrop.cs       # Drag and drop mechanics
│       └── FeedbackController.cs      # Real-time feedback display
│
├── Scenes/
│   ├── MainMenu.unity                 # Entry point
│   ├── MainMuseum.unity               # Virtual aerospace museum
│   ├── RocketAssembly.unity           # Assembly simulation
│   └── ModuleViewer.unity             # Educational content viewer
│
├── Prefabs/
│   ├── Hotspot.prefab
│   ├── InfoPanel.prefab
│   ├── RocketPart.prefab
│   └── AITutorPanel.prefab
│
├── Materials/
└── Models/                            # Optimized low-poly 3D assets
    ├── Engines/
    ├── Rockets/
    ├── Satellites/
    └── Museum/
```

---

## 🔧 Technical Details

### Engine & Configuration

- **Unity Version:** 2021.3 LTS
- **Render Pipeline:** Universal Render Pipeline (URP)
- **Target Platform:** Windows 10/11 (PC Standalone)
- **Scripting Language:** C#
- **Min Hardware:** Intel i5, 8GB RAM, GTX 1050

### Key Systems

#### 🕹️ Navigation System
- First-person keyboard & mouse controls (WASD + mouse look)
- Collision detection via Unity Colliders
- Minimap overlay for museum orientation
- Scene transition with async loading to minimize wait time

#### 📍 Hotspot System
- Raycast-based click detection on 3D models
- Animated visual indicators (glow + pulse effect)
- Info panels with component name, description, and specs
- Fetches live content from the backend API

#### 🤖 AI Tutor Integration
- Chat panel accessible from any scene via HUD button
- Communicates with `/api/tutor/ask` Flask endpoint
- Supports French and English
- Session-aware conversation display

#### 🚀 Rocket Assembly Simulation
- Drag-and-drop component placement system
- Sequence validation against correct assembly order
- Immediate visual + audio feedback (green highlight / red shake)
- Help system: progressive hints on request

### Performance Guidelines

- All 3D models must be **low-to-medium poly** (max 10k triangles per object)
- Textures compressed to **1024x1024** or less
- LOD (Level of Detail) applied to all major models
- Scene loading targets: **< 5 seconds**
- Frame rate target: **60 FPS** on recommended hardware, **30 FPS** minimum

---

## 🚀 Getting Started

1. Install **Unity Hub** and add Unity version **2021.3 LTS**
2. Clone the repository and open the `unity/` folder as a Unity project
3. Open `Assets/Scenes/MainMenu.unity`
4. Configure backend URL in `Assets/Scripts/Config/APIConfig.cs`:
   ```csharp
   public static string BaseURL = "http://localhost:5000/api";
   ```
5. Press **Play** in Unity Editor to test

---

## 📋 Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| C# Classes | PascalCase | `HotspotManager` |
| Methods | PascalCase | `LoadModuleContent()` |
| Variables | camelCase | `playerSpeed` |
| Constants | UPPER_SNAKE | `MAX_COMPONENTS` |
| Scene files | PascalCase | `MainMuseum.unity` |
| Prefabs | PascalCase + .prefab | `RocketPart.prefab` |
