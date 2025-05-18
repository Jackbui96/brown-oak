import pandas as pd
from config import get_mongo_atlas_movies_collection
from movie_recommendation_model import MovieRecommendationModel
from preprocess import preprocess_text, generate_embeddings, combine_features


def setup_df():
    movies_collection = get_mongo_atlas_movies_collection()
    movie_records = list(movies_collection.find())
    df = pd.DataFrame(movie_records)

    pd.set_option("display.max_columns", None)
    pd.set_option("display.max_rows", None)
    pd.set_option("display.width", 1000)

    print("\n===== DESCRIPTIVE STATISTICS =====")
    nlp_feature_extraction(df)

def nlp_feature_extraction(df):
    # Preprocess titles and overviews
    df['clean_title'] = df['title'].apply(preprocess_text)
    df['clean_overview'] = df['overview'].apply(preprocess_text)
    print(df.head())

    # Generate embeddings
    print(f"Start title embeddings....")
    title_embeddings = generate_embeddings(df['clean_title'].tolist())
    print(f"Start overview embeddings....")
    overview_embeddings = generate_embeddings(df['clean_overview'].tolist())
    print(f"Combining features....")
    movie_features = combine_features(title_embeddings, overview_embeddings)

    system = MovieRecommendationModel(df, movie_features)
    system.get_movie_recommendations(1241982)

    system.save_embeddings_to_h5()

if __name__ == "__main__":
    setup_df()
