package com.posmobile.domain.model

data class Transaction(
    val id: Long,
    val userId: Long,
    val totalAmount: Double,
    val status: String,
    val createdAt: Long,
    val cashierName: String? = null,
    val items: List<TransactionItem> = emptyList()
)
