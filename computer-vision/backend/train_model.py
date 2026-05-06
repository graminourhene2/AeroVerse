"""
Training script for Aerospace Component Classifier
Uses Transfer Learning with MobileNetV2
"""
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import json
import os

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 16
EPOCHS = 20
DATA_DIR = 'training_data'  # Folder with subfolders for each component class
MODEL_SAVE_PATH = 'models/aerospace_classifier.h5'
LABELS_SAVE_PATH = 'models/class_labels.json'

def create_model(num_classes):
    """
    Create the CNN model using Transfer Learning
    
    Args:
        num_classes: Number of component categories
    
    Returns:
        Compiled Keras model
    """
    # Load pre-trained MobileNetV2 (trained on ImageNet)
    base_model = keras.applications.MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,  # Don't include classification layer
        weights='imagenet'
    )
    
    # Freeze the base model (don't retrain it)
    base_model.trainable = False
    
    # Build the full model
    model = keras.Sequential([
        # Preprocessing
        layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3)),
        
        # Pre-trained base
        base_model,
        
        # Custom classification head
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(128, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    # Compile
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model


def train():
    """Main training function"""
    
    print("="*70)
    print("AeroVerse Component Classifier Training")
    print("="*70)
    
    # Check if training data exists
    if not os.path.exists(DATA_DIR):
        print(f"\n❌ ERROR: Training data folder '{DATA_DIR}' not found!")
        print("\nPlease organize your data like this:")
        print(f"{DATA_DIR}/")
        print("  ├── turbofan_engine/")
        print("  │   ├── img1.jpg")
        print("  │   ├── img2.jpg")
        print("  ├── rocket_engine/")
        print("  │   ├── img1.jpg")
        print("  ├── wing/")
        print("  └── ...")
        return
    
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2  # 80% train, 20% validation
    )
    
    # Load training data
    print(f"\n📂 Loading training data from {DATA_DIR}...")
    train_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )
    
    # Load validation data
    val_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )
    
    num_classes = len(train_generator.class_indices)
    print(f"\n✅ Found {num_classes} component classes:")
    for class_name, class_idx in train_generator.class_indices.items():
        print(f"   {class_idx}: {class_name}")
    
    print(f"\n📊 Training samples: {train_generator.samples}")
    print(f"📊 Validation samples: {val_generator.samples}")
    
    # Create the model
    print(f"\n🏗️  Building model...")
    model = create_model(num_classes)
    
    print("\nModel architecture:")
    model.summary()
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=5,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7
        ),
        keras.callbacks.ModelCheckpoint(
            MODEL_SAVE_PATH,
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        )
    ]
    
    # Train
    print(f"\n🚀 Starting training for {EPOCHS} epochs...")
    print("="*70)
    
    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=EPOCHS,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate
    print("\n" + "="*70)
    print("📈 Training completed!")
    print("="*70)
    
    final_train_acc = history.history['accuracy'][-1]
    final_val_acc = history.history['val_accuracy'][-1]
    best_val_acc = max(history.history['val_accuracy'])
    
    print(f"\n✅ Final Training Accuracy: {final_train_acc:.2%}")
    print(f"✅ Final Validation Accuracy: {final_val_acc:.2%}")
    print(f"🏆 Best Validation Accuracy: {best_val_acc:.2%}")
    
    # Save class labels
    os.makedirs(os.path.dirname(LABELS_SAVE_PATH), exist_ok=True)
    
    # Reverse the class_indices dictionary (index -> name)
    class_labels = {str(v): k for k, v in train_generator.class_indices.items()}
    
    with open(LABELS_SAVE_PATH, 'w') as f:
        json.dump(class_labels, f, indent=2)
    
    print(f"\n💾 Model saved to: {MODEL_SAVE_PATH}")
    print(f"💾 Labels saved to: {LABELS_SAVE_PATH}")
    
    print("\n" + "="*70)
    print("🎉 Training complete! You can now use the model in your Flask API.")
    print("="*70)


if __name__ == "__main__":
    train()