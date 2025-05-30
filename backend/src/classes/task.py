from dataclasses import dataclass, field
from datetime import datetime, date
from typing import List, Optional


def convert_to_datetime(ts):
    # error handling, in case there is no start time or end time
    if not ts: return
    return datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

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

    def __str__(self):
        return (
            f"Task {self.task} with id: {self.id} with tags: {self.tags} "
            f"Date is {self.date}, Task started at {convert_to_datetime(self.start_time)} and ended at "
            f"{convert_to_datetime(self.end_time)}, the total time elapsed is {self.elapsed}"
        )

    # Takes in a task dictionary and outputs a Task instance
    @classmethod
    def from_dict(cls, task):
        return cls(
            id=task["id"],
            task=task["task"],
            tags=task["tags"],
            date=task["date"],
            start_time=task["start_time"],
            end_time=task["end_time"],
            elapsed=task["elapsed"],
        )

    def end_task(self):
        self.end_time = datetime.now().timestamp()
        self.elapsed = self.end_time - self.start_time
