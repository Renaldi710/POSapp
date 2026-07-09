package com.posmobile.data.network.models

import com.google.gson.annotations.SerializedName

data class UserDto(
    val id: Long,
    val name: String,
    val email: String,
    val role: String,
    @SerializedName("created_at") val createdAt: String?
)
