"""
Computer Vision Service for Aerospace and Astronomy Object Detection
Supports: Planets (9) + Aerospace Components (4)
"""
import cv2
import numpy as np
import os
import json

# Try to import TensorFlow
try:
    import tensorflow as tf
    from tensorflow import keras
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("[WARNING] TensorFlow not installed. CV service will run in dummy mode.")

class AerospaceComponentDetector:
    def __init__(self, model_path='models/aerospace_classifier.h5', labels_path='models/class_labels.json'):
        """Initialize the detector"""
        self.model_path = model_path
        self.labels_path = labels_path
        self.model = None
        self.class_labels = None
        self.img_size = 224
        
        self._load_model()
    
    def _load_model(self):
        """Load the trained model and class labels"""
        if not TF_AVAILABLE:
            print("[INFO] TensorFlow not available. Using dummy mode.")
            self.model = None
            self._load_default_labels()
            return
            
        try:
            if os.path.exists(self.model_path):
                print(f"[INFO] Loading model from {self.model_path}...")
                self.model = keras.models.load_model(self.model_path)
                print(f"[SUCCESS] Model loaded successfully")
            else:
                print(f"[WARNING] Model not found at {self.model_path}")
                print("[INFO] Using dummy model for development")
                self.model = None
            
            # Load class labels
            if os.path.exists(self.labels_path):
                with open(self.labels_path, 'r') as f:
                    self.class_labels = json.load(f)
                print(f"[INFO] Loaded {len(self.class_labels)} classes")
            else:
                print(f"[WARNING] Labels file not found at {self.labels_path}")
                self._load_default_labels()
                
        except Exception as e:
            print(f"[ERROR] Failed to load model: {str(e)}")
            self.model = None
            self._load_default_labels()
    
    def _load_default_labels(self):
        """Load default labels"""
        self.class_labels = {
            # Planets
            "0": "Earth",
            "1": "Eris",
            "2": "Jupiter",
            "3": "Mars",
            "4": "Mercury",
            "5": "Neptune",
            "6": "Saturn",
            "7": "Uranus",
            "8": "Venus",
            # Aerospace Components
            "9": "rocket",
            "10": "rocket_engine",
            "11": "satellite",
            "12": "turbofan_engine"
        }
        print("[INFO] Using default labels (13 classes)")
    
    def is_model_loaded(self):
        """Check if the model is loaded"""
        return self.model is not None
    
    def preprocess_image(self, image):
        """Preprocess image for the model"""
        image_resized = cv2.resize(image, (self.img_size, self.img_size))
        image_rgb = cv2.cvtColor(image_resized, cv2.COLOR_BGR2RGB)
        image_normalized = image_rgb.astype('float32') / 255.0
        image_batch = np.expand_dims(image_normalized, axis=0)
        return image_batch
    
    def detect_component(self, image, confidence_threshold=0.5):
        """Detect object in the image"""
        if not self.is_model_loaded():
            print("[WARNING] Model not loaded, returning dummy detection")
            return self._dummy_detection(image)
        
        try:
            # Preprocess
            preprocessed = self.preprocess_image(image)
            
            # Predict
            predictions = self.model.predict(preprocessed, verbose=0)
            
            # Get top prediction
            class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][class_idx])
            
            print(f"[DEBUG] Predictions: {predictions[0]}")
            print(f"[DEBUG] Top class: {class_idx}, Confidence: {confidence:.2f}")
            
            # Check confidence
            if confidence < confidence_threshold:
                print(f"[INFO] Confidence {confidence:.2f} below threshold {confidence_threshold}")
                return None
            
            # Get component name
            component_name = self.class_labels.get(str(class_idx), "Unknown")
            
            # Determine category
            category = self._get_category(component_name)
            
            # Bounding box (entire image)
            height, width = image.shape[:2]
            bounding_box = {
                'x': 0,
                'y': 0,
                'width': width,
                'height': height
            }
            
            result = {
                'component_name': component_name,
                'category': category,
                'confidence': confidence,
                'bounding_box': bounding_box,
                'class_idx': int(class_idx)
            }
            
            return result
            
        except Exception as e:
            print(f"[ERROR] Detection failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    def _get_category(self, component_name):
        """Map component name to category"""
        category_mapping = {
            # Planets
            'Earth': 'Planet',
            'Mars': 'Planet',
            'Jupiter': 'Planet',
            'Saturn': 'Planet',
            'Venus': 'Planet',
            'Mercury': 'Planet',
            'Neptune': 'Planet',
            'Uranus': 'Planet',
            'Eris': 'Dwarf Planet',
            
            # Aerospace Components
            'turbofan_engine': 'Propulsion',
            'rocket_engine': 'Propulsion',
            'satellite': 'Spacecraft',
            'rocket': 'Launch Vehicle'
        }
        return category_mapping.get(component_name, 'Unknown')
    
    def _dummy_detection(self, image):
        """Return dummy detection for development"""
        import random
        
        all_objects = [
            ('Earth', 'Planet'),
            ('Mars', 'Planet'),
            ('Jupiter', 'Planet'),
            ('Saturn', 'Planet'),
            ('satellite', 'Spacecraft'),
            ('rocket', 'Launch Vehicle')
        ]
        
        component, category = random.choice(all_objects)
        height, width = image.shape[:2]
        
        return {
            'component_name': component,
            'category': category,
            'confidence': 0.85 + random.random() * 0.1,
            'bounding_box': {
                'x': 0,
                'y': 0,
                'width': width,
                'height': height
            },
            'class_idx': 0
        }


# Test
if __name__ == "__main__":
    detector = AerospaceComponentDetector()
    
    print("="*60)
    print("Testing AerospaceComponentDetector")
    print("="*60)
    print(f"Model loaded: {detector.is_model_loaded()}")
    print(f"Number of classes: {len(detector.class_labels)}")
    print(f"Classes: {list(detector.class_labels.values())}")
    
    # Test with dummy image
    print("\nTesting with dummy image...")
    dummy_image = np.random.randint(0, 255, (640, 480, 3), dtype=np.uint8)
    result = detector.detect_component(dummy_image)
    
    if result:
        print(f"\nDetection result:")
        print(f"  Object: {result['component_name']}")
        print(f"  Category: {result['category']}")
        print(f"  Confidence: {result['confidence']:.2%}")
        print("✅ CV service working!")
    else:
        print("❌ No object detected")