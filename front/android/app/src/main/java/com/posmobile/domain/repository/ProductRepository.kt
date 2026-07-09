package com.posmobile.domain.repository

import com.posmobile.domain.model.Product

interface ProductRepository {
    suspend fun getAll(): List<Product>
    suspend fun getById(id: Long): Product?
    suspend fun create(categoryId: Long, name: String, price: Double, stock: Int): Product
    suspend fun update(id: Long, categoryId: Long?, name: String?, price: Double?, stock: Int?): Product
    suspend fun delete(id: Long)
}
