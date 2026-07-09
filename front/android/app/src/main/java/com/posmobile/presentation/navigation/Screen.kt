package com.posmobile.presentation.navigation

sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object Dashboard : Screen("dashboard")
    data object POS : Screen("pos")
    data object Products : Screen("products")
    data object Categories : Screen("categories")
    data object Customers : Screen("customers")
    data object Transactions : Screen("transactions")
    data object Settings : Screen("settings")
    data object Bluetooth : Screen("bluetooth")
}
