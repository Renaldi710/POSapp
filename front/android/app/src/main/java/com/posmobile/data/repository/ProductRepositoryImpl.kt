package com.posmobile.data.repository

import com.posmobile.data.database.dao.ProductDao
import com.posmobile.data.database.entities.ProductEntity
import com.posmobile.data.network.ApiService
import com.posmobile.domain.model.Product
import com.posmobile.domain.repository.ProductRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ProductRepositoryImpl @Inject constructor(
    private val api: ApiService,
    private val productDao: ProductDao
) : ProductRepository {

    override suspend fun getAll(): List<Product> {
        return try {
            val dtos = api.getProducts()
            val entities = dtos.map {
                ProductEntity(id = it.id, categoryId = it.categoryId, name = it.name, price = it.price.toDoubleOrNull() ?: 0.0, stock = it.stock)
            }
            productDao.insertAll(entities)
            dtos.map {
                Product(id = it.id, categoryId = it.categoryId, name = it.name, price = it.price.toDoubleOrNull() ?: 0.0, stock = it.stock, categoryName = it.category?.name)
            }
        } catch (e: Exception) {
            productDao.getAll().map {
                Product(id = it.id, categoryId = it.categoryId, name = it.name, price = it.price, stock = it.stock)
            }
        }
    }

    override suspend fun getById(id: Long): Product? {
        return try {
            val dto = api.getProduct(id)
            Product(id = dto.id, categoryId = dto.categoryId, name = dto.name, price = dto.price.toDoubleOrNull() ?: 0.0, stock = dto.stock, categoryName = dto.category?.name)
        } catch (e: Exception) {
            productDao.getById(id)?.let {
                Product(id = it.id, categoryId = it.categoryId, name = it.name, price = it.price, stock = it.stock)
            }
        }
    }

    override suspend fun create(categoryId: Long, name: String, price: Double, stock: Int): Product {
        val dto = api.createProduct(mapOf("category_id" to categoryId, "name" to name, "price" to price, "stock" to stock))
        return Product(id = dto.id, categoryId = dto.categoryId, name = dto.name, price = dto.price.toDoubleOrNull() ?: 0.0, stock = dto.stock)
    }

    override suspend fun update(id: Long, categoryId: Long?, name: String?, price: Double?, stock: Int?): Product {
        val body = mutableMapOf<String, Any>()
        categoryId?.let { body["category_id"] = it }
        name?.let { body["name"] = it }
        price?.let { body["price"] = it }
        stock?.let { body["stock"] = it }
        val dto = api.updateProduct(id, body)
        return Product(id = dto.id, categoryId = dto.categoryId, name = dto.name, price = dto.price.toDoubleOrNull() ?: 0.0, stock = dto.stock)
    }

    override suspend fun delete(id: Long) {
        api.deleteProduct(id)
        productDao.deleteById(id)
    }
}
