from flask import Flask, jsonify
from flask_cors import CORS
from data import Data, load_data, save_data

# Constants local to this file
DATA_DIR = "data/data.json"

# Global variables
app = Flask(__name__)
cors = CORS(app)
data = load_data()

@app.route("")

@app.route("/members", methods=['GET'])
def members():
    return jsonify(
        {"members": ["Member1", "Member2", "Member3"]}
    )

@app.route('/')
def index():
    return "We are the goat team! Heheheha!"

if __name__ == "__main__":
    app.run(debug=True)