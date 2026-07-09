package com.posmobile.presentation.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.posmobile.presentation.common.components.LoadingIndicator
import com.posmobile.presentation.common.theme.Black
import com.posmobile.presentation.common.theme.Gold
import com.posmobile.presentation.common.theme.Gray100
import com.posmobile.presentation.common.theme.Gray700
import com.posmobile.presentation.common.theme.White
import com.posmobile.util.DateUtils
import com.posmobile.util.Resource

@Composable
fun DashboardScreen(
    onNavigateToPOS: () -> Unit,
    onNavigateToProducts: () -> Unit,
    onNavigateToCategories: () -> Unit,
    onNavigateToCustomers: () -> Unit,
    onNavigateToTransactions: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onLogout: () -> Unit,
    viewModel: DashboardViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()

    when (val s = state) {
        is Resource.Loading -> LoadingIndicator()
        is Resource.Error -> Box(Modifier.fillMaxSize()) {
            Text(s.message, modifier = Modifier.align(Alignment.Center), color = Gray700)
        }
        is Resource.Success<DashboardUiState> -> DashboardContent(
            state = s.data,
            onRefresh = { viewModel.load() },
            onNavigateToPOS = onNavigateToPOS,
            onNavigateToProducts = onNavigateToProducts,
            onNavigateToCategories = onNavigateToCategories,
            onNavigateToCustomers = onNavigateToCustomers,
            onNavigateToTransactions = onNavigateToTransactions,
            onNavigateToSettings = onNavigateToSettings,
            onLogout = onLogout
        )
    }
}

@Composable
private fun DashboardContent(
    state: DashboardUiState,
    onRefresh: () -> Unit,
    onNavigateToPOS: () -> Unit,
    onNavigateToProducts: () -> Unit,
    onNavigateToCategories: () -> Unit,
    onNavigateToCustomers: () -> Unit,
    onNavigateToTransactions: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onLogout: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize().background(Gray100).padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Dashboard", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Button(onClick = onLogout, colors = ButtonDefaults.buttonColors(containerColor = Black)) {
                Text("Logout", color = White)
            }
        }

        Spacer(Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard("Products", state.productsCount.toString(), Modifier.weight(1f))
            StatCard("Categories", state.categoriesCount.toString(), Modifier.weight(1f))
            StatCard("Transactions", state.transactionsCount.toString(), Modifier.weight(1f))
            StatCard("Revenue", "Rp${String.format("%,.0f", state.totalRevenue)}", Modifier.weight(1f))
        }

        Spacer(Modifier.height(16.dp))

        Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = onNavigateToPOS, shape = RoundedCornerShape(8.dp), colors = ButtonDefaults.buttonColors(containerColor = Gold)) {
                Text("POS", fontWeight = FontWeight.Bold)
            }
            Button(onClick = onNavigateToProducts, shape = RoundedCornerShape(8.dp)) {
                Text("Products")
            }
            Button(onClick = onNavigateToCategories, shape = RoundedCornerShape(8.dp)) {
                Text("Categories")
            }
            Button(onClick = onNavigateToCustomers, shape = RoundedCornerShape(8.dp)) {
                Text("Customers")
            }
            Button(onClick = onNavigateToTransactions, shape = RoundedCornerShape(8.dp)) {
                Text("Transactions")
            }
            Button(onClick = onNavigateToSettings, shape = RoundedCornerShape(8.dp)) {
                Text("Settings")
            }
        }

        Spacer(Modifier.height(16.dp))

        Text("Recent Transactions", fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(8.dp))

        if (state.recentTransactions.isEmpty()) {
            Text("No transactions yet.", color = Gray700)
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                items(state.recentTransactions.size) { i ->
                    val t = state.recentTransactions[i]
                    Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = White)) {
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("#${t.id}", fontWeight = FontWeight.Bold)
                            Text(DateUtils.formatTimestamp(t.createdAt), fontSize = 12.sp)
                            Text("Rp${String.format("%,.0f", t.totalAmount)}", fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StatCard(label: String, value: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = White),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Black)
            Text(label, fontSize = 12.sp, color = Gray700)
        }
    }
}
