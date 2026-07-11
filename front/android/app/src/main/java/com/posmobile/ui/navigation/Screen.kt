package com.posmobile.ui.navigation

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
    data object Inventaris : Screen("inventaris")
    data object Laporan : Screen("laporan")
    data object UserManagement : Screen("user-management")
    data class StockDetail(val productId: Long = 0) : Screen("inventaris/{productId}") {
        companion object { const val routePattern = "inventaris/{productId}" }
    }
}
