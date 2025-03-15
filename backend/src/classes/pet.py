from dataclasses import dataclass, field

"""
    Pet class, the pet contains a name, xp, level and happiness.
    The pet's happiness will decrease if the player is not studying.
"""
@dataclass
class Pet:
    name: str
    xp: int
    level: int
    happiness: int

    @classmethod
    def from_dict(cls, pet):
        return cls(
            name=pet["name"],
            xp=pet["xp"],
            level=pet["level"],
            happiness=pet["happiness"],
        )