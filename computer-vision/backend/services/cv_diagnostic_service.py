"""
Computer Vision Diagnostic Service with GPT-4o Vision
Uses OpenAI's Vision API to actually analyze images instead of random heuristics
"""
import cv2
import numpy as np
import base64
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

class ComponentDiagnosticService:
    def __init__(self):
        """Initialize diagnostic service with GPT-4o Vision"""
        self.api_key = os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            print("[WARNING] OPENAI_API_KEY not found. CV diagnosis will use fallback mode.")
            self.client = None
        else:
            self.client = OpenAI(api_key=self.api_key)
        
        # Error database for structured responses
        self.error_database = {
            'rocket': {
                'misaligned_fins': {
                    'severity': 'HIGH',
                    'description': "Rocket fins are misaligned or asymmetrical.",
                    'solution': "Realign fins to be symmetrical. Check structural attachment points.",
                    'consequence': "Flight instability, trajectory deviation, potential mission failure"
                },
                'missing_nose_cone': {
                    'severity': 'CRITICAL',
                    'description': "Nose cone is missing or damaged.",
                    'solution': "Replace nose cone immediately. Ensure aerodynamic integrity.",
                    'consequence': "Extreme drag, overheating during ascent, structural failure"
                },
                'fuel_leak': {
                    'severity': 'CRITICAL',
                    'description': "Potential fuel leak detected.",
                    'solution': "Inspect fuel lines and seals. Perform pressure test.",
                    'consequence': "Fire hazard, loss of thrust, mission abort required"
                }
            },
            'rocket_engine': {
                'nozzle_damage': {
                    'severity': 'HIGH',
                    'description': "Engine nozzle shows damage or erosion.",
                    'solution': "Inspect for cracks. Replace if integrity compromised.",
                    'consequence': "Reduced thrust efficiency, vectoring issues"
                },
                'combustion_chamber_crack': {
                    'severity': 'CRITICAL',
                    'description': "Potential crack in combustion chamber.",
                    'solution': "Immediate replacement required. Ultrasonic inspection needed.",
                    'consequence': "Catastrophic engine failure, explosion risk"
                }
            },
            'satellite': {
                'solar_panel_misalignment': {
                    'severity': 'MEDIUM',
                    'description': "Solar panels not properly aligned or deployed.",
                    'solution': "Check deployment mechanism. Verify sun-tracking system.",
                    'consequence': "Reduced power generation, shortened mission life"
                },
                'antenna_orientation_error': {
                    'severity': 'HIGH',
                    'description': "Communication antenna not properly oriented.",
                    'solution': "Recalibrate attitude control. Verify pointing accuracy.",
                    'consequence': "Communication loss, data transmission failure"
                }
            },
            'command_module': {
                'window_damage': {
                    'severity': 'CRITICAL',
                    'description': "Viewport or window shows cracks or damage.",
                    'solution': "Immediate replacement. Test pressure seal.",
                    'consequence': "Depressurization risk, crew safety compromise"
                }
            },
            'solar_panel': {
                'cell_degradation': {
                    'severity': 'MEDIUM',
                    'description': "Solar cells show degradation or damage.",
                    'solution': "Replace damaged cells. Test power output.",
                    'consequence': "Reduced power generation capacity"
                }
            }
        }
    
    def diagnose_component(self, image):
        """
        Diagnose component using GPT-4o Vision
        
        Args:
            image: OpenCV image (numpy array)
            
        Returns:
            dict: Complete diagnosis with errors and recommendations
        """
        if self.client is None:
            return self._fallback_diagnosis(image)
        
        try:
            # Convert image to base64
            _, buffer = cv2.imencode('.png', image)
            image_base64 = base64.b64encode(buffer).decode('utf-8')
            
            # Call GPT-4o Vision
            print("[INFO] Calling GPT-4o Vision for image analysis...")
            
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": """You are an aerospace engineer analyzing spacecraft components for defects.

Analyze the image and identify:
1. What component(s) you see (rocket, satellite, solar panel, engine, command module, etc.)
2. Any visible defects, misalignments, or issues
3. The severity of issues (OK, MEDIUM, HIGH, CRITICAL)

Respond ONLY in this exact JSON format:
{
  "component_detected": "name of main component",
  "confidence": 0.0-1.0,
  "status": "OK" or "WARNING" or "ERROR" or "CRITICAL",
  "errors_found": [
    {
      "type": "short_name_of_error",
      "severity": "MEDIUM/HIGH/CRITICAL",
      "description": "what you see wrong",
      "visual_evidence": "describe what in the image shows this"
    }
  ],
  "overall_assessment": "brief summary"
}

If the image shows a well-built spacecraft with no issues, return status "OK" with empty errors_found array."""
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Analyze this spacecraft component for defects and structural issues."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/png;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=1000,
                temperature=0.3  # Lower temp for more consistent technical analysis
            )
            
            # Parse GPT-4o response
            import json
            raw_response = response.choices[0].message.content.strip()
            
            # Remove markdown code blocks if present
            if raw_response.startswith('```json'):
                raw_response = raw_response.split('```json')[1].split('```')[0].strip()
            elif raw_response.startswith('```'):
                raw_response = raw_response.split('```')[1].split('```')[0].strip()
            
            diagnosis = json.loads(raw_response)
            
            print(f"[SUCCESS] GPT-4o Vision identified: {diagnosis['component_detected']}")
            print(f"[SUCCESS] Status: {diagnosis['status']}, Errors: {len(diagnosis.get('errors_found', []))}")
            
            # Enhance errors with solutions from database
            enhanced_errors = []
            component_name = diagnosis['component_detected'].lower().replace(' ', '_')
            
            for error in diagnosis.get('errors_found', []):
                error_type = error['type'].lower().replace(' ', '_')
                
                # Try to match with database
                if component_name in self.error_database:
                    if error_type in self.error_database[component_name]:
                        db_error = self.error_database[component_name][error_type]
                        enhanced_errors.append({
                            'type': error['type'],
                            'severity': error.get('severity', db_error['severity']),
                            'description': error['description'],
                            'solution': db_error['solution'],
                            'consequence': db_error['consequence'],
                            'visual_evidence': error.get('visual_evidence', '')
                        })
                        continue
                
                # If no database match, use GPT's analysis with generic solution
                enhanced_errors.append({
                    'type': error['type'],
                    'severity': error.get('severity', 'MEDIUM'),
                    'description': error['description'],
                    'solution': f"Inspect and address: {error['description']}",
                    'consequence': "Potential operational impact",
                    'visual_evidence': error.get('visual_evidence', '')
                })
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                diagnosis['component_detected'],
                enhanced_errors
            )
            
            return {
                'component_detected': diagnosis['component_detected'],
                'confidence': diagnosis.get('confidence', 0.85),
                'category': self._get_category(diagnosis['component_detected']),
                'status': diagnosis['status'],
                'errors_found': enhanced_errors,
                'overall_assessment': diagnosis.get('overall_assessment', ''),
                'recommendations': recommendations,
                'bounding_box': self._get_bounding_box(image)
            }
            
        except Exception as e:
            print(f"[ERROR] GPT-4o Vision failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return self._fallback_diagnosis(image)
    
    def _fallback_diagnosis(self, image):
        """Fallback when GPT-4o Vision unavailable"""
        print("[INFO] Using fallback diagnosis (no GPT-4o Vision)")
        
        return {
            'component_detected': 'Unknown Component',
            'confidence': 0.5,
            'category': 'Unknown',
            'status': 'WARNING',
            'errors_found': [{
                'type': 'api_unavailable',
                'severity': 'MEDIUM',
                'description': 'Computer Vision API is unavailable. Cannot perform detailed analysis.',
                'solution': 'Configure OPENAI_API_KEY in .env file to enable GPT-4o Vision analysis.',
                'consequence': 'Limited diagnostic capability'
            }],
            'overall_assessment': '⚠️ Computer Vision requires OpenAI API key. Add OPENAI_API_KEY to .env for full diagnostics.',
            'recommendations': [
                'Add OPENAI_API_KEY to computer-vision/backend/.env',
                'Restart Flask backend',
                'Try diagnosis again'
            ],
            'bounding_box': self._get_bounding_box(image)
        }
    
    def _get_category(self, component_name):
        """Map component to category"""
        mapping = {
            'rocket': 'Launch Vehicle',
            'rocket engine': 'Propulsion',
            'turbofan engine': 'Propulsion',
            'satellite': 'Spacecraft',
            'command module': 'Control',
            'solar panel': 'Energy',
            'fuel tank': 'Storage',
            'communication': 'Systems',
            'antenna': 'Communication'
        }
        return mapping.get(component_name.lower(), 'Unknown')
    
    def _generate_recommendations(self, component_name, errors):
        """Generate action recommendations"""
        if not errors:
            return [
                'Continue with pre-flight checklist',
                'Monitor component during operation',
                'Schedule routine maintenance'
            ]
        
        recommendations = []
        severities = [e['severity'] for e in errors]
        
        if 'CRITICAL' in severities:
            recommendations.append("🚨 GROUND/ABORT mission immediately")
            recommendations.append("📞 Contact engineering team for emergency inspection")
        elif 'HIGH' in severities:
            recommendations.append("⏸️ Delay launch until repairs completed")
            recommendations.append("🔍 Perform comprehensive system check")
        
        # Add specific solutions
        for error in errors[:3]:  # Top 3 errors
            recommendations.append(f"[{error['severity']}] {error['solution']}")
        
        recommendations.append("📝 Document all findings in maintenance log")
        
        return recommendations
    
    def _get_bounding_box(self, image):
        """Get image bounding box"""
        height, width = image.shape[:2]
        return {
            'x': 0,
            'y': 0,
            'width': width,
            'height': height
        }


# Test
if __name__ == "__main__":
    service = ComponentDiagnosticService()
    
    print("="*60)
    print("Testing GPT-4o Vision Diagnostic Service")
    print("="*60)
    
    # Test with dummy image
    dummy_image = np.random.randint(0, 255, (640, 480, 3), dtype=np.uint8)
    result = service.diagnose_component(dummy_image)
    
    print(f"\nComponent: {result['component_detected']}")
    print(f"Status: {result['status']}")
    print(f"Assessment: {result['overall_assessment']}")
    print(f"\nErrors found: {len(result['errors_found'])}")
    for error in result['errors_found']:
        print(f"  - [{error['severity']}] {error['type']}: {error['description']}")
    
    print(f"\nRecommendations:")
    for rec in result['recommendations']:
        print(f"  • {rec}")
    
    print("\n✅ Diagnostic service initialized!")
