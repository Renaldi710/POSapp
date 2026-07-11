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

// ponytail: pushes pending transactions via itemsJson, markSynced on success
@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val api: ApiService,
    private val transactionRepository: TransactionRepository
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            val pendingTxs = transactionRepository.getPending()
            for (tx in pendingTxs) {
                val items = tx.items.map {
                    TransactionItemRequest(productId = it.productId, quantity = it.quantity)
                }
                api.createTransaction(TransactionRequest(items))
                transactionRepository.markSynced(tx.id)
            }
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}
