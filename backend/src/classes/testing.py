import time
from user import User
from pet import Pet
from task import Task
from datetime import datetime, date
from data_class import Data


def create_user():
    """Create user test"""
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


def create_pet():
    """Create pet test"""
    pikachu_data = {"id": 1, "name": "Pikachu", "xp": 1200, "level": 20}
    pikachu = Pet.from_dict(pikachu_data)

    print(pikachu.to_dict())


def create_task():
    """Create task test"""
    task_data = {
        "id": 1,
        "task": "Homework",
        "tags": ["Work"],
        "date": None,
        "start_time": datetime.now().timestamp(),
        "end_time": None,
        "elapsed": None,
    }
    user_task = Task.from_dict(task_data)
    print(user_task)

    user_data = {
        "id": 1,
        "username": "Bob",
        "email": "email@email.com",
        "password": "password",
        "pets": [],
        "tasks": [{user_task.id: user_task}],
    }

    person = User.from_dict(user_data)

    print(type(user_task.start_time))
    time.sleep(5)

    user_task.end_task()

    print(person.tasks)


def data_test():
    """Test the data class"""

    new_data = Data()

    task_data = {
        "id": 1,
        "task": "Homework",
        "tags": ["Work"],
        "date": None,
        "start_time": datetime.now().timestamp(),
        "end_time": None,
        "elapsed": None,
    }

    user_task = Task.from_dict(task_data)

    pikachu_data = {"id": 1, "name": "Pikachu", "xp": 1200, "level": 20}
    pikachu = Pet.from_dict(pikachu_data)

    user_data = {
        "id": 1,
        "username": "Bob",
        "email": "email@email.com",
        "password": "password",
        "pets": [{pikachu.id: pikachu}],
        "tasks": [{user_task.id: user_task}],
    }

    charizard_data = {"id": 2, "name": "Charizard", "xp": 5000, "level": 36}
    charizard = Pet.from_dict(charizard_data)

    person = User.from_dict(user_data)

    person.add_pet(charizard)
    time.sleep(2)

    user_task.end_task()

    new_data.add_user(person)
    new_data.add_task(user_task)
    new_data.add_pet(pikachu)
    new_data.add_pet(charizard)

    print(new_data)
    print()

    new_data.save_data()
    new_data.clean_data()
    new_data.load_data()

    print(new_data)


def invalid_user_add():
    data = Data()
    user_data = {
        "id": 1,
        "username": "Bob",
        "email": "email@email.com",
        "password": "password",
        "pets": [],
        "tasks": [],
    }

    person = User.from_dict(user_data)
    data.add_user(person)

    user_data = {
        "id": 1,
        "username": "Bob",
        "email": "email@email.com",
        "password": "password",
        "pets": [],
        "tasks": [],
    }

    person = User.from_dict(user_data)
    res = data.add_user(person)

    print(res)



invalid_user_add()
# create_task()
