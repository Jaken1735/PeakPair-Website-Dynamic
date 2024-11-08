import sqlite3
from contextlib import closing
from faker import Faker
import random

# Initialize Faker with Swedish locale
fake = Faker('sv_SE')

# Connect to SQLite database
conn = sqlite3.connect('recommendation_system.db')
cursor = conn.cursor()

male_names = [
    "Erik", "Leo", "Karl", "Johan", "Andreas", "Nils", "Oskar", "Edvin", "Martin", "Fredrik", "Noah", "Liam", "Elias",
    "Oliver", "Adam", "Alfred", "Leo", "Frans", "Arvid", "Elliot", "Ted", "Axel", "Albin", "Isak", "Lukas", "Hjalmar",
    "Theodor", "Noel", "Benjamin", "Harry", "Leon", "Otto", "Sam", "Samuel", "Ludvig", "Gustav", "Jacob"
]
female_names = [
    "Anna", "Siri", "Maja", "Karin", "Ingrid", "Jessica", "Lena", "Molly", "Elsa", "Sofia", "Vera", "Alma", "Selma",
    "Alice", "Olivia", "Astrid", "Ella", "Stella", "Saga", "Alva", "Agnes", "Ebba", "Hedda", "Wilma", "Alicia",
    "Nathalie", "Julia", "Majken", "Ellen", "Nora", "Ingrid", "Lea", "Tyra", "Amanda", "Tilda", "Elin", "Filippa"
]

# Lists of predefined training areas and certificates
training_areas = [
    "Yoga", "Mindfulness", "Meditation", "Pilates", "Mobility", "Flexibility", "Strength Training", "Weightlifting",
    "Olympic lifts", "Bodybuilding", "Boxing", "CrossFit", "Cycling", "Running", "Cardio", "Swimming", "Climbing",
]
certificates = [
    "NASM Certified", "Yoga Alliance Certified", "ACE Personal Trainer", "CSCS", "ISSA Certified"
]
goals_users = [
    "Weight loss", "Muscle building", "Increased endurance", "Stress reduction", "Flexibility and mobility",
    "Rehabilitation and recovery", "Athletic Performance", "Functional Strength", "Balance and Coordination",
    "Overall Fitness and Health",
]
goals_trainers = [
    "Weight Management", "Strength Training", "Muscle Growth", "Endurance Training", "Mindfulness and Mental Health",
    "Sports-Specific Training", "Flexibility and Mobility Training", "Rehabilitation and Injury Recovery",
    "Functional Fitness", "Balance and Coordination Training"
]


# Ensure all users and trainers are from Stockholm
geographic_area = "Stockholm"

# Price options
price_options_users = list(range(500, 1550, 50))
price_options_trainers = list(range(300, 1550, 50))

class Database:
    def __init__(self, db_path='recommendation_system.db'):
        self.db_path = db_path

    def _connect(self):
        """Internal method to connect to the database."""
        return sqlite3.connect(self.db_path)

    def create_tables(self):
        """Create tables if they don't exist."""
        with closing(self._connect()) as conn, conn, closing(conn.cursor()) as cursor:
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                age INTEGER,
                gender TEXT,
                max_price_per_hour INTEGER,
                training_areas_of_interest TEXT,
                try_new_training_forms BOOLEAN,
                experience_level TEXT,
                geographic_area TEXT,
                goals TEXT
            )
            ''')
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS trainers (
                trainer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                age INTEGER,
                gender TEXT,
                min_price_per_hour INTEGER,
                training_areas TEXT,
                level_of_expertise TEXT,
                licenses_certificates TEXT,
                geographic_area TEXT,
                goals TEXT
            )
            ''')
            conn.commit()

    def add_user(self, user_data):
        """Insert a new user into the database."""
        with closing(self._connect()) as conn, conn, closing(conn.cursor()) as cursor:
            cursor.execute('''
            INSERT INTO users (name, age, gender, max_price_per_hour, training_areas_of_interest, 
                               try_new_training_forms, experience_level, geographic_area, goals) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                           (user_data['name'],
                            user_data['age'],
                            user_data['gender'],
                            user_data['max_price_per_hour'],
                            ', '.join(user_data['training_areas_of_interest']),
                            user_data['try_new_training_forms'],
                            user_data['experience_level'],
                            user_data['geographic_area'],
                            ', '.join(user_data['goals'])))
            conn.commit()
            return cursor.lastrowid

    def add_trainer(self, trainer_data):
        """Insert a new trainer into the database."""
        with closing(self._connect()) as conn, conn, closing(conn.cursor()) as cursor:
            cursor.execute('''
            INSERT INTO trainers (name, age, gender, min_price_per_hour, training_areas, 
                               level_of_expertise, licenses_certificates, geographic_area, goals) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                           (trainer_data['name'],
                            trainer_data['age'],
                            trainer_data['gender'],
                            trainer_data['min_price_per_hour'],
                            ', '.join(trainer_data['training_areas']),
                            trainer_data['level_of_expertise'],
                            ', '.join(trainer_data['licenses_certificates']),
                            trainer_data['geographic_area'],
                            ', '.join(trainer_data['goals'])))
            conn.commit()
            return cursor.lastrowid

    def get_user(self, user_id):
        """Fetch a user by ID."""
        with closing(self._connect()) as conn, closing(conn.cursor()) as cursor:
            cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
            row = cursor.fetchone()
            if row:
                return {
                    'user_id': row[0],
                    'name': row[1],
                    'age': row[2],
                    'gender': row[3],
                    'max_price_per_hour': row[4],
                    'training_areas_of_interest': row[5].split(', '),
                    'try_new_training_forms': row[6],
                    'experience_level': row[7],
                    'geographic_area': row[8],
                    'goals': row[9]
                }
            return None

    def get_trainer(self, trainer_id):
        """Fetch a trainers by ID."""
        with closing(self._connect()) as conn, closing(conn.cursor()) as cursor:
            cursor.execute('SELECT * FROM trainers WHERE trainer_id = ?', (trainer_id,))
            row = cursor.fetchone()
            if row:
                return {
                    'trainer_id': row[0],
                    'name': row[1],
                    'age': row[2],
                    'gender': row[3],
                    'min_price_per_hour': row[4],
                    'training_areas': row[5].split(', '),
                    'level_of_expertise': row[6],
                    'licenses_certificates': row[7].split(', '),
                    'geographic_area': row[8],
                    'goals': row[9]
                }
            return None

    def get_trainers(self):
        """Fetch all trainers."""
        with closing(self._connect()) as conn, closing(conn.cursor()) as cursor:
            cursor.execute('SELECT * FROM trainers')
            rows = cursor.fetchall()
            trainers = []
            for row in rows:
                trainers.append({
                    'trainer_id': row[0],
                    'name': row[1],
                    'age': row[2],
                    'gender': row[3],
                    'min_price_per_hour': row[4],
                    'training_areas': row[5].split(', '),
                    'level_of_expertise': row[6],
                    'licenses_certificates': row[7].split(', '),
                    'geographic_area': row[8],
                    'goals': row[9]
                })
            return trainers

    def get_trainers_by_price(self, max_price):
        """Fetch trainers with a minimum price less than or equal to max_price."""
        with closing(self._connect()) as conn, closing(conn.cursor()) as cursor:
            cursor.execute('SELECT * FROM trainers WHERE min_price_per_hour <= ?', (max_price,))
            rows = cursor.fetchall()
            trainers = []
            for row in rows:
                trainers.append({
                    'trainer_id': row[0],
                    'name': row[1],
                    'age': row[2],
                    'gender': row[3],
                    'min_price_per_hour': row[4],
                    'training_areas': row[5].split(', '),
                    'level_of_expertise': row[6],
                    'licenses_certificates': row[7].split(', '),
                    'geographic_area': row[8],
                    'goals': row[9]
                })
            return trainers

    def get_users_by_price(self, min_price):
        """Fetch users with a maximum price higher than or equal to min_price."""
        with closing(self._connect()) as conn, closing(conn.cursor()) as cursor:
            cursor.execute('SELECT * FROM users WHERE max_price_per_hour >= ?', (min_price,))
            rows = cursor.fetchall()
            users = []
            for row in rows:
                users.append({
                    'user_id': row[0],
                    'name': row[1],
                    'age': row[2],
                    'gender': row[3],
                    'max_price_per_hour': row[4],
                    'training_areas_of_interest': row[5].split(', '),
                    'try_new_training_forms': row[6],
                    'experience_level': row[7],
                    'geographic_area': row[8],
                    'goals': row[9]
                })
            return users

    def get_random_trainers(self, n=6):
        """Retrieve n random trainers from the database."""
        with closing(self._connect()) as conn, closing(conn.cursor()) as cursor:
            cursor.execute('SELECT * FROM trainers')
            all_trainers = cursor.fetchall()

            # Choose n random trainers from all trainers
            random_trainers = random.sample(all_trainers, min(n, len(all_trainers)))

            # Format the trainers into a list of dictionaries
            trainers = [{
                    'trainer_id': row[0],
                    'name': row[1],
                    'age': row[2],
                    'gender': row[3],
                    'min_price_per_hour': row[4],
                    'training_areas': row[5].split(', '),
                    'level_of_expertise': row[6],
                    'licenses_certificates': row[7].split(', '),
                    'geographic_area': row[8],
                    'goals': row[9]
                }
                for row in random_trainers
            ]

            return trainers

    def generate_and_insert_random_user(self):
        gender = random.choice(["Male", "Female"])
        name = random.choice(male_names if gender == "Male" else female_names)
        selected_areas = random.sample(training_areas, random.randint(1, 3))
        level_of_expertise = random.choice(["Beginner", "Intermediate", "Advanced"]) if selected_areas else None
        goals = random.sample(goals_users, random.randint(1, 2))
        user_data = {
            "name": name,
            "age": random.randint(19, 30),
            "gender": gender,
            "max_price_per_hour": random.choice(price_options_users),
            "training_areas_of_interest": selected_areas,
            "try_new_training_forms": random.choice([True, False]),
            "experience_level": level_of_expertise,
            "geographic_area": geographic_area,
            "goals": goals
        }
        self.add_user(user_data)

    def generate_and_insert_random_trainer(self):
        gender = random.choice(["Male", "Female"])
        name = random.choice(male_names if gender == "Male" else female_names)
        goals = random.sample(goals_trainers, random.randint(1, 2))
        trainer_data = {
            "name": name,
            "age": random.randint(22, 50),
            "gender": gender,
            "min_price_per_hour": random.choice(price_options_trainers),
            "training_areas": random.sample(training_areas, random.randint(1, 3)),
            "level_of_expertise": random.choice(["Expert", "Intermediate"]),
            "licenses_certificates": random.sample(certificates, random.randint(1, 3)),
            "geographic_area": geographic_area,
            "goals": goals
        }
        self.add_trainer(trainer_data)

    def generate_new_users_and_trainers(self, user_count=60, trainer_count=40):
        """Generate and insert a specified number of random users."""
        for _ in range(user_count):
            self.generate_and_insert_random_user()
        print(f"{user_count} new users generated and added to the database.")
        for _ in range(trainer_count):
            self.generate_and_insert_random_trainer()
        print(f"{trainer_count} new users generated and added to the database.")

    def clear_tables(self):
        """Clear all data from the users and trainers tables."""
        with closing(self._connect()) as conn, conn, closing(conn.cursor()) as cursor:
            cursor.execute('DELETE FROM users')
            cursor.execute('DELETE FROM trainers')
            cursor.execute('DELETE FROM sqlite_sequence WHERE name="users"')
            cursor.execute('DELETE FROM sqlite_sequence WHERE name="trainers"')
            conn.commit()
        print("All tables cleared.")

