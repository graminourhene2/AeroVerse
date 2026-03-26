from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print(f"📝 Register attempt: {data}")
        
        # Validation
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400
        
        # Check if email is valid format
        if '@' not in data.get('email', ''):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Check password length
        if len(data.get('password', '')) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "This email is already registered"}), 400
        
        hashed = generate_password_hash(data['password'])
        user = User(
            email=data['email'],
            password=hashed,
            username=data.get('username', data['email'].split('@')[0])
        )
        db.session.add(user)
        db.session.commit()
        print(f"✅ User created: {user.email}")
        return jsonify({"message": "Account created successfully", "user_id": user.id}), 201
    except Exception as e:
        db.session.rollback()
        print(f"❌ Register error: {str(e)}")
        return jsonify({"error": f"Unable to create account: {str(e)}"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validation
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        print(f"🔐 Login attempt: {email}")
        
        user = User.query.filter_by(email=email).first()
        print(f"   User found: {user is not None}")
        
        if not user:
            return jsonify({"error": "User not found"}), 401
        
        if not check_password_hash(user.password, password):
            print(f"   Password check: FAILED")
            return jsonify({"error": "Email or password is incorrect"}), 401
        
        print(f"   ✅ Login successful!")
        token = create_access_token(identity=str(user.id))
        return jsonify({
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "role": user.role
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        return jsonify({"error": "Unable to sign in. Please try again."}), 500

@auth_bp.route('/me', methods=['GET'])
def me():
    return jsonify({"message": "profil"})