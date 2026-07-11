package com.posmobile.ui.screens.customers

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.domain.model.Customer
import com.posmobile.domain.repository.CustomerRepository
import com.posmobile.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CustomersViewModel @Inject constructor(
    private val customerRepository: CustomerRepository
) : ViewModel() {

    private val _customers = MutableStateFlow<Resource<List<Customer>>>(Resource.Loading)
    val customers = _customers.asStateFlow()

    private val _saveResult = MutableStateFlow<Resource<Unit>?>(null)
    val saveResult = _saveResult.asStateFlow()

    init { load() }

    fun load() {
        viewModelScope.launch {
            _customers.value = Resource.Loading
            try {
                _customers.value = Resource.Success(customerRepository.getAll())
            } catch (e: Exception) {
                _customers.value = Resource.Error(e.message ?: "Failed to load customers")
            }
        }
    }

    fun create(name: String, phone: String, email: String) {
        viewModelScope.launch {
            _saveResult.value = Resource.Loading
            try {
                customerRepository.create(name, phone, email)
                load()
                _saveResult.value = Resource.Success(Unit)
            } catch (e: Exception) {
                _saveResult.value = Resource.Error(e.message ?: "Failed to create customer")
            }
        }
    }

    fun update(id: Long, name: String, phone: String, email: String) {
        viewModelScope.launch {
            _saveResult.value = Resource.Loading
            try {
                customerRepository.update(id, name, phone, email)
                load()
                _saveResult.value = Resource.Success(Unit)
            } catch (e: Exception) {
                _saveResult.value = Resource.Error(e.message ?: "Failed to update customer")
            }
        }
    }

    fun delete(id: Long) {
        viewModelScope.launch {
            try {
                customerRepository.delete(id)
                load()
            } catch (e: Exception) {
                _saveResult.value = Resource.Error(e.message ?: "Failed to delete customer")
            }
        }
    }

    fun clearSaveResult() { _saveResult.value = null }
}
