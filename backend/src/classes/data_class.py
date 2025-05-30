from dataclasses import dataclass, asdict, is_dataclass
from datetime import datetime
from user import User
from pet import Pet
from task import Task
from typing import Dict, List
import json
import os
import logging
from uuid import uuid4


# Constants
DATA_DIR = "data.json"


class Data:
    def __init__(self):
        self.users = []
        self.pets = []
        self.tasks = []
    # users: List[User]
    # pets: List[Pet]
    # tasks: List[Task]

    def save_data(self):
        """Save data to json"""
        data = {
            "users": [user.to_dict() for user in self.users],
            "pets": [pet.to_dict() for pet in self.pets],
            "tasks": [task.to_dict() for task in self.tasks],
        }

        ret = json.dumps(data)

        with open(DATA_DIR, 'w') as f:
            f.write(ret)

        return ret

    def load_data(self):
        """Load data from json"""
        pass

    def add_user(self, user):
        self.users.append(user)

    def add_pet(self, pet):
        self.pets.append(pet)

    def add_task(self, task):
        self.tasks.append(task)
