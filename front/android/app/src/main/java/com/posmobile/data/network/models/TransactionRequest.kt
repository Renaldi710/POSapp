package com.posmobile.data.network.models

import com.google.gson.annotations.SerializedName

data class TransactionRequest(
    val items: List<TransactionItemRequest>
)

data class TransactionItemRequest(
    @SerializedName("product_id") val productId: Long,
    val quantity: Int
)
