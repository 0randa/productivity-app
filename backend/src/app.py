from flask import Flask, request, jsonify
from flask_cors import CORS
from classes.data import Data, read_data, write_data
from classes.user import User
import logging

# Global variables
app = Flask(__name__)
cors = CORS(app)

data = read_data()

# HTTP Endpoints
@app.route("/members", methods=['GET'])
def members():
    return jsonify(
        {"members": ["Member1", "Member2", "Member3"]}
    )

@app.route("/signup", methods=["POST"])
def signup():
    email = request.json["email"]
    password = request.json["password"]

    new_user = User(user_id = 1, username = "john cena", email = email, password = password, tracker = [], past_xp = [])
    
    print(new_user)

    sign_up = data.check_user(new_user)

    if not sign_up:
        return jsonify({}), 400

    logging.info(f"Signed up with email: {email}, password: {password}.")
    data.add_user(new_user)

    return jsonify({
        "email": email,
        "password": password,
    }), 200


@app.route('/')
def index():
    return "We are the goat team! Heheheha!"

if __name__ == "__main__":
    app.run(debug=True)