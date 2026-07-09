package com.posmobile.domain.usecase

import com.posmobile.domain.model.Transaction
import com.posmobile.domain.repository.TransactionRepository
import javax.inject.Inject

class GetTransactionsUseCase @Inject constructor(
    private val transactionRepository: TransactionRepository
) {
    suspend operator fun invoke(): Result<List<Transaction>> {
        return try {
            Result.success(transactionRepository.getAll())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
