import time
import requests
from config import get_mongo_atlas_movies_collection

def update_genre_names():
    # Get MongoDB collection
    movie_collection = get_mongo_atlas_movies_collection()

    # Fetch genre mapping from TMDB
    response = requests.get(
        f"https://api.themoviedb.org/3/genre/movie/list?api_key=05d4672bed9f275eb9928c51a589e7e5&language=en-US"
    )
    genre_data = response.json()

    # Create genre ID to name mapping
    genre_map = {genre['id']: genre['name'] for genre in genre_data['genres']}

    # Process movies in batches to avoid memory issues
    batch_size = 100
    cursor = movie_collection.find({})

    count = 0
    updates = 0

    for movie in cursor:
        count += 1

        print(f"Movie: {movie}")

        # Create a list of dicts with both id and name
        genre_info = [
            {'id': genre_id, 'name': genre_map.get(genre_id, 'Unknown')}
            for genre_id in movie['genreIds']
        ]

        print(f"genre_info: {genre_info}")

        # Update the document
        result = movie_collection.update_one(
            {'_id': movie['_id']},
            {'$set': {'genres': genre_info}}
        )

        if result.modified_count > 0:
            updates += 1

        # Rate limiting to be nice to TMDB API
        if count % 50 == 0:
            print(f"Processed {count} movies, updated {updates}...")
            time.sleep(0.5)  # Brief pause to avoid API rate limits

    print(f"Completed: Processed {count} movies, updated {updates}")

if __name__ == "__main__":
    update_genre_names()
