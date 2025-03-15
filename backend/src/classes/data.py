from dataclasses import dataclass
from user import User

# Constants
DATA_DIR = "../data/data.json"

# Loads data from data.json into a Data object
# Returns a Data object
def load_data():
    pass

# Saves the data object into data.json
def save_data(data):
    pass

# Data.json is directly loaded into this class
@dataclass
class Data:
    def __init__(self):
        pass