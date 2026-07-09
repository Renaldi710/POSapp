package com.posmobile.domain.repository

import com.posmobile.domain.model.Category

interface CategoryRepository {
    suspend fun getAll(): List<Category>
    suspend fun create(name: String): Category
    suspend fun update(id: Long, name: String): Category
    suspend fun delete(id: Long)
}
