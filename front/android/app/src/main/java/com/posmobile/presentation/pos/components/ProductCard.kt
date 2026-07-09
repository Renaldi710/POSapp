package com.posmobile.presentation.pos.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.posmobile.domain.model.Product
import com.posmobile.presentation.common.theme.Black
import com.posmobile.presentation.common.theme.Gold
import com.posmobile.presentation.common.theme.Gray300
import com.posmobile.presentation.common.theme.Gray500
import com.posmobile.presentation.common.theme.Gray700
import com.posmobile.presentation.common.theme.White

@Composable
fun ProductCard(
    product: Product,
    onAdd: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = product.name,
                fontWeight = FontWeight.SemiBold,
                fontSize = 14.sp,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
            if (product.categoryName != null) {
                Text(product.categoryName, fontSize = 11.sp, color = Gray500)
            }
            Spacer(Modifier.height(4.dp))
            Text(
                text = "Rp${String.format("%,.0f", product.price)}",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = Black
            )
            Text("Stok: ${product.stock}", fontSize = 11.sp, color = Gray700)
            Spacer(Modifier.height(4.dp))
            Button(
                onClick = onAdd,
                enabled = product.stock > 0,
                modifier = Modifier.fillMaxWidth().height(32.dp),
                shape = RoundedCornerShape(4.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Gold,
                    disabledContainerColor = Gray300
                )
            ) {
                Text("Tambah", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Black)
            }
        }
    }
}
