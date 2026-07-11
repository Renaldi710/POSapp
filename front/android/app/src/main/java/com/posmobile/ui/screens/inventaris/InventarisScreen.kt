package com.posmobile.ui.screens.inventaris

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.posmobile.domain.model.Product
import com.posmobile.ui.components.ErrorDialog
import com.posmobile.ui.components.LoadingIndicator
import com.posmobile.ui.components.SearchBar
import com.posmobile.ui.theme.Black
import com.posmobile.ui.theme.Gold
import com.posmobile.ui.theme.Gray100
import com.posmobile.ui.theme.Gray500
import com.posmobile.ui.theme.Gray700
import com.posmobile.ui.theme.White
import com.posmobile.util.Resource

@Composable
fun InventarisScreen(
    onBack: () -> Unit,
    onProductClick: (Long) -> Unit,
    viewModel: InventarisViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()
    var searchQuery by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxSize().background(Gray100).padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Inventaris", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Button(onClick = onBack, shape = RoundedCornerShape(8.dp)) { Text("Back") }
        }
        Spacer(Modifier.height(8.dp))

        SearchBar(
            query = searchQuery,
            onQueryChange = { searchQuery = it },
            placeholder = "Search products..."
        )
        Spacer(Modifier.height(8.dp))

        when (val s = state) {
            is Resource.Loading -> LoadingIndicator()
            is Resource.Error -> ErrorDialog(message = s.message, onDismiss = onBack)
            is Resource.Success -> {
                val filtered = s.data.filter {
                    it.name.lowercase().contains(searchQuery.lowercase())
                }
                LazyColumn(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(filtered, key = { it.id }) { product ->
                        InventarisCard(product = product, onClick = { onProductClick(product.id) })
                    }
                }
            }
        }
    }
}

@Composable
private fun InventarisCard(product: Product, onClick: () -> Unit) {
    val stockColor = when {
        product.stock <= 0 -> Color(0xFFE53935)
        product.stock <= 5 -> Color(0xFFFBC02D)
        else -> Color(0xFF43A047)
    }

    Card(
        modifier = Modifier.fillMaxWidth().clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = White),
        shape = RoundedCornerShape(8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier.size(12.dp).clip(CircleShape).background(stockColor)
            )
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(product.name, fontWeight = FontWeight.SemiBold)
                Text(product.categoryName ?: "No category", fontSize = 12.sp, color = Gray500)
            }
            Column(horizontalAlignment = Alignment.End) {
                Text("Stock: ${product.stock}", fontWeight = FontWeight.Bold, color = stockColor)
                Text("Rp${String.format("%,.0f", product.price)}", fontSize = 12.sp, color = Gray700)
            }
        }
    }
}
