package com.posmobile.presentation.settings

import android.content.SharedPreferences
import androidx.lifecycle.ViewModel
import com.posmobile.presentation.bluetooth.utils.BluetoothManager
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val prefs: SharedPreferences,
    private val bluetoothManager: BluetoothManager
) : ViewModel() {

    val serverUrl: String
        get() = prefs.getString("server_url", "http://10.0.2.2:8000/api/") ?: "http://10.0.2.2:8000/api/"

    fun saveServerUrl(url: String) {
        prefs.edit().putString("server_url", url).apply()
    }

    val printerName: String
        get() = prefs.getString("printer_name", "") ?: ""

    fun savePrinterName(name: String) {
        prefs.edit().putString("printer_name", name).apply()
    }

    val isBluetoothEnabled: Boolean get() = bluetoothManager.isEnabled
}
