package com.posmobile.data.network.models

import com.google.gson.annotations.SerializedName

data class AuthRequest(
    val email: String,
    val password: String,
    @SerializedName("device_name") val deviceName: String = "pos-mobile"
)

data class AuthResponse(
    val token: String
)
