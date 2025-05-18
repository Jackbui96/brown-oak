from sklearn.metrics.pairwise import cosine_similarity

class MovieRecommendationModel:
    def __init__(self, df, feature_embeddings):
        self.df = df
        self.feature_embeddings = feature_embeddings
        self.similarity_matrix = None
        self._compute_similarity_matrix()

    def _compute_similarity_matrix(self):
        """Calculate similarity matrix between all movies using cosine similarity"""
        self.similarity_matrix = cosine_similarity(self.feature_embeddings)

    def get_movie_recommendations(self, movie_id, n_recommendations=10):
        try:
            movie_index = self.df[self.df['tmdbId'] == movie_id].index[0]
            similarity_scores = list(enumerate(self.similarity_matrix[movie_index]))
            similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
            top_similar = similarity_scores[1:n_recommendations+1]

            movie_indices = [i[0] for i in top_similar]
            similarity_values = [i[1] for i in top_similar]

            recommendations = self.df.iloc[movie_indices].copy()
            recommendations['similarity_score'] = similarity_values
            print(recommendations.head())

            return recommendations

        except IndexError:
            raise ValueError(f"Movie ID {movie_id} not found in dataset")
