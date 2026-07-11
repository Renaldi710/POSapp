package com.posmobile.ui.screens.categories

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
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import com.posmobile.domain.model.Category
import com.posmobile.ui.components.ErrorDialog
import com.posmobile.ui.components.LoadingIndicator
import com.posmobile.ui.theme.Black
import com.posmobile.ui.theme.Gold
import com.posmobile.ui.theme.Gray700
import com.posmobile.ui.theme.White
import com.posmobile.util.Resource

@Composable
fun CategoriesScreen(
    onBack: () -> Unit,
    viewModel: CategoriesViewModel = hiltViewModel()
) {
    val categoriesState by viewModel.categories.collectAsState()
    val saveResult by viewModel.saveResult.collectAsState()

    var showForm by remember { mutableStateOf(false) }
    var editingCategory by remember { mutableStateOf<Category?>(null) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Categories", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = onBack, shape = RoundedCornerShape(8.dp)) { Text("Back") }
                Button(
                    onClick = { editingCategory = null; showForm = true },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Gold)
                ) {
                    Icon(Icons.Default.Add, contentDescription = null)
                    Text("Add", color = Black)
                }
            }
        }
        Spacer(Modifier.height(12.dp))

        when (val state = categoriesState) {
            is Resource.Loading -> LoadingIndicator()
            is Resource.Error -> ErrorDialog(message = state.message, onDismiss = onBack)
            is Resource.Success -> {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    items(state.data, key = { it.id }) { cat ->
                        CategoryRow(
                            category = cat,
                            onEdit = { editingCategory = cat; showForm = true },
                            onDelete = { viewModel.delete(cat.id) }
                        )
                    }
                }
            }
        }
    }

    if (showForm) {
        CategoryFormDialog(
            category = editingCategory,
            onSave = { name ->
                if (editingCategory != null) {
                    viewModel.update(editingCategory!!.id, name)
                } else {
                    viewModel.create(name)
                }
                showForm = false
            },
            onDismiss = { showForm = false; editingCategory = null }
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
private fun CategoryRow(
    category: Category,
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
                Text(category.name, fontWeight = FontWeight.SemiBold)
                Text("${category.productsCount} products", fontSize = 12.sp, color = Gray700)
            }
            TextButton(onClick = onEdit) { Text("Edit", color = Gold) }
            TextButton(onClick = onDelete) { Text("Delete", color = MaterialTheme.colorScheme.error) }
        }
    }
}

@Composable
private fun CategoryFormDialog(
    category: Category?,
    onSave: (String) -> Unit,
    onDismiss: () -> Unit
) {
    var name by remember { mutableStateOf(category?.name ?: "") }
    androidx.compose.material3.AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (category == null) "Add Category" else "Edit Category") },
        text = {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Name") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Gold, cursorColor = Gold)
            )
        },
        confirmButton = {
            Button(
                onClick = { if (name.isNotBlank()) onSave(name.trim()) },
                colors = ButtonDefaults.buttonColors(containerColor = Gold)
            ) {
                Text("Save", color = Black)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}
