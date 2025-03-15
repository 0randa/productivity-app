from dataclasses import dataclass, field
from datetime import date
from typing import Dict, List
from classes.task import Task
from classes.past_xp import PastXp

@dataclass
class User:
    user_id: int
    username: str
    email: str
    password: str
    tracker: List[Task]
    past_xp: List[PastXp]

    # Takes in a user dictionary and outputs a User instance
    @classmethod
    def from_dict(cls, user):
        return cls(
            user_id=user["user_id"],
            username=user["username"],
            email=user["email"],
            password=user["password"],
            tracker=[Task.from_dict(task) for task in user["tracker"]],
            past_xp=[PastXp.from_dict(past_xp) for past_xp in user["past_xp"]]
        )