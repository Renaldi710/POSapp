package com.posmobile.domain.usecase

import com.posmobile.domain.model.Transaction
import com.posmobile.domain.repository.TransactionRepository
import javax.inject.Inject

class CheckoutUseCase @Inject constructor(
    private val transactionRepository: TransactionRepository
) {
    suspend operator fun invoke(items: List<Pair<Long, Int>>): Result<Transaction> {
        return try {
            Result.success(transactionRepository.create(items))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
