from flask import Flask, request, jsonify
from flask_cors import CORS
from crew import InstagramGrowthCrew
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins="*")

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Social Media Growth Backend is running!",
        "health": "/health"
    })

def verify_secret(req):
    secret = req.headers.get("X-Api-Secret", "")
    expected = os.getenv("API_SECRET_KEY", "")
    if expected and secret != expected:
        return False
    return True

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model": "llama-3.1-8b-instant",
        "framework": "CrewAI + Flask"
    })

@app.route("/generate-plan", methods=["POST"])
def generate_plan():
    if not verify_secret(request):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required = [
        "username", "followers", "avg_likes", "avg_comments",
        "posting_frequency", "content_type", "brand_tone",
        "goal", "target_followers"
    ]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        crew = InstagramGrowthCrew(
            username=data["username"],
            followers=int(data["followers"]),
            avg_likes=int(data["avg_likes"]),
            avg_comments=int(data["avg_comments"]),
            posting_frequency=int(data["posting_frequency"]),
            content_type=data["content_type"],
            brand_tone=data["brand_tone"],
            goal=data["goal"],
            target_followers=int(data["target_followers"]),
        )
        result = crew.run()
        return jsonify({"success": True, "data": result})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
