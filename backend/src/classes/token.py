import dataclasses

@dataclass
class Token:
    session_id: int
    user_id: int

    # Takes in a token dictionary and outputs a Token instance
    @classmethod
    def from_dict(cls, token):
        return cls(
            session_id=token["session_id"],
            user_id=token["user_id"]
        )