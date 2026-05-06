from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id         = db.Column(db.Integer, primary_key=True)
    email      = db.Column(db.String(120), unique=True, nullable=False)
    password   = db.Column(db.String(200), nullable=False)
    username   = db.Column(db.String(80))
    role       = db.Column(db.String(20), default='student')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Module(db.Model):
    __tablename__ = 'modules'
    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    level       = db.Column(db.String(20))
    duration    = db.Column(db.String(20))
    image_url   = db.Column(db.String(255))
    lessons     = db.relationship('Lesson', backref='module', lazy=True)

class Lesson(db.Model):
    __tablename__ = 'lessons'
    id        = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    title     = db.Column(db.String(100), nullable=False)
    content   = db.Column(db.Text)
    order     = db.Column(db.Integer)
    video_url = db.Column(db.String(255))

class Progress(db.Model):
    __tablename__ = 'progress'
    id            = db.Column(db.Integer, primary_key=True)
    user_id       = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_id     = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    completed     = db.Column(db.Boolean, default=False)
    score         = db.Column(db.Float, default=0)
    time_spent    = db.Column(db.Integer, default=0)
    last_accessed = db.Column(db.DateTime, default=datetime.utcnow)

class SpacecraftBuild(db.Model):
    __tablename__ = 'spacecraft_builds'
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name       = db.Column(db.String(100))
    components = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)