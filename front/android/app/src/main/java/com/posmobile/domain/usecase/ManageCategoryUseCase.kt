package com.posmobile.domain.usecase

import com.posmobile.domain.model.Category
import com.posmobile.domain.repository.CategoryRepository
import javax.inject.Inject

class ManageCategoryUseCase @Inject constructor(
    private val categoryRepository: CategoryRepository
) {
    suspend fun getAll(): Result<List<Category>> {
        return try {
            Result.success(categoryRepository.getAll())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun create(name: String): Result<Category> {
        return try {
            Result.success(categoryRepository.create(name))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun update(id: Long, name: String): Result<Category> {
        return try {
            Result.success(categoryRepository.update(id, name))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun delete(id: Long): Result<Unit> {
        return try {
            Result.success(categoryRepository.delete(id))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
