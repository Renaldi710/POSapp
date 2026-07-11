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
                TransactionEntity(id = it.id, userId = it.userId, totalAmount = it.totalAmount.toDoubleOrNull() ?: 0.0, status = it.status, syncStatus = "synced")
            }
            transactionDao.insertAll(entities)
            dtos.map { it.toDomain() }
        } catch (e: Exception) {
            transactionDao.getAll().map { entity ->
                entity.toDomain()
            }
        }
    }

    override suspend fun getById(id: Long): Transaction? {
        return try {
            val dto = api.getTransaction(id)
            dto.toDomain()
        } catch (e: Exception) {
            transactionDao.getById(id)?.let { it.toDomain() }
        }
    }

    override suspend fun create(items: List<Pair<Long, Int>>): Transaction {
        return try {
            val request = TransactionRequest(
                items = items.map { TransactionItemRequest(productId = it.first, quantity = it.second) }
            )
            val dto = api.createTransaction(request)
            val entity = TransactionEntity(
                id = dto.id, userId = dto.userId,
                totalAmount = dto.totalAmount.toDoubleOrNull() ?: 0.0,
                status = dto.status,
                syncStatus = "synced"
            )
            transactionDao.insert(entity)
            dto.toDomain()
        } catch (e: Exception) {
            val localId = System.currentTimeMillis()
            val totalAmount = items.sumOf { (_, qty) -> qty.toDouble() }
            val itemsJson = items.joinToString(";") { (id, qty) -> "$id:$qty" }
            val entity = TransactionEntity(
                id = localId, userId = 0,
                totalAmount = totalAmount,
                status = "completed",
                syncStatus = "pending",
                itemsJson = itemsJson
            )
            transactionDao.insert(entity)
            entity.toDomain()
        }
    }

    override suspend fun getPending(): List<Transaction> {
        return transactionDao.getBySyncStatus("pending").map { it.toDomain() }
    }

    override suspend fun markSynced(id: Long) {
        transactionDao.updateSyncStatus(id, "synced")
    }

    private fun TransactionEntity.toDomain() = Transaction(
        id = id, userId = userId,
        totalAmount = totalAmount, status = status,
        createdAt = createdAt,
        items = itemsJson?.split(";")?.mapNotNull { part ->
            val parts = part.split(":")
            if (parts.size == 2) {
                val productId = parts[0].toLongOrNull() ?: return@mapNotNull null
                val qty = parts[1].toIntOrNull() ?: return@mapNotNull null
                TransactionItem(id = 0, productId = productId, quantity = qty, price = 0.0, subtotal = 0.0)
            } else null
        } ?: emptyList()
    )

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
