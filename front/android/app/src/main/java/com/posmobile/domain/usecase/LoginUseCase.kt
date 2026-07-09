package com.posmobile.domain.usecase

import com.posmobile.domain.model.User
import com.posmobile.domain.repository.AuthRepository
import javax.inject.Inject

class LoginUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(email: String, password: String): Result<User> {
        return try {
            authRepository.login(email, password)
            val user = authRepository.getUser()
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
