package com.posmobile.presentation.transactions

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.domain.model.Transaction
import com.posmobile.domain.usecase.GetTransactionsUseCase
import com.posmobile.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class TransactionsViewModel @Inject constructor(
    private val getTransactions: GetTransactionsUseCase
) : ViewModel() {

    private val _state = MutableStateFlow<Resource<List<Transaction>>>(Resource.Loading)
    val state = _state.asStateFlow()

    init { load() }

    fun load() {
        viewModelScope.launch {
            _state.value = Resource.Loading
            val result = getTransactions()
            _state.value = if (result.isSuccess) {
                Resource.Success(result.getOrDefault(emptyList()))
            } else {
                Resource.Error(result.exceptionOrNull()?.message ?: "Failed to load transactions")
            }
        }
    }
}
