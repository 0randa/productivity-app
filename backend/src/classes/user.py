from dataclasses import dataclass, field
from datetime import date
from typing import Dict, List
from classes.task import Task, get_timestamp, get_date
from classes.pet import Pet
from classes.past_xp import PastXp

@dataclass
class User:
    user_id: int
    username: str
    email: str
    password: str
    pet: Pet
    tracker: List[Task]
    past_xp: List[PastXp]

    # Adds a task
    def add_task(self, task_id, task, tags):
        new_task = Task(
            task_id, task, tags, date=get_date(), start_time=get_timestamp()
        )
        tracker.append(new_task)

    # Gets the summary of all of a certain date's tasks
    def get_summary(self, date):
        tasks = [task for task in self.tracker if task.date == get_date()]
        xp = [past_xp for past_xp in self.past_xp if past_xp.date == get_date()][0]
        return {tracker: tasks, xp: xp}

    def create_pet(self, pet):
        if pet is not None:
            raise ValueError("User already has a pet")
        self.pet = pet

    # Takes in a user dictionary and outputs a User instance
    @classmethod
    def from_dict(cls, user):
        return cls(
            user_id=user["user_id"],
            username=user["username"],
            email=user["email"],
            password=user["password"],
            pet=user["pet"],
            tracker=[Task.from_dict(task) for task in user["tracker"]],
            past_xp=[PastXp.from_dict(past_xp) for past_xp in user["past_xp"]],
        )
