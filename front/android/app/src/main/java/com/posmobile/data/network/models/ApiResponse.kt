package com.posmobile.data.network.models

data class ValidationErrorResponse(
    val message: String,
    val errors: Map<String, List<String>>?
)
