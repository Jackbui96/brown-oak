package com.apani.moodieapigateway.repo

import com.apani.moodieapigateway.model.db.Movie
import com.apani.moodieapigateway.model.rest.MovieAutoComplete
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface MovieRepo : MongoRepository<Movie, String> {

    /**
     * Get random sample of movies
     * @param size number of random movies to return
     */
    @Aggregation(pipeline = [
        "{ \$sample: { size: ?0 } }"
    ])
    fun fetchRandomMovies(limit: Int): List<Movie>

    /**
     * Get autocomplete suggestions based on movie title
     * @param query search term to match against movie titles
     * @param limit maximum number of results to return
     */
    @Aggregation(pipeline = [
        "{ \$match: { title: { \$regex: ?0, \$options: 'i' } } }",
        "{ \$sort: { title: 1 } }",
        "{ \$limit: ?1 }",
        "{ \$project: { movieId: '\$_id', title: 1, year: 1, genres: 1, rating: 1 } }"
    ])
    fun getAutoCompleteSuggestions(query: String, limit: Int): List<MovieAutoComplete>

}
