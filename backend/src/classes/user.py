from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Dict, List
from classes.task import Task, get_timestamp, get_date
from classes.pet import Pet
from classes.past_xp import PastXp

# Checks if two dates are consequtive
def are_consecutive(date1_str, date2_str, date_format="%Y-%m-%d"):
    # Convert strings to date objects
    date1 = datetime.strptime(date1_str, date_format).date()
    date2 = datetime.strptime(date2_str, date_format).date()

    # Check if the absolute difference is exactly 1 day
    return abs((date2 - date1).days) == 1

@dataclass
class User:
    user_id: int
    username: str
    email: str
    password: str
    pet: Pet
    tracker: List[Task]
    past_xp: List[PastXp]
    active_task_id: int = -1

    def get_xp(self, date=get_date()):
        # Get total seconds
        seconds = sum([task.elapsed for task in self.tracker])

        # Find number of consecutive days recorded
        streak = 0
        if len(self.past_x) > 1:
            for i in range(len(self.past_xp) - 1, 0, -1):
                current_day = self.past_xp[i]
                prev_day = self.past_xp[i - 1]
                if are_consecutive(current_day["date"], prev_day["date"]):
                    if streak == 0:
                        streak = 2
                    else:
                        streak += 1

        if seconds <= 0:
            return 0

        base_xp = 0.14 * seconds  # XP per second
        fatigue_penalty = 0.0005 * (max(seconds - 21600, 0)) ** 1.3  # Slight slowdown after 6 hours
        streak_bonus = min(streak * 100, 500)  # Max bonus at 10 days

        total_xp = base_xp - fatigue_penalty + streak_bonus
        return int(max(total_xp, 0))  # Ensure XP is never negative

    # Adds a task
    def add_task(self, task_id, task, tags):
        new_task = Task(
            task_id, task, tags, date=str(get_date()), start_time=get_timestamp()
        )
        self.tracker.append(new_task)
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
            self.past_xp.append(PastXp(date=get_date(), xp=self.get_xp()))
        else:
            today_xp.xp = self.get_xp()

        self.active_task_id = -1

    # Gets the summary of all of a certain date's tasks
    def get_summary(self, date):
        tasks = [task for task in self.tracker if task.date == get_date()]
        xp = [xp for xp in self.past_xp if xp.date == get_date()]
        if len(xp) == 0:
            xp = 0
        else:
            xp = xp[0]
        return {tracker: tasks, xp: xp}

    def create_pet(self, pet):
        if pet is not None:
            raise ValueError("User already has a pet")
        self.pet = pet

    # Takes in a user dictionary and outputs a User instance
    @classmethod
    def from_dict(cls, user):
        if user["pet"] is not None:
            pet = Pet.from_dict(user["pet"])
        else:
            pet = None
        return cls(
            user_id=user["user_id"],
            username=user["username"],
            email=user["email"],
            password=user["password"],
            pet=pet,
            active_task_id=user["active_task_id"],
            tracker=[Task.from_dict(task) for task in user["tracker"]],
            past_xp=[PastXp.from_dict(past_xp) for past_xp in user["past_xp"]],
        )
