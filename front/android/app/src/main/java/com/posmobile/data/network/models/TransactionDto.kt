package com.posmobile.data.network.models

import com.google.gson.annotations.SerializedName

data class TransactionDto(
    val id: Long,
    @SerializedName("user_id") val userId: Long,
    @SerializedName("total_amount") val totalAmount: String,
    val status: String,
    @SerializedName("created_at") val createdAt: String,
    val items: List<TransactionItemDto>? = null,
    val user: UserDto? = null
)
