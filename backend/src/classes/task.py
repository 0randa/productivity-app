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

    def end_task(self):
        self.end_time = datetime.now()
