package com.posmobile.ui.screens.transactions

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.posmobile.domain.model.Transaction
import com.posmobile.ui.components.LoadingIndicator
import com.posmobile.ui.theme.Black
import com.posmobile.ui.theme.Gold
import com.posmobile.ui.theme.Gray100
import com.posmobile.ui.theme.Gray500
import com.posmobile.ui.theme.Gray700
import com.posmobile.ui.theme.White
import com.posmobile.util.DateUtils
import com.posmobile.util.Resource

@Composable
fun TransactionsScreen(
    onBack: () -> Unit,
    viewModel: TransactionsViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Transactions", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Button(onClick = onBack, shape = RoundedCornerShape(8.dp)) { Text("Back") }
        }
        Spacer(Modifier.height(12.dp))

        when (val s = state) {
            is Resource.Loading -> LoadingIndicator()
            is Resource.Error -> Text(s.message, color = Gray700)
            is Resource.Success<List<Transaction>> -> {
                if (s.data.isEmpty()) {
                    Text("No transactions found.", color = Gray500)
                } else {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(s.data, key = { it.id }) { transaction ->
                            TransactionCard(transaction = transaction)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TransactionCard(transaction: Transaction) {
    var expanded by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = White),
        onClick = { expanded = !expanded }
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("#${transaction.id}", fontWeight = FontWeight.Bold)
                Text(DateUtils.formatTimestamp(transaction.createdAt), fontSize = 12.sp, color = Gray700)
                Text(
                    "Rp${String.format("%,.0f", transaction.totalAmount)}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                transaction.cashierName?.let { Text(it, fontSize = 12.sp, color = Gray500) }
                Text(transaction.status, fontSize = 12.sp, color = if (transaction.status == "completed") Gold else Gray500)
            }

            if (expanded && transaction.items.isNotEmpty()) {
                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                transaction.items.forEach { item ->
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(item.productName ?: "Product #${item.productId}", fontSize = 13.sp, modifier = Modifier.weight(1f))
                        Text("x${item.quantity}", fontSize = 13.sp, color = Gray700)
                        Text("Rp${String.format("%,.0f", item.subtotal)}", fontSize = 13.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }
        }
    }
}
