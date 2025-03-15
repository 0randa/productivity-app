from flask import Flask, request, jsonify
from flask_cors import CORS
from classes.data import Data, read_data, write_data
import logging

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

    def wrapper():
        response = function()
        write_data(data)
        return response

    return wrapper

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
        return jsonify({"Error": str(error)}), 400

    return jsonify({"Token": token}), 200

@app.route("/login", methods=["POST"])
@save_data
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    try:
        token = data.login(email, password)
    except ValueError as error:
        logging.error(f"Login error: {error}")
        return jsonify({"Error": str(error)}), 400

    return jsonify({"Token": token}), 200

@app.route("/add-task", methods=["POST"])
@save_data
def add_task():
    token = request.headers.get("token")
    task = request.json.get("task")
    tags = request.json.get("tags")
    
    try:
        data.add_task(token["user_id"], task, tags)
    except ValueError as error:
        logging.error(f"Login error: {error}")
        return jsonify({"Error": str(error)}), 400
    
    return jsonify({}), 200


@app.route('/')
def index():
    return "We are the goat team! Heheheha!"

if __name__ == "__main__":
    logging.basicConfig(level=logging.ERROR)
    app.run(debug=True)