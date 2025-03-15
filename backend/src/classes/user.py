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