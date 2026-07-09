package com.posmobile.domain.repository

import com.posmobile.domain.model.Transaction

interface TransactionRepository {
    suspend fun getAll(): List<Transaction>
    suspend fun getById(id: Long): Transaction?
    suspend fun create(items: List<Pair<Long, Int>>): Transaction
}
