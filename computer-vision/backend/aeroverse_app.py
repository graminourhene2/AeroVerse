"""
AeroVerse Computer Vision Backend - HYBRID SYSTEM
Combines Unity Raycast precision with GPT-4o Vision intelligence
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
import os
import json
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

KNOWN_CLASSES = [
    "earth", "mars", "jupiter", "saturn", "venus", "mercury", "neptune", "uranus", 
    "sun", "black_hole",
    "lunar_gateway", "progress_ms", "orion_nebula", "dsn_antenna", "acrimsat"
]

# ══════════════════════════════════════════════════════════════════════════════
# COMPONENT DATABASE - COMPLETE
# ══════════════════════════════════════════════════════════════════════════════
COMPONENT_DB = {
    'earth': {
        'component_name': 'Earth',
        'component_id': 'earth',
        'category': 'Planet',
        'emoji': '🌍',
        'description': 'The third planet from the Sun and the only astronomical object known to harbor life.',
        'how_to_use': 'Reference point for orbital mechanics, atmospheric studies, and climate modeling.',
        'technical_specs': [
            'Diameter: 12,742 km',
            'Mass: 5.97 × 10²⁴ kg',
            'Orbital Period: 365.25 days',
            'Atmosphere: 78% Nitrogen, 21% Oxygen'
        ],
        'fun_facts': [
            'Earth is the densest planet in the solar system',
            '70% of Earth\'s surface is covered by water',
            'Earth\'s axis is tilted at 23.5°, causing seasons'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'mars': {
        'component_name': 'Mars',
        'component_id': 'mars',
        'category': 'Planet',
        'emoji': '🔴',
        'description': 'The fourth planet from the Sun, known as the Red Planet due to iron oxide on its surface.',
        'how_to_use': 'Ideal for exploration missions and colonization studies.',
        'technical_specs': [
            'Diameter: 6,779 km',
            'Mass: 6.39 × 10²³ kg',
            'Orbital Period: 687 days',
            'Atmosphere: 95% Carbon Dioxide'
        ],
        'fun_facts': [
            'Mars has two small moons: Phobos and Deimos',
            'A day on Mars is 24.6 hours',
            'Mars has the largest dust storms in the solar system'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'jupiter': {
        'component_name': 'Jupiter',
        'component_id': 'jupiter',
        'category': 'Planet',
        'emoji': '🪐',
        'description': 'The largest planet in the solar system, a gas giant with distinctive bands.',
        'how_to_use': 'Study gas giant atmospheres and moon systems.',
        'technical_specs': [
            'Diameter: 139,820 km',
            'Mass: 1.90 × 10²⁷ kg',
            'Orbital Period: 11.86 years',
            'Atmosphere: 90% Hydrogen, 10% Helium'
        ],
        'fun_facts': [
            'Jupiter has 95 known moons',
            'The Great Red Spot is a storm larger than Earth',
            'Jupiter rotates faster than any other planet'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'saturn': {
        'component_name': 'Saturn',
        'component_id': 'saturn',
        'category': 'Planet',
        'emoji': '🪐',
        'description': 'The sixth planet from the Sun, famous for its spectacular ring system.',
        'how_to_use': 'Study ring dynamics and gas giant atmospheres.',
        'technical_specs': [
            'Diameter: 116,460 km',
            'Mass: 5.68 × 10²⁶ kg',
            'Orbital Period: 29.46 years',
            'Atmosphere: 96% Hydrogen, 3% Helium'
        ],
        'fun_facts': [
            'Saturn has 146 known moons',
            'Saturn is the least dense planet',
            'Saturn\'s rings are mostly ice particles'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'sun': {
        'component_name': 'Sun',
        'component_id': 'sun',
        'category': 'Star',
        'emoji': '☀️',
        'description': 'The star at the center of our solar system.',
        'how_to_use': 'Essential for stellar physics and energy production studies.',
        'technical_specs': [
            'Diameter: 1,391,000 km',
            'Mass: 1.989 × 10³⁰ kg',
            'Surface Temperature: 5,500°C',
            'Age: 4.6 billion years'
        ],
        'fun_facts': [
            'The Sun is 109 times wider than Earth',
            'One million Earths could fit inside the Sun',
            'The Sun will eventually become a red giant'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'mercury': {
        'component_name': 'Mercury',
        'component_id': 'mercury',
        'category': 'Planet',
        'emoji': '☿️',
        'description': 'The smallest and innermost planet with extreme temperature variations.',
        'how_to_use': 'Study extreme environments and tidal locking.',
        'technical_specs': [
            'Diameter: 4,879 km',
            'Orbital Period: 88 days',
            'Surface Temperature: -173°C to 427°C'
        ],
        'fun_facts': [
            'Mercury has no moons',
            'A day on Mercury lasts 176 Earth days'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'venus': {
        'component_name': 'Venus',
        'component_id': 'venus',
        'category': 'Planet',
        'emoji': '♀️',
        'description': 'The second planet with extreme temperatures due to greenhouse effect.',
        'how_to_use': 'Study greenhouse effects and atmospheric pressure.',
        'technical_specs': [
            'Diameter: 12,104 km',
            'Surface Temperature: 462°C',
            'Atmosphere: 96.5% Carbon Dioxide'
        ],
        'fun_facts': [
            'Venus rotates backwards',
            'A day on Venus is longer than its year'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'neptune': {
        'component_name': 'Neptune',
        'component_id': 'neptune',
        'category': 'Planet',
        'emoji': '🔵',
        'description': 'The eighth planet, a dark cold ice giant with extreme winds.',
        'how_to_use': 'Study ice giant atmospheres and weather systems.',
        'technical_specs': [
            'Diameter: 49,244 km',
            'Orbital Period: 164.8 years',
            'Winds: Up to 2,100 km/h'
        ],
        'fun_facts': [
            'Neptune was discovered mathematically',
            'A year on Neptune is 165 Earth years'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'uranus': {
        'component_name': 'Uranus',
        'component_id': 'uranus',
        'category': 'Planet',
        'emoji': '🔷',
        'description': 'The seventh planet, unique for rotating on its side.',
        'how_to_use': 'Study tilted rotations and ice giant compositions.',
        'technical_specs': [
            'Diameter: 50,724 km',
            'Orbital Period: 84 years',
            'Axis Tilt: 98° (sideways)'
        ],
        'fun_facts': [
            'Uranus rotates on its side',
            'Uranus has 27 known moons'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'black_hole': {
        'component_name': 'Black Hole',
        'component_id': 'black_hole',
        'category': 'Celestial Object',
        'emoji': '⚫',
        'description': 'A region of spacetime where gravity prevents even light from escaping.',
        'how_to_use': 'Study extreme gravity and spacetime warping.',
        'technical_specs': [
            'Event Horizon: Point of no return',
            'Singularity: Infinite density core',
            'Hawking Radiation: Theoretical emission'
        ],
        'fun_facts': [
            'Time slows down near a black hole',
            'Black holes can rotate near light speed',
            'Supermassive black holes exist in most galaxies'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'lunar_gateway': {
        'component_name': 'Lunar Gateway Core Module',
        'component_id': 'lunar_gateway',
        'category': 'Space Station',
        'emoji': '🛰️',
        'description': 'Lunar orbital station serving as a relay between Earth and the Moon.',
        'how_to_use': 'Staging point for lunar missions and deep space exploration.',
        'technical_specs': [
            'Orbit: NRHO (Near-Rectilinear Halo Orbit)',
            'Modular design with habitation modules',
            'Supports crewed and uncrewed operations'
        ],
        'fun_facts': [
            'Part of NASA\'s Artemis Program',
            'Prepares for future Mars missions',
            'Assembled progressively in cislunar space'
        ],
        'can_add_to_builder': True,
        'builder_component_id': 'lunar_gateway'
    },
    'progress_ms': {
        'component_name': 'Progress MS Cargo Spacecraft',
        'component_id': 'progress_ms',
        'category': 'Cargo Vehicle',
        'emoji': '📦',
        'description': 'Russian automated cargo spacecraft for station resupply.',
        'how_to_use': 'Autonomous docking for fuel, food, and equipment delivery.',
        'technical_specs': [
            'Cargo capacity: ~2,500 kg',
            'Automatic KURS docking system',
            'Can boost station orbit'
        ],
        'fun_facts': [
            'Main ISS resupply vehicle (Russian segment)',
            'Burns up with trash after mission',
            'Based on Soyuz spacecraft technology'
        ],
        'can_add_to_builder': True,
        'builder_component_id': 'progress_ms'
    },
    'orion_nebula': {
        'component_name': 'Orion Nebula (M42)',
        'component_id': 'orion_nebula',
        'category': 'Nebula',
        'emoji': '🌌',
        'description': 'A stellar nursery where new stars are born.',
        'how_to_use': 'Study star formation and stellar evolution.',
        'technical_specs': [
            'Distance: ~1,344 light-years',
            'Diameter: ~24 light-years',
            'Temperature: ~10,000 K (ionized regions)'
        ],
        'fun_facts': [
            'Visible as fuzzy patch in Orion constellation',
            'Contains the Trapezium star cluster',
            'Studied extensively by Hubble'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'dsn_antenna': {
        'component_name': 'Deep Space Network 70m Antenna',
        'component_id': 'dsn_antenna',
        'category': 'Ground Infrastructure',
        'emoji': '📡',
        'description': 'Massive parabolic antenna for deep space communication.',
        'how_to_use': 'Communicate with distant spacecraft and probes.',
        'technical_specs': [
            'Diameter: 70 meters',
            'Frequencies: S, X, and Ka bands',
            'Locations: Goldstone, Madrid, Canberra'
        ],
        'fun_facts': [
            'Can detect signals fainter than light bulb on Mars',
            'Three global sites ensure 24/7 coverage',
            'Critical for all deep space missions'
        ],
        'can_add_to_builder': True,
        'builder_component_id': 'dsn_antenna'
    },
    'acrimsat': {
        'component_name': 'ACRIMSAT',
        'component_id': 'acrimsat',
        'category': 'Scientific Satellite',
        'emoji': '🛰️',
        'description': 'Solar observation satellite measuring total solar irradiance.',
        'how_to_use': 'Monitor solar energy output for climate studies.',
        'technical_specs': [
            'Launch: 1999',
            'Orbit: Low Earth Orbit (~700-800 km)',
            'Mission: Measure Total Solar Irradiance'
        ],
        'fun_facts': [
            'Tracks solar variations with extreme precision',
            'Data used for climate change studies',
            'Part of ACRIM mission series'
        ],
        'can_add_to_builder': True,
        'builder_component_id': 'acrimsat'
    },
    'unknown': {
        'component_name': 'Unknown Object',
        'component_id': 'unknown',
        'category': 'Unknown',
        'emoji': '❓',
        'description': 'Unable to identify this object.',
        'how_to_use': 'N/A',
        'technical_specs': [],
        'fun_facts': [],
        'can_add_to_builder': False,
        'builder_component_id': None
    }
}

# ══════════════════════════════════════════════════════════════════════════════
# HYBRID SYSTEM - ROUTE FOR UNITY RAYCAST
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/components/<component_id>', methods=['GET'])
def get_component_by_name(component_id):
    """
    HYBRID ROUTE 1: Unity Raycast detected an object by name
    This is FAST and ACCURATE - use this whenever Unity knows the name
    """
    component_id = component_id.lower().strip()
    
    print(f"[HYBRID] Unity Raycast detected: {component_id}")
    
    if component_id not in COMPONENT_DB:
        print(f"[HYBRID] ❌ Component not in database: {component_id}")
        return jsonify({
            'error': f'Component not found: {component_id}',
            'component_id': 'unknown',
            'component_name': 'Unknown Object',
            'category': 'Unknown',
            'emoji': '❓',
            'description': 'This object is not in our database.',
            'how_to_use': 'N/A',
            'technical_specs': [],
            'fun_facts': [],
            'can_add_to_builder': False,
            'builder_component_id': None,
            'detection_method': 'unity_raycast'
        }), 404
    
    component_data = COMPONENT_DB[component_id].copy()
    component_data['detection_method'] = 'unity_raycast'
    component_data['confidence'] = 1.0  # 100% accurate via Unity
    
    print(f"[HYBRID] ✅ Returning: {component_data['component_name']}")
    
    return jsonify(component_data), 200


# ══════════════════════════════════════════════════════════════════════════════
# BUILDER VALIDATION ENDPOINT
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/builder/validate', methods=['POST'])
def validate_builder_assembly():
    """
    Builder validation - Check if components are correctly assembled
    """
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        image_base64 = data['image']
        expected_components = data.get('expected_components', [])
        assembly_type = data.get('assembly_type', 'satellite')  # satellite, station, probe
        
        print(f"[BUILDER] Validating {assembly_type} assembly...")
        print(f"[BUILDER] Expected components: {expected_components}")
        
        # GPT-4o analyzes the assembly
        system_prompt = f"""You are an aerospace engineer validating spacecraft assembly.

The user is building a {assembly_type} with these components: {', '.join(expected_components)}

Analyze the image and check:
1. Are all required components present?
2. Are they correctly positioned?
3. Are there any assembly errors?
4. Is the structure stable?

Return JSON with:
{{
  "valid": true/false,
  "score": 0-100,
  "components_found": ["list", "of", "detected"],
  "missing_components": ["list", "if", "any"],
  "errors": ["specific", "error", "descriptions"],
  "suggestions": ["improvement", "recommendations"],
  "overall_feedback": "Brief assessment"
}}"""

        user_prompt = f"Validate this {assembly_type} assembly. Expected components: {', '.join(expected_components)}"
        
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            max_tokens=1000,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{image_base64}",
                                "detail": "high"
                            }
                        },
                        {"type": "text", "text": user_prompt}
                    ]
                }
            ]
        )
        
        raw = response.choices[0].message.content.strip()
        
        # Clean JSON
        if "```" in raw:
            lines = raw.split("\n")
            lines = [l for l in lines if not l.strip().startswith("```")]
            raw = "\n".join(lines).strip()
        
        result = json.loads(raw)
        
        print(f"[BUILDER] Valid: {result.get('valid')}, Score: {result.get('score')}")
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"[BUILDER] ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
# HEALTH CHECK
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/health', methods=['GET'])
def health_check():
    api_key_set = bool(os.getenv('OPENAI_API_KEY'))
    return jsonify({
        'status': 'healthy',
        'system': 'HYBRID (Unity Raycast + GPT-4o Vision)',
        'openai_configured': api_key_set,
        'total_components': len(COMPONENT_DB),
        'simulation_components': len([c for c in COMPONENT_DB.values() if not c.get('can_add_to_builder')]),
        'builder_components': len([c for c in COMPONENT_DB.values() if c.get('can_add_to_builder')]),
        'supported_classes': KNOWN_CLASSES
    }), 200
# ═══════════════════════════════════════════════════════════════
# SPACECRAFT BUILDER ENDPOINTS
# ═══════════════════════════════════════════════════════════════

# Simulons une base de données en mémoire (remplacez par une vraie DB)
spacecrafts_db = []
spacecraft_id_counter = 1

@app.route('/api/spacecraft/', methods=['GET'])
def get_spacecrafts():
    """Récupère tous les spacecraft sauvegardés"""
    return jsonify(spacecrafts_db), 200

@app.route('/api/spacecraft/', methods=['POST'])
def save_spacecraft():
    """Sauvegarde un nouveau spacecraft"""
    global spacecraft_id_counter
    
    data = request.json
    
    if not data.get('name') or not data.get('components'):
        return jsonify({'error': 'Missing name or components'}), 400
    
    new_spacecraft = {
        'id': spacecraft_id_counter,
        'name': data['name'],
        'components': data['components'],
        'created_at': datetime.now().isoformat()
    }
    
    spacecrafts_db.append(new_spacecraft)
    spacecraft_id_counter += 1
    
    return jsonify(new_spacecraft), 201

@app.route('/api/spacecraft/<int:spacecraft_id>', methods=['DELETE'])
def delete_spacecraft(spacecraft_id):
    """Supprime un spacecraft"""
    global spacecrafts_db
    
    spacecrafts_db = [s for s in spacecrafts_db if s['id'] != spacecraft_id]
    
    return jsonify({'message': 'Spacecraft deleted'}), 200

# ═══════════════════════════════════════════════════════════════
# UNITY BUILDER VALIDATION ENDPOINT
# ═══════════════════════════════════════════════════════════════

@app.route('/api/builder/validate-assembly', methods=['POST'])
def validate_assembly():
    """Valide l'assemblage satellite avec GPT-4o Vision"""
    
    data = request.json
    image_data = data.get('image')
    component_type = data.get('component_type')
    detected_parts = data.get('detected_parts', [])
    
    if not image_data or not component_type:
        return jsonify({'error': 'Missing image or component_type'}), 400
    
    prompt = f"""Analyze this {component_type} assembly.

Detected parts via Unity Raycast: {', '.join(detected_parts)}

Validate:
1. Are all parts correctly positioned?
2. Are the solar panels (panel1 and panel2) symmetrically placed?
3. Is the body (central core) properly aligned?
4. Are connections between parts properly aligned?
5. Overall structural integrity and symmetry?

Provide detailed constructive feedback for a student learning aerospace engineering."""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{image_data}"
                        }
                    }
                ]
            }],
            max_tokens=800
        )
        
        analysis = response.choices[0].message.content
        
        return jsonify({
            'status': 'OK',
            'component_type': component_type,
            'detected_parts': detected_parts,
            'gpt4o_analysis': analysis,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"[Validation Error] {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 80)
    print("🚀 AeroVerse CV Backend - HYBRID SYSTEM")
    print("=" * 80)
    print(f"OpenAI: {'✅ Configured' if os.getenv('OPENAI_API_KEY') else '❌ MISSING'}")
    print(f"Total Components: {len(COMPONENT_DB)}")
    print(f"Simulation (celestial): {len([c for c in COMPONENT_DB.values() if not c.get('can_add_to_builder')])}")
    print(f"Builder (spacecraft): {len([c for c in COMPONENT_DB.values() if c.get('can_add_to_builder')])}")
    print("\nEndpoints:")
    print("  GET  /api/components/<id>     → Unity Raycast lookup")
    print("  POST /api/builder/validate    → Builder assembly validation")
    print("  GET  /api/health              → System status")
    print("=" * 80)
    app.run(host='0.0.0.0', port=5000, debug=True)
