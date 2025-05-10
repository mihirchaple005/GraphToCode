from flask import Flask, jsonify , request, Response
from flask_cors import CORS
from mistralai.client import MistralClient
from dotenv import load_dotenv
import os
from mistralai.models.chat_completion import ChatMessage

load_dotenv()

app = Flask(__name__)
CORS(app)


# Get API Key
api_key = os.getenv("MISTRAL_API_KEY")

# Initialize the Mistral client
client = MistralClient(api_key=api_key)


@app.route("/api/generate-code", methods=['POST'])
def generate_code_using_mistral():
    try :
        data = request.get_json()
        parameters = data.get('parameters')

        print("Parameters: ", parameters)

        prompt = """You are a code generation model. Given a JSON input that describes a machine learning pipeline, your task is to generate the corresponding Python code. Follow these rules strictly:
                - Output ONLY the Python code.
                - Do NOT include any explanations, markdown, or extra text. No ```python or ``` tags. Only the code.
                - Include meaningful comments inside the code for clarity.
                - Ensure the code runs without errors.
            """ 

        input_data = f"{prompt}\n{parameters}"
        print("input data : ", input_data)

        messages = [
        ChatMessage(role="user", content=input_data)
    ]

        print("messages : ", messages)

        response = client.chat(
        model="mistral-tiny", 
        messages=messages
        )

        print("response : ", response)

        generated_code = response.choices[0].message.content
        cleaned_code = generated_code.strip()
        if cleaned_code.startswith("```"):
            cleaned_code = cleaned_code.split("```")[1].strip()
        # if cleaned_code.startswith("python"):
        #     cleaned_code = cleaned_code[len("python"):].strip()
        if "```" in cleaned_code:
            cleaned_code = cleaned_code.split("```")[0].strip()

        print("cleaned code : ", cleaned_code)
    
        return jsonify({
            'message':"Reviced the code successfully",
            "parameters": parameters,
            "code" : cleaned_code
        })

    except Exception as e:
        import traceback;
        traceback.print_exc()
        print("Error: ", e)
        return jsonify({
            'message':"Error in generating code",
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True,port=8080)