package com.posmobile.presentation.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.domain.usecase.GetDashboardStatsUseCase
import com.posmobile.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val getDashboardStats: GetDashboardStatsUseCase
) : ViewModel() {

    private val _state = MutableStateFlow<Resource<DashboardUiState>>(Resource.Loading)
    val state = _state.asStateFlow()

    init { load() }

    fun load() {
        viewModelScope.launch {
            _state.value = Resource.Loading
            val result = getDashboardStats()
            _state.value = if (result.isSuccess) {
                val stats = result.getOrThrow()
                Resource.Success(
                    DashboardUiState(
                        productsCount = stats.productsCount,
                        categoriesCount = stats.categoriesCount,
                        transactionsCount = stats.transactionsCount,
                        totalRevenue = stats.totalRevenue,
                        recentTransactions = stats.recentTransactions
                    )
                )
            } else {
                Resource.Error(result.exceptionOrNull()?.message ?: "Failed to load dashboard")
            }
        }
    }
}

data class DashboardUiState(
    val productsCount: Int = 0,
    val categoriesCount: Int = 0,
    val transactionsCount: Int = 0,
    val totalRevenue: Double = 0.0,
    val recentTransactions: List<com.posmobile.domain.model.Transaction> = emptyList()
)
