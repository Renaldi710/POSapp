package com.posmobile.domain.usecase

import com.posmobile.domain.model.Category
import com.posmobile.domain.model.Product
import com.posmobile.domain.model.Transaction
import com.posmobile.domain.repository.CategoryRepository
import com.posmobile.domain.repository.ProductRepository
import com.posmobile.domain.repository.TransactionRepository
import javax.inject.Inject

data class DashboardStats(
    val productsCount: Int,
    val categoriesCount: Int,
    val transactionsCount: Int,
    val totalRevenue: Double,
    val recentTransactions: List<Transaction>
)

class GetDashboardStatsUseCase @Inject constructor(
    private val productRepository: ProductRepository,
    private val categoryRepository: CategoryRepository,
    private val transactionRepository: TransactionRepository
) {
    suspend operator fun invoke(): Result<DashboardStats> {
        return try {
            val products = productRepository.getAll()
            val categories = categoryRepository.getAll()
            val transactions = transactionRepository.getAll()
            val revenue = transactions.sumOf { it.totalAmount }
            Result.success(
                DashboardStats(
                    productsCount = products.size,
                    categoriesCount = categories.size,
                    transactionsCount = transactions.size,
                    totalRevenue = revenue,
                    recentTransactions = transactions.take(5)
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
