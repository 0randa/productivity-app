from dataclasses import dataclass
from user import User
from token import Token
import json
import os
import logging

# Constants
DATA_DIR = "../data/data.json"
DEFAULT_DICT = {
    next_user_id: 0,
    next_session_id: 0,
    next_task_id: 0,
    users: [],
    tokens: []
}

# Loads data from data.json into a Data object
# Returns a Data object
def read_data():
    # If data file does not exist, create it
    if not os.path.exists(DATA_DIR) or os.path.getsize(DATA_DIR) == 0:
        with open(DATA_DIR, "w") as data_file:
            json.dump(DEFAULT_DICT)
        logging.info(f"No {DATA_DIR} file found or is empty. Created one.")

    with open(DATA_DIR, "r") as data_file:
        data_dict = json.load(data_file)



# Saves the data object into data.json
def write_data(data):
    pass

# Data.json is directly loaded into this class
@dataclass
class Data:
    next_user_id: int
    next_session_id: int
    next_task_id: int
    users: List[User]
    tokens: List[Token]

    @classmethod
    def from_dict(cls, data):
        tokens = [Token.from_dict(token) for token in data["tokens"]]
        return cls(
            next_user_id=data["next_user_id"],
            next_session_id=data["next_session_id"],
            next_task_id=data["next_task_id"],
            users=[User.from_dict(user) for user in data["users"]],
            tokens=[Token.from_dict(token) for token in data["tokens"]]
        )