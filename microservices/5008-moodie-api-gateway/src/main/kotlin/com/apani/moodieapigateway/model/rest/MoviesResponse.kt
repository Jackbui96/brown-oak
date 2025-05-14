package com.apani.moodieapigateway.model.rest

data class MoviesResponse (
    val success: Boolean,
    val message: String,
    val data: Any? = null
)

data class AutoCompleteResponse(
    val suggestions: List<MovieAutoComplete>
)

data class MovieAutoComplete(
    val title: String,
    val movieId: String,
)
