import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Response
from mistralai.client import MistralClient



app = Flask(__name__)
CORS(app)

api_key = os.getenv(MISTRAL_API_KEY)

if not api_key:
    raise EnvironmentError("MISTRAL_API_KEY is not set in the environment.")

client = MistralClient(api_key=api_key)

@app.route('/api/generate-code', methods=['GET'])
def generate_code():
    json_data = """{
            "nodes": [
                {"id": "1", "type": "data_load", "label": "Load CSV"},
                {"id": "2", "type": "preprocess", "label": "Handle Missing Values (Mean)"},
                {"id": "3", "type": "preprocess", "label": "Feature Scaling (MinMax)"},
                {"id": "4", "type": "split", "label": "Train/Test Split (80-20)"},
                {"id": "5", "type": "train", "label": "Train Random Forest"},
                {"id": "6", "type": "hyperparameter_tuning", "label": "Optimize with Optuna"},
                {"id": "7", "type": "evaluate", "label": "Evaluate with Accuracy Score"},
                {"id": "8", "type": "deploy", "label": "Deploy via Flask API"}
            ],
            "edges": [
                {"from": "1", "to": "2"},
                {"from": "2", "to": "3"},
                {"from": "3", "to": "4"},
                {"from": "4", "to": "5"},
                {"from": "5", "to": "6"},
                {"from": "6", "to": "7"},
                {"from": "7", "to": "8"}
            ]
        }"""

        
    prompt = """You are a code generation model. Given a JSON input that describes a machine learning pipeline, your task is to generate the corresponding Python code. Follow these rules strictly:
                - Output ONLY the Python code.
                - Do NOT include any explanations, markdown, or extra text. No ```python or ``` tags. Only the code.
                - Include meaningful comments inside the code for clarity.
                - Ensure the code runs without errors.
            """ 
    input_data = f"{prompt}\n{json_data}"


    messages = [
        ChatMessage(role="user", content=input_data)
    ]

    response = client.chat(
        model="mistral-tiny", 
        messages=messages
    )

    generated_code = response.choices[0].message.content
    cleaned_code = generated_code.strip()
    if cleaned_code.startswith("```"):
        cleaned_code = cleaned_code.split("```")[1].strip()
    if cleaned_code.startswith("python"):
        cleaned_code = cleaned_code[len("python"):].strip()
    if "```" in cleaned_code:
        cleaned_code = cleaned_code.split("```")[0].strip()
    
    return Response(cleaned_code, mimetype='text/plain')
if __name__ == '__main__':
    app.run(debug=True)
