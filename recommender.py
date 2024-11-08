# Install necessary libraries:
# pip install sentence-transformers

# Import the necessary libraries
from flask import Flask, jsonify
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize
from db import Database
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
db = Database()  # Initialize the database object
db.create_tables()  # Ensure tables are created on startup
db.clear_tables()
db.generate_new_users_and_trainers()

# Load pre-trained SBERT model
sbert_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Function to recommend trainers to a user
def get_top_trainer_matches_for_user(user_data, n=6):
    user_interests = ', '.join(user_data['training_areas_of_interest'])
    user_goals = user_data.get('goals', '')
    user_profile_text = f"{user_interests}, {user_goals}"
    level_mapping = {"Beginner": 1, "Intermediate": 2, "Expert": 3}

    # Filter trainers by price and experience level
    filtered_trainers = [
        trainer for trainer in db.get_trainers_by_price(user_data['max_price_per_hour'])
        if level_mapping.get(trainer['level_of_expertise'], 0) > level_mapping.get(user_data['experience_level'], 0)
    ]

    # If no interests, set to an empty string to avoid errors
    if not user_profile_text:
        user_profile_text = ''

    # Generate embeddings for user interests and each trainer's skills
    user_embedding = sbert_model.encode(user_profile_text)
    trainer_embeddings = [
        sbert_model.encode(f"{', '.join(t['training_areas'])}, {t.get('goals', '')}")
        for t in filtered_trainers
    ]

    # Normalize embeddings
    user_embedding_normalized = normalize([user_embedding])[0]
    trainer_embeddings_normalized = normalize(list(trainer_embeddings))

    # Compute cosine similarity
    similarity_scores = cosine_similarity([user_embedding_normalized], trainer_embeddings_normalized)[0]

    # Add similarity scores, price, and IDs to the filtered trainers DataFrame
    for idx, score in enumerate(similarity_scores):
        filtered_trainers[idx]['similarity'] = score

    # Sort trainers by similarity
    top_matches = sorted(filtered_trainers, key=lambda x: x['similarity'], reverse=True)[:n]

    # Add additional trainers with lower scores if user wants to try new training forms
    if user_data['try_new_training_forms']:
        remaining_trainers = [t for t in filtered_trainers if t not in top_matches]
        additional_matches = sorted(remaining_trainers, key=lambda x: x['similarity'], reverse=True)[:2]
        if len(top_matches) == n:
            top_matches = top_matches[:-2]
        elif len(top_matches) == n-1:
            top_matches = top_matches[:-1]
        top_matches.extend(additional_matches)

    top_matches = [
        {
            'trainer_id': t['trainer_id'],
            'name': t['name'],
            'age': t['age'],
            'gender': t['gender'],
            'similarity': t['similarity'],
            'min_price_per_hour': t['min_price_per_hour'],
            'training_areas': t['training_areas'],
            'licenses_certificates': t['licenses_certificates'],
            'geographic_area': t['geographic_area'],
            'goals': t['goals']
        }
        for t in top_matches
    ]
    return top_matches


# Function to recommend users to a trainer
def get_top_user_matches_for_trainer(trainer_data, n=6):
    trainer_skills = ', '.join(trainer_data['training_areas'])
    level_mapping = {"Beginner": 1, "Intermediate": 2, "Expert": 3}

    filtered_users = [
        user for user in db.get_users_by_price(trainer_data['min_price_per_hour'])
        if level_mapping.get(trainer_data['level_of_expertise'], 0) > level_mapping.get(user['experience_level'], 0)
    ]

    if not trainer_skills:
        trainer_skills = ''

    trainer_embedding = normalize([sbert_model.encode(trainer_skills)])[0]
    user_embeddings = [sbert_model.encode(', '.join(u['training_areas_of_interest'])) for u in filtered_users]

    # Normalize embeddings
    trainer_embedding_normalized = normalize([trainer_embedding])[0]
    user_embeddings_normalized = normalize(list(user_embeddings))

    similarity_scores = cosine_similarity([trainer_embedding_normalized], user_embeddings_normalized)[0]

    for idx, score in enumerate(similarity_scores):
        filtered_users[idx]['similarity'] = score

    top_matches = sorted(filtered_users, key=lambda x: x['similarity'], reverse=True)[:n]

    top_matches = [
        {
            'user_id': u['user_id'],
            'name': u['name'],
            'age': u['age'],
            'gender': u['gender'],
            'similarity': u['similarity'],
            'max_price_per_hour': u['max_price_per_hour'],
            'training_areas_of_interest': u['training_areas_of_interest'],
            'experience_level': u['experience_level'],
            'geographic_area': u['geographic_area'],
            'try_new_training_forms': u['try_new_training_forms'],
            'goals': u['goals']
        }
        for u in top_matches
    ]
    return top_matches

# API endpoint to get recommendations for a specific user
@app.route('/recommendations/<int:user_id>', methods=['GET'])
def recommend_trainers(user_id):
    user_data = db.get_user(user_id)
    if not user_data:
        return jsonify({"error": "User not found"}), 404
    recommendations = get_top_trainer_matches_for_user(user_data, n=6)
    return jsonify(recommendations)

# API endpoint to get recommendations for a specific trainer
@app.route('/recommendations/trainer/<int:trainer_id>', methods=['GET'])
def recommend_users(trainer_id):
    trainer_data = db.get_trainer(trainer_id)
    if not trainer_data:
        return jsonify({"error": "Trainer not found"}), 404
    recommendations = get_top_user_matches_for_trainer(trainer_data, n=6)
    return jsonify(recommendations)

# API endpoint to get a trainer by id
@app.route('/trainer/<int:trainer_id>', methods=['GET'])
def get_trainer(trainer_id):
    trainer_data = db.get_trainer(trainer_id)
    if not trainer_data:
        return jsonify({"error": "Trainer not found"}), 404
    return jsonify(trainer_data)

# API endpoint to get a user by id
@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user_data = db.get_user(user_id)
    if not user_data:
        return jsonify({"error": "Trainer not found"}), 404
    return jsonify(user_data)

@app.route('/trainers', methods=['GET'])
def get_random_trainers():
    random_trainers = db.get_random_trainers()
    return jsonify(random_trainers)

@app.route('/all-trainers', methods=['GET'])
def get_all_trainers():
    all_trainers = db.get_trainers()
    return jsonify(all_trainers)

# Run the app
if __name__ == '__main__':
    app.run(debug=True)