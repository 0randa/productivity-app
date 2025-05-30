from user import User
from pet import Pet
from task import Task
from datetime import datetime, date
import time


def createUser():
    user_data = {
        "id": 1,
        "username": "Bob",
        "email": "email@email.com",
        "password": "password",
        "pets": [],
        "tasks": [],
    }

    person = User.from_dict(user_data)
    pikachu = Pet(id=1, name="Pikachu", xp=None, level=12)
    person.add_pet(pikachu)
    print(person)


def createPet():
    pet_data = {"id": 1, "name": "Pikachu", "xp": 1200, "level": 20}
    pikachu = Pet.from_dict(pet_data)

    print(pikachu.to_dict())

def createTask():
    task_data = {"id": 1, "task": "Homework", 
                 "tags": ["Work"], "date": None, 
                 "start_time": datetime.now().timestamp(), "end_time": None,
                 "elapsed": None}
    user_task = Task.from_dict(task_data)
    print(user_task)

    user_data = {
        "id": 1,
        "username": "Bob",
        "email": "email@email.com",
        "password": "password",
        "pets": [],
        "tasks": user_task,
    }

    person = User.from_dict(user_data)

    print(type(user_task.start_time))
    time.sleep(5)


    user_task.end_task()

    print(user_task)



createTask()