from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS


import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Load dataset
df = pd.read_csv("movies_data.csv")  # Ensure this file is in the same directory

# Combine features for content-based filtering
df['combined_features'] = df['title'] + " " + df['listed_in'] + " " + df['description']

# Compute TF-IDF matrix
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_features'])

# Compute cosine similarity
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

@app.route('/', methods=['GET'])

def welcom():
    return "<h1> Hello  , this is movie recommender System</h1>"


# Recommendation function
def recommend_movies(title):
    # idx = df[df['title'] == title].index
    idx = df[df['title'].str.lower() == title.lower()].index

    if len(idx) == 0:
        return None  # Return None if movie not found

    idx = idx[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:11]  # Top 10 recommendations

    movie_indices = [i[0] for i in sim_scores]
    recommended_movies = df.iloc[movie_indices][['title', 'listed_in', 'description']].to_dict(orient="records")
    return recommended_movies

# Flask API endpoint

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    movie_name = data.get("movie_name", "").strip()

    if not movie_name:
        return jsonify({"error": "No movie name provided"}), 400

    recommendations = recommend_movies(movie_name)

    if recommendations is None:
        return jsonify({"error": "Movie not found in dataset"}), 404

    return jsonify({"recommended_movies": recommendations})

# Run Flask App
if __name__ == '__main__':
    app.run(debug=True)
