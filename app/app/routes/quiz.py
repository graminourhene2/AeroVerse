from flask import Blueprint, request, jsonify
from datetime import datetime
from app.models import db, User, Progress
from flask_jwt_extended import jwt_required, get_jwt_identity

quiz_bp = Blueprint("quiz", __name__, url_prefix="/api/quiz")

# Quiz data - 3 modules with multiple questions each
QUIZ_DATA = {
    1: {
        "title": "Orbital Mechanics Basics",
        "questions": [
            {
                "id": 1,
                "text": "Qu'est-ce que l'orbite géostationnaire?",
                "options": [
                    "Une orbite à 36,000 km d'altitude",
                    "Une orbite à 400 km d'altitude",
                    "Une orbite lunaire",
                    "Une orbite à 10,000 km d'altitude"
                ],
                "correctAnswer": 0,
                "explanation": "L'orbite géostationnaire est à environ 36,000 km, synchronisée avec la rotation terrestre."
            },
            {
                "id": 2,
                "text": "La vitesse de libération de la Terre est d'environ:",
                "options": [
                    "11.2 km/s",
                    "7.8 km/s",
                    "5.5 km/s",
                    "15.3 km/s"
                ],
                "correctAnswer": 0,
                "explanation": "La vitesse de libération est ~11.2 km/s, nécessaire pour échapper au champ gravitationnel terrestre."
            },
            {
                "id": 3,
                "text": "À quelle altitude l'ISS orbite-t-elle?",
                "options": [
                    "Environ 400 km",
                    "Environ 1000 km",
                    "Environ 200 km",
                    "Environ 600 km"
                ],
                "correctAnswer": 0,
                "explanation": "L'ISS orbite à environ 408 km d'altitude, complétant une orbite toutes les 90 minutes."
            },
            {
                "id": 4,
                "text": "Quel facteur affecte la période orbitale d'un satellite?",
                "options": [
                    "L'altitude et la masse du corps central",
                    "La couleur du satellite",
                    "La température de l'espace",
                    "L'âge de la mission"
                ],
                "correctAnswer": 0,
                "explanation": "Selon la 3e loi de Kepler, la période dépend de l'altitude et de la masse du corps central."
            },
            {
                "id": 5,
                "text": "Qu'est-ce que la 'fenêtre de lancement'?",
                "options": [
                    "La période de temps viable pour lancer une fusée",
                    "Une ouverture dans le fuselage de la fusée",
                    "Une théorie physique",
                    "Un type de système de navigation"
                ],
                "correctAnswer": 0,
                "explanation": "C'est la période optimale pour lancer une mission vers une destination donnée."
            }
        ]
    },
    2: {
        "title": "Space Propulsion Systems",
        "questions": [
            {
                "id": 1,
                "text": "Quel carburant utilisent la plupart des fusées modernes?",
                "options": [
                    "Kérosène et oxygène liquide",
                    "Essence pure",
                    "Diesel",
                    "Propane uniquement"
                ],
                "correctAnswer": 0,
                "explanation": "Le kérosène (RP-1) et l'oxygène liquide (LOX) offrent un excellent rapport énergie/masse."
            },
            {
                "id": 2,
                "text": "Combien de temps faut-il pour atteindre la Lune?",
                "options": [
                    "3-4 jours",
                    "1 semaine",
                    "2 semaines",
                    "1 mois"
                ],
                "correctAnswer": 0,
                "explanation": "Les missions Apollo prennent environ 3-4 jours pour atteindre la Lune."
            },
            {
                "id": 3,
                "text": "Quel est l'équivalent spécifique du carburant pour une fusée?",
                "options": [
                    "Impulsion spécifique (Isp)",
                    "Ratio de masse",
                    "Vitesse d'échappement",
                    "Densité énergétique"
                ],
                "correctAnswer": 0,
                "explanation": "L'impulsion spécifique mesure l'efficacité du carburant en secondes."
            },
            {
                "id": 4,
                "text": "La gravité sur la Lune est combien de fois moins forte que sur Terre?",
                "options": [
                    "6 fois",
                    "2 fois",
                    "10 fois",
                    "4 fois"
                ],
                "correctAnswer": 0,
                "explanation": "La Lune a ~1/6 de la gravité terrestre, affectant la mobilité des astronautes."
            },
            {
                "id": 5,
                "text": "Qu'est-ce qu'un point de Lagrange?",
                "options": [
                    "Point d'équilibre gravitationnel entre deux corps",
                    "Une région du système solaire",
                    "Un type de fusée",
                    "Une orbite polaire"
                ],
                "correctAnswer": 0,
                "explanation": "Les points de Lagrange sont des positions où les forces gravitationnelles s'équilibrent."
            }
        ]
    },
    3: {
        "title": "Spacecraft Engineering",
        "questions": [
            {
                "id": 1,
                "text": "Quel est le rôle principal d'un radiateur thermique sur un satellite?",
                "options": [
                    "Dissiper la chaleur en excès",
                    "Générer de l'énergie",
                    "Amplifier les signaux radio",
                    "Protéger contre les impacts"
                ],
                "correctAnswer": 0,
                "explanation": "Les radiateurs évacuent la chaleur produite par les équipements électroniques."
            },
            {
                "id": 2,
                "text": "Les panneaux solaires d'un satellite génèrent environ combien de watts par mètre carré?",
                "options": [
                    "1400 W/m²",
                    "500 W/m²",
                    "2000 W/m²",
                    "1000 W/m²"
                ],
                "correctAnswer": 0,
                "explanation": "La constante solaire est ~1361 W/m² au-dessus de l'atmosphère terrestre."
            },
            {
                "id": 3,
                "text": "Quel système contrôle l'orientation d'un satellite?",
                "options": [
                    "Système d'orientation/d'attitude",
                    "Système de propulsion",
                    "Système de communication",
                    "Système de stockage"
                ],
                "correctAnswer": 0,
                "explanation": "Le contrôle d'attitude utilise des gyroscopes et des vérins pour orienter le satellite."
            },
            {
                "id": 4,
                "text": "Quel est le but d'une chambre de combustion de fusée?",
                "options": [
                    "Brûler le carburant et créer une poussée",
                    "Stocker le carburant",
                    "Refroidir les gaz chauds",
                    "Mesurer la pression"
                ],
                "correctAnswer": 0,
                "explanation": "La chambre brûle le carburant pour créer des gaz chauds expulsés par la tuyère."
            },
            {
                "id": 5,
                "text": "Combien de capteurs un vaisseau spatial peut-il avoir?",
                "options": [
                    "De douzaines à des milliers",
                    "Maximum 10",
                    "Seulement 1 ou 2",
                    "Les satellites n'ont pas de capteurs"
                ],
                "correctAnswer": 0,
                "explanation": "Les satellites modernes ont de nombreux capteurs pour diverses mesures scientifiques."
            }
        ]
    },
    4: {
        "title": "Mission Planning",
        "questions": [
            {
                "id": 1,
                "text": "Qu'est-ce qu'une trajectoire de transfert Hohmann?",
                "options": [
                    "Une orbite économe en carburant entre deux orbites",
                    "Une orbite polaire",
                    "Une trajectoire rectiligne",
                    "Une descente atmosphérique"
                ],
                "correctAnswer": 0,
                "explanation": "C'est la trajectoire la plus économe en carburant entre deux orbites circulaires."
            },
            {
                "id": 2,
                "text": "Combien de fusées SpaceX Falcon 9 ont déjà volé?",
                "options": [
                    "Plus de 200",
                    "Moins de 50",
                    "Exactement 100",
                    "Seulement 10"
                ],
                "correctAnswer": 0,
                "explanation": "Falcon 9 réutilisable a révolutionné l'accès à l'espace avec ses nombreux lancements."
            },
            {
                "id": 3,
                "text": "Quel est le principal défi de l'exploration martienne?",
                "options": [
                    "Distance et temps de transit",
                    "Manque de carburant",
                    "Mauvaise trajectoire",
                    "Absence de technologie"
                ],
                "correctAnswer": 0,
                "explanation": "Mars est à plusieurs millions de km, nécessitant 6-9 mois de transit."
            },
            {
                "id": 4,
                "text": "À quelle vitesse la Terre tourne-t-elle autour du Soleil?",
                "options": [
                    "~30 km/s",
                    "~100 km/s",
                    "~10 km/s",
                    "~50 km/s"
                ],
                "correctAnswer": 0,
                "explanation": "La Terre orbite le Soleil à une vitesse moyenne d'environ 30 km/s."
            },
            {
                "id": 5,
                "text": "Quel est le but d'une correction de trajectoire en vol?",
                "options": [
                    "Ajuster la course pour atteindre la cible",
                    "Réduire la vitesse",
                    "Tourner le vaisseau",
                    "Vérifier les capteurs"
                ],
                "correctAnswer": 0,
                "explanation": "Les corrections ajustent la trajectoire pour compenser les erreurs de lancement."
            }
        ]
    }
}

@quiz_bp.route("/<int:module_id>", methods=["GET"])
def get_quiz(module_id):
    """Récupère le quiz pour un module"""
    if module_id not in QUIZ_DATA:
        return jsonify({"error": "Module not found"}), 404
    
    quiz = QUIZ_DATA[module_id]
    # Ne pas inclure les réponses correctes dans la réponse
    quiz_copy = {
        "title": quiz["title"],
        "questions": [
            {
                "id": q["id"],
                "text": q["text"],
                "options": q["options"],
                "explanation": q["explanation"]
            } for q in quiz["questions"]
        ]
    }
    return jsonify(quiz_copy), 200

@quiz_bp.route("/<int:module_id>/submit", methods=["POST"])
@jwt_required()
def submit_quiz(module_id):
    """Soumet et évalue un quiz"""
    data = request.get_json()
    answers = data.get("answers", {})  # {question_id: selected_option_index}
    
    if module_id not in QUIZ_DATA:
        return jsonify({"error": "Module not found"}), 404
    
    quiz = QUIZ_DATA[module_id]
    score = 0
    total = len(quiz["questions"])
    detailed_results = []
    
    for question in quiz["questions"]:
        q_id = question["id"]
        user_answer = answers.get(str(q_id), -1)
        is_correct = user_answer == question["correctAnswer"]
        
        if is_correct:
            score += 1
        
        detailed_results.append({
            "id": q_id,
            "text": question["text"],
            "userAnswer": user_answer,
            "correctAnswer": question["correctAnswer"],
            "isCorrect": is_correct,
            "explanation": question["explanation"]
        })
    
    percentage = round((score / total) * 100) if total > 0 else 0
    user_id = get_jwt_identity()
    
    # Sauvegarder la progression
    try:
        progress = Progress.query.filter_by(
            user_id=user_id, 
            module_id=module_id
        ).first()
        
        if progress:
            progress.score = max(progress.score, percentage)
            progress.completed = percentage >= 80
            progress.completed_at = datetime.utcnow()
        else:
            progress = Progress(
                user_id=user_id,
                module_id=module_id,
                score=percentage,
                completed=percentage >= 80,
                completed_at=datetime.utcnow()
            )
            db.session.add(progress)
        
        db.session.commit()
    except Exception as e:
        print(f"Error saving progress: {e}")
    
    return jsonify({
        "score": score,
        "total": total,
        "percentage": percentage,
        "passed": percentage >= 80,
        "results": detailed_results
    }), 200
