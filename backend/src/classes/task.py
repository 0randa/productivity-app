from dataclasses import dataclass, field
from datetime import datetime, date
from typing import List, Optional

@dataclass
class Task:
    task_id: int
    task: str
    tags: List[str]
    date: date = field(default_factory=list)
    start_time: datetime = field(default_factory=datetime.now)
    end_time: Optional[datetime] = None

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
        )

    def end_task(self):
        self.end_time = datetime.now()
