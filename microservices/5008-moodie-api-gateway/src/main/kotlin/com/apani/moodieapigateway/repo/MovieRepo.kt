package com.apani.moodieapigateway.repo

import com.apani.moodieapigateway.model.db.Movie
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface MovieRepo : MongoRepository<Movie, String> {
    @Aggregation(pipeline = [
        "{ \$sample: { size: ?0 } }"
    ])
    fun fetchRandomMovies(limit: Int): List<Movie>
}
