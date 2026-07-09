package com.posmobile.domain.model

data class Category(
    val id: Long,
    val name: String,
    val productsCount: Int = 0
)
