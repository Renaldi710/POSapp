package com.posmobile.data.network

import com.posmobile.data.network.models.AuthRequest
import com.posmobile.data.network.models.AuthResponse
import com.posmobile.data.network.models.CategoryDto
import com.posmobile.data.network.models.DailyReportDto
import com.posmobile.data.network.models.ProductDto
import com.posmobile.data.network.models.TransactionDto
import com.posmobile.data.network.models.TransactionRequest
import com.posmobile.data.network.models.UserDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    @POST("tokens/create")
    suspend fun login(@Body request: AuthRequest): AuthResponse

    @GET("health")
    suspend fun health(): Map<String, String>

    @GET("user")
    suspend fun getUser(): UserDto

    @GET("categories")
    suspend fun getCategories(): List<CategoryDto>

    @POST("categories")
    suspend fun createCategory(@Body body: Map<String, String>): CategoryDto

    @PUT("categories/{id}")
    suspend fun updateCategory(@Path("id") id: Long, @Body body: Map<String, String>): CategoryDto

    @DELETE("categories/{id}")
    suspend fun deleteCategory(@Path("id") id: Long): Response<Unit>

    @GET("products")
    suspend fun getProducts(): List<ProductDto>

    @GET("products/{id}")
    suspend fun getProduct(@Path("id") id: Long): ProductDto

    @POST("products")
    suspend fun createProduct(@Body body: Map<String, Any>): ProductDto

    @PUT("products/{id}")
    suspend fun updateProduct(@Path("id") id: Long, @Body body: Map<String, Any>): ProductDto

    @DELETE("products/{id}")
    suspend fun deleteProduct(@Path("id") id: Long): Response<Unit>

    @GET("transactions")
    suspend fun getTransactions(): List<TransactionDto>

    @GET("transactions/{id}")
    suspend fun getTransaction(@Path("id") id: Long): TransactionDto

    @POST("transactions")
    suspend fun createTransaction(@Body request: TransactionRequest): TransactionDto

    @GET("reports/daily")
    suspend fun getDailyReport(@Query("date") date: String? = null): DailyReportDto
}
