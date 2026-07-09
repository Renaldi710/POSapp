package com.posmobile.data.network.models

import com.google.gson.annotations.SerializedName

data class DailyReportDto(
    val date: String,
    @SerializedName("total_transactions") val totalTransactions: Int,
    @SerializedName("total_revenue") val totalRevenue: Double,
    @SerializedName("total_items_sold") val totalItemsSold: Int,
    @SerializedName("top_products") val topProducts: List<TopProductDto>
)

data class TopProductDto(
    @SerializedName("product_id") val productId: Long,
    @SerializedName("total_qty") val totalQty: Int,
    val total: String,
    val product: ProductDto
)
