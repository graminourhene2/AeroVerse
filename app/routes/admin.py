from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from app.models import db, User, SpacecraftBuild, Progress, Module, Lesson

admin_bp = Blueprint('admin', __name__)


def _require_admin():
    """Returns (user, error_response) — call after @jwt_required()."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or user.role != 'admin':
        return None, (jsonify({"error": "Admin access required"}), 403)
    return user, None


# ── Stats ──────────────────────────────────────────────────────────────────────

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    _, err = _require_admin()
    if err:
        return err
    return jsonify({
        "total_users":       User.query.count(),
        "total_builds":      SpacecraftBuild.query.count(),
        "total_progress":    Progress.query.count(),
        "completed_modules": Progress.query.filter_by(completed=True).count(),
    })


# ── Users ──────────────────────────────────────────────────────────────────────

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    _, err = _require_admin()
    if err:
        return err
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([{
        "id":             u.id,
        "email":          u.email,
        "username":       u.username,
        "role":           u.role,
        "created_at":     u.created_at.isoformat() if u.created_at else None,
        "builds_count":   SpacecraftBuild.query.filter_by(user_id=u.id).count(),
        "progress_count": Progress.query.filter_by(user_id=u.id).count(),
    } for u in users])


@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_role(user_id):
    _, err = _require_admin()
    if err:
        return err
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    user.role = data.get('role', 'student')
    db.session.commit()
    return jsonify({"message": "Role updated", "role": user.role})


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current, err = _require_admin()
    if err:
        return err
    if current.id == user_id:
        return jsonify({"error": "Cannot delete your own account"}), 400
    user = User.query.get_or_404(user_id)
    SpacecraftBuild.query.filter_by(user_id=user_id).delete()
    Progress.query.filter_by(user_id=user_id).delete()
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})


# ── Spacecraft builds ──────────────────────────────────────────────────────────

@admin_bp.route('/builds', methods=['GET'])
@jwt_required()
def get_all_builds():
    _, err = _require_admin()
    if err:
        return err
    builds = SpacecraftBuild.query.order_by(SpacecraftBuild.created_at.desc()).limit(100).all()
    users = {u.id: u.username for u in User.query.all()}
    return jsonify([{
        "id":         b.id,
        "user_id":    b.user_id,
        "username":   users.get(b.user_id, "Unknown"),
        "name":       b.name,
        "components": b.components,
        "created_at": b.created_at.isoformat(),
    } for b in builds])


@admin_bp.route('/builds/<int:build_id>', methods=['DELETE'])
@jwt_required()
def delete_build(build_id):
    _, err = _require_admin()
    if err:
        return err
    build = SpacecraftBuild.query.get_or_404(build_id)
    db.session.delete(build)
    db.session.commit()
    return jsonify({"message": "Build deleted"})


# ── Modules (Courses) ──────────────────────────────────────────────────────────

@admin_bp.route('/modules', methods=['GET'])
@jwt_required()
def get_modules_admin():
    _, err = _require_admin()
    if err:
        return err
    modules = Module.query.all()
    return jsonify([{
        "id":           m.id,
        "title":        m.title,
        "description":  m.description,
        "level":        m.level,
        "duration":     m.duration,
        "image_url":    m.image_url,
        "lessons_count": len(m.lessons)
    } for m in modules])


@admin_bp.route('/modules', methods=['POST'])
@jwt_required()
def create_module():
    _, err = _require_admin()
    if err:
        return err
    data = request.get_json()
    
    module = Module(
        title=data.get('title'),
        description=data.get('description'),
        level=data.get('level'),
        duration=data.get('duration'),
        image_url=data.get('image_url')
    )
    db.session.add(module)
    db.session.commit()
    
    return jsonify({"message": "Module created", "id": module.id}), 201


@admin_bp.route('/modules/<int:module_id>', methods=['PUT'])
@jwt_required()
def update_module(module_id):
    _, err = _require_admin()
    if err:
        return err
    module = Module.query.get_or_404(module_id)
    data = request.get_json()
    
    module.title = data.get('title', module.title)
    module.description = data.get('description', module.description)
    module.level = data.get('level', module.level)
    module.duration = data.get('duration', module.duration)
    module.image_url = data.get('image_url', module.image_url)
    db.session.commit()
    
    return jsonify({"message": "Module updated"})


@admin_bp.route('/modules/<int:module_id>', methods=['DELETE'])
@jwt_required()
def delete_module(module_id):
    _, err = _require_admin()
    if err:
        return err
    module = Module.query.get_or_404(module_id)
    Lesson.query.filter_by(module_id=module_id).delete()
    Progress.query.filter_by(module_id=module_id).delete()
    db.session.delete(module)
    db.session.commit()
    return jsonify({"message": "Module deleted"})


# ── Lessons ────────────────────────────────────────────────────────────────────

@admin_bp.route('/modules/<int:module_id>/lessons', methods=['GET'])
@jwt_required()
def get_lessons(module_id):
    _, err = _require_admin()
    if err:
        return err
    module = Module.query.get_or_404(module_id)
    return jsonify([{
        "id":         l.id,
        "title":      l.title,
        "content":    l.content,
        "video_url":  l.video_url,
        "order":      l.order
    } for l in sorted(module.lessons, key=lambda x: x.order or 0)])


@admin_bp.route('/modules/<int:module_id>/lessons', methods=['POST'])
@jwt_required()
def create_lesson(module_id):
    _, err = _require_admin()
    if err:
        return err
    Module.query.get_or_404(module_id)  # Verify module exists
    data = request.get_json()
    
    lesson = Lesson(
        module_id=module_id,
        title=data.get('title'),
        content=data.get('content'),
        video_url=data.get('video_url'),
        order=data.get('order', 0)
    )
    db.session.add(lesson)
    db.session.commit()
    
    return jsonify({"message": "Lesson created", "id": lesson.id}), 201


@admin_bp.route('/lessons/<int:lesson_id>', methods=['PUT'])
@jwt_required()
def update_lesson(lesson_id):
    _, err = _require_admin()
    if err:
        return err
    lesson = Lesson.query.get_or_404(lesson_id)
    data = request.get_json()
    
    lesson.title = data.get('title', lesson.title)
    lesson.content = data.get('content', lesson.content)
    lesson.video_url = data.get('video_url', lesson.video_url)
    lesson.order = data.get('order', lesson.order)
    db.session.commit()
    
    return jsonify({"message": "Lesson updated"})


@admin_bp.route('/lessons/<int:lesson_id>', methods=['DELETE'])
@jwt_required()
def delete_lesson(lesson_id):
    _, err = _require_admin()
    if err:
        return err
    lesson = Lesson.query.get_or_404(lesson_id)
    db.session.delete(lesson)
    db.session.commit()
    return jsonify({"message": "Lesson deleted"})


# ── User Password Reset ────────────────────────────────────────────────────────

@admin_bp.route('/users/<int:user_id>/password', methods=['PUT'])
@jwt_required()
def reset_password(user_id):
    _, err = _require_admin()
    if err:
        return err
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    new_password = data.get('password')
    
    if not new_password or len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    
    user.password = generate_password_hash(new_password)
    db.session.commit()
    
    return jsonify({"message": "Password reset successfully"})
