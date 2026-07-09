package com.posmobile.domain.usecase

import com.posmobile.domain.model.Product
import com.posmobile.domain.repository.ProductRepository
import javax.inject.Inject

class GetProductsUseCase @Inject constructor(
    private val productRepository: ProductRepository
) {
    suspend operator fun invoke(): Result<List<Product>> {
        return try {
            Result.success(productRepository.getAll())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
