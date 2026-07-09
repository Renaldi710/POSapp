package com.posmobile.domain.model

data class TransactionItem(
    val id: Long,
    val productId: Long,
    val productName: String? = null,
    val quantity: Int,
    val price: Double,
    val subtotal: Double
)
