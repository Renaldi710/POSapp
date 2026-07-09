package com.posmobile.data.network

import android.content.SharedPreferences
import dagger.hilt.android.qualifiers.ApplicationContext
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthInterceptor @Inject constructor(
    @ApplicationContext private val context: android.content.Context
) : Interceptor {

    private val prefs: SharedPreferences by lazy {
        context.getSharedPreferences("pos_secure_prefs", android.content.Context.MODE_PRIVATE)
    }

    override fun intercept(chain: Interceptor.Chain): Response {
        val token = prefs.getString("token", null)
        val request = if (token != null) {
            chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .addHeader("Accept", "application/json")
                .build()
        } else {
            chain.request().newBuilder()
                .addHeader("Accept", "application/json")
                .build()
        }
        return chain.proceed(request)
    }
}
