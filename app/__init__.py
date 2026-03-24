from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    from app.models import db
    db.init_app(app)
    
    JWTManager(app)
    CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"])

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    from app.routes.modules import modules_bp
    app.register_blueprint(modules_bp, url_prefix="/api/modules")

    from app.routes.spacecraft import spacecraft_bp
    app.register_blueprint(spacecraft_bp, url_prefix="/api/spacecraft")
    
    from app.routes.chat import chat_bp
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    
    from app.routes.cv import cv_bp
    app.register_blueprint(cv_bp, url_prefix="/api/cv")
    
    from app.routes.quiz import quiz_bp
    app.register_blueprint(quiz_bp, url_prefix="/api/quiz")

    return app