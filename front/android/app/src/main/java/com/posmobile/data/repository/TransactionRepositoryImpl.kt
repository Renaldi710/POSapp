package com.posmobile.data.repository

import com.posmobile.data.database.dao.TransactionDao
import com.posmobile.data.database.entities.TransactionEntity
import com.posmobile.data.network.ApiService
import com.posmobile.data.network.models.TransactionItemRequest
import com.posmobile.data.network.models.TransactionRequest
import com.posmobile.domain.model.Transaction
import com.posmobile.domain.model.TransactionItem
import com.posmobile.domain.repository.TransactionRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TransactionRepositoryImpl @Inject constructor(
    private val api: ApiService,
    private val transactionDao: TransactionDao
) : TransactionRepository {

    override suspend fun getAll(): List<Transaction> {
        return try {
            val dtos = api.getTransactions()
            val entities = dtos.map {
                TransactionEntity(id = it.id, userId = it.userId, totalAmount = it.totalAmount.toDoubleOrNull() ?: 0.0, status = it.status)
            }
            transactionDao.insertAll(entities)
            dtos.map { it.toDomain() }
        } catch (e: Exception) {
            transactionDao.getAll().map { entity ->
                Transaction(id = entity.id, userId = entity.userId, totalAmount = entity.totalAmount, status = entity.status, createdAt = entity.createdAt)
            }
        }
    }

    override suspend fun getById(id: Long): Transaction? {
        return try {
            val dto = api.getTransaction(id)
            dto.toDomain()
        } catch (e: Exception) {
            transactionDao.getById(id)?.let {
                Transaction(id = it.id, userId = it.userId, totalAmount = it.totalAmount, status = it.status, createdAt = it.createdAt)
            }
        }
    }

    override suspend fun create(items: List<Pair<Long, Int>>): Transaction {
        val request = TransactionRequest(
            items = items.map { TransactionItemRequest(productId = it.first, quantity = it.second) }
        )
        val dto = api.createTransaction(request)
        val entity = TransactionEntity(
            id = dto.id, userId = dto.userId,
            totalAmount = dto.totalAmount.toDoubleOrNull() ?: 0.0,
            status = dto.status
        )
        transactionDao.insert(entity)
        return dto.toDomain()
    }

    private fun com.posmobile.data.network.models.TransactionDto.toDomain() = Transaction(
        id = id,
        userId = userId,
        totalAmount = totalAmount.toDoubleOrNull() ?: 0.0,
        status = status,
        createdAt = parseDate(createdAt),
        cashierName = user?.name,
        items = items?.map { item ->
            TransactionItem(
                id = item.id,
                productId = item.productId,
                productName = item.product?.name,
                quantity = item.quantity,
                price = item.price.toDoubleOrNull() ?: 0.0,
                subtotal = item.subtotal.toDoubleOrNull() ?: 0.0
            )
        } ?: emptyList()
    )

    private fun parseDate(dateStr: String?): Long {
        if (dateStr == null) return System.currentTimeMillis()
        return try {
            java.time.LocalDateTime.parse(dateStr, java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'"))
                .atZone(java.time.ZoneOffset.UTC).toInstant().toEpochMilli()
        } catch (e: Exception) {
            try {
                java.time.LocalDateTime.parse(dateStr, java.time.format.DateTimeFormatter.ISO_DATE_TIME)
                    .atZone(java.time.ZoneOffset.UTC).toInstant().toEpochMilli()
            } catch (e2: Exception) {
                System.currentTimeMillis()
            }
        }
    }
}
