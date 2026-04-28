from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
from services.cv_service import AerospaceComponentDetector
from services.openai_service import DescriptionGenerator
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize services
cv_detector = AerospaceComponentDetector()
description_gen = DescriptionGenerator()

# Configuration
UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/cv/analyze-image', methods=['POST'])
def analyze_image():
    """
    Main endpoint for analyzing aerospace/astronomy images
    
    Supports: 9 Planets + 4 Aerospace Components = 13 classes
    """
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode Base64 image
        image_base64 = data['image']
        image_format = data.get('format', 'png')
        
        image_bytes = base64.b64decode(image_base64)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({'error': 'Failed to decode image'}), 400
        
        # Save image (for debugging)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        image_path = os.path.join(UPLOAD_FOLDER, f'captured_{timestamp}.{image_format}')
        cv2.imwrite(image_path, image)
        
        print(f"[INFO] Image received and saved: {image_path}")
        print(f"[INFO] Image shape: {image.shape}")
        
        # Detect object
        detection_result = cv_detector.detect_component(image)
        
        if detection_result is None:
            return jsonify({
                'error': 'No object detected',
                'component_name': 'Unknown',
                'confidence': 0.0
            }), 200
        
        # Generate description
        description = description_gen.generate_description(
            component_name=detection_result['component_name'],
            category=detection_result['category']
        )
        
        # Get 3D model reference
        model_reference = get_3d_model_reference(detection_result['component_name'])
        
        # Get technical specs
        technical_specs = get_technical_specs(detection_result['component_name'])
        
        # Build response
        response = {
            'component_name': detection_result['component_name'],
            'category': detection_result['category'],
            'confidence': float(detection_result['confidence']),
            'description': description,
            'model_3d_reference': model_reference,
            'bounding_box': detection_result['bounding_box'],
            'technical_specs': technical_specs,
            'image_path': image_path
        }
        
        print(f"[SUCCESS] Object detected: {detection_result['component_name']} "
              f"(confidence: {detection_result['confidence']:.2f})")
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


def get_3d_model_reference(component_name):
    """Mapping between component name and 3D model"""
    model_mapping = {
        # Aerospace Components
        'turbofan_engine': 'models/turbofan_engine.obj',
        'rocket_engine': 'models/rocket_engine.obj',
        'satellite': 'models/satellite_basic.obj',
        'rocket': 'models/rocket.obj',
        
        # Planets
        'Earth': 'models/planets/earth.obj',
        'Mars': 'models/planets/mars.obj',
        'Jupiter': 'models/planets/jupiter.obj',
        'Saturn': 'models/planets/saturn.obj',
        'Venus': 'models/planets/venus.obj',
        'Mercury': 'models/planets/mercury.obj',
        'Neptune': 'models/planets/neptune.obj',
        'Uranus': 'models/planets/uranus.obj',
        'Eris': 'models/planets/eris.obj'
    }
    return model_mapping.get(component_name, 'models/default_object.obj')


def get_technical_specs(component_name):
    """Get technical specifications"""
    specs_database = {
        # ========== AEROSPACE COMPONENTS ==========
        'turbofan_engine': [
            'Thrust: 20,000-25,000 lbf',
            'Bypass ratio: 9:1',
            'Fan diameter: 78 inches',
            'Weight: 4,500 kg',
            'Max temperature: 1,500°C'
        ],
        'rocket_engine': [
            'Thrust: 190,000 lbf',
            'Specific impulse: 311s (sea level)',
            'Propellant: LOX/RP-1',
            'Burn time: 162 seconds',
            'Gimbal range: ±10 degrees'
        ],
        'satellite': [
            'Orbit: LEO/GEO',
            'Power: Solar panels (2-5 kW)',
            'Mass: 500-6,000 kg',
            'Communication: X-band, Ka-band',
            'Lifespan: 10-15 years'
        ],
        'rocket': [
            'Height: 70 meters',
            'Diameter: 3.7 meters',
            'Payload to LEO: 22,800 kg',
            'Payload to GTO: 8,300 kg',
            'Number of engines: 9'
        ],
        
        # ========== PLANETS ==========
        'Earth': [
            'Diameter: 12,742 km',
            'Mass: 5.97 × 10²⁴ kg',
            'Distance from Sun: 149.6 million km (1 AU)',
            'Orbital period: 365.25 days',
            'Day length: 24 hours',
            'Moons: 1 (Moon)',
            'Atmosphere: 78% N₂, 21% O₂'
        ],
        'Mars': [
            'Diameter: 6,779 km',
            'Mass: 6.39 × 10²³ kg',
            'Distance from Sun: 227.9 million km (1.52 AU)',
            'Orbital period: 687 Earth days',
            'Day length: 24h 37m',
            'Moons: 2 (Phobos, Deimos)',
            'Atmosphere: 95% CO₂'
        ],
        'Jupiter': [
            'Diameter: 139,820 km',
            'Mass: 1.898 × 10²⁷ kg',
            'Distance from Sun: 778.5 million km (5.2 AU)',
            'Orbital period: 11.86 Earth years',
            'Day length: 9h 56m',
            'Moons: 95 known',
            'Composition: 90% H₂, 10% He'
        ],
        'Saturn': [
            'Diameter: 116,460 km',
            'Mass: 5.683 × 10²⁶ kg',
            'Distance from Sun: 1.43 billion km (9.5 AU)',
            'Orbital period: 29.46 Earth years',
            'Day length: 10h 33m',
            'Moons: 146 known',
            'Ring thickness: ~10 meters'
        ],
        'Venus': [
            'Diameter: 12,104 km',
            'Mass: 4.867 × 10²⁴ kg',
            'Distance from Sun: 108.2 million km (0.72 AU)',
            'Orbital period: 225 Earth days',
            'Day length: 243 Earth days (retrograde)',
            'Surface temp: 465°C',
            'Atmosphere: 96% CO₂'
        ],
        'Mercury': [
            'Diameter: 4,879 km',
            'Mass: 3.285 × 10²³ kg',
            'Distance from Sun: 57.9 million km (0.39 AU)',
            'Orbital period: 88 Earth days',
            'Day length: 59 Earth days',
            'Surface temp: -173°C to 427°C',
            'No moons or rings'
        ],
        'Neptune': [
            'Diameter: 49,244 km',
            'Mass: 1.024 × 10²⁶ kg',
            'Distance from Sun: 4.5 billion km (30 AU)',
            'Orbital period: 164.8 Earth years',
            'Day length: 16h 6m',
            'Moons: 16 known',
            'Wind speeds: Up to 2,100 km/h'
        ],
        'Uranus': [
            'Diameter: 50,724 km',
            'Mass: 8.681 × 10²⁵ kg',
            'Distance from Sun: 2.87 billion km (19.2 AU)',
            'Orbital period: 84 Earth years',
            'Day length: 17h 14m',
            'Axial tilt: 98 degrees',
            'Moons: 28 known'
        ],
        'Eris': [
            'Diameter: ~2,326 km',
            'Mass: 1.66 × 10²² kg',
            'Distance from Sun: 96.3 AU (average)',
            'Orbital period: 558 Earth years',
            'Day length: ~26 hours',
            'Moons: 1 (Dysnomia)',
            'Classification: Dwarf Planet'
        ]
    }
    return specs_database.get(component_name, ['No specifications available'])


@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'cv_model_loaded': cv_detector.is_model_loaded(),
        'openai_configured': description_gen.is_configured(),
        'supported_classes': len(cv_detector.class_labels) if cv_detector.class_labels else 0
    }), 200


if __name__ == '__main__':
    print("="*50)
    print("AeroVerse - Astronomy & Aerospace API")
    print("="*50)
    print(f"CV Model loaded: {cv_detector.is_model_loaded()}")
    print(f"OpenAI configured: {description_gen.is_configured()}")
    if cv_detector.class_labels:
        print(f"Supported classes ({len(cv_detector.class_labels)}):")
        for idx, name in cv_detector.class_labels.items():
            print(f"  {idx}: {name}")
    print("Starting Flask server...")
    print("="*50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)





from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
from services.cv_diagnostic_service import ComponentDiagnosticService
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize diagnostic service
diagnostic_service = ComponentDiagnosticService()

# Configuration
UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/api/cv/diagnose', methods=['POST'])
def diagnose_component():
    """
    NEW ENDPOINT: Diagnose aerospace component from Unity screenshot
    
    Input (JSON):
    {
        "image": "base64_encoded_screenshot",
        "format": "png"
    }
    
    Output (JSON):
    {
        "component_detected": "rocket",
        "confidence": 0.95,
        "category": "Launch Vehicle",
        "status": "CRITICAL" | "ERROR" | "WARNING" | "OK",
        "errors_found": [
            {
                "type": "misaligned_fins",
                "severity": "HIGH",
                "description": "...",
                "solution": "...",
                "consequence": "..."
            }
        ],
        "overall_assessment": "...",
        "recommendations": ["...", "..."]
    }
    """
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode Base64 image
        image_base64 = data['image']
        image_format = data.get('format', 'png')
        
        image_bytes = base64.b64decode(image_base64)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({'error': 'Failed to decode image'}), 400
        
        # Save screenshot for debugging
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        image_path = os.path.join(UPLOAD_FOLDER, f'unity_screenshot_{timestamp}.{image_format}')
        cv2.imwrite(image_path, image)
        
        print(f"[INFO] Unity screenshot received: {image_path}")
        print(f"[INFO] Image shape: {image.shape}")
        
        # Run diagnosis
        diagnosis = diagnostic_service.diagnose_component(image)
        
        # Add screenshot path to response
        diagnosis['screenshot_path'] = image_path
        diagnosis['timestamp'] = timestamp
        
        # Log result
        status_emoji = {
            'OK': '✅',
            'WARNING': '⚠️',
            'ERROR': '⛔',
            'CRITICAL': '🚨'
        }
        
        print(f"[DIAGNOSIS] {status_emoji.get(diagnosis['status'], '❓')} {diagnosis['component_detected']}")
        print(f"[DIAGNOSIS] Status: {diagnosis['status']}")
        print(f"[DIAGNOSIS] Errors: {len(diagnosis['errors_found'])}")
        
        return jsonify(diagnosis), 200
        
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({
        'status': 'healthy',
        'diagnostic_service': 'active',
        'cv_model_loaded': diagnostic_service.detector.is_model_loaded()
    }), 200


if __name__ == '__main__':
    print("="*50)
    print("AeroVerse - Component Diagnostic API")
    print("="*50)
    print("Endpoints:")
    print("  POST /api/cv/diagnose - Diagnose component from screenshot")
    print("  GET  /api/health      - Health check")
    print("="*50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
