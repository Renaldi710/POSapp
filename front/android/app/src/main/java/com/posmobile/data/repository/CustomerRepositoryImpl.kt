package com.posmobile.data.repository

import com.posmobile.data.database.dao.CustomerDao
import com.posmobile.data.database.entities.CustomerEntity
import com.posmobile.domain.model.Customer
import com.posmobile.domain.repository.CustomerRepository
import javax.inject.Inject
import javax.inject.Singleton

// TODO: backend endpoint — customers API not yet implemented on server
@Singleton
class CustomerRepositoryImpl @Inject constructor(
    private val customerDao: CustomerDao
) : CustomerRepository {

    override suspend fun getAll(): List<Customer> {
        return customerDao.getAll().map { it.toDomain() }
    }

    override suspend fun getById(id: Long): Customer? {
        return customerDao.getById(id)?.toDomain()
    }

    override suspend fun create(name: String, phone: String, email: String): Customer {
        val entity = CustomerEntity(name = name, phone = phone, email = email)
        val id = customerDao.insert(entity)
        return entity.copy(id = id).toDomain()
    }

    override suspend fun update(id: Long, name: String, phone: String, email: String): Customer {
        val entity = CustomerEntity(id = id, name = name, phone = phone, email = email)
        customerDao.insert(entity)
        return entity.toDomain()
    }

    override suspend fun delete(id: Long) {
        customerDao.deleteById(id)
    }

    private fun CustomerEntity.toDomain() = Customer(
        id = id, name = name, phone = phone, email = email, loyaltyPoints = loyaltyPoints
    )
}
