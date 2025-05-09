package com.apani.moodieapigateway.graphql

import com.apani.moodieapigateway.model.db.Movie
import com.apani.moodieapigateway.service.MovieService
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class MoviesGraphQLController(private val movieService: MovieService) {

    @QueryMapping
    fun randomMovies(@Argument limit: Int = 10): List<Movie> {
        return movieService.getRandomMovies(limit)
    }
}
