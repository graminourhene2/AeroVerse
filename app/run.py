import os
import sys
from app import create_app

print("=" * 60)
print("🚀 STARTING AEROVERSE BACKEND")
print("=" * 60)

# Diagnostics
print("\n📋 DIAGNOSTICS:")
print(f"  ✅ Python version: {sys.version}")
print(f"  ✅ DATABASE_URL: {os.getenv('DATABASE_URL', 'NOT SET')}")
print(f"  ✅ JWT_SECRET: {os.getenv('JWT_SECRET', 'NOT SET')}")

try:
    app = create_app()
    print("  ✅ Flask app created successfully")
except Exception as e:
    print(f"  ❌ ERROR creating Flask app: {e}")
    sys.exit(1)

# Create tables
print("\n📊 DATABASE SETUP:")
try:
    from app.models import db
    with app.app_context():
        db.create_all()
        print("  ✅ Tables created/verified")
except Exception as e:
    print(f"  ❌ ERROR creating tables: {e}")
    sys.exit(1)

# Start server
print("\n🌐 SERVER:")
print("  ✅ Starting Flask server...")
print("  📍 http://127.0.0.1:5000")
print("  📍 Frontend: http://localhost:5173")
print("\n" + "=" * 60)

if __name__ == '__main__':
    try:
        app.run(debug=True, host='127.0.0.1', port=5000)
    except Exception as e:
        print(f"\n❌ SERVER ERROR: {e}")
        sys.exit(1)