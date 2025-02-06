import requests

# Define the API URL (make sure Flask is running first)
API_URL = "http://127.0.0.1:5000/chat"

# Send a test request with a fitness-related question
test_data = {"message": "Give me a workout split for bulking"}

# Make a POST request to the chatbot API
response = requests.post(API_URL, json=test_data)

# Print the chatbot's response
print("Bot Response:", response.json())
