package com.posmobile.ui.screens.inventaris

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import com.posmobile.ui.theme.Gray500
import com.posmobile.ui.theme.Gray700
import com.posmobile.ui.theme.White
import com.posmobile.util.Resource

@Composable
fun StockDetailScreen(
    onBack: () -> Unit,
    viewModel: StockDetailViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()
    val saveResult by viewModel.saveResult.collectAsState()

    when (val s = state) {
        is Resource.Loading -> LoadingIndicator()
        is Resource.Error -> ErrorDialog(message = s.message, onDismiss = onBack)
        is Resource.Success -> {
            val product = s.data
            var adjustedStock by remember(product.id) { mutableIntStateOf(product.stock) }

            Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Stock Detail", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
                    Button(onClick = onBack, shape = RoundedCornerShape(8.dp)) { Text("Back") }
                }
                Spacer(Modifier.height(16.dp))

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = White)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(product.name, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                        Spacer(Modifier.height(4.dp))
                        Text(product.categoryName ?: "No category", color = Gray500)
                        Spacer(Modifier.height(8.dp))
                        Text("Harga: Rp${String.format("%,.0f", product.price)}", color = Gray700)
                        Text("Stok saat ini: ${product.stock}", fontWeight = FontWeight.SemiBold)
                    }
                }

                Spacer(Modifier.height(24.dp))

                Text("Sesuaikan Stok", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                Spacer(Modifier.height(12.dp))

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = White)
                ) {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Button(
                                onClick = { if (adjustedStock > 0) adjustedStock-- },
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Gray700)
                            ) {
                                Text("-", fontSize = 24.sp, color = White)
                            }
                            Spacer(Modifier.width(24.dp))
                            Text(
                                "$adjustedStock",
                                fontSize = 36.sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.width(80.dp)
                            )
                            Spacer(Modifier.width(24.dp))
                            Button(
                                onClick = { adjustedStock++ },
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Gold)
                            ) {
                                Text("+", fontSize = 24.sp, color = Black)
                            }
                        }
                        Spacer(Modifier.height(16.dp))
                        val isChanged = adjustedStock != product.stock
                        Button(
                            onClick = { viewModel.updateStock(adjustedStock) },
                            enabled = isChanged,
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = if (isChanged) Gold else Gray500)
                        ) {
                            Text("Simpan", color = if (isChanged) Black else White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }

    LaunchedEffect(saveResult) {
        if (saveResult is Resource.Success) onBack()
    }

    if (saveResult is Resource.Error) {
        ErrorDialog(message = (saveResult as Resource.Error).message, onDismiss = { viewModel.clearSaveResult() })
    }
}
