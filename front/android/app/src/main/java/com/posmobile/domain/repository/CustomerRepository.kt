package com.posmobile.domain.repository

import com.posmobile.domain.model.Customer

interface CustomerRepository {
    suspend fun getAll(): List<Customer>
    suspend fun getById(id: Long): Customer?
    suspend fun create(name: String, phone: String, email: String): Customer
    suspend fun update(id: Long, name: String, phone: String, email: String): Customer
    suspend fun delete(id: Long)
}
