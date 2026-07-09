package com.posmobile.presentation.products

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.domain.model.Category
import com.posmobile.domain.model.Product
import com.posmobile.domain.repository.CategoryRepository
import com.posmobile.domain.repository.ProductRepository
import com.posmobile.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProductsViewModel @Inject constructor(
    private val productRepository: ProductRepository,
    private val categoryRepository: CategoryRepository
) : ViewModel() {

    private val _products = MutableStateFlow<Resource<List<Product>>>(Resource.Loading)
    val products = _products.asStateFlow()

    private val _categories = MutableStateFlow<List<Category>>(emptyList())
    val categories = _categories.asStateFlow()

    private val _saveResult = MutableStateFlow<Resource<Unit>?>(null)
    val saveResult = _saveResult.asStateFlow()

    init { load() }

    fun load() {
        viewModelScope.launch {
            _products.value = Resource.Loading
            try {
                val result = productRepository.getAll()
                _products.value = Resource.Success(result)
                _categories.value = categoryRepository.getAll()
            } catch (e: Exception) {
                _products.value = Resource.Error(e.message ?: "Failed to load products")
            }
        }
    }

    fun create(categoryId: Long, name: String, price: Double, stock: Int) {
        viewModelScope.launch {
            _saveResult.value = Resource.Loading
            try {
                productRepository.create(categoryId, name, price, stock)
                _saveResult.value = Resource.Success(Unit)
                load()
            } catch (e: Exception) {
                _saveResult.value = Resource.Error(e.message ?: "Failed to create product")
            }
        }
    }

    fun update(id: Long, categoryId: Long?, name: String?, price: Double?, stock: Int?) {
        viewModelScope.launch {
            _saveResult.value = Resource.Loading
            try {
                productRepository.update(id, categoryId, name, price, stock)
                _saveResult.value = Resource.Success(Unit)
                load()
            } catch (e: Exception) {
                _saveResult.value = Resource.Error(e.message ?: "Failed to update product")
            }
        }
    }

    fun delete(id: Long) {
        viewModelScope.launch {
            try {
                productRepository.delete(id)
                load()
            } catch (e: Exception) {
                _saveResult.value = Resource.Error(e.message ?: "Failed to delete product")
            }
        }
    }

    fun clearSaveResult() { _saveResult.value = null }
}
