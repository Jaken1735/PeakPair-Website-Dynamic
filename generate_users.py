from faker import Faker
import random
import json

# Initialize the Faker object with Swedish localization
fake = Faker('sv_SE')  # Swedish names and details

# Predefined lists of Swedish male and female names
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

# Ensure all users and trainers are from Stockholm
geographic_area = "Stockholm"

# Price options
price_options_users = list(range(500, 1550, 50))
price_options_trainers = list(range(300, 1550, 50))

# Function to generate a random Swedish user
def generate_user(id):
    gender = random.choice(["Male", "Female"])
    name = random.choice(male_names) if gender == "Male" else random.choice(female_names)
    selected_areas = random.sample(training_areas, random.randint(0, 3))
    level_of_expertise = random.choice(["Beginner", "Intermediate", "Advanced"]) if selected_areas else None
    user = {
        "id": id,
        "name": name,
        "age": random.randint(19, 30),
        "gender": gender,
        "max_price_per_hour": f"{random.choice(price_options_users)}SEK",
        "training_areas_of_interest": selected_areas,
        "try_new_training_forms": random.choice([True, False]),
        "experience_level": level_of_expertise,
        "geographic_area": geographic_area
    }
    return user

# Function to generate a random Swedish trainer
def generate_trainer(id):
    gender = random.choice(["Male", "Female"])
    name = random.choice(male_names) if gender == "Male" else random.choice(female_names)
    trainer = {
        "id": id,
        "name": name,
        "age": random.randint(22, 50),
        "gender": gender,
        "min_price_per_hour": f"{random.choice(price_options_trainers)}SEK",
        "training_areas": random.sample(training_areas, random.randint(1, 3)),
        "level_of_expertise": random.choice(["Expert", "Intermediate"]),
        "licenses_certificates": random.sample(certificates, random.randint(1, 3)),
        "geographic_area": geographic_area
    }
    return trainer

# Generate a large amount of user and trainer data
users = [generate_user(id) for id in range(60)]
trainers = [generate_trainer(id) for id in range(50)]

# Optionally save this data to a JSON file or database
with open("users.json", "w") as f:
    json.dump(users, f, indent=4)

with open("trainers.json", "w") as f:
    json.dump(trainers, f, indent=4)
