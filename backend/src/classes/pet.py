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