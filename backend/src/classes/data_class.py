from dataclasses import dataclass, asdict, is_dataclass
from datetime import datetime
from .user import User
from .pet import Pet
from .task import Task
from typing import Dict, List
import json
import os
import logging
from uuid import uuid4


# Constants
DATA_DIR = "data.json"


class Data:
    """Data class for storing data"""

    def __init__(self):
        self.users = []
        self.pets = []
        self.tasks = []

    def __str__(self):
        return (
            f"users = {self.users}\n" f"pets = {self.pets}\n" f"tasks = {self.tasks}\n"
        )

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

   
    def load_data(self):
        """Load data from json"""
        with open(DATA_DIR, "r") as f:
            json_object = json.load(f)

        pet_object = json_object["pets"]
        task_object = json_object["tasks"]
        user_object = json_object["users"]

        def load_tasks(tasks):
            """Load the tasks from the JSON task object"""
            for task in tasks:
                self.tasks.append(task)

        def load_pets(pets):
            """Load the pets from the JSON pet object"""
            for pet in pets:
                self.pets.append(pet)

        def load_users(users):
            """Load the users from the JSON user object"""
            for user in users:
                # Get the values from the dictionary
                user_id, name, email, password, pets, tasks = user.values()
                user_tasks = []
                user_pets = []

                # Iterate through the tasks and append to users array if it
                # there is a match
                for task_id in tasks:
                    for task in self.tasks:
                        if task_id == task["id"]:
                            user_tasks.append(task)

                # Same as above logic but for pets
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

                # Create a user instance and then chuck it into the array
                person = User.from_dict(user_data)
                self.users.append(person)

        load_pets(pet_object)
        load_tasks(task_object)
        load_users(user_object)

    def clean_data(self):
        """Reset data"""
        self.users = []
        self.pets = []
        self.tasks = []

    def add_user(self, user) -> tuple:
        """Add user to the attribute"""
        
        # Error checking, if user exists return an error
        user_email = user.email
        username = user.username

        email_exists = [u for u in self.users if user_email == u.email]
        username_exists = [u for u in self.users if username == u.username]
        if email_exists and username_exists:
            return (False, "Email exists and username taken")
        if email_exists:
            return (False, "Email already exists")
        if username_exists:
            return (False, "Username taken")

        self.users.append(user)
        return (True, "Username successfully created")

    def add_pet(self, pet):
        """Add a pet"""
        self.pets.append(pet)

    def add_task(self, task):
        """Add a task"""
        self.tasks.append(task)
