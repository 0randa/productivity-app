from dataclasses import dataclass, field


@dataclass
class Pet:
    """
    Pet class, the pet contains a name, xp, level and happiness.
    The pet's happiness will decrease if the player is not studying.
    """

    id: int
    name: str
    xp: int
    level: int

    # for chucking data into a dict
    def to_dict(self):
        """Transforms the class instance into a dictionary"""
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
        """Creates a class instance from an input dictionary"""
        return cls(id=pet["id"], name=pet["name"], xp=pet["xp"], level=pet["level"])
