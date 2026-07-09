package com.posmobile.data.repository

import com.posmobile.data.database.dao.CategoryDao
import com.posmobile.data.database.entities.CategoryEntity
import com.posmobile.data.network.ApiService
import com.posmobile.domain.model.Category
import com.posmobile.domain.repository.CategoryRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CategoryRepositoryImpl @Inject constructor(
    private val api: ApiService,
    private val categoryDao: CategoryDao
) : CategoryRepository {

    override suspend fun getAll(): List<Category> {
        return try {
            val dtos = api.getCategories()
            val entities = dtos.map { CategoryEntity(id = it.id, name = it.name) }
            categoryDao.insertAll(entities)
            dtos.map { Category(id = it.id, name = it.name, productsCount = it.productsCount ?: 0) }
        } catch (e: Exception) {
            categoryDao.getAll().map { Category(id = it.id, name = it.name) }
        }
    }

    override suspend fun create(name: String): Category {
        val dto = api.createCategory(mapOf("name" to name))
        categoryDao.insertAll(listOf(CategoryEntity(id = dto.id, name = dto.name)))
        return Category(id = dto.id, name = dto.name)
    }

    override suspend fun update(id: Long, name: String): Category {
        val dto = api.updateCategory(id, mapOf("name" to name))
        categoryDao.insertAll(listOf(CategoryEntity(id = dto.id, name = dto.name)))
        return Category(id = dto.id, name = dto.name)
    }

    override suspend fun delete(id: Long) {
        api.deleteCategory(id)
        categoryDao.deleteById(id)
    }
}
