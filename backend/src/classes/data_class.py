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

    def __str__(self):
        return f"users = {self.users} " f"pets = {self.pets} " f"tasks = {self.tasks} "

    def save_data(self):
        """Save data to json"""
        data = {
            "users": [user.to_dict() for user in self.users],
            "pets": [pet.to_dict() for pet in self.pets],
            "tasks": [task.to_dict() for task in self.tasks],
        }

        ret = json.dumps(data)

        with open(DATA_DIR, "w") as f:
            f.write(ret)

        return ret

    def load_tasks(self, task_object):
        """Load the tasks from the JSON task object"""
        for task in task_object:
            self.tasks.append(task)

    def load_pets(self, pet_object):
        """Load the pets from the JSON pet object"""
        for pet in pet_object:
            self.pets.append(pet)

    def load_users(self, user_object):
        """Load the users from the JSON user object"""
        for user in user_object:
            user_id, name, email, password, pets, tasks = user
            user_tasks = []
            user_pets = []

            for task_id in tasks:
                for task in self.tasks:
                    if task_id == task["id"]:
                        user_tasks.append(task)

            for pet_id in pets:
                for pet in self.pets:
                    if pet_id == pet["id"]:
                        user_pets.append(pet)

            user_data = {
                "id": user_id,
                "username": name,
                "email": email,
                "password": password,
                "pets": user_pets,
                "tasks": user_tasks,
            }

            person = User.from_dict(user_data)
            self.users.append(person)

    def load_data(self):
        """Load data from json"""
        with open(DATA_DIR, "r") as f:
            json_object = json.load(f)


        task_object = json_object["tasks"]
        user_object = json_object["users"]

        self.load_tasks(task_object)
        self.load_users(user_object)

    def clean_data(self):
        """Reset data"""
        self.users = []
        self.pets = []
        self.tasks = []

    def add_user(self, user):
        """Add user to the attribute"""
        self.users.append(user)

    def add_pet(self, pet):
        """Add a pet"""
        self.pets.append(pet)

    def add_task(self, task):
        """Add a task"""
        self.tasks.append(task)
