package com.posmobile.domain.model

data class Customer(
    val id: Long = 0,
    val name: String,
    val phone: String = "",
    val email: String = "",
    val loyaltyPoints: Int = 0
)
