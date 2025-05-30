from user import User
from pet import Pet


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

    print(person.to_dict())


def createPet():
    pet_data = {"id": 1, "name": "Pikachu", "xp": 1200, "level": 20}
    pikachu = Pet.from_dict(pet_data)

    print(pikachu.to_dict())


createUser()
