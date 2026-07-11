package com.posmobile.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.posmobile.ui.components.MainScaffold
import com.posmobile.ui.screens.login.LoginScreen
import com.posmobile.ui.screens.bluetooth.BluetoothScreen
import com.posmobile.ui.screens.categories.CategoriesScreen
import com.posmobile.ui.screens.customers.CustomersScreen
import com.posmobile.ui.screens.dashboard.DashboardScreen
import com.posmobile.ui.screens.inventaris.InventarisScreen
import com.posmobile.ui.screens.inventaris.StockDetailScreen
import com.posmobile.ui.screens.kasir.POSScreen
import com.posmobile.ui.screens.laporan.LaporanScreen
import com.posmobile.ui.screens.products.ProductsScreen
import com.posmobile.ui.screens.settings.SettingsScreen
import com.posmobile.ui.screens.transactions.TransactionsScreen
import com.posmobile.ui.screens.user.UserManagementScreen

@Composable
fun NavGraph(navController: NavHostController = rememberNavController()) {
    MainScaffold(navController = navController) { modifier ->
        NavHost(
            navController = navController,
            startDestination = Screen.Login.route,
            modifier = modifier
        ) {
            composable(Screen.Login.route) {
                LoginScreen(
                    onLoginSuccess = {
                        navController.navigate(Screen.Dashboard.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    }
                )
            }
            composable(Screen.Dashboard.route) {
                DashboardScreen(
                    onNavigateToPOS = { navController.navigate(Screen.POS.route) },
                    onNavigateToProducts = { navController.navigate(Screen.Products.route) },
                    onNavigateToCategories = { navController.navigate(Screen.Categories.route) },
                    onNavigateToCustomers = { navController.navigate(Screen.Customers.route) },
                    onNavigateToTransactions = { navController.navigate(Screen.Transactions.route) },
                    onNavigateToSettings = { navController.navigate(Screen.Settings.route) },
                    onNavigateToInventaris = { navController.navigate(Screen.Inventaris.route) },
                    onNavigateToLaporan = { navController.navigate(Screen.Laporan.route) },
                    onNavigateToUserManagement = { navController.navigate(Screen.UserManagement.route) },
                    onLogout = {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }
            composable(Screen.POS.route) {
                POSScreen(
                    onBack = { navController.popBackStack() }
                )
            }
            composable(Screen.Products.route) {
                ProductsScreen(
                    onBack = { navController.popBackStack() }
                )
            }
            composable(Screen.Categories.route) {
                CategoriesScreen(
                    onBack = { navController.popBackStack() }
                )
            }
            composable(Screen.Customers.route) {
                CustomersScreen(
                    onBack = { navController.popBackStack() }
                )
            }
            composable(Screen.Transactions.route) {
                TransactionsScreen(
                    onBack = { navController.popBackStack() }
                )
            }
            composable(Screen.Settings.route) {
                SettingsScreen(
                    onBack = { navController.popBackStack() },
                    onNavigateToBluetooth = { navController.navigate(Screen.Bluetooth.route) }
                )
            }
            composable(Screen.Bluetooth.route) {
                BluetoothScreen(
                    onBack = { navController.popBackStack() }
                )
            }
            composable(Screen.Inventaris.route) {
                InventarisScreen(
                    onBack = { navController.popBackStack() },
                    onProductClick = { productId ->
                        navController.navigate(Screen.StockDetail(productId).route)
                    }
                )
            }
            composable(
                route = Screen.StockDetail.routePattern,
                arguments = listOf(navArgument("productId") { type = NavType.LongType })
            ) {
                StockDetailScreen(
                    onBack = { navController.popBackStack() }
                )
            }
            composable(Screen.Laporan.route) {
                LaporanScreen(
                    onBack = { navController.popBackStack() }
                )
            }
            composable(Screen.UserManagement.route) {
                UserManagementScreen(
                    onBack = { navController.popBackStack() }
                )
            }
        }
    }
}
