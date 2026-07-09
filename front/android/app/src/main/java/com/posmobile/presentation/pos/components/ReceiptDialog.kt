package com.posmobile.presentation.pos.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.posmobile.domain.model.Transaction
import com.posmobile.presentation.common.theme.Black
import com.posmobile.presentation.common.theme.Gold
import com.posmobile.presentation.common.theme.Gray500
import com.posmobile.presentation.common.theme.White
import com.posmobile.util.DateUtils

@Composable
fun ReceiptDialog(
    transaction: Transaction,
    onDismiss: () -> Unit,
    onPrint: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = MaterialTheme.shapes.large,
            tonalElevation = 6.dp,
            color = White
        ) {
            Column(
                modifier = Modifier.padding(24.dp).fillMaxWidth()
            ) {
                Text(
                    "RECEIPT",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center
                )
                Text(
                    "POSMobile",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center,
                    color = Gray500
                )
                Spacer(Modifier.height(12.dp))
                HorizontalDivider()
                Spacer(Modifier.height(8.dp))
                Text("ID: #${transaction.id}", fontSize = 13.sp)
                Text("Date: ${DateUtils.formatTimestamp(transaction.createdAt)}", fontSize = 13.sp)
                transaction.cashierName?.let { Text("Cashier: $it", fontSize = 13.sp) }
                Text("Status: ${transaction.status}", fontSize = 13.sp)
                Spacer(Modifier.height(8.dp))
                HorizontalDivider()
                Spacer(Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Item", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.weight(2f))
                    Text("Qty", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                    Text("Subtotal", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.weight(1.5f), textAlign = TextAlign.End)
                }
                LazyColumn(modifier = Modifier.height(200.dp)) {
                    items(transaction.items) { item ->
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(item.productName ?: "Product #${item.productId}", fontSize = 12.sp, modifier = Modifier.weight(2f))
                            Text("${item.quantity}", fontSize = 12.sp, modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                            Text("Rp${String.format("%,.0f", item.subtotal)}", fontSize = 12.sp, modifier = Modifier.weight(1.5f), textAlign = TextAlign.End)
                        }
                    }
                }
                Spacer(Modifier.height(8.dp))
                HorizontalDivider()
                Spacer(Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("TOTAL", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Text("Rp${String.format("%,.0f", transaction.totalAmount)}", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                }
                Spacer(Modifier.height(16.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Gray500)
                    ) {
                        Text("Close")
                    }
                    Button(
                        onClick = onPrint,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Gold)
                    ) {
                        Text("Print", color = Black)
                    }
                }
            }
        }
    }
}
