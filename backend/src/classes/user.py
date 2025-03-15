from dataclasses import dataclass, field
from datetime import date
from typing import Dict, List
from task import Task

@dataclass
class User:
    user_id: int
    username: str
    email: str
    password: str
    tracker: Task
    past_xp: Dict