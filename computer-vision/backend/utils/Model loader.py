# backend/utils/model_loader.py

import os
import torch
from ultralytics import YOLO
import pickle
import json

class ModelLoader:
    """
    Gestionnaire centralisé pour charger tous les modèles ML
    """
    
    def __init__(self, models_dir='models'):
        self.models_dir = models_dir
        self.loaded_models = {}
        
    def load_yolo_model(self, model_name='yolov8_aerospace.pt'):
        """
        Charger le modèle YOLO pour détection de composants
        
        Args:
            model_name: nom du fichier modèle
        
        Returns:
            modèle YOLO chargé
        """
        model_path = os.path.join(self.models_dir, model_name)
        
        try:
            if os.path.exists(model_path):
                print(f"[ModelLoader] Loading custom YOLO model: {model_path}")
                model = YOLO(model_path)
                self.loaded_models['yolo'] = model
                print(f"[ModelLoader] ✓ Custom YOLO model loaded successfully")
                return model
            else:
                print(f"[ModelLoader] Custom model not found: {model_path}")
                print(f"[ModelLoader] Loading pretrained YOLOv8n as fallback")
                model = YOLO('yolov8n.pt')  # Modèle nano (léger)
                self.loaded_models['yolo'] = model
                print(f"[ModelLoader] ✓ Pretrained YOLO model loaded")
                return model
                
        except Exception as e:
            print(f"[ModelLoader ERROR] Failed to load YOLO: {e}")
            return None
    
    def load_classifier_model(self, model_name='component_classifier.pkl'):
        """
        Charger un modèle de classification (sklearn, etc.)
        
        Args:
            model_name: nom du fichier modèle
        
        Returns:
            modèle de classification
        """
        model_path = os.path.join(self.models_dir, model_name)
        
        try:
            if os.path.exists(model_path):
                print(f"[ModelLoader] Loading classifier: {model_path}")
                with open(model_path, 'rb') as f:
                    model = pickle.load(f)
                self.loaded_models['classifier'] = model
                print(f"[ModelLoader] ✓ Classifier loaded successfully")
                return model
            else:
                print(f"[ModelLoader] Classifier not found: {model_path}")
                return None
                
        except Exception as e:
            print(f"[ModelLoader ERROR] Failed to load classifier: {e}")
            return None
    
    def load_pytorch_model(self, model_class, model_path, device='cpu'):
        """
        Charger un modèle PyTorch custom
        
        Args:
            model_class: classe du modèle
            model_path: chemin vers le checkpoint
            device: 'cpu' ou 'cuda'
        
        Returns:
            modèle PyTorch chargé
        """
        try:
            print(f"[ModelLoader] Loading PyTorch model: {model_path}")
            
            # Initialiser le modèle
            model = model_class()
            
            # Charger les poids
            if os.path.exists(model_path):
                checkpoint = torch.load(model_path, map_location=device)
                model.load_state_dict(checkpoint)
                model.to(device)
                model.eval()  # Mode évaluation
                
                print(f"[ModelLoader] ✓ PyTorch model loaded on {device}")
                return model
            else:
                print(f"[ModelLoader ERROR] Model file not found: {model_path}")
                return None
                
        except Exception as e:
            print(f"[ModelLoader ERROR] Failed to load PyTorch model: {e}")
            return None
    
    def get_model(self, model_type):
        """
        Récupérer un modèle déjà chargé
        
        Args:
            model_type: 'yolo', 'classifier', etc.
        
        Returns:
            modèle ou None
        """
        return self.loaded_models.get(model_type)
    
    def list_loaded_models(self):
        """
        Lister tous les modèles chargés
        
        Returns:
            dict des modèles chargés
        """
        return list(self.loaded_models.keys())
    
    def unload_model(self, model_type):
        """
        Décharger un modèle de la mémoire
        
        Args:
            model_type: type de modèle à décharger
        """
        if model_type in self.loaded_models:
            del self.loaded_models[model_type]
            print(f"[ModelLoader] Model '{model_type}' unloaded")
    
    def get_model_info(self, model_type):
        """
        Obtenir des infos sur un modèle chargé
        
        Args:
            model_type: type de modèle
        
        Returns:
            dict avec informations
        """
        model = self.loaded_models.get(model_type)
        
        if model is None:
            return {'status': 'not_loaded'}
        
        info = {
            'status': 'loaded',
            'type': str(type(model).__name__)
        }
        
        # Info spécifique YOLO
        if model_type == 'yolo':
            try:
                info['model_size'] = model.model.yaml.get('nc', 'unknown')
                info['input_size'] = 640  # YOLO standard
            except:
                pass
        
        return info


class ModelConfig:
    """
    Configuration centralisée des modèles
    """
    
    # Chemins des modèles
    YOLO_MODEL_PATH = 'models/yolov8_aerospace.pt'
    CLASSIFIER_MODEL_PATH = 'models/component_classifier.pkl'
    
    # Classes de composants (doit correspondre au training YOLO)
    AEROSPACE_CLASSES = [
        'turbofan_engine',
        'rocket_engine',
        'wing',
        'satellite',
        'turbine_blade',
        'fuel_tank',
        'landing_gear',
        'cockpit',
        'propeller',
        'tail_section'
    ]
    
    # Mapping ID → Nom lisible
    CLASS_NAMES = {
        0: 'Turbofan Engine',
        1: 'Rocket Engine',
        2: 'Aircraft Wing',
        3: 'Satellite',
        4: 'Turbine Blade',
        5: 'Fuel Tank',
        6: 'Landing Gear',
        7: 'Cockpit',
        8: 'Propeller',
        9: 'Tail Section'
    }
    
    # Seuils de confiance
    CONFIDENCE_THRESHOLD = 0.25  # 25% minimum
    HIGH_CONFIDENCE = 0.80       # 80%+ = haute confiance
    
    # Paramètres de preprocessing
    IMAGE_SIZE = 640  # Taille standard YOLO
    MAX_IMAGE_SIZE = 1920  # Taille max avant resize
    
    @staticmethod
    def get_class_name(class_id):
        """Convertir ID de classe en nom"""
        return ModelConfig.CLASS_NAMES.get(class_id, f'Unknown_{class_id}')
    
    @staticmethod
    def get_class_id(class_name):
        """Convertir nom de classe en ID"""
        for id, name in ModelConfig.CLASS_NAMES.items():
            if name.lower() == class_name.lower():
                return id
        return -1
    
    @staticmethod
    def save_config(filepath='models/config.json'):
        """Sauvegarder la configuration"""
        config = {
            'classes': ModelConfig.AEROSPACE_CLASSES,
            'class_names': ModelConfig.CLASS_NAMES,
            'confidence_threshold': ModelConfig.CONFIDENCE_THRESHOLD,
            'image_size': ModelConfig.IMAGE_SIZE
        }
        
        with open(filepath, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"[Config] Configuration saved to {filepath}")
    
    @staticmethod
    def load_config(filepath='models/config.json'):
        """Charger la configuration depuis un fichier"""
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                config = json.load(f)
            
            ModelConfig.AEROSPACE_CLASSES = config.get('classes', ModelConfig.AEROSPACE_CLASSES)
            ModelConfig.CLASS_NAMES = {int(k): v for k, v in config.get('class_names', {}).items()}
            ModelConfig.CONFIDENCE_THRESHOLD = config.get('confidence_threshold', 0.25)
            
            print(f"[Config] Configuration loaded from {filepath}")
        else:
            print(f"[Config] No config file found at {filepath}, using defaults")


def download_pretrained_model():
    """
    Télécharger le modèle YOLO pré-entraîné si pas de modèle custom
    """
    print("[ModelLoader] Checking for pretrained YOLO models...")
    
    # Les modèles disponibles
    models = {
        'yolov8n.pt': 'Nano - Fastest, lowest accuracy',
        'yolov8s.pt': 'Small - Good balance',
        'yolov8m.pt': 'Medium - Better accuracy',
        'yolov8l.pt': 'Large - High accuracy',
        'yolov8x.pt': 'Extra Large - Highest accuracy'
    }
    
    # Par défaut, utiliser nano (le plus léger)
    default_model = 'yolov8n.pt'
    
    try:
        model = YOLO(default_model)
        print(f"[ModelLoader] ✓ Downloaded {default_model}")
        return model
    except Exception as e:
        print(f"[ModelLoader ERROR] Failed to download model: {e}")
        return None


def verify_model_files():
    """
    Vérifier que tous les fichiers de modèles nécessaires existent
    """
    models_dir = 'models'
    required_files = [
        'yolov8_aerospace.pt',  # Peut ne pas exister (optionnel)
    ]
    
    optional_files = [
        'component_classifier.pkl',
        'config.json'
    ]
    
    print("\n=== MODEL FILES VERIFICATION ===")
    
    # Créer le dossier models si n'existe pas
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
        print(f"Created directory: {models_dir}")
    
    # Vérifier les fichiers
    status = {
        'required': {},
        'optional': {}
    }
    
    for file in required_files:
        path = os.path.join(models_dir, file)
        exists = os.path.exists(path)
        status['required'][file] = '✓' if exists else '✗ (will use pretrained)'
        print(f"{status['required'][file]} {file}")
    
    for file in optional_files:
        path = os.path.join(models_dir, file)
        exists = os.path.exists(path)
        status['optional'][file] = '✓' if exists else '✗ (optional)'
        print(f"{status['optional'][file]} {file}")
    
    print("="*35)
    
    return status


if __name__ == "__main__":
    print("=== MODEL LOADER UTILITY ===\n")
    
    # Vérifier les fichiers
    verify_model_files()
    
    # Tester le chargement
    print("\n=== TESTING MODEL LOADING ===")
    loader = ModelLoader()
    
    # Charger YOLO
    yolo_model = loader.load_yolo_model()
    if yolo_model:
        print("✓ YOLO model ready")
    
    # Lister les modèles chargés
    print(f"\nLoaded models: {loader.list_loaded_models()}")
    
    # Info sur les modèles
    for model_type in loader.list_loaded_models():
        info = loader.get_model_info(model_type)
        print(f"{model_type}: {info}")
    
    print("\n=== MODEL LOADER READY ===")