from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Module, Lesson, Progress

modules_bp = Blueprint('modules', __name__)

@modules_bp.route('/', methods=['GET'])
def get_modules():
    modules = Module.query.all()
    return jsonify([{
        "id": m.id,
        "title": m.title,
        "description": m.description,
        "level": m.level,
        "duration": m.duration,
        "image_url": m.image_url,
        "lessons_count": len(m.lessons)
    } for m in modules])

@modules_bp.route('/<int:id>', methods=['GET'])
def get_module(id):
    m = Module.query.get_or_404(id)
    lessons = [{
        "id": l.id,
        "title": l.title,
        "order": l.order,
        "video_url": l.video_url,
        "content": l.content
    } for l in sorted(m.lessons, key=lambda x: x.order or 0)]
    return jsonify({
        "id": m.id,
        "title": m.title,
        "description": m.description,
        "level": m.level,
        "duration": m.duration,
        "image_url": m.image_url,
        "lessons": lessons
    })

@modules_bp.route('/progress', methods=['POST'])
@jwt_required()
def save_progress():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    progress = Progress.query.filter_by(
        user_id=user_id,
        module_id=data['module_id']
    ).first()
    
    if progress:
        progress.score = data.get('score', progress.score)
        progress.completed = data.get('completed', progress.completed)
        progress.time_spent = data.get('time_spent', progress.time_spent)
    else:
        progress = Progress(
            user_id=user_id,
            module_id=data['module_id'],
            score=data.get('score', 0),
            completed=data.get('completed', False),
            time_spent=data.get('time_spent', 0)
        )
        db.session.add(progress)
    
    db.session.commit()
    return jsonify({"message": "Progression sauvegardée"})

@modules_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress():
    user_id = get_jwt_identity()
    progresses = Progress.query.filter_by(user_id=user_id).all()
    
    total_time = sum(p.time_spent for p in progresses)
    completed = sum(1 for p in progresses if p.completed)
    
    return jsonify({
        "courses_started": len(progresses),
        "lessons_completed": completed,
        "study_time": round(total_time / 60, 1),
        "details": [{
            "module_id": p.module_id,
            "completed": p.completed,
            "score": p.score,
            "time_spent": p.time_spent
        } for p in progresses]
    })