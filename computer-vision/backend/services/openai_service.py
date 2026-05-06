"""
OpenAI Service for generating aerospace and astronomy descriptions
"""
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

class DescriptionGenerator:
    def __init__(self):
        """Initialize OpenAI client"""
        self.api_key = os.getenv('OPENAI_API_KEY')
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None
            print("[WARNING] OPENAI_API_KEY not found in environment")
        
        # Static descriptions as fallback
        self.static_descriptions = {
            # ========== AEROSPACE COMPONENTS ==========
            'turbofan_engine': {
                'en': "A turbofan engine is a type of air-breathing jet engine that uses a large fan to bypass air around the core, providing efficient thrust for commercial aircraft. The fan accelerates a large mass of air at subsonic speeds, while the core provides additional thrust through hot exhaust gases. Commonly used in modern airliners like the Boeing 737, 787, and Airbus A320, A350. Fun fact: Modern turbofans can achieve bypass ratios of 12:1, meaning 12 times more air bypasses the core than goes through it!",
                'fr': "Un moteur turbofan est un type de moteur à réaction qui utilise un grand ventilateur pour contourner l'air autour du noyau, fournissant une poussée efficace pour les avions commerciaux."
            },
            'rocket_engine': {
                'en': "A rocket engine produces thrust by expelling propellant mass at extremely high velocities through a nozzle, based on Newton's third law of motion. Unlike air-breathing engines, rockets carry both fuel and oxidizer, allowing them to operate in the vacuum of space. Used in launch vehicles like SpaceX Falcon 9, NASA's SLS, and spacecraft propulsion systems. Fun fact: The Saturn V F-1 engine produced 1.5 million pounds of thrust!",
                'fr': "Un moteur-fusée produit une poussée en expulsant de la masse de propergol à des vitesses extrêmement élevées à travers une tuyère."
            },
            'satellite': {
                'en': "A satellite is a spacecraft that orbits Earth or another celestial body, performing functions like communications, Earth observation, navigation (GPS), or scientific research. Satellites use solar panels for power, attitude control systems to maintain orientation, and transponders to relay signals. Examples include the International Space Station, Hubble Space Telescope, and thousands of communication satellites in geostationary and low Earth orbits. Fun fact: There are over 8,000 active satellites currently orbiting Earth!",
                'fr': "Un satellite est un engin spatial qui orbite autour de la Terre ou d'un autre corps céleste, effectuant des fonctions comme les communications, l'observation de la Terre, la navigation (GPS) ou la recherche scientifique."
            },
            'rocket': {
                'en': "A rocket is a vehicle that uses rocket engines to achieve spaceflight by expelling exhaust gases at high velocity. Rockets work on Newton's third law of motion, propelling the vehicle in the opposite direction of the exhaust. They are used for launching satellites, crewed missions to space, and interplanetary exploration. Fun fact: The Saturn V rocket that took astronauts to the Moon stood 111 meters tall and remains the most powerful rocket ever successfully flown!",
                'fr': "Une fusée est un véhicule qui utilise des moteurs-fusées pour atteindre l'espace en expulsant des gaz d'échappement à haute vitesse."
            },
            
            # ========== PLANETS ==========
            'Earth': {
                'en': "Earth is the third planet from the Sun and the only known planet to harbor life. With a diameter of 12,742 km, Earth orbits the Sun at an average distance of 149.6 million km (1 AU). Its atmosphere is composed of 78% nitrogen and 21% oxygen, creating the perfect conditions for life. Earth has one natural satellite, the Moon. Fun fact: Earth is the densest planet in the Solar System and the only planet not named after a Greek or Roman deity!",
                'fr': "La Terre est la troisième planète du Soleil et la seule planète connue à abriter la vie. Avec un diamètre de 12 742 km, la Terre orbite autour du Soleil à une distance moyenne de 149,6 millions de km."
            },
            'Mars': {
                'en': "Mars is the fourth planet from the Sun, known as the Red Planet due to iron oxide (rust) on its surface. It has a thin atmosphere composed mainly of carbon dioxide and features the largest volcano in the Solar System, Olympus Mons (21 km high). Mars has two small moons, Phobos and Deimos. Evidence suggests Mars once had liquid water on its surface. Fun fact: A day on Mars (called a sol) lasts 24 hours and 37 minutes, very similar to Earth!",
                'fr': "Mars est la quatrième planète du Soleil, connue sous le nom de Planète Rouge en raison de l'oxyde de fer sur sa surface."
            },
            'Jupiter': {
                'en': "Jupiter is the largest planet in the Solar System, a gas giant with a mass more than twice that of all other planets combined. Its iconic Great Red Spot is a giant storm that has been raging for at least 400 years. Jupiter has 95 known moons, including the four large Galilean moons: Io, Europa, Ganymede, and Callisto. Its powerful magnetic field is 20,000 times stronger than Earth's. Fun fact: Jupiter rotates faster than any other planet, completing one rotation in just 10 hours!",
                'fr': "Jupiter est la plus grande planète du système solaire, une géante gazeuse avec une masse plus de deux fois supérieure à celle de toutes les autres planètes combinées."
            },
            'Saturn': {
                'en': "Saturn is the sixth planet from the Sun, famous for its spectacular ring system made of ice and rock particles. It's a gas giant composed mainly of hydrogen and helium, with wind speeds reaching 1,800 km/h. Saturn has 146 known moons, with Titan being the largest. Despite being the second-largest planet, Saturn is the least dense and would float in water if a large enough ocean existed. Fun fact: Saturn's rings are only about 10 meters thick despite being 282,000 km wide!",
                'fr': "Saturne est la sixième planète du Soleil, célèbre pour son spectaculaire système d'anneaux composé de particules de glace et de roche."
            },
            'Venus': {
                'en': "Venus is the second planet from the Sun and Earth's closest planetary neighbor. Often called Earth's 'sister planet' due to similar size, Venus has a thick atmosphere of carbon dioxide creating a runaway greenhouse effect with surface temperatures reaching 465°C, hot enough to melt lead. It rotates very slowly and in the opposite direction to most planets. Fun fact: A day on Venus (243 Earth days) is longer than its year (225 Earth days)!",
                'fr': "Vénus est la deuxième planète du Soleil et le voisin planétaire le plus proche de la Terre."
            },
            'Mercury': {
                'en': "Mercury is the smallest planet in the Solar System and the closest to the Sun. Despite being nearest to the Sun, it's not the hottest planet due to its lack of atmosphere. Mercury's surface is heavily cratered, similar to the Moon, and it experiences extreme temperature variations from -173°C at night to 427°C during the day. It has no moons or rings. Fun fact: Mercury has the most eccentric orbit of all planets, varying from 46 to 70 million km from the Sun!",
                'fr': "Mercure est la plus petite planète du système solaire et la plus proche du Soleil."
            },
            'Neptune': {
                'en': "Neptune is the eighth and farthest planet from the Sun, an ice giant with winds reaching 2,100 km/h, the fastest in the Solar System. Its beautiful blue color comes from methane in its atmosphere. Neptune has 16 known moons, with Triton being the largest. It takes 165 Earth years to complete one orbit around the Sun. Fun fact: Neptune was the first planet discovered through mathematical predictions rather than direct observation, in 1846!",
                'fr': "Neptune est la huitième et la plus éloignée planète du Soleil, une géante de glace avec des vents atteignant 2 100 km/h."
            },
            'Uranus': {
                'en': "Uranus is the seventh planet from the Sun, unique for rotating on its side with an axial tilt of 98 degrees. This ice giant appears blue-green due to methane in its atmosphere and has a system of 13 faint rings. Uranus has 28 known moons, all named after characters from Shakespeare and Alexander Pope. It's the coldest planet with atmospheric temperatures reaching -224°C. Fun fact: Uranus experiences extreme seasons, with each pole getting 42 years of continuous sunlight followed by 42 years of darkness!",
                'fr': "Uranus est la septième planète du Soleil, unique car elle tourne sur le côté avec une inclinaison axiale de 98 degrés."
            },
            'Eris': {
                'en': "Eris is a dwarf planet in the scattered disc region beyond Neptune's orbit. Discovered in 2005, it's about the same size as Pluto and was initially thought to be larger, leading to the reclassification of Pluto as a dwarf planet. Eris takes 558 years to orbit the Sun and has one known moon called Dysnomia. Its surface is covered in frozen methane. Fun fact: Eris is named after the Greek goddess of strife and discord, fitting since its discovery sparked the planet definition debate!",
                'fr': "Éris est une planète naine dans la région du disque dispersé au-delà de l'orbite de Neptune."
            }
        }
    
    def is_configured(self):
        """Check if OpenAI API is properly configured"""
        return self.client is not None
    
    def generate_description(self, component_name, category, language='en'):
        """Generate description (with static fallback)"""
        
        # Try OpenAI first
        if self.is_configured():
            try:
                if language == 'fr':
                    prompt = f"Génère une description éducative pour {component_name}. 4-5 phrases claires."
                else:
                    prompt = f"Generate an educational description for {component_name}. 4-5 clear sentences."
                
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are an astronomy and aerospace educator."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=300,
                    temperature=0.7
                )
                
                description = response.choices[0].message.content.strip()
                print(f"[INFO] Generated description via OpenAI for {component_name}")
                return description
                
            except Exception as e:
                print(f"[WARNING] OpenAI API failed: {str(e)}")
                print(f"[INFO] Falling back to static description")
        
        # Fallback to static descriptions
        lang = 'fr' if language == 'fr' else 'en'
        
        if component_name in self.static_descriptions:
            return self.static_descriptions[component_name].get(lang, 
                self.static_descriptions[component_name]['en'])
        else:
            # Generic fallback
            return f"{component_name} is a celestial object or aerospace component. Learn more about this fascinating subject in astronomy and space exploration!"


# Test
if __name__ == "__main__":
    gen = DescriptionGenerator()
    print("Testing DescriptionGenerator...")
    print("="*60)
    
    # Test planète
    print("\n[TEST] Mars:")
    print(gen.generate_description("Mars", "Planet", language='en'))
    
    # Test composant
    print("\n[TEST] Satellite:")
    print(gen.generate_description("satellite", "Spacecraft", language='en'))
    
    print("\n" + "="*60)
    print("✅ Service working!")