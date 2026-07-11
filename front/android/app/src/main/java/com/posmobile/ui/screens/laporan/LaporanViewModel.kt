package com.posmobile.ui.screens.laporan

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.data.network.ApiService
import com.posmobile.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import javax.inject.Inject

@HiltViewModel
class LaporanViewModel @Inject constructor(
    private val api: ApiService
) : ViewModel() {

    private val _date = MutableStateFlow(Date())
    val date = _date.asStateFlow()

    private val _report = MutableStateFlow<Resource<LaporanUiState>?>(null)
    val report = _report.asStateFlow()

    init { load() }

    fun setDate(newDate: Date) {
        _date.value = newDate
        load()
    }

    fun load() {
        viewModelScope.launch {
            _report.value = Resource.Loading
            try {
                val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(_date.value)
                val dto = api.getDailyReport(dateStr)
                _report.value = Resource.Success(
                    LaporanUiState(
                        date = dateStr,
                        totalTransactions = dto.totalTransactions,
                        totalRevenue = dto.totalRevenue,
                        totalItemsSold = dto.totalItemsSold,
                        topProducts = dto.topProducts
                    )
                )
            } catch (e: Exception) {
                _report.value = Resource.Error(e.message ?: "Gagal memuat laporan")
            }
        }
    }
}

data class LaporanUiState(
    val date: String = "",
    val totalTransactions: Int = 0,
    val totalRevenue: Double = 0.0,
    val totalItemsSold: Int = 0,
    val topProducts: List<com.posmobile.data.network.models.TopProductDto> = emptyList()
)
