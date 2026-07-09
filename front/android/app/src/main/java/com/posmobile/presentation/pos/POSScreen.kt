package com.posmobile.presentation.pos

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.posmobile.presentation.common.components.ErrorDialog
import com.posmobile.presentation.common.components.LoadingIndicator
import com.posmobile.presentation.common.components.SearchBar
import com.posmobile.presentation.common.theme.Black
import com.posmobile.presentation.common.theme.Gold
import com.posmobile.presentation.pos.components.CartPanel
import com.posmobile.presentation.pos.components.ProductCard
import com.posmobile.presentation.pos.components.ReceiptDialog
import com.posmobile.util.Resource

@Composable
fun POSScreen(
    onBack: () -> Unit,
    viewModel: POSViewModel = hiltViewModel()
) {
    val productsState by viewModel.products.collectAsState()
    val cart by viewModel.cart.collectAsState()
    val checkoutResult by viewModel.checkoutResult.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()

    LaunchedEffect(checkoutResult) {
        if (checkoutResult is Resource.Success) {
            viewModel.loadProducts()
        }
    }

    Row(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier.weight(1f).fillMaxHeight().padding(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Button(
                    onClick = onBack,
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Gold)
                ) {
                    androidx.compose.material3.Text("Back", color = Black)
                }
            }
            SearchBar(
                query = searchQuery,
                onQueryChange = { viewModel.setSearchQuery(it) },
                placeholder = "Search products..."
            )
            when (val state = productsState) {
                is Resource.Loading -> LoadingIndicator()
                is Resource.Error -> ErrorDialog(message = state.message, onDismiss = onBack)
                is Resource.Success -> {
                    val filtered = state.data.filter {
                        it.name.lowercase().contains(searchQuery.lowercase())
                    }
                    LazyVerticalGrid(
                        columns = GridCells.Adaptive(minSize = 140.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(filtered, key = { it.id }) { product ->
                            ProductCard(
                                product = product,
                                onAdd = { viewModel.addToCart(product) }
                            )
                        }
                    }
                }
            }
        }

        CartPanel(
            cart = cart,
            total = viewModel.cartTotal,
            onIncrement = { viewModel.updateQuantity(it, (cart.find { c -> c.product.id == it }?.quantity ?: 0) + 1) },
            onDecrement = { viewModel.updateQuantity(it, (cart.find { c -> c.product.id == it }?.quantity ?: 1) - 1) },
            onCheckout = { viewModel.checkout() },
            modifier = Modifier.width(320.dp)
        )
    }

    if (checkoutResult is Resource.Success) {
        val transaction = (checkoutResult as Resource.Success<com.posmobile.domain.model.Transaction>).data
        ReceiptDialog(
            transaction = transaction,
            onDismiss = { viewModel.clearCheckoutResult() },
            onPrint = {
                viewModel.printReceipt(transaction)
                viewModel.clearCheckoutResult()
            }
        )
    }

    if (checkoutResult is Resource.Error) {
        ErrorDialog(
            message = (checkoutResult as Resource.Error).message,
            onDismiss = { viewModel.clearCheckoutResult() }
        )
    }
}
