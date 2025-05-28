from dataclasses import dataclass

@dataclass
class PastXp:
    date: str
    xp: int

    # Takes in a past_xp dictionary and outputs a PastXp instance
    @classmethod
    def from_dict(cls, past_xp):
        return cls(
            date=past_xp["date"],
            xp=past_xp["xp"]
        )