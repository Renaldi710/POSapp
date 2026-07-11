package com.posmobile.ui.screens.kasir.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.posmobile.domain.model.CartItem
import com.posmobile.ui.theme.Black
import com.posmobile.ui.theme.Gold
import com.posmobile.ui.theme.Gray500
import com.posmobile.ui.theme.White

@Composable
fun CartItemRow(
    item: CartItem,
    onIncrement: () -> Unit,
    onDecrement: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth().padding(vertical = 4.dp, horizontal = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(item.product.name, fontWeight = FontWeight.Medium, fontSize = 13.sp)
            Text("Rp${String.format("%,.0f", item.product.price)}/item", fontSize = 11.sp, color = Gray500)
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onDecrement, modifier = Modifier.size(28.dp)) {
                Icon(Icons.Default.Clear, "Kurangi", modifier = Modifier.size(16.dp))
            }
            Text("${item.quantity}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            IconButton(onClick = onIncrement, modifier = Modifier.size(28.dp)) {
                Icon(Icons.Default.Add, "Tambah", modifier = Modifier.size(16.dp), tint = Gold)
            }
        }
        Spacer(Modifier.width(8.dp))
        Text(
            text = "Rp${String.format("%,.0f", item.subtotal)}",
            fontWeight = FontWeight.Bold,
            fontSize = 13.sp
        )
    }
}
