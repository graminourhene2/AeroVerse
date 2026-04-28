"""
AeroVerse Computer Vision Backend - FIXED VERSION
Uses GPT-4o Vision directly instead of unreliable custom CNN model
Endpoints:
  POST /api/cv/analyze-image      - Identify component (legacy)
  POST /api/cv/diagnose           - Diagnose defects (GPT-4o Vision)
  POST /api/cv/identify-component - Full specs for Simulation CV Camera
  GET  /api/health                - Health check
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

# ── OpenAI client (GPT-4o Vision) ─────────────────────────────────────────────
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# ── Upload folder ──────────────────────────────────────────────────────────────
UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ── Known classes (for reference / health check) ───────────────────────────────
KNOWN_CLASSES = [
    "rocket", "rocket_engine", "turbofan_engine", "satellite",
    "earth", "Mars", "Jupiter", "Saturn", "Venus", "Mercury",
    "Neptune", "Uranus", "Eris", "sun", "black_hole"
]

# ── Helpers ────────────────────────────────────────────────────────────────────
def decode_image(image_base64):
    """Decode base64 image to numpy array"""
    image_bytes = base64.b64decode(image_base64)
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return image

def save_image(image, prefix, image_format='png'):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = os.path.join(UPLOAD_FOLDER, f'{prefix}_{timestamp}.{image_format}')
    cv2.imwrite(path, image)
    return path

def call_gpt4o_vision(image_base64, system_prompt, user_prompt, image_format='png'):
    """Call GPT-4o Vision and return parsed JSON"""
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        max_tokens=1200,
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/{image_format};base64,{image_base64}",
                            "detail": "high"
                        }
                    },
                    {"type": "text", "text": user_prompt}
                ]
            }
        ]
    )
    raw = response.choices[0].message.content.strip()
    # Strip markdown fences if present
    if "```" in raw:
        lines = raw.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw = "\n".join(lines).strip()
    return json.loads(raw)

# Component Database
COMPONENT_DB = {
    'earth': {
        'component_name': 'Earth',
        'component_id': 'earth',
        'category': 'Planet',
        'emoji': '🌍',
        'description': 'The third planet from the Sun and the only astronomical object known to harbor life. Earth is home to millions of species and features a diverse climate system.',
        'how_to_use': 'In simulations, Earth serves as a reference point for orbital mechanics, atmospheric studies, and climate modeling. It is essential for understanding planetary habitability.',
        'technical_specs': [
            'Diameter: 12,742 km',
            'Mass: 5.97 × 10²⁴ kg',
            'Orbital Period: 365.25 days',
            'Surface Temperature: -88°C to 58°C',
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
        'description': 'The fourth planet from the Sun, known as the Red Planet due to iron oxide on its surface. Mars has the largest volcano and canyon in the solar system.',
        'how_to_use': 'Mars is a prime target for exploration missions and colonization studies. Use it to simulate landing scenarios, rover operations, and atmospheric entry.',
        'technical_specs': [
            'Diameter: 6,779 km',
            'Mass: 6.39 × 10²³ kg',
            'Orbital Period: 687 days',
            'Surface Temperature: -87°C to -5°C',
            'Atmosphere: 95% Carbon Dioxide'
        ],
        'fun_facts': [
            'Mars has two small moons: Phobos and Deimos',
            'A day on Mars is 24.6 hours (similar to Earth)',
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
        'description': 'The largest planet in the solar system, a gas giant with a mass greater than all other planets combined. Jupiter has a Great Red Spot, a giant storm.',
        'how_to_use': 'Jupiter is ideal for studying gas giant atmospheres, magnetospheres, and moon systems. It plays a crucial role in protecting Earth from asteroids.',
        'technical_specs': [
            'Diameter: 139,820 km',
            'Mass: 1.90 × 10²⁷ kg',
            'Orbital Period: 11.86 years',
            'Surface Temperature: -145°C',
            'Atmosphere: 90% Hydrogen, 10% Helium'
        ],
        'fun_facts': [
            'Jupiter has 95 known moons',
            'The Great Red Spot is a storm larger than Earth',
            'Jupiter rotates faster than any other planet (10 hours)'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'saturn': {
        'component_name': 'Saturn',
        'component_id': 'saturn',
        'category': 'Planet',
        'emoji': '🪐',
        'description': 'The sixth planet from the Sun, famous for its spectacular ring system. Saturn is a gas giant with the lowest density of all planets.',
        'how_to_use': 'Use Saturn to study ring dynamics, moon interactions, and gas giant atmospheres. Its rings are ideal for orbital mechanics simulations.',
        'technical_specs': [
            'Diameter: 116,460 km',
            'Mass: 5.68 × 10²⁶ kg',
            'Orbital Period: 29.46 years',
            'Surface Temperature: -178°C',
            'Atmosphere: 96% Hydrogen, 3% Helium'
        ],
        'fun_facts': [
            'Saturn has 146 known moons',
            'Saturn is the least dense planet (it would float in water)',
            'Saturn\'s rings are mostly made of ice particles'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'sun': {
        'component_name': 'Sun',
        'component_id': 'sun',
        'category': 'Star',
        'emoji': '☀️',
        'description': 'The star at the center of our solar system. The Sun accounts for 99.86% of the total mass of the solar system and provides the energy necessary for life on Earth.',
        'how_to_use': 'The Sun is essential for understanding stellar physics, solar wind, and energy production. Use it as the gravitational anchor in orbital simulations.',
        'technical_specs': [
            'Diameter: 1,391,000 km',
            'Mass: 1.989 × 10³⁰ kg',
            'Surface Temperature: 5,500°C',
            'Core Temperature: 15,000,000°C',
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
        'description': 'The smallest and innermost planet in the solar system. Mercury has extreme temperature variations and a heavily cratered surface.',
        'how_to_use': 'Use Mercury to study extreme environments, solar radiation effects, and tidal locking phenomena.',
        'technical_specs': [
            'Diameter: 4,879 km',
            'Mass: 3.30 × 10²³ kg',
            'Orbital Period: 88 days',
            'Surface Temperature: -173°C to 427°C',
            'Atmosphere: Trace amounts (exosphere)'
        ],
        'fun_facts': [
            'Mercury has no moons',
            'A day on Mercury lasts 176 Earth days',
            'Mercury has a large iron core'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'venus': {
        'component_name': 'Venus',
        'component_id': 'venus',
        'category': 'Planet',
        'emoji': '♀️',
        'description': 'The second planet from the Sun, similar in size to Earth but with a toxic atmosphere and extreme surface temperatures due to a runaway greenhouse effect.',
        'how_to_use': 'Venus is ideal for studying greenhouse effects, atmospheric pressure, and volcanic activity.',
        'technical_specs': [
            'Diameter: 12,104 km',
            'Mass: 4.87 × 10²⁴ kg',
            'Orbital Period: 225 days',
            'Surface Temperature: 462°C',
            'Atmosphere: 96.5% Carbon Dioxide'
        ],
        'fun_facts': [
            'Venus rotates backwards (retrograde)',
            'Venus is the hottest planet in the solar system',
            'A day on Venus is longer than its year'
        ],
        'can_add_to_builder': False,
        'builder_component_id': None
    },
    'unknown': {
        'component_name': 'Unknown Object',
        'component_id': 'unknown',
        'category': 'Unknown',
        'emoji': '❓',
        'description': 'Unable to identify this object. It may be a satellite, asteroid, or spacecraft.',
        'how_to_use': 'N/A',
        'technical_specs': [],
        'fun_facts': [],
        'can_add_to_builder': False,
        'builder_component_id': None
    }
}
# ══════════════════════════════════════════════════════════════════════════════
# POST /api/cv/diagnose
# Main endpoint used by Builder "Capture & Diagnose" button
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/cv/diagnose', methods=['POST'])
def diagnose_component():
    """
    Diagnose defects in aerospace component or celestial body from screenshot.
    Uses GPT-4o Vision for accurate detection — replaces broken custom CNN.
    """
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        image_base64 = data['image']
        image_format = data.get('format', 'png')

        # Save screenshot
        image = decode_image(image_base64)
        if image is None:
            return jsonify({'error': 'Failed to decode image'}), 400
        image_path = save_image(image, 'diagnose', image_format)
        print(f"[DIAGNOSE] Image saved: {image_path}")

        # ── GPT-4o Vision diagnosis ──────────────────────────────────────────
        system_prompt = """You are a senior aerospace engineer and astrophysicist working inside AeroVerse, 
a space simulation and education platform. You analyze screenshots from the platform's Mission Builder 
which shows space components arranged on a dark starfield canvas.

Known detectable objects: rocket, rocket_engine, turbofan_engine, satellite, earth, Mars, Jupiter, 
Saturn, Venus, Mercury, Neptune, Uranus, Eris, sun, black_hole

IDENTIFICATION RULES:
- Look carefully at the actual visual content — colors, shapes, surface textures, ring systems
- Mars = reddish-orange planet with surface features
- Earth = blue-green planet with clouds and continents  
- Saturn = planet with prominent ring system
- Jupiter = large banded planet with Great Red Spot
- black_hole = dark circular object with accretion disk glow
- rocket = elongated cylindrical launch vehicle
- satellite = spacecraft with solar panels
- For the builder canvas (dark background with component thumbnails), identify the DOMINANT component shown

DIAGNOSIS RULES:
- For planets and stars with no visible anomalies: status = "OK", errors_found = []
- For spacecraft components: check for structural issues, misalignments, damage
- Be realistic — if you see a normal planet image, say it's OK
- Confidence should reflect how clearly you can see the object (0.7-0.95 for clear images)

Return ONLY valid raw JSON, no markdown:
{
  "component_detected": "exact name from known list above",
  "confidence": 0.85,
  "category": "Planet|Spacecraft|Engine|Satellite|Phenomena|Dwarf Planet",
  "status": "OK|WARNING|ERROR|CRITICAL",
  "errors_found": [
    {
      "type": "error_type_snake_case",
      "severity": "LOW|MEDIUM|HIGH|CRITICAL",
      "description": "What you observe that is wrong",
      "solution": "How to fix it",
      "consequence": "What happens if not addressed"
    }
  ],
  "overall_assessment": "2-3 sentence educational assessment of the component and its condition",
  "recommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3"],
  "bounding_box": {"x": 0, "y": 0, "width": 100, "height": 100}
}"""

        user_prompt = "Analyze this AeroVerse Mission Builder screenshot. Identify the main aerospace component or celestial body visible and provide a diagnosis. Return only valid JSON."

        result = call_gpt4o_vision(image_base64, system_prompt, user_prompt, image_format)

        # Ensure required fields
        result.setdefault('component_detected', 'Unknown')
        result.setdefault('confidence', 0.5)
        result.setdefault('category', 'Unknown')
        result.setdefault('status', 'OK')
        result.setdefault('errors_found', [])
        result.setdefault('overall_assessment', 'Component analyzed.')
        result.setdefault('recommendations', ['Monitor component during operation'])
        result.setdefault('bounding_box', {'x': 0, 'y': 0, 'width': image.shape[1], 'height': image.shape[0]})

        result['screenshot_path'] = image_path
        result['timestamp'] = datetime.now().strftime("%Y%m%d_%H%M%S")

        print(f"[DIAGNOSE] ✅ {result['component_detected']} | {result['status']} | {result['confidence']:.0%}")
        return jsonify(result), 200

    except json.JSONDecodeError as e:
        print(f"[ERROR] GPT-4o returned invalid JSON: {e}")
        return jsonify({'error': 'AI returned malformed response, please retry'}), 500
    except Exception as e:
        print(f"[ERROR] /diagnose: {str(e)}")
        import traceback; traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ══════════════════════════════════════════════════════════════════════════════
# COLOR-BASED PLANET IDENTIFICATION (Fallback when GPT-4o can't distinguish)
# ══════════════════════════════════════════════════════════════════════════════
def identify_planet_by_color(image):
    """
    Fallback color-based planet identification for Unity simulation.
    When GPT-4o can only determine "it's a planet", use color to identify which one.
    """
    import cv2
    import numpy as np
    
    # Get dominant color of the image
    avg_color = cv2.mean(image)[:3]  # BGR
    b, g, r = avg_color
    
    print(f"[COLOR] Detected avg RGB: R={r:.0f}, G={g:.0f}, B={b:.0f}")
    
    # Color-based planet identification
    # Earth: Blue-green dominant
    if b > 150 and g > 100 and b > r:
        return {'component_id': 'earth', 'component_name': 'Earth', 'confidence': 0.75}
    
    # Mars: Red-orange dominant
    elif r > 150 and r > b and r > g:
        return {'component_id': 'mars', 'component_name': 'Mars', 'confidence': 0.75}
    
    # Jupiter: Orange-brown (high red and green, medium blue)
    elif r > 130 and g > 100 and b < 120:
        return {'component_id': 'jupiter', 'component_name': 'Jupiter', 'confidence': 0.72}
    
    # Saturn: Yellow-beige (high red and green, similar)
    elif r > 140 and g > 120 and abs(r - g) < 30 and b < 140:
        return {'component_id': 'saturn', 'component_name': 'Saturn', 'confidence': 0.70}
    
    # Venus: Pale yellow-white (all channels high)
    elif r > 180 and g > 170 and b > 150:
        return {'component_id': 'venus', 'component_name': 'Venus', 'confidence': 0.68}
    
    # Sun: Very bright orange/yellow
    elif r > 200 and g > 180:
        return {'component_id': 'sun', 'component_name': 'Sun', 'confidence': 0.80}
    
    # Mercury: Gray-brown (low saturation)
    elif r > 100 and g > 90 and b > 80 and max([r,g,b]) < 160:
        return {'component_id': 'mercury', 'component_name': 'Mercury', 'confidence': 0.65}
    
    # Default: unidentified
    return {'component_id': 'unknown', 'component_name': 'Unknown Planet', 'confidence': 0.50}
# ══════════════════════════════════════════════════════════════════════════════
# POST /api/cv/identify-component
# Used by Simulation CV Camera click-to-identify
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/cv/identify-component', methods=['POST'])
def identify_component():
    """
    Full educational identification of a component from simulation screenshot.
    Returns specs, how-to-use, fun facts, and builder mapping.
    """
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        image_base64 = data['image']
        image_format = data.get('format', 'png')

        image = decode_image(image_base64)
        if image is not None:
            save_image(image, 'identify', image_format)

        system_prompt = """You are an elite aerospace engineer and astrophysicist with 20 years of experience analyzing space imagery. You work inside AeroVerse, an advanced educational space simulation platform.

Your task: Analyze this simulation screenshot and identify the EXACT object the user clicked on.

════════════════════════════════════════════════════════════════════════════════
CRITICAL ANALYSIS RULES:
════════════════════════════════════════════════════════════════════════════════
1. The image is a CROPPED section from a larger simulation
2. The user clicked at the CENTER of this crop
3. Identify ONLY what is at the CENTER - ignore background objects
4. Look for size, color, texture, shape, and unique features
5. This is a SOLAR SYSTEM simulation - most objects are planets, NOT black holes

════════════════════════════════════════════════════════════════════════════════
DETAILED VISUAL IDENTIFICATION GUIDE:
════════════════════════════════════════════════════════════════════════════════

🌍 EARTH:
- Color: Distinctive BLUE with WHITE cloud swirls
- Features: Green/brown continents visible, dynamic cloud patterns
- Size: Medium planetary sphere
- Atmosphere: Clearly visible blue atmospheric glow
- UNIQUE: Only planet with visible blue oceans and white clouds
- NOT Earth if: No blue oceans visible, uniformly colored

🔴 MARS:
- Color: REDDISH-ORANGE to rusty red
- Features: Uniform surface, may show darker spots (Syrtis Major)
- Size: Smaller than Earth
- Atmosphere: Thin, barely visible
- UNIQUE: The "Red Planet" - distinctly rust-colored
- NOT Mars if: Blue tones present, has clouds, greenish

🟠 JUPITER:
- Color: ORANGE-BROWN with distinct horizontal BANDS
- Features: Alternating light/dark bands, Great Red Spot (oval storm)
- Size: VERY LARGE - clearly the biggest planet if multiple are visible
- Atmosphere: Thick, turbulent, visible storm systems
- UNIQUE: Banded appearance, massive size
- NOT Jupiter if: Solid uniform color, no bands, small size

🟡 SATURN:
- Color: PALE YELLOW to beige
- Features: PROMINENT RING SYSTEM (if visible from angle), subtle banding
- Size: Second largest planet
- Atmosphere: Calm, subtle cloud bands
- UNIQUE: Ring system (though may not be visible from all angles)
- NOT Saturn if: Blue or red tones, no subtle yellow hue

🌟 SUN:
- Color: BRIGHT YELLOW-ORANGE, GLOWING intensely
- Features: Surface may show sunspots, corona/flares
- Size: LARGEST object in scene, dominates the view
- Brightness: EXTREMELY BRIGHT, light emanating outward
- UNIQUE: Only star - emits light, everything else reflects it
- NOT Sun if: Not glowing, dark, reflects light instead of emitting

⚫ BLACK HOLE:
- Color: DARK CENTER with bright surrounding ACCRETION DISK
- Features: Visible LIGHT BENDING (gravitational lensing), swirling matter
- Disk: Bright, luminous, spiral pattern, ACTIVE matter accretion
- Effect: Space-time distortion visible, light warps around it
- UNIQUE: Dark center + bright spiral disk + light bending effect
- NOT Black Hole if: Just a planet with orbital ring, no light bending, uniform sphere

🪐 VENUS:
- Color: PALE YELLOW-WHITE, creamy, uniform
- Features: Completely cloud-covered, NO surface features visible
- Size: Similar to Earth
- Atmosphere: Thick, featureless clouds
- UNIQUE: Brightest planet, uniform cream color, no surface detail
- NOT Venus if: Blue oceans, surface features visible, reddish

☿️ MERCURY:
- Color: GRAY to light brown, crater-covered
- Features: Heavily cratered like Moon, NO atmosphere
- Size: SMALLEST planet
- Surface: Rocky, barren, similar to lunar surface
- UNIQUE: Tiny, gray, heavily cratered, no atmosphere
- NOT Mercury if: Has atmosphere, colorful, large size

🔵 NEPTUNE:
- Color: DEEP BLUE (darker than Earth)
- Features: Uniform blue, may show faint cloud features
- Size: Ice giant - large but smaller than Jupiter/Saturn
- Atmosphere: Methane-rich, deep azure blue
- UNIQUE: Deep ocean blue color, darker than Earth's blue
- NOT Neptune if: Light blue with white clouds (that's Earth), reddish, small

🔷 URANUS:
- Color: CYAN to pale blue-green
- Features: Nearly featureless, pale appearance
- Size: Ice giant - similar to Neptune
- Atmosphere: Calm, uniform color
- UNIQUE: Pale cyan/turquoise color, very uniform
- NOT Uranus if: Deep blue, has visible features, reddish

🚀 ROCKET:
- Shape: TALL CYLINDRICAL vehicle, vertical orientation
- Features: Pointed nose cone, engine nozzles at bottom, fins/stabilizers
- Color: Usually white/gray with markings
- Structure: Clear stages, technical details visible
- UNIQUE: Man-made structure, obvious engineered design
- NOT Rocket if: Natural sphere, no technical features

🛰️ SATELLITE:
- Shape: BOX-LIKE body with SOLAR PANELS extending outward
- Features: Rectangular/cubic main body, flat panel wings
- Color: Usually metallic gray/silver
- Structure: Antennas, instruments visible
- UNIQUE: Artificial, solar panel "wings", geometric
- NOT Satellite if: Natural object, spherical, no panels

════════════════════════════════════════════════════════════════════════════════
COMMON MISTAKES TO AVOID:
════════════════════════════════════════════════════════════════════════════════
❌ DO NOT confuse orbital rings (gray circles) with black hole accretion disks
❌ DO NOT identify every planet as Neptune just because it's in space
❌ DO NOT call small planets "black holes" - black holes are extremely rare
❌ DO NOT identify Earth as Mars or vice versa - check for blue vs red
❌ DO NOT guess - if truly uncertain, say "Unknown Object"

════════════════════════════════════════════════════════════════════════════════
KNOWN OBJECTS IN THIS SIMULATION:
════════════════════════════════════════════════════════════════════════════════
Spacecraft: rocket, rocket_engine, turbofan_engine, satellite
Planets: earth, mars, jupiter, saturn, venus, mercury, neptune, uranus, eris
Phenomena: sun, black_hole

════════════════════════════════════════════════════════════════════════════════
OUTPUT FORMAT (STRICT):
════════════════════════════════════════════════════════════════════════════════
Respond ONLY with valid raw JSON (no markdown, no backticks, no explanation):
{
  "component_name": "Exact name (e.g. 'Earth', 'Mars', 'H70 Rocket')",
  "component_id": "lowercase_id (earth|mars|jupiter|saturn|venus|mercury|neptune|uranus|sun|black_hole|rocket|satellite|rocket_engine|turbofan_engine)",
  "category": "Category (Planet|Dwarf Planet|Phenomena|Spacecraft|Propulsion)",
  "emoji": "single emoji",
  "description": "2-3 sentences educational description",
  "how_to_use": "2-3 sentences on usage/function",
  "technical_specs": ["spec1", "spec2", "spec3"],
  "fun_facts": ["fact1", "fact2"],
  "can_add_to_builder": true or false,
  "builder_component_id": "id or null",
  "confidence_reasoning": "Brief explanation of why you identified this object (e.g. 'Blue color with white clouds indicates Earth')"
}"""

        user_prompt = """ANALYSIS TASK:
This is a cropped screenshot from a solar system simulation. The user clicked on a specific object.

FOCUS: Identify the object at the CENTER of this image.

STEP-BY-STEP ANALYSIS:
1. What is the PRIMARY object in the center? (Describe what you see)
2. What COLOR is it? (Be specific: blue, red, orange, yellow, gray, etc.)
3. What SIZE is it relative to frame? (Large, medium, small)
4. What FEATURES do you see? (Clouds, bands, rings, craters, etc.)
5. Is it NATURAL (planet/star) or ARTIFICIAL (rocket/satellite)?
6. Based on the visual guide above, which object matches BEST?

IMPORTANT: 
- If you see a blue sphere with white clouds → EARTH
- If you see a red/orange sphere → MARS  
- If you see a large sphere with bands → JUPITER
- If you see a pale yellow sphere → SATURN or VENUS
- If you see deep blue uniform color → NEPTUNE
- If you see a glowing bright object → SUN
- If you see dark center with swirling bright disk → BLACK HOLE

Return ONLY valid JSON. Include "confidence_reasoning" field explaining your identification."""

        result = call_gpt4o_vision(image_base64, system_prompt, user_prompt, image_format)

        # Set defaults for missing fields
        result.setdefault('component_name', 'Unknown Object')
        result.setdefault('component_id', 'unknown')
        result.setdefault('category', 'Unknown')

        # Log the identification result
        detected_name = result.get('component_name', 'Unknown')
        detected_id = result.get('component_id', 'unknown')
        confidence_reason = result.get('confidence_reasoning', 'No reasoning provided')

        print(f"[IDENTIFY] ✅ {detected_name} ({detected_id})")
        if confidence_reason != 'No reasoning provided':
            print(f"[REASONING] {confidence_reason}")

        return jsonify(result), 200
        print(f"[IDENTIFY] ✅ {result['component_name']} ({result['category']})")
        return jsonify(result), 200

    except json.JSONDecodeError as e:
        print(f"[ERROR] GPT-4o returned invalid JSON: {e}")
        return jsonify({'error': 'AI returned malformed response, please retry'}), 500
    except Exception as e:
        print(f"[ERROR] /identify-component: {str(e)}")
        import traceback; traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
# POST /api/cv/analyze-image  (legacy endpoint — kept for compatibility)
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/cv/analyze-image', methods=['POST'])
def analyze_image():
    """Legacy endpoint — redirects to GPT-4o Vision identification"""
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        image_base64 = data['image']
        image_format = data.get('format', 'png')

        image = decode_image(image_base64)
        if image is not None:
            save_image(image, 'analyze', image_format)

        system_prompt = """You are an aerospace and astronomy expert. Identify the object in the image.
Known classes: rocket, rocket_engine, turbofan_engine, satellite, earth, Mars, Jupiter, Saturn, 
Venus, Mercury, Neptune, Uranus, Eris, sun, black_hole

Return ONLY raw JSON:
{
  "component_name": "name",
  "category": "category",
  "confidence": 0.9,
  "description": "description",
  "technical_specs": ["spec1", "spec2"]
}"""

        result = call_gpt4o_vision(image_base64, system_prompt, "Identify this object. Return only JSON.", image_format)
        result.setdefault('component_name', 'Unknown')
        result.setdefault('category', 'Unknown')
        result.setdefault('confidence', 0.5)
        result.setdefault('description', '')
        result.setdefault('technical_specs', [])

        print(f"[ANALYZE] ✅ {result['component_name']}")
        return jsonify(result), 200

    except Exception as e:
        print(f"[ERROR] /analyze-image: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
# GET /api/health
# ══════════════════════════════════════════════════════════════════════════════
@app.route('/api/health', methods=['GET'])
def health_check():
    api_key_set = bool(os.getenv('OPENAI_API_KEY'))
    return jsonify({
        'status': 'healthy',
        'cv_engine': 'GPT-4o Vision',
        'openai_configured': api_key_set,
        'custom_model': 'disabled (insufficient training data)',
        'supported_classes': KNOWN_CLASSES,
        'total_classes': len(KNOWN_CLASSES)
    }), 200
@app.route('/api/components/<component_id>', methods=['GET'])
def get_component_details(component_id):
    """
    Get full details for a component identified by Unity click.
    No image processing - just return pre-defined data.
    """
    component_id = component_id.lower()
    
    if component_id not in COMPONENT_DB:
        return jsonify({
            'error': f'Component {component_id} not found',
            'component_id': 'unknown',
            'component_name': 'Unknown Object',
            'category': 'Unknown',
            'emoji': '❓',
            'description': 'Unable to identify this object.',
            'how_to_use': 'N/A',
            'technical_specs': [],
            'fun_facts': [],
            'can_add_to_builder': False,
            'builder_component_id': None
        }), 404
    
    component_data = COMPONENT_DB[component_id].copy()
    component_data['detection_method'] = 'unity_raycast'
    component_data['confidence'] = 1.0  # 100% accurate!
    
    print(f"[COMPONENT] ✅ {component_data['component_name']} (Unity)")
    
    return jsonify(component_data), 200

if __name__ == '__main__':
    print("=" * 60)
    print("AeroVerse CV Backend — GPT-4o Vision Edition")
    print("=" * 60)
    print(f"OpenAI API key: {'✅ configured' if os.getenv('OPENAI_API_KEY') else '❌ MISSING'}")
    print(f"CV Engine: GPT-4o Vision (replaces custom CNN)")
    print(f"Supported classes: {len(KNOWN_CLASSES)}")
    print("\nEndpoints:")
    print("  POST /api/cv/diagnose           → Builder diagnosis")
    print("  POST /api/cv/identify-component → Simulation CV Camera")
    print("  POST /api/cv/analyze-image      → Legacy")
    print("  GET  /api/health                → Health check")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
