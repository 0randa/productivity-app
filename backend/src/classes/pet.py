from dataclasses import dataclass, field

"""
    Pet class, the pet contains a name, xp, level and happiness.
    The pet's happiness will decrease if the player is not studying.
"""


@dataclass
class Pet:
    id: int
    name: str
    xp: int
    level: int

    # for chucking data into a dict
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "xp": self.xp,
            "level": self.level,
        }

    # Getting data from a dictionary and creating an
    # instance out of it
    @classmethod
    def from_dict(cls, pet):
        return cls(id=pet["id"], name=pet["name"], xp=pet["xp"], level=pet["level"])
