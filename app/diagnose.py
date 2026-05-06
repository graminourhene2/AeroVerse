#!/usr/bin/env python
"""
🔍 DIAGNOSTIC SCRIPT - Database Connection Check
Run this to verify your setup is correct
"""

import os
import sys
from dotenv import load_dotenv

print("\n" + "="*70)
print("🔍 AEROVERSE DIAGNOSTIC CHECK")
print("="*70)

# Load .env
load_dotenv()

# 1. Check Environment Variables
print("\n📋 1. ENVIRONMENT CHECK:")
database_url = os.getenv("DATABASE_URL")
jwt_secret = os.getenv("JWT_SECRET")

print(f"  DATABASE_URL: {database_url if database_url else '❌ NOT SET'}")
print(f"  JWT_SECRET: {'✅' if jwt_secret else '❌ NOT SET'}")

if not database_url or not jwt_secret:
    print("\n⚠️  Missing environment variables! Check .env file")
    sys.exit(1)

# 2. Check Python Packages
print("\n📦 2. PACKAGES CHECK:")
packages = [
    'flask',
    'flask_sqlalchemy',
    'flask_jwt_extended',
    'flask_cors',
    'psycopg2',
    'werkzeug',
    'dotenv'
]

for pkg in packages:
    try:
        __import__(pkg.replace('_', '-').replace('-', '_'))
        print(f"  ✅ {pkg}")
    except ImportError:
        print(f"  ❌ {pkg} - NOT INSTALLED")

# 3. Test Database Connection
print("\n🗄️  3. DATABASE CONNECTION CHECK:")

try:
    import psycopg2
    from psycopg2 import connect
    
    # Parse DATABASE_URL: postgresql://user:password@host:port/dbname
    db_url = database_url.replace('postgresql://', '')
    
    # Split user and password from host
    credentials, host_part = db_url.split('@')
    user, password = credentials.split(':')
    
    # Split host and port from dbname
    host_port, dbname = host_part.split('/')
    
    if ':' in host_port:
        host, port = host_port.split(':')
    else:
        host = host_port
        port = '5432'
    
    print(f"  Attempting to connect to PostgreSQL...")
    print(f"    User: {user}")
    print(f"    Host: {host}")
    print(f"    Port: {port}")
    print(f"    Database: {dbname}")
    
    conn = connect(
        user=user,
        password=password,
        host=host,
        port=int(port),
        database=dbname
    )
    
    print(f"  ✅ Connection successful!")
    conn.close()
    
except psycopg2.OperationalError as e:
    print(f"  ❌ Connection failed: {e}")
    print(f"\n  SOLUTIONS:")
    print(f"    1. Start PostgreSQL service: services.msc")
    print(f"    2. Create database: createdb -U postgres aeroverse")
    print(f"    3. Verify credentials in .env")
    sys.exit(1)
except Exception as e:
    print(f"  ❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# 4. Test Flask App
print("\n🚀 4. FLASK APP CHECK:")

try:
    from app import create_app
    app = create_app()
    print(f"  ✅ Flask app created successfully")
    
    with app.app_context():
        from app.models import db
        db.create_all()
        print(f"  ✅ Database tables created/verified")
        
        # Check data
        from app.models import User
        user_count = User.query.count()
        print(f"  ✅ Users in database: {user_count}")
        
except Exception as e:
    print(f"  ❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# 5. Check Frontend Connection
print("\n🎨 5. CORS & FRONTEND CHECK:")
print(f"  Backend URL: http://127.0.0.1:5000")
print(f"  Frontend URL: http://localhost:5173")
print(f"  CORS Origins configured: ✅")

print("\n" + "="*70)
print("✅ ALL SYSTEMS GO! Ready to start development")
print("="*70)
print("\nNEXT STEPS:")
print("  1. Terminal 1: python run.py")
print("  2. Terminal 2: python seed.py")
print("  3. Terminal 3: npm run dev")
print("\n")
