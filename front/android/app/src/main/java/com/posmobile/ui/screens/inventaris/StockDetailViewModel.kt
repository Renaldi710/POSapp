package com.posmobile.ui.screens.inventaris

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.domain.model.Product
import com.posmobile.domain.repository.ProductRepository
import com.posmobile.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class StockDetailViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val productRepository: ProductRepository
) : ViewModel() {

    private val productId: Long = savedStateHandle["productId"] ?: 0L

    private val _state = MutableStateFlow<Resource<Product>>(Resource.Loading)
    val state = _state.asStateFlow()

    private val _saveResult = MutableStateFlow<Resource<Unit>?>(null)
    val saveResult = _saveResult.asStateFlow()

    init { load() }

    fun load() {
        viewModelScope.launch {
            _state.value = Resource.Loading
            try {
                val product = productRepository.getById(productId)
                if (product != null) {
                    _state.value = Resource.Success(product)
                } else {
                    _state.value = Resource.Error("Produk tidak ditemukan")
                }
            } catch (e: Exception) {
                _state.value = Resource.Error(e.message ?: "Gagal memuat produk")
            }
        }
    }

    fun updateStock(newStock: Int) {
        viewModelScope.launch {
            try {
                productRepository.update(productId, categoryId = null, name = null, price = null, stock = newStock)
                _saveResult.value = Resource.Success(Unit)
                load()
            } catch (e: Exception) {
                _saveResult.value = Resource.Error(e.message ?: "Gagal memperbarui stok")
            }
        }
    }

    fun clearSaveResult() {
        _saveResult.value = null
    }
}
