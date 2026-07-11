package com.posmobile.ui.screens.laporan

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.posmobile.ui.components.ErrorDialog
import com.posmobile.ui.components.LoadingIndicator
import com.posmobile.ui.theme.Black
import com.posmobile.ui.theme.Gold
import com.posmobile.ui.theme.Gray100
import com.posmobile.ui.theme.Gray500
import com.posmobile.ui.theme.Gray700
import com.posmobile.ui.theme.White
import com.posmobile.util.Resource
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

@Composable
fun LaporanScreen(
    onBack: () -> Unit,
    viewModel: LaporanViewModel = hiltViewModel()
) {
    val currentDate by viewModel.date.collectAsState()
    val reportState by viewModel.report.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Laporan", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Button(onClick = onBack, shape = RoundedCornerShape(8.dp)) { Text("Back") }
        }
        Spacer(Modifier.height(8.dp))

        DatePickerRow(
            date = currentDate,
            onDateChanged = { viewModel.setDate(it) }
        )
        Spacer(Modifier.height(12.dp))

        when (val rs = reportState) {
            null -> {}
            is Resource.Loading -> LoadingIndicator()
            is Resource.Error -> ErrorDialog(message = rs.message, onDismiss = onBack)
            is Resource.Success -> {
                val data = rs.data
                Column(
                    modifier = Modifier.verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = White)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Ringkasan", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Spacer(Modifier.height(12.dp))
                            SummaryRow("Total Transaksi", data.totalTransactions.toString())
                            SummaryRow("Total Pendapatan", "Rp${String.format("%,.0f", data.totalRevenue)}")
                            SummaryRow("Total Item Terjual", data.totalItemsSold.toString())
                        }
                    }

                    if (data.topProducts.isNotEmpty()) {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = White)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text("Produk Terlaris", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                                Spacer(Modifier.height(12.dp))
                                data.topProducts.forEachIndexed { index, product ->
                                    Row(
                                        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text("${index + 1}. ${product.product.name}", modifier = Modifier.weight(1f))
                                        Text("x${product.totalQty}", color = Gray700)
                                        Text("Rp${String.format("%,.0f", product.total.toDoubleOrNull() ?: 0.0)}", fontWeight = FontWeight.SemiBold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DatePickerRow(date: Date, onDateChanged: (Date) -> Unit) {
    val cal = Calendar.getInstance().apply { time = date }
    val fmt = SimpleDateFormat("EEE, dd MMM yyyy", Locale("id", "ID"))

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = White)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(8.dp),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = {
                cal.add(Calendar.DAY_OF_MONTH, -1)
                onDateChanged(cal.time)
            }) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Previous day")
            }
            Text(
                text = fmt.format(date),
                fontWeight = FontWeight.SemiBold,
                fontSize = 16.sp,
                modifier = Modifier.padding(horizontal = 16.dp),
                textAlign = TextAlign.Center
            )
            IconButton(onClick = {
                cal.add(Calendar.DAY_OF_MONTH, 1)
                onDateChanged(cal.time)
            }) {
                Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = "Next day")
            }
        }
    }
}

@Composable
private fun SummaryRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = Gray700)
        Text(value, fontWeight = FontWeight.Bold)
    }
}
