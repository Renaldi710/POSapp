package com.posmobile.data.network.models

import com.google.gson.annotations.SerializedName

data class CategoryDto(
    val id: Long,
    val name: String,
    @SerializedName("products_count") val productsCount: Int? = 0
)
