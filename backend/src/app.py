from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from classes.data_class import Data
from classes.user import User
import logging
import functools
import urllib.parse
from dataclasses import asdict, is_dataclass
import json
from uuid import uuid4

# =========================================================================================
# ==== Global Variables ===================================================================
# =========================================================================================

app = Flask(__name__)
cors = CORS(app)

data = Data()

# =========================================================================================
# ==== Helper Functions and Decorators ====================================================
# =========================================================================================


# =========================================================================================
# ==== HTTP Endpoints =====================================================================
# =========================================================================================

@app.route("/register", methods=["POST"])
def register():
    """Register user"""
    # load the json file data
    data.load_data()

    register_data = request.get_json()

    if not register_data:
        return jsonify({"msg": "No JSON data received or malformed JSON."}), 400

    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in register_data:
            app.logger.error(f"Missing field in registration data: {field}")
            return jsonify({"msg": f"Missing required field: {field}"}), 400

    user_id = str(uuid4())
    username = register_data['username']
    email = register_data['email']
    password = register_data['password']
    pets = []
    tasks = []

    user_data = {
        "id": user_id,
        "username": username,
        "email": email,
        "password": password,
        "pets": pets,
        "tasks": tasks,
    }

    user = User.from_dict(user_data)
    add_user = data.add_user(user)

    # check that user does not already have a username registered
    status, message = add_user
    if not status:
        return jsonify({"msg": message}), 400

    # Success message and save data.
    message = "User successfully registered"
    data.save_data()
    return jsonify({"msg": message}), 200



@app.route("/login", methods=["POST"])
def login():
    data.load_data()

    login_data = request.get_json()

    if not login_data:
        return jsonify({"msg": "No JSON data received or malformed JSON."}), 400

    required_fields = ['email', 'password']  
    for field in required_fields:
        if field not in login_data:
            app.logger.error(f"Missing field in registration data: {field}")
            return jsonify({"msg": f"Missing required field: {field}"}), 400

    email = login_data['email']
    password = login_data['password']

    # check if the user exists

    user_exists = [u for u in data.users if u.email == email]

    if not user_exists:
        return jsonify({"msg": "User does not exist"}), 400
    
    if user_exists[0]['password'] != password:
        return jsonify({"msg": "Wrong password"}), 400

    message = "Logged in successfully"
    return jsonify({"msg": message}), 200






@app.route("/addTask", methods=["POST"])
def add_task():
    pass


@app.route("/endTask", methods=["PUT"])
def end_task():
    pass


@app.route("/createPet", methods=["POST"])
def create_pet():
    pass



@app.route("/")
def index():
    return render_template("homepage.html")


if __name__ == "__main__":
    logging.basicConfig(level=logging.ERROR)
    app.run(debug=True, host='0.0.0.0', port=8000)
