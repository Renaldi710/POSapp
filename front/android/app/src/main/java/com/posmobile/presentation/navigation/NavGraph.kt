package com.posmobile.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.posmobile.presentation.auth.LoginScreen
import com.posmobile.presentation.bluetooth.BluetoothScreen
import com.posmobile.presentation.categories.CategoriesScreen
import com.posmobile.presentation.customers.CustomersScreen
import com.posmobile.presentation.dashboard.DashboardScreen
import com.posmobile.presentation.pos.POSScreen
import com.posmobile.presentation.products.ProductsScreen
import com.posmobile.presentation.settings.SettingsScreen
import com.posmobile.presentation.transactions.TransactionsScreen

@Composable
fun NavGraph(navController: NavHostController = rememberNavController()) {
    NavHost(navController = navController, startDestination = Screen.Dashboard.route) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = { navController.navigate(Screen.Dashboard.route) {
                    popUpTo(Screen.Login.route) { inclusive = true }
                }}
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
    }
}
