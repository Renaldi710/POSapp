package com.posmobile.presentation.products

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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.posmobile.domain.model.Product
import com.posmobile.presentation.common.components.ErrorDialog
import com.posmobile.presentation.common.components.LoadingIndicator
import com.posmobile.presentation.common.theme.Black
import com.posmobile.presentation.common.theme.Gold
import com.posmobile.presentation.common.theme.Gray100
import com.posmobile.presentation.common.theme.Gray500
import com.posmobile.presentation.common.theme.Gray700
import com.posmobile.presentation.common.theme.White
import com.posmobile.util.Resource

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductsScreen(
    onBack: () -> Unit,
    viewModel: ProductsViewModel = hiltViewModel()
) {
    val productsState by viewModel.products.collectAsState()
    val categories by viewModel.categories.collectAsState()
    val saveResult by viewModel.saveResult.collectAsState()

    var showForm by remember { mutableStateOf(false) }
    var editingProduct by remember { mutableStateOf<Product?>(null) }

    LaunchedEffect(saveResult) {
        if (saveResult is Resource.Success) showForm = false
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Products", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = onBack, shape = RoundedCornerShape(8.dp)) { Text("Back") }
                Button(
                    onClick = { editingProduct = null; showForm = true },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Gold)
                ) {
                    Icon(Icons.Default.Add, contentDescription = null)
                    Text("Add", color = Black)
                }
            }
        }
        Spacer(Modifier.height(12.dp))

        when (val state = productsState) {
            is Resource.Loading -> LoadingIndicator()
            is Resource.Error -> ErrorDialog(message = state.message, onDismiss = onBack)
            is Resource.Success -> {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    items(state.data, key = { it.id }) { product ->
                        ProductRow(
                            product = product,
                            onEdit = { editingProduct = product; showForm = true },
                            onDelete = { viewModel.delete(product.id) }
                        )
                    }
                }
            }
        }
    }

    if (showForm) {
        ProductFormSheet(
            product = editingProduct,
            categories = categories,
            onSave = { catId, name, price, stock ->
                if (editingProduct != null) {
                    viewModel.update(editingProduct!!.id, catId, name, price, stock)
                } else {
                    viewModel.create(catId, name, price, stock)
                }
            },
            onDismiss = { showForm = false; editingProduct = null }
        )
    }

    if (saveResult is Resource.Error) {
        ErrorDialog(
            message = (saveResult as Resource.Error).message,
            onDismiss = { viewModel.clearSaveResult() }
        )
    }
}

@Composable
private fun ProductRow(
    product: Product,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = White)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(product.name, fontWeight = FontWeight.SemiBold)
                Text("Rp${String.format("%,.0f", product.price)} | Stok: ${product.stock}", fontSize = 12.sp, color = Gray700)
            }
            TextButton(onClick = onEdit) { Text("Edit", color = Gold) }
            TextButton(onClick = onDelete) { Text("Delete", color = MaterialTheme.colorScheme.error) }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ProductFormSheet(
    product: Product?,
    categories: List<com.posmobile.domain.model.Category>,
    onSave: (Long, String, Double, Int) -> Unit,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var name by remember { mutableStateOf(product?.name ?: "") }
    var selectedCategoryId by remember { mutableStateOf(product?.categoryId ?: 0L) }
    var priceText by remember { mutableStateOf(product?.price?.let { String.format("%.0f", it) } ?: "") }
    var stockText by remember { mutableStateOf(product?.stock?.toString() ?: "") }
    var categoryExpanded by remember { mutableStateOf(false) }

    ModalBottomSheet(onDismissRequest = onDismiss, sheetState = sheetState) {
        Column(modifier = Modifier.padding(24.dp)) {
            Text(
                if (product == null) "Add Product" else "Edit Product",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(16.dp))

            OutlinedTextField(
                value = name, onValueChange = { name = it },
                label = { Text("Name") }, singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Gold, cursorColor = Gold)
            )
            Spacer(Modifier.height(8.dp))

            ExposedDropdownMenuBox(
                expanded = categoryExpanded,
                onExpandedChange = { categoryExpanded = it }
            ) {
                OutlinedTextField(
                    value = categories.find { it.id == selectedCategoryId }?.name ?: "Select category",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Category") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = categoryExpanded) },
                    modifier = Modifier.menuAnchor().fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Gold)
                )
                ExposedDropdownMenu(
                    expanded = categoryExpanded,
                    onDismissRequest = { categoryExpanded = false }
                ) {
                    categories.forEach { cat ->
                        DropdownMenuItem(
                            text = { Text(cat.name) },
                            onClick = { selectedCategoryId = cat.id; categoryExpanded = false }
                        )
                    }
                }
            }
            Spacer(Modifier.height(8.dp))

            OutlinedTextField(
                value = priceText, onValueChange = { priceText = it },
                label = { Text("Price") }, singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Gold, cursorColor = Gold)
            )
            Spacer(Modifier.height(8.dp))

            OutlinedTextField(
                value = stockText, onValueChange = { stockText = it },
                label = { Text("Stock") }, singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Gold, cursorColor = Gold)
            )
            Spacer(Modifier.height(24.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(onClick = onDismiss, modifier = Modifier.weight(1f), shape = RoundedCornerShape(8.dp)) {
                    Text("Cancel")
                }
                Button(
                    onClick = {
                        val price = priceText.toDoubleOrNull() ?: return@Button
                        val stock = stockText.toIntOrNull() ?: return@Button
                        onSave(selectedCategoryId, name, price, stock)
                    },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Gold)
                ) {
                    Text("Save", color = Black)
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}
