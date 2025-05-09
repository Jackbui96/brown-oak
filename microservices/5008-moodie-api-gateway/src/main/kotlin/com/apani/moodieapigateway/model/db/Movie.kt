package com.apani.moodieapigateway.model.db

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "movies")
data class Movie (
    @Id val id: String,
    val title: String,
    val overview: String,
    val releaseDate: String,
    val voteAverage: Double,
    val voteCount: Int,
    val popularity: Double,
    val genreIds: List<Int>,
    val posterPath: String,
)
