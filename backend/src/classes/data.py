from dataclasses import dataclass, asdict, is_dataclass
from datetime import datetime
from classes.user import User
from classes.token import Token
from classes.task import get_date
from typing import Dict, List
import json
import os
import logging

# Constants
DATA_DIR = "./data/data.json"
DEFAULT_DICT = {
    "next_user_id": 0,
    "next_session_id": 0,
    "next_task_id": 0,
    "users": [],
    "tokens": []
}

# Loads data from data.json into a Data object
# Returns a Data object
def read_data():
    # If data file does not exist, create it
    if not os.path.exists(DATA_DIR) or os.path.getsize(DATA_DIR) == 0:
        with open(DATA_DIR, "w") as data_file:
            json.dump(DEFAULT_DICT, data_file, indent=2)
        logging.info(f"No {DATA_DIR} file found or is empty. Created one.")

    with open(DATA_DIR, "r") as data_file:
        data_dict = json.load(data_file)
        return Data.from_dict(data_dict)

# Saves the data object into data.json
def write_data(data):
    data_dict = asdict(data)
    with open(DATA_DIR, "w") as data_file:
        json.dump(data_dict, data_file, indent=2)

# Data.json is directly loaded into this class
@dataclass
class Data:
    next_user_id: int
    next_session_id: int
    next_task_id: int
    users: List[User]
    tokens: List[Token]

    # get user id
    def get_next_user_id(self):
        user_id = self.next_user_id
        self.next_user_id += 1
        return user_id
    
    # get session id
    def get_next_session_id(self):
        session_id = self.next_session_id
        self.next_session_id += 1
        return session_id

    # get task id
    def get_next_task_id(self):
        task_id = self.next_task_id
        self.next_task_id += 1
        return task_id
    

    def get_user_by_id(self, id):
        for user in self.users:
            if user.id == id:
                return user
        raise ValueError("Username does not exist")
        
        

    # Checks if user is valid, if so append to users list, and also logs in a user
    def add_user(self, username, email, password):
        for user in self.users:
            if user.email == email:
                raise ValueError("Email already exists.")
            if user.username == username:
                raise ValueError("Username already exists.")
        
        user_id = self.get_next_user_id()

        # Make a token
        token = Token(self.get_next_session_id(), user_id)
        self.tokens.append(token)

        # Make a user
        new_user = User(
            user_id=user_id,
            username=username,
            email=email,
            password=password,
            tracker=[],
            past_xp=[]
        )

        self.users.append(new_user)

        logging.info(f"Signed up with email: {email}, password: {password}.")

        return token
    
    # Logs in a user
    def login(self, email, password):
        # check if user exists in the list
        for user in self.users:
            if email == user.email:
                if password == user.password:
                    token = Token(self.get_next_session_id(), user.user_id)
                    self.tokens.append(token)
                    return token
                raise ValueError("Password not valid")
            
        raise ValueError("Email does not exist")

    # Logic for add_task route
    def add_task(self, user_id, task, tags):
        user = self.get_user_by_id(user_id)
        task_id = self.get_next_task_id()
        user.add_task(task_id, task, tags)

    # Logic for get_summary function
    def get_summary(self, user_id, date=get_date()):
        if date == None:
            date = get_date()
        user = self.get_user_by_id(user_id)
        return user.get_summary(date)

    # Given a dictionary, returns a class
    @classmethod
    def from_dict(cls, data):
        return cls(
            next_user_id=data["next_user_id"],
            next_session_id=data["next_session_id"],
            next_task_id=data["next_task_id"],
            users=[User.from_dict(user) for user in data["users"]],
            tokens=[Token.from_dict(token) for token in data["tokens"]]
        )
    