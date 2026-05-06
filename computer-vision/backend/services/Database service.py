# backend/services/database_service.py

import json
import os
from datetime import datetime

class ComponentDatabase:
    """
    Service pour gérer la base de données des composants aérospatiaux
    """
    
    def __init__(self, db_path='data/component_database.json'):
        self.db_path = db_path
        self.components = {}
        self.load_database()
    
    def load_database(self):
        """Charger la base de données depuis le fichier JSON"""
        try:
            if os.path.exists(self.db_path):
                with open(self.db_path, 'r', encoding='utf-8') as f:
                    self.components = json.load(f)
                print(f"[DB] Loaded {len(self.components)} components from database")
            else:
                print(f"[DB] Database file not found, creating new one")
                self.initialize_default_database()
                self.save_database()
        except Exception as e:
            print(f"[DB ERROR] Failed to load database: {e}")
            self.initialize_default_database()
    
    def save_database(self):
        """Sauvegarder la base de données dans le fichier JSON"""
        try:
            os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
            with open(self.db_path, 'w', encoding='utf-8') as f:
                json.dump(self.components, f, indent=2, ensure_ascii=False)
            print(f"[DB] Database saved successfully")
        except Exception as e:
            print(f"[DB ERROR] Failed to save database: {e}")
    
    def initialize_default_database(self):
        """Initialiser la base de données avec des composants par défaut"""
        self.components = {
            "turbofan_engine": {
                "name": "Turbofan Engine",
                "category": "Engine",
                "description": "A turbofan engine is a type of jet engine that uses a ducted fan to accelerate air around the engine core.",
                "model_3d_reference": "models/turbofan_engine.obj",
                "technical_specs": [
                    "Thrust: 20,000-25,000 lbf",
                    "Bypass ratio: 9:1",
                    "Fan diameter: 78 inches",
                    "Weight: 4,500 kg",
                    "Max temperature: 1,500°C"
                ],
                "educational_content": {
                    "how_it_works": "The fan draws in air, part goes through the core (combustion) and part bypasses it.",
                    "applications": ["Commercial aviation", "Military transport aircraft"],
                    "key_principles": ["Bernoulli's principle", "Newton's third law", "Thermodynamics"]
                }
            },
            "rocket_engine": {
                "name": "Rocket Engine",
                "category": "Engine",
                "description": "A rocket engine generates thrust through the expulsion of high-velocity exhaust gases.",
                "model_3d_reference": "models/rocket_engine.obj",
                "technical_specs": [
                    "Thrust: 190,000 lbf",
                    "Specific impulse: 311s (sea level)",
                    "Propellant: LOX/RP-1",
                    "Burn time: 162 seconds",
                    "Gimbal range: ±10 degrees"
                ],
                "educational_content": {
                    "how_it_works": "Combustion of propellants creates high-pressure gas expelled through a nozzle.",
                    "applications": ["Space launch vehicles", "Missiles", "Spacecraft propulsion"],
                    "key_principles": ["Newton's third law", "Conservation of momentum", "Rocket equation"]
                }
            },
            "wing": {
                "name": "Aircraft Wing",
                "category": "Structure",
                "description": "An aircraft wing generates lift through airfoil shape and pressure differential.",
                "model_3d_reference": "models/aircraft_wing.obj",
                "technical_specs": [
                    "Wingspan: 35-60 meters (typical commercial)",
                    "Aspect ratio: 8-11",
                    "Wing area: 120-550 m²",
                    "Airfoil: NACA 23012 (example)",
                    "Material: Aluminum alloy / Carbon composite"
                ],
                "educational_content": {
                    "how_it_works": "Airfoil shape creates pressure difference - lower pressure above, higher below.",
                    "applications": ["Commercial aircraft", "Military fighters", "General aviation"],
                    "key_principles": ["Bernoulli's principle", "Angle of attack", "Lift coefficient"]
                }
            },
            "satellite": {
                "name": "Communication Satellite",
                "category": "Spacecraft",
                "description": "A satellite placed in orbit for telecommunications, broadcasting, and data relay.",
                "model_3d_reference": "models/satellite_basic.obj",
                "technical_specs": [
                    "Orbit: Geostationary (35,786 km)",
                    "Power: Solar panels (5-15 kW)",
                    "Mass: 3,000-6,000 kg",
                    "Lifespan: 15-20 years",
                    "Transponders: 24-72 channels"
                ],
                "educational_content": {
                    "how_it_works": "Receives signals from Earth, amplifies them, and retransmits to different locations.",
                    "applications": ["TV broadcasting", "Internet", "GPS", "Military communications"],
                    "key_principles": ["Orbital mechanics", "Radio frequency", "Solar power"]
                }
            },
            "turbine_blade": {
                "name": "Turbine Blade",
                "category": "Propulsion",
                "description": "A turbine blade extracts energy from high-temperature gas flow.",
                "model_3d_reference": "models/turbine_blade.obj",
                "technical_specs": [
                    "Material: Nickel-based superalloy",
                    "Operating temperature: 1,400-1,700°C",
                    "Length: 10-40 cm",
                    "Coating: Thermal barrier coating (TBC)",
                    "Cooling: Internal air channels"
                ],
                "educational_content": {
                    "how_it_works": "Hot exhaust gases spin the turbine blades, converting thermal energy to mechanical rotation.",
                    "applications": ["Jet engines", "Gas turbines", "Power generation"],
                    "key_principles": ["Energy conversion", "Thermodynamics", "Material science"]
                }
            },
            "fuel_tank": {
                "name": "Aerospace Fuel Tank",
                "category": "Spacecraft",
                "description": "Storage container for rocket propellant or aircraft fuel.",
                "model_3d_reference": "models/fuel_tank.obj",
                "technical_specs": [
                    "Capacity: 50-150 tons (rockets)",
                    "Material: Aluminum-lithium alloy",
                    "Pressure: 20-60 psi",
                    "Insulation: Foam for cryogenic fuels",
                    "Shape: Cylindrical with domes"
                ],
                "educational_content": {
                    "how_it_works": "Stores fuel under pressure, often insulated for cryogenic liquids like LOX.",
                    "applications": ["Rocket stages", "Aircraft wings", "Spacecraft"],
                    "key_principles": ["Pressure vessels", "Cryogenics", "Structural integrity"]
                }
            },
            "landing_gear": {
                "name": "Landing Gear",
                "category": "Structure",
                "description": "Retractable wheels and shock absorbers for aircraft landing and takeoff.",
                "model_3d_reference": "models/landing_gear.obj",
                "technical_specs": [
                    "Load capacity: 50-200 tons",
                    "Tire pressure: 200 psi",
                    "Hydraulic system: 3000 psi",
                    "Retraction time: 5-10 seconds",
                    "Material: Steel, titanium"
                ],
                "educational_content": {
                    "how_it_works": "Absorbs landing impact via hydraulic shock struts, retracts to reduce drag.",
                    "applications": ["Commercial aircraft", "Military aircraft", "Helicopters"],
                    "key_principles": ["Hydraulics", "Shock absorption", "Mechanical engineering"]
                }
            },
            "cockpit": {
                "name": "Aircraft Cockpit",
                "category": "Structure",
                "description": "The pilot's control area containing instruments and flight controls.",
                "model_3d_reference": "models/cockpit.obj",
                "technical_specs": [
                    "Displays: Glass cockpit (LCD screens)",
                    "Controls: Fly-by-wire system",
                    "Windows: Laminated acrylic",
                    "Pressurization: 8,000 ft cabin altitude",
                    "Avionics: GPS, autopilot, radar"
                ],
                "educational_content": {
                    "how_it_works": "Pilots use instruments to monitor aircraft status and control flight.",
                    "applications": ["All aircraft", "Spacecraft", "Simulators"],
                    "key_principles": ["Human factors", "Avionics", "Automation"]
                }
            }
        }
    
    def get_component(self, component_id):
        """Récupérer un composant par son ID"""
        return self.components.get(component_id.lower().replace(' ', '_'))
    
    def get_component_by_name(self, name):
        """Récupérer un composant par son nom"""
        name_normalized = name.lower().replace(' ', '_')
        return self.components.get(name_normalized)
    
    def get_all_components(self):
        """Récupérer tous les composants"""
        return self.components
    
    def get_components_by_category(self, category):
        """Récupérer tous les composants d'une catégorie"""
        return {
            comp_id: comp_data 
            for comp_id, comp_data in self.components.items() 
            if comp_data['category'].lower() == category.lower()
        }
    
    def add_component(self, component_id, component_data):
        """Ajouter un nouveau composant"""
        self.components[component_id] = component_data
        self.save_database()
    
    def update_component(self, component_id, component_data):
        """Mettre à jour un composant existant"""
        if component_id in self.components:
            self.components[component_id].update(component_data)
            self.save_database()
            return True
        return False
    
    def delete_component(self, component_id):
        """Supprimer un composant"""
        if component_id in self.components:
            del self.components[component_id]
            self.save_database()
            return True
        return False
    
    def search_components(self, query):
        """Rechercher des composants par mot-clé"""
        query_lower = query.lower()
        results = {}
        
        for comp_id, comp_data in self.components.items():
            if (query_lower in comp_data['name'].lower() or 
                query_lower in comp_data['description'].lower() or 
                query_lower in comp_data['category'].lower()):
                results[comp_id] = comp_data
        
        return results
    
    def get_component_stats(self):
        """Obtenir des statistiques sur la base de données"""
        stats = {
            'total_components': len(self.components),
            'categories': {}
        }
        
        for comp_data in self.components.values():
            category = comp_data['category']
            if category not in stats['categories']:
                stats['categories'][category] = 0
            stats['categories'][category] += 1
        
        return stats


# Fonctions utilitaires
def get_3d_model_reference(component_name, db):
    """Récupérer la référence du modèle 3D depuis la base de données"""
    component = db.get_component_by_name(component_name)
    if component:
        return component.get('model_3d_reference', 'models/default_component.obj')
    return 'models/default_component.obj'


def get_technical_specs(component_name, db):
    """Récupérer les spécifications techniques depuis la base de données"""
    component = db.get_component_by_name(component_name)
    if component:
        return component.get('technical_specs', ['No specifications available'])
    return ['No specifications available']


def get_educational_content(component_name, db):
    """Récupérer le contenu éducatif depuis la base de données"""
    component = db.get_component_by_name(component_name)
    if component:
        return component.get('educational_content', {})
    return {}


if __name__ == "__main__":
    # Test de la base de données
    db = ComponentDatabase()
    
    print("\n=== DATABASE STATS ===")
    stats = db.get_component_stats()
    print(f"Total components: {stats['total_components']}")
    print(f"Categories: {stats['categories']}")
    
    print("\n=== TESTING COMPONENT RETRIEVAL ===")
    turbofan = db.get_component('turbofan_engine')
    if turbofan:
        print(f"Name: {turbofan['name']}")
        print(f"Category: {turbofan['category']}")
        print(f"Specs: {turbofan['technical_specs'][:2]}")
    
    print("\n=== TESTING SEARCH ===")
    results = db.search_components('engine')
    print(f"Found {len(results)} components matching 'engine'")
    
    print("\n=== DATABASE READY ===")