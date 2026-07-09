package com.posmobile.data.sync

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.posmobile.data.network.ApiService
import com.posmobile.data.network.models.TransactionItemRequest
import com.posmobile.data.network.models.TransactionRequest
import com.posmobile.domain.repository.TransactionRepository
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject

// ponytail: simple per-transaction sync, upgrade to full conflict resolution if needed
@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val api: ApiService,
    private val transactionRepository: TransactionRepository
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            val pendingTransactions = transactionRepository.getAll()
            for (tx in pendingTransactions) {
                val items = tx.items.map {
                    TransactionItemRequest(productId = it.productId, quantity = it.quantity)
                }
                api.createTransaction(TransactionRequest(items))
            }
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}
