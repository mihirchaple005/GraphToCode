from flask import Flask, jsonify , request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/generate-code", methods=['POST'])
def generate_code_using_mistral():
    try :
        data = request.get_json()
        parameters = data.get('parameters')

        print("Parameters: ", parameters)

    
        return jsonify({
            'message':"Reviced the code successfully",
            "parameters": parameters
        })

    except Exception as e:
        print("Error: ", e)
        return jsonify({
            'message':"Error in generating code",
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True,port=8080)