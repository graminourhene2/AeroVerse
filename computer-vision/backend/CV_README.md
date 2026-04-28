# AeroVerse Computer Vision Module

Deep learning-based component identification and defect diagnosis system for aerospace education.

## Features

### 1. Component Identification
- Detects 13 classes: 9 planets + 4 aerospace components
- Uses CNN (MobileNetV2 transfer learning)
- Returns confidence scores and technical specifications

### 2. Defect Diagnosis
- Analyzes Unity screenshots for component defects
- Identifies errors and provides solutions
- Severity levels: OK, WARNING, ERROR, CRITICAL

## Supported Classes

**Planets:**
- Earth, Mars, Jupiter, Saturn, Venus, Mercury, Neptune, Uranus, Eris

**Aerospace Components:**
- Rocket, Rocket Engine, Satellite, Turbofan Engine

## Installation

### Prerequisites
- Python 3.11+ (Python 3.14 not supported by TensorFlow yet)
- 4GB RAM minimum
- 2GB disk space for models

### Setup

```bash
cd computer-vision/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Training the Model

```bash
# Place training images in training_data/
# Organize as: training_data/category_name/*.jpg

# Run training
python train_model.py

# Model will be saved to models/aerospace_classifier.h5
```

## Usage

### Start the Backend

```bash
cd computer-vision/backend
venv\Scripts\activate  # Windows
python app.py
```

Server runs on: `http://localhost:5000`

### API Endpoints

#### 1. Component Identification
**POST** `/api/cv/analyze-image`

Request:
```json
{
  "image": "base64_encoded_image",
  "format": "jpg"
}
```

Response:
```json
{
  "component_name": "Mars",
  "category": "Planet",
  "confidence": 0.95,
  "description": "Mars is the fourth planet...",
  "technical_specs": ["Diameter: 6,779 km", ...]
}
```

#### 2. Defect Diagnosis
**POST** `/api/cv/diagnose`

Request:
```json
{
  "image": "base64_screenshot_from_unity",
  "format": "png"
}
```

Response:
```json
{
  "component_detected": "rocket",
  "status": "CRITICAL",
  "errors_found": [
    {
      "type": "misaligned_fins",
      "severity": "HIGH",
      "description": "...",
      "solution": "...",
      "consequence": "..."
    }
  ],
  "recommendations": [...]
}
```

#### 3. Health Check
**GET** `/api/health`

Response:
```json
{
  "status": "healthy",
  "cv_model_loaded": true,
  "openai_configured": true
}
```

## Unity Integration

See `unity/Assets/Scripts/ComponentDiagnostic.cs` for Unity client implementation.

### Quick Unity Setup

1. Add `ComponentDiagnostic.cs` to your Unity project
2. Create UI elements (Button, TextMeshPro panels)
3. Attach script and configure API URL: `http://localhost:5000`
4. Click "Run Diagnostic" button in Play Mode

## Model Training

### Data Collection
- Minimum 30 images per category
- Recommended: 50-100 images per category
- Use high-quality, clear images
- Vary angles, lighting, backgrounds

### Training Performance
- With 50 images/category: ~70-80% accuracy
- With 100 images/category: ~85-90% accuracy
- Training time: 10-30 minutes (CPU)

## Project Structure

```
computer-vision/
├── backend/
│   ├── services/
│   │   ├── cv_service.py              # Component detection
│   │   ├── openai_service.py          # Description generation
│   │   └── cv_diagnostic_service.py   # Defect diagnosis
│   ├── models/
│   │   ├── aerospace_classifier.h5    # Trained CNN model
│   │   └── class_labels.json          # Class mappings
│   ├── app.py                         # Flask API
│   ├── train_model.py                 # Model training script
│   └── requirements.txt
└── training_data/
    ├── Earth/
    ├── Mars/
    ├── rocket/
    └── ...
```

## Troubleshooting

### Model not loading
- Ensure `models/aerospace_classifier.h5` exists
- Run `python train_model.py` to train model

### Low accuracy (<70%)
- Collect more training images (50+ per category)
- Improve image quality
- Increase epochs in `train_model.py`

### OpenAI errors
- Check API key in `.env`
- System falls back to static descriptions if API fails

### Unity connection fails
- Ensure Flask is running on port 5000
- Check firewall settings
- Try `http://127.0.0.1:5000` instead of `localhost`

## Team

**ENSI 2025/2026**
- Nour Mrabet (Scrum Master)
- Wiem Ben El Haj Salah Bouhdid
- Nourhene Grami

**Supervisor:** Ms. Aroua Hedhli

## License

Educational project for ENSI.
