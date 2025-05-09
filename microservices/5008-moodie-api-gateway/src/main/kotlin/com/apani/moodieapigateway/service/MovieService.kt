package com.apani.moodieapigateway.service

import com.apani.moodieapigateway.model.db.Movie
import com.apani.moodieapigateway.repo.MovieRepo
import org.springframework.stereotype.Service

@Service
class MovieService(private val movieRepo: MovieRepo) {

    fun getRandomMovies(limit: Int = 10): List<Movie> {
        return try {
            movieRepo.fetchRandomMovies(limit)
        } catch (e: Exception) {
            emptyList()
        }
    }
}
