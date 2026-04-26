from flask import Blueprint, request, jsonify
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv(override=True)

chat_bp = Blueprint('chat', __name__)

print(f"🔑 GROQ KEY CHECK: {os.getenv('GROQ_API_KEY') is not None}")

try:
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        raise ValueError("GROQ_API_KEY is not set in .env")
    client = Groq(api_key=groq_key)
    print("✅ Groq client initialized successfully")
except Exception as e:
    print(f"❌ ERROR initializing Groq: {e}")
    client = None

@chat_bp.route('/', methods=['POST'])
def chat():
    if client is None:
        return jsonify({"error": "AI model is not initialized. Check GROQ_API_KEY."}), 500
    
    data = request.get_json()
    user_message = data.get('message', '')
    history = data.get('history', [])

    try:
        messages = []
        
        # Add system instruction
        messages.append({
            "role": "system",
            "content": (
                "Tu es AeroBot, un tuteur expert en aérospatiale "
                "pour la plateforme AeroVerse. Tu expliques les concepts "
                "de façon claire et pédagogique. Tu réponds en français "
                "si l'utilisateur écrit en français, en anglais sinon. "
                "Tu couvres : fusées, satellites, propulsion, orbites, "
                "aérodynamique, missions spatiales."
            )
        })
        
        # Add history
        for msg in history[-10:]:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add current message
        messages.append({
            "role": "user",
            "content": user_message
        })

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )

        return jsonify({"reply": response.choices[0].message.content})

    except Exception as e:
        print(f"ERROR in chat: {e}")
        return jsonify({"error": str(e)}), 500