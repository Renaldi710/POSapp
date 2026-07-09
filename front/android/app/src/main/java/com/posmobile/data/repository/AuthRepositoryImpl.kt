package com.posmobile.data.repository

import android.content.SharedPreferences
import com.posmobile.data.database.dao.UserDao
import com.posmobile.data.database.entities.UserEntity
import com.posmobile.data.network.ApiService
import com.posmobile.data.network.models.AuthRequest
import com.posmobile.domain.model.User
import com.posmobile.domain.repository.AuthRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val api: ApiService,
    private val userDao: UserDao,
    private val prefs: SharedPreferences
) : AuthRepository {

    override suspend fun login(email: String, password: String): String {
        val response = api.login(AuthRequest(email, password))
        saveToken(response.token)
        return response.token
    }

    override suspend fun getUser(): User {
        val dto = api.getUser()
        userDao.insert(
            UserEntity(id = dto.id, name = dto.name, email = dto.email, role = dto.role)
        )
        return User(id = dto.id, name = dto.name, email = dto.email, role = dto.role)
    }

    override suspend fun getToken(): String? = prefs.getString("token", null)

    override fun saveToken(token: String) {
        prefs.edit().putString("token", token).apply()
    }

    override fun clearToken() {
        prefs.edit().remove("token").apply()
    }

    override fun isLoggedIn(): Boolean = prefs.contains("token")
}
