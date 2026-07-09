package com.posmobile.domain.model

data class Product(
    val id: Long,
    val categoryId: Long,
    val name: String,
    val price: Double,
    val stock: Int,
    val categoryName: String? = null
)
