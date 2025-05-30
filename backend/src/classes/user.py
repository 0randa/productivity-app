from dataclasses import dataclass
from datetime import date, timedelta
from typing import Dict, List
from pet import Pet


@dataclass
class User:
    """User class
    Error handling in the server routes probably."""

    id: int
    username: str
    email: str
    password: str
    # probably have it map to the ID and
    pets: List[Dict[int, Pet]]
    tasks: List[Dict[int, str]]

    def add_pet(self, pet):
        self.pets.append({pet.id: pet})

    def add_task(self, task):
        self.tasks.append({task.id: task})

    def __str__(self):
        """prints the user as a string"""
        return (
            f"{self.username} has user id of {self.id} and registered "
            f"with email: {self.email} and password: {self.password}"
            f" has tasks: {self.tasks} and their pet is {self.pets}"
        )

    def to_dict(self):
        """Turns the user info into a dict"""

        pet_ids = []

        # chuck the pet_ids into an array
        for pet in self.pets:
            for key in pet.keys():
                pet_ids.append(key)


        return {
            "id": self.id,
            "name": self.username,
            "email": self.email,
            "password": self.password,
            "pets": pet_ids,
        }

    # Takes in a user dictionary and outputs a User instance
    @classmethod
    def from_dict(cls, user):
        return cls(
            id=user["id"],
            username=user["username"],
            email=user["email"],
            password=user["password"],
            pets=user["pets"],
            tasks=user["tasks"],
        )


# # Checks if two dates are consequtive
# def are_consecutive(date1_str, date2_str, date_format="%Y-%m-%d"):
#     # Convert strings to date objects
#     date1 = datetime.strptime(date1_str, date_format).date()
#     date2 = datetime.strptime(date2_str, date_format).date()

#     # Check if the absolute difference is exactly 1 day
#     return abs((date2 - date1).days) == 1


# @dataclass
# class User:
#     user_id: int
#     username: str
#     email: str
#     password: str
#     pet: Pet | None
#     tracker: List[Task]
#     past_xp: List[PastXp]
#     active_task_id: int = -1

#     def get_xp(self, date=get_date()):
#         # Get total seconds
#         seconds = sum([task.elapsed for task in self.tracker])

#         # Find number of consecutive days recorded
#         streak = 0
#         if len(self.past_xp) > 1:
#             for i in range(len(self.past_xp) - 1, 0, -1):
#                 current_day = self.past_xp[i]
#                 prev_day = self.past_xp[i - 1]
#                 if are_consecutive(current_day["date"], prev_day["date"]):
#                     if streak == 0:
#                         streak = 2
#                     else:
#                         streak += 1

#         if seconds <= 0:
#             return 0

#         base_xp = 0.14 * seconds  # XP per second
#         fatigue_penalty = (
#             0.0005 * (max(seconds - 21600, 0)) ** 1.3
#         )  # Slight slowdown after 6 hours
#         streak_bonus = min(streak * 100, 500)  # Max bonus at 10 days

#         total_xp = base_xp - fatigue_penalty + streak_bonus
#         return int(max(total_xp, 0))  # Ensure XP is never negative

#     # Adds a task
#     def add_task(self, task_id, task, tags):
#         new_task = Task(
#             task_id, task, tags, date=str(get_date()), start_time=get_timestamp()
#         )
#         self.tracker.append(new_task)
#         self.active_task_id = task_id

#     def end_current_task(self):
#         if self.active_task_id == -1:
#             raise ValueError("Error: No active task.")

#         # Find the task based off task_id
#         task = [task for task in self.tracker if task.task_id == self.active_task_id][0]
#         task.end_task()

#         # Update xp for the day
#         today_xp = [xp for xp in self.past_xp if xp["date"] == get_date()]
#         if len(today_xp) == 0:
#             self.past_xp.append(PastXp(date=get_date(), xp=self.get_xp()))
#         else:
#             today_xp.xp = self.get_xp()

#         self.active_task_id = -1

#     # Gets the summary of all of a certain date's tasks
#     def get_summary(self, date):
#         tasks = [task for task in self.tracker if task.date == get_date()]
#         xp = [xp for xp in self.past_xp if xp.date == get_date()]
#         if len(xp) == 0:
#             xp = 0
#         else:
#             xp = xp[0]
#         return {tracker: tasks, xp: xp}

#     def create_pet(self, name):
#         if self.pet is not None:
#             raise ValueError("User already has a pet")
#         self.pet = Pet(name, 0, 0, 0)

#
