package com.posmobile.presentation.pos

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.domain.model.CartItem
import com.posmobile.domain.model.Product
import com.posmobile.domain.model.Transaction
import com.posmobile.domain.usecase.CheckoutUseCase
import com.posmobile.domain.usecase.GetProductsUseCase
import com.posmobile.presentation.bluetooth.utils.PrintService
import com.posmobile.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class POSViewModel @Inject constructor(
    private val getProducts: GetProductsUseCase,
    private val checkoutUseCase: CheckoutUseCase,
    private val printService: PrintService
) : ViewModel() {

    private val _products = MutableStateFlow<Resource<List<Product>>>(Resource.Loading)
    val products = _products.asStateFlow()

    private val _cart = MutableStateFlow<List<CartItem>>(emptyList())
    val cart = _cart.asStateFlow()

    private val _checkoutResult = MutableStateFlow<Resource<Transaction>?>(null)
    val checkoutResult = _checkoutResult.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    val cartTotal: Double get() = _cart.value.sumOf { it.subtotal }

    init { loadProducts() }

    fun loadProducts() {
        viewModelScope.launch {
            _products.value = Resource.Loading
            val result = getProducts()
            _products.value = if (result.isSuccess) {
                Resource.Success(result.getOrDefault(emptyList()))
            } else {
                Resource.Error(result.exceptionOrNull()?.message ?: "Failed to load products")
            }
        }
    }

    fun setSearchQuery(query: String) { _searchQuery.value = query }

    fun addToCart(product: Product) {
        _cart.update { cart ->
            val existing = cart.indexOfFirst { it.product.id == product.id }
            if (existing >= 0) {
                val item = cart[existing]
                if (item.quantity < product.stock) {
                    cart.toMutableList().apply { set(existing, item.copy(quantity = item.quantity + 1)) }
                } else cart
            } else {
                cart + CartItem(product = product)
            }
        }
    }

    fun updateQuantity(productId: Long, quantity: Int) {
        if (quantity < 1) { removeFromCart(productId); return }
        _cart.update { cart ->
            cart.map { item ->
                if (item.product.id == productId) {
                    if (quantity > item.product.stock) item
                    else item.copy(quantity = quantity)
                } else item
            }
        }
    }

    fun removeFromCart(productId: Long) {
        _cart.update { cart -> cart.filter { it.product.id != productId } }
    }

    fun clearCart() { _cart.value = emptyList() }

    fun checkout() {
        viewModelScope.launch {
            _checkoutResult.value = Resource.Loading
            val items = _cart.value.map { it.product.id to it.quantity }
            val result = checkoutUseCase(items)
            _checkoutResult.value = if (result.isSuccess) {
                clearCart()
                Resource.Success(result.getOrThrow())
            } else {
                Resource.Error(result.exceptionOrNull()?.message ?: "Checkout failed")
            }
        }
    }

    fun printReceipt(transaction: Transaction) {
        viewModelScope.launch {
            printService.printReceipt(transaction)
        }
    }

    fun clearCheckoutResult() { _checkoutResult.value = null }
}
