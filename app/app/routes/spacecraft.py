from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, SpacecraftBuild

spacecraft_bp = Blueprint('spacecraft', __name__)

@spacecraft_bp.route('/', methods=['GET'])
@jwt_required()
def get_builds():
    user_id = get_jwt_identity()
    builds = SpacecraftBuild.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": b.id,
        "name": b.name,
        "components": b.components,
        "created_at": b.created_at.isoformat()
    } for b in builds])

@spacecraft_bp.route('/', methods=['POST'])
@jwt_required()
def save_build():
    user_id = get_jwt_identity()
    data = request.get_json()
    build = SpacecraftBuild(
        user_id=user_id,
        name=data.get('name', 'My Spacecraft'),
        components=data.get('components', [])
    )
    db.session.add(build)
    db.session.commit()
    return jsonify({"message": "Vaisseau sauvegardé", "id": build.id}), 201

@spacecraft_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_build(id):
    user_id = get_jwt_identity()
    build = SpacecraftBuild.query.filter_by(id=id, user_id=user_id).first_or_404()
    db.session.delete(build)
    db.session.commit()
    return jsonify({"message": "Vaisseau supprimé"})