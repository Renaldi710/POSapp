package com.posmobile.data.network.models

import com.google.gson.annotations.SerializedName

data class ProductDto(
    val id: Long,
    @SerializedName("category_id") val categoryId: Long,
    val name: String,
    val price: String,
    val stock: Int,
    val category: CategoryDto?
)
