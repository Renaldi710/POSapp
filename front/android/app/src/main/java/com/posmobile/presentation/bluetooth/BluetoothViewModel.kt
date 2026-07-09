package com.posmobile.presentation.bluetooth

import android.bluetooth.BluetoothDevice
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.presentation.bluetooth.utils.BluetoothManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class BluetoothViewModel @Inject constructor(
    private val bluetoothManager: BluetoothManager
) : ViewModel() {

    private val _devices = MutableStateFlow<List<BluetoothDevice>>(emptyList())
    val devices = _devices.asStateFlow()

    private val _connectionStatus = MutableStateFlow("Disconnected")
    val connectionStatus = _connectionStatus.asStateFlow()

    init { refresh() }

    fun refresh() {
        _devices.value = bluetoothManager.getBondedDevices()
        _connectionStatus.value = if (bluetoothManager.isConnected()) "Connected" else "Disconnected"
    }

    fun connect(device: BluetoothDevice) {
        viewModelScope.launch {
            _connectionStatus.value = "Connecting..."
            val result = bluetoothManager.connectToDevice(device)
            _connectionStatus.value = if (result.isSuccess) "Connected" else "Failed: ${result.exceptionOrNull()?.message}"
        }
    }

    fun disconnect() {
        bluetoothManager.disconnect()
        _connectionStatus.value = "Disconnected"
    }

    fun printTest() {
        val result = bluetoothManager.printText("POSMobile Test Print\n${java.text.SimpleDateFormat("dd/MM/yyyy HH:mm", java.util.Locale.getDefault()).format(java.util.Date())}")
        if (result.isFailure) {
            _connectionStatus.value = "Print failed: ${result.exceptionOrNull()?.message}"
        }
    }
}
