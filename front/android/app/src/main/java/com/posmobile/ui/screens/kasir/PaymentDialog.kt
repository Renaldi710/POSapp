package com.posmobile.ui.screens.kasir

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.posmobile.ui.theme.Black
import com.posmobile.ui.theme.Gold
import com.posmobile.ui.theme.Gray300
import com.posmobile.ui.theme.Gray500
import com.posmobile.ui.theme.Gray700
import com.posmobile.ui.theme.White

enum class PaymentMethod { CASH, QRIS, CARD }

@Composable
fun PaymentDialog(
    totalAmount: Double,
    onConfirm: (PaymentMethod, Double) -> Unit,
    onDismiss: () -> Unit
) {
    var selectedMethod by remember { mutableStateOf(PaymentMethod.CASH) }
    var cashAmount by remember { mutableStateOf("") }

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
                    "Payment",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center
                )

                Spacer(Modifier.height(16.dp))
                HorizontalDivider()
                Spacer(Modifier.height(12.dp))

                Text("Total", fontSize = 14.sp, color = Gray700)
                Text(
                    "Rp${String.format("%,.0f", totalAmount)}",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Black
                )

                Spacer(Modifier.height(20.dp))

                Text("Payment Method", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                Spacer(Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    PaymentMethod.values().forEach { method ->
                        val isSelected = selectedMethod == method
                        Button(
                            onClick = { selectedMethod = method },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isSelected) Gold else Gray300,
                                contentColor = if (isSelected) Black else Gray700
                            )
                        ) {
                            Text(
                                when (method) {
                                    PaymentMethod.CASH -> "Cash"
                                    PaymentMethod.QRIS -> "QRIS"
                                    PaymentMethod.CARD -> "Card"
                                },
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                fontSize = 13.sp
                            )
                        }
                    }
                }

                if (selectedMethod == PaymentMethod.CASH) {
                    Spacer(Modifier.height(16.dp))
                    Text("Cash Amount", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                    Spacer(Modifier.height(4.dp))
                    OutlinedTextField(
                        value = cashAmount,
                        onValueChange = { cashAmount = it.filter { c -> c.isDigit() || c == '.' } },
                        placeholder = { Text("Enter cash amount") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Gold,
                            cursorColor = Gold
                        )
                    )

                    val cash = cashAmount.toDoubleOrNull() ?: 0.0
                    if (cash >= totalAmount) {
                        val change = cash - totalAmount
                        Spacer(Modifier.height(8.dp))
                        Text(
                            "Change: Rp${String.format("%,.0f", change)}",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Gray700
                        )
                    }
                }

                Spacer(Modifier.height(20.dp))
                HorizontalDivider()
                Spacer(Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Gray500)
                    ) {
                        Text("Cancel")
                    }
                    Button(
                        onClick = {
                            val cash = cashAmount.toDoubleOrNull() ?: totalAmount
                            onConfirm(selectedMethod, maxOf(cash, totalAmount))
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Gold)
                    ) {
                        Text("Pay", color = Black, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
