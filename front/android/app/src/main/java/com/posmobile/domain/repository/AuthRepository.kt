package com.posmobile.domain.repository

import com.posmobile.domain.model.User

interface AuthRepository {
    suspend fun login(email: String, password: String): String
    suspend fun getUser(): User
    suspend fun getToken(): String?
    fun saveToken(token: String)
    fun clearToken()
    fun isLoggedIn(): Boolean
}
