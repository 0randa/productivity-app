from dataclasses import dataclass
from task import Task
from past_xp import PastXp

@dataclass
class User:
    user_id: int
    username: str
    email: str
    password: str
    tracker: List[Task]
    past_xp: List[PastXp]

    