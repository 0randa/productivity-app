from flask import Flask, request, jsonify
from flask_cors import CORS
from classes.data import Data, read_data, write_data
import logging
import functools
import urllib.parse
from dataclasses import asdict, is_dataclass
import json

# =========================================================================================
# ==== Global Variables ===================================================================
# =========================================================================================

app = Flask(__name__)
cors = CORS(app)

data = read_data()

# =========================================================================================
# ==== Helper Functions and Decorators ====================================================
# =========================================================================================

# Runs write_data() after the provided function is called
def save_data(function):
    @functools.wraps(function)  # Preserve function name
    def wrapper():
        response = function()
        write_data(data)
        return response

    return wrapper

# Encodes a token
def encode_token(token):
    if is_dataclass(token):
        token = asdict(token)
    return urllib.parse.quote(json.dumps(token))

# Decodes a token
def decode_token(token_str):
    # print("\n\n\n")
    # print(token_str)
    # print("\n\n\n")
    # print(f"|{urllib.parse.unquote(token_str)}|")
    # print("\n\n\n")
    # print(json.loads(urllib.parse.unquote(token_str)[1:-1].strip()))
    return json.loads(urllib.parse.unquote(token_str))

# =========================================================================================
# ==== HTTP Endpoints =====================================================================
# =========================================================================================

@app.route("/members", methods=['GET'])
def members():
    return jsonify(
        {"members": ["Member1", "Member2", "Member3"]}
    )

@app.route("/signup", methods=["POST"])
@save_data
def signup():
    email = request.json.get("email")
    password = request.json.get("password")
    username = request.json.get("username")

    try:
        token = data.add_user(username, email, password)
    except ValueError as error:
        logging.error(f"Signup error: {error}")
        return jsonify({"Signup error": str(error)}), 400

    return jsonify({"token": encode_token(token)}), 200

@app.route("/login", methods=["POST"])
@save_data
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    try:
        token = data.login(email, password)
    except ValueError as error:
        logging.error(f"Login error: {error}")
        return jsonify({"Login error": str(error)}), 400

    return jsonify({"token": encode_token(token)}), 200

@app.route("/getSummary", methods=["GET"])
def get_summary():
    token_str = request.headers.get("token")
    date = request.json.get("date")

    summary = data.get_summary(decode_token(token_str)["user_id"], date)

    return jsonify(summary), 200

@app.route("/addTask", methods=["POST"])
@save_data
def add_task():
    token_str = request.headers.get("token")
    task = request.json.get("task")
    tags = request.json.get("tags")
    try:
        data.add_task(decode_token(token_str)["user_id"], task, tags)
    except ValueError as error:
        logging.error(f"Error when adding task: {error}")
        return jsonify({"Error when adding task": str(error)}), 400
        
    return jsonify({}), 200

@app.route("/endTask", methods=["PUT"])
@save_data
def end_task():
    token_str = request.headers.get("token")
    
    try:
        data.end_task(decode_token(token_str)["user_id"])
    except ValueError as error:
        logging.error(f"Error in end task")
        return jsonify({"Error in end task": str(error)}), 400
    
    return jsonify({}), 200

@app.route("/createPet", methods=["POST"])
@save_data
def create_pet():
    token_str = request.headers.get("token")
    name = request.json.get("pet")

    try:
        data.create_pet(decode_token(token_str)["user_id"], name)
    except ValueError as error:
        logging.error(f"Login error: {error}")
        return jsonify({"Error": str(error)}), 400
    
    return jsonify({}), 200

"""Route for the pet page"""
@app.route("/pet", methods=["GET"])
@save_data
def get_pet():
    token_str = request.headers.get("token")
    user = data.get_user_by_id(decode_token(token_str)["user_id"])

    pet_data = {
        "name": user.pet.name,
        "xp": user.pet.xp,
        "level": user.pet.level,
        "happiness": user.pet.happiness,
    }
    
    return jsonify({"pet": pet_data}), 200


@app.route('/')
def index():
    return "We are the goat team! Heheheha!"

if __name__ == "__main__":
    logging.basicConfig(level=logging.ERROR)
    app.run(debug=True)