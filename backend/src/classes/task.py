from dataclasses import dataclass, field
from datetime import datetime, date
from typing import List, Optional


# Returns a unix timestamp
def get_timestamp():
    return int(datetime.utcnow().timestamp())


# Returns the date
def get_date():
    return datetime.now().date()


@dataclass
class Task:
    id: int
    task: str
    tags: List[str]
    date: date = field(default_factory=list)
    start_time: datetime = field(default_factory=datetime.now)
    end_time: Optional[datetime] = None
    elapsed: Optional[int] = None

    # Takes in a task dictionary and outputs a Task instance
    @classmethod
    def from_dict(cls, task):
        return cls(
            task_id=task["task_id"],
            task=task["task"],
            tags=task["tags"],
            date=task["date"],
            start_time=task["start_time"],
            end_time=task["end_time"],
            elapsed=task["elapsed"],
        )

    def end_task(self):
        self.end_time = get_timestamp()
        self.elapsed = self.end_time - self.start_time
