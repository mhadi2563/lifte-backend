from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "http://localhost:3001"}})  # Allow frontend to call API

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"response": "⚠️ Error: No message received."})

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        response_text = response.choices[0].message.content.strip()
    except Exception as e:
        response_text = f"⚠️ Error: {str(e)}"

    return jsonify({"response": response_text})

if __name__ == "__main__":
    app.run(debug=True)
