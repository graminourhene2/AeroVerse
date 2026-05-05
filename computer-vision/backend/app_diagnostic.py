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
