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
    active_task_id: int = -1
    tracker: List[Task]
    past_xp: List[PastXp]

    def get_xp(self, date=get_date()):
        pass

    # Adds a task
    def add_task(self, task_id, task, tags):
        new_task = Task(
            task_id, task, tags, date=get_date(), start_time=get_timestamp()
        )
        tracker.append(new_task)
        self.active_task_id = task_id

    def end_current_task(self):
        if self.active_task_id == -1:
            raise ValueError("Error: No active task.")
        
        # Find the task based off task_id
        task = [task for task in self.tracker if task.task_id == self.active_task_id][0]
        task.end_task()

        # Update xp for the day
        today_xp = [xp for xp in self.past_xp if xp["date"] == get_date()]
        if len(today_xp) == 0:
            past_xp.append(PastXp(date=get_date(), xp=self.get_xp()))
        else:
            today_xp.xp = self.get_xp()

        self.active_task_id = -1

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
            active_task_id=user["active_task_id"],
            tracker=[Task.from_dict(task) for task in user["tracker"]],
            past_xp=[PastXp.from_dict(past_xp) for past_xp in user["past_xp"]],
        )
