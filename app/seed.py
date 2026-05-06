from app import create_app
from app.models import db, Module, Lesson, User, Progress, SpacecraftBuild
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    # 🧹 Nettoyer toutes les données
    Progress.query.delete()
    SpacecraftBuild.query.delete()
    Lesson.query.delete()
    Module.query.delete()
    User.query.delete()
    db.session.commit()
    print("🧹 Base de données nettoyée")
    
    # 👥 Créer les utilisateurs de test
    users = [
        User(email='nour@test123', password=generate_password_hash('1234'), username='Nour', role='student'),
        User(email='wiem@test456', password=generate_password_hash('5678'), username='Wiem', role='student'),
        User(email='admin@admin.com', password=generate_password_hash('admin123'), username='Admin', role='admin'),
    ]
    db.session.add_all(users)
    db.session.flush()
    nour, wiem, admin = users
    print("✅ 3 utilisateurs créés")
    
    # 📚 Créer les modules éducatifs
    modules = [
        Module(
            title="Space Flight Basics",
            description="Learn the fundamentals of space travel and orbital mechanics",
            level="Beginner",
            duration="2.5 hours",
            image_url="https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500"
        ),
        Module(
            title="Rocket Engineering",
            description="Deep dive into rocket design and propulsion systems",
            level="Intermediate",
            duration="4 hours",
            image_url="https://images.unsplash.com/photo-1520257328559-2062fc7de0b3?w=500"
        ),
        Module(
            title="Satellite Technology",
            description="Understanding satellites and their applications",
            level="Intermediate",
            duration="3 hours",
            image_url="https://images.unsplash.com/photo-1597120081843-631bddc57076?w=500"
        ),
        Module(
            title="Advanced Propulsion",
            description="Master rocket science and advanced propulsion systems",
            level="Advanced",
            duration="5 hours",
            image_url="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500"
        ),
    ]
    db.session.add_all(modules)
    db.session.flush()
    print("✅ 4 modules créés")
    
    # 📖 Créer les leçons
    lessons_data = [
        # Module 1: Space Flight Basics (8 leçons)
        (modules[0].id, [
            ("Introduction to Space", "History of space exploration and the space age"),
            ("Orbital Mechanics", "How orbits work and Kepler's laws"),
            ("Rocket Propulsion", "Newton's third law and rocket engines"),
            ("Re-entry Physics", "How spacecraft return from orbit"),
            ("Zero Gravity", "Living and working in space"),
            ("Earth's Atmosphere", "Layers and their properties"),
            ("Navigation Systems", "GPS and space navigation"),
            ("History of Spaceflight", "From Sputnik to modern rockets"),
        ]),
        # Module 2: Rocket Engineering (8 leçons)
        (modules[1].id, [
            ("Rocket Structures", "Materials and structural design"),
            ("Fuel Systems", "Liquid vs solid propellant"),
            ("Guidance Systems", "Navigation and attitude control"),
            ("Launch Vehicle Design", "Multi-stage rockets"),
            ("Payload Integration", "Connecting satellites to rockets"),
            ("Ground Operations", "Launch preparation and countdown"),
            ("Failure Analysis", "Learning from launch failures"),
            ("Future Rockets", "Next generation launch vehicles"),
        ]),
        # Module 3: Satellite Technology (8 leçons)
        (modules[2].id, [
            ("Types of Satellites", "LEO, MEO, GEO orbits"),
            ("Communication Systems", "How satellites transmit data"),
            ("Earth Observation", "Remote sensing and imaging"),
            ("Scientific Satellites", "Research spacecraft"),
            ("Weather Satellites", "Meteorological systems"),
            ("Navigation Satellites", "GPS constellation"),
            ("Space Debris", "Orbital pollution management"),
            ("Satellite Operations", "Maintenance and control"),
        ]),
        # Module 4: Advanced Propulsion (8 leçons)
        (modules[3].id, [
            ("Ion Engines", "Electric propulsion technology"),
            ("Nuclear Propulsion", "Advanced energy sources"),
            ("Hypersonic Flight", "Breaking sound barriers"),
            ("Space Tether", "Electrodynamic systems"),
            ("Solar Sails", "Photon propulsion"),
            ("Thermal Propulsion", "Heat-based engines"),
            ("Aerobraking", "Atmospheric drag maneuvers"),
            ("Future Concepts", "Theoretical propulsion systems"),
        ]),
    ]
    
    all_lessons = []
    for module_id, lesson_titles in lessons_data:
        for order, (title, content) in enumerate(lesson_titles, 1):
            lesson = Lesson(
                module_id=module_id,
                title=title,
                content=content,
                order=order,
                video_url=f"https://www.youtube.com/embed/dQw4w9WgXcQ"
            )
            all_lessons.append(lesson)
    
    db.session.add_all(all_lessons)
    db.session.flush()
    print(f"✅ {len(all_lessons)} leçons créées")
    
    # 📊 Créer progression pour utilisateurs de test
    progress_data = [
        Progress(user_id=nour.id, module_id=modules[0].id, completed=True, score=92, time_spent=150),
        Progress(user_id=nour.id, module_id=modules[1].id, completed=False, score=65, time_spent=90),
        Progress(user_id=wiem.id, module_id=modules[0].id, completed=True, score=88, time_spent=140),
        Progress(user_id=wiem.id, module_id=modules[2].id, completed=False, score=70, time_spent=100),
    ]
    db.session.add_all(progress_data)
    db.session.flush()
    print("✅ Progression sauvegardée pour les utilisateurs")
    
    # 🚀 Créer des vaisseaux spatiaux
    spacecraft_data = [
        SpacecraftBuild(
            user_id=nour.id,
            name="My First Rocket",
            components=["engine-1", "fuel-tank-1", "capsule-1", "antenna-1"]
        ),
        SpacecraftBuild(
            user_id=wiem.id,
            name="Mars Explorer",
            components=["capsule-2", "engine-2", "solar-panel-1", "lab-1", "habitat-1"]
        ),
    ]
    db.session.add_all(spacecraft_data)
    
    db.session.commit()
    print("✅ 2 vaisseaux spatiaux créés")
    
    print("\n" + "="*50)
    print("✅ BASE DE DONNEES INITIALISEE AVEC SUCCES !")
    print("="*50)
    print("\n👤 UTILISATEURS DE TEST:")
    print("   1. nour@test123 / 1234")
    print("   2. wiem@test456 / 5678")
    print("   3. admin@admin.com / admin123")
    print("\n📚 MODULES: 4 modules avec 32 leçons")
    print("📊 PROGRESSION: 4 enregistrements")
    print("🚀 VAISSEAUX: 2 constructions sauvegardées")
    print("="*50)