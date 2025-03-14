import os
from dotenv import load_dotenv, dotenv_values

class trip_interface:
    def __init__(self):
        load_dotenv()
        self.KEY = os.getenv("TRIPPLANNER_KEY")

    def run(self):
        pass

if __name__ == "__main__":
    trip_interface().run()
