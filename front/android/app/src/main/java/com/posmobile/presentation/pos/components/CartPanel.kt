package com.posmobile.presentation.pos.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.posmobile.domain.model.CartItem
import com.posmobile.presentation.common.theme.Black
import com.posmobile.presentation.common.theme.Gold
import com.posmobile.presentation.common.theme.Gray100
import com.posmobile.presentation.common.theme.Gray300
import com.posmobile.presentation.common.theme.Gray500
import com.posmobile.presentation.common.theme.White

@Composable
fun CartPanel(
    cart: List<CartItem>,
    total: Double,
    onIncrement: (Long) -> Unit,
    onDecrement: (Long) -> Unit,
    onCheckout: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxHeight().background(White).padding(12.dp)
    ) {
        Text("Cart", fontWeight = FontWeight.Bold, fontSize = 18.sp)
        HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = Gray300)

        if (cart.isEmpty()) {
            Text("Cart is empty", color = Gray500, modifier = Modifier.weight(1f))
        } else {
            LazyColumn(modifier = Modifier.weight(1f)) {
                items(cart, key = { it.product.id }) { item ->
                    CartItemRow(
                        item = item,
                        onIncrement = { onIncrement(item.product.id) },
                        onDecrement = { onDecrement(item.product.id) }
                    )
                    HorizontalDivider(color = Gray100)
                }
            }
        }

        HorizontalDivider(color = Gray300)
        Spacer(Modifier.height(8.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Total", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Text("Rp${String.format("%,.0f", total)}", fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }
        Spacer(Modifier.height(12.dp))
        Button(
            onClick = onCheckout,
            enabled = cart.isNotEmpty(),
            modifier = Modifier.fillMaxWidth().height(48.dp),
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Gold,
                disabledContainerColor = Gray300
            )
        ) {
            Text("Checkout", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Black)
        }
    }
}
