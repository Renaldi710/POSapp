package com.posmobile.ui.screens.bluetooth

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothSocket
import java.io.IOException
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

// ponytail: classic Bluetooth only, upgrade to BLE if printer requires it
@Singleton
class BluetoothManager @Inject constructor(
    private val bluetoothAdapter: BluetoothAdapter?
) {

    private var connectedSocket: BluetoothSocket? = null
    private val sppUuid: UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")

    val isEnabled: Boolean get() = bluetoothAdapter?.isEnabled == true

    fun getBondedDevices(): List<BluetoothDevice> {
        return bluetoothAdapter?.bondedDevices?.toList() ?: emptyList()
    }

    fun enableBluetooth() {
        bluetoothAdapter?.enable()
    }

    suspend fun connectToDevice(device: BluetoothDevice): Result<Unit> {
        return try {
            disconnect()
            val socket = device.createRfcommSocketToServiceRecord(sppUuid)
            bluetoothAdapter?.cancelDiscovery()
            socket.connect()
            connectedSocket = socket
            Result.success(Unit)
        } catch (e: IOException) {
            Result.failure(e)
        }
    }

    fun disconnect() {
        try {
            connectedSocket?.close()
        } catch (_: IOException) { }
        connectedSocket = null
    }

    fun printText(text: String): Result<Unit> {
        val socket = connectedSocket ?: return Result.failure(IOException("Not connected"))
        return try {
            val outputStream = socket.outputStream
            val initPrinter = byteArrayOf(0x1B, 0x40.toByte())
            val boldOn = byteArrayOf(0x1B, 0x45.toByte(), 0x01)
            val boldOff = byteArrayOf(0x1B, 0x45.toByte(), 0x00)
            val lineFeed = byteArrayOf(0x0A)
            val cutPaper = byteArrayOf(0x1D, 0x56.toByte(), 0x00)

            outputStream.write(initPrinter)
            outputStream.write(boldOn)
            outputStream.write(text.toByteArray(charset("US-ASCII")))
            outputStream.write(boldOff)
            outputStream.write(lineFeed)
            outputStream.write(lineFeed)
            outputStream.write(lineFeed)
            outputStream.write(cutPaper)
            outputStream.flush()
            Result.success(Unit)
        } catch (e: IOException) {
            Result.failure(e)
        }
    }

    fun isConnected(): Boolean = connectedSocket?.isConnected == true
}
