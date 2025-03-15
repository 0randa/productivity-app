from flask import Flask, request, jsonify
from flask_cors import CORS
from classes.data import Data, read_data, write_data
from classes.user import User
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
    email = request.json["email"]
    password = request.json["password"]
    username = request.json["username"]

    new_user = User(
        user_id=data.next_user_id, 
        username=username, 
        email=email, 
        password=password, 
        tracker=[], 
        past_xp=[]
    )

    try:
        token = data.add_user(new_user)
    except ValueError as error:
        logging.error(f"Error: {error}")
        return jsonify({"Error": str(error)}), 400

    return jsonify({"token": token}), 200

@app.route("/login", methods=["POST"])
def login():
    email = request.json["email"]
    password = request.json["password"]

    try:
        token = data.login(email, password)
    except ValueError as error:
        logging.error(f"Error: {error}")
        return jsonify({"Error": error}), 400

    return jsonify({"token": token}), 200

@app.route('/')
def index():
    return "We are the goat team! Heheheha!"

if __name__ == "__main__":
    logging.basicConfig(level=logging.ERROR)
    app.run(debug=True)