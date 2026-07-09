package com.posmobile.util

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import com.posmobile.data.sync.SyncManager
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.distinctUntilChanged
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class NetworkMonitor @Inject constructor(
    @ApplicationContext private val context: Context,
    private val syncManager: SyncManager
) {
    val isOnline: Flow<Boolean> = callbackFlow {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val callback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                syncManager.isOnline = true
                syncManager.enqueueSync()
                trySend(true)
            }
            override fun onLost(network: Network) {
                syncManager.isOnline = false
                trySend(false)
            }
            override fun onCapabilitiesChanged(network: Network, caps: NetworkCapabilities) {
                val online = caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                syncManager.isOnline = online
                if (online) syncManager.enqueueSync()
                trySend(online)
            }
        }
        val request = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()
        connectivityManager.registerNetworkCallback(request, callback)

        val current = connectivityManager.activeNetwork
        val caps = connectivityManager.getNetworkCapabilities(current)
        val initial = caps?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true
        syncManager.isOnline = initial
        trySend(initial)

        awaitClose { connectivityManager.unregisterNetworkCallback(callback) }
    }.distinctUntilChanged()
}
