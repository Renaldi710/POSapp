package com.posmobile.data.network.models

import com.google.gson.annotations.SerializedName

data class TransactionItemDto(
    val id: Long,
    @SerializedName("product_id") val productId: Long,
    val quantity: Int,
    val price: String,
    val subtotal: String,
    val product: ProductDto?
)
