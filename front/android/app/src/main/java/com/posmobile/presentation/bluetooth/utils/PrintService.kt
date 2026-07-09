package com.posmobile.presentation.bluetooth.utils

import com.posmobile.domain.model.Transaction
import com.posmobile.domain.model.TransactionItem
import java.io.OutputStream
import java.text.NumberFormat
import java.util.Date
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PrintService @Inject constructor(
    private val bluetoothManager: BluetoothManager
) {

    fun printReceipt(transaction: Transaction): Result<Unit> {
        if (!bluetoothManager.isConnected()) {
            return Result.failure(Exception("Printer not connected"))
        }

        val receipt = buildReceipt(transaction)
        return bluetoothManager.printText(receipt)
    }

    private fun buildReceipt(transaction: Transaction): String {
        val fmt = NumberFormat.getNumberInstance(Locale("id", "ID"))
        val sb = StringBuilder()

        sb.appendLine("      POSMobile")
        sb.appendLine("   Point of Sale")
        sb.appendLine("=".repeat(32))
        sb.appendLine("ID: #${transaction.id}")
        sb.appendLine("Date: ${java.text.SimpleDateFormat("dd/MM/yy HH:mm", Locale("id", "ID")).format(Date(transaction.createdAt))}")
        transaction.cashierName?.let { sb.appendLine("Cashier: $it") }
        sb.appendLine("=".repeat(32))
        sb.appendLine(String.format("%-18s %3s %10s", "Item", "Qty", "Subtotal"))
        sb.appendLine("-".repeat(32))

        transaction.items.forEach { item ->
            val name = (item.productName?.take(18) ?: item.productId.toString())
            sb.appendLine(String.format("%-18s %3d %10s", name, item.quantity, fmt.format(item.subtotal)))
        }

        sb.appendLine("=".repeat(32))
        sb.appendLine(String.format("%-22s %10s", "TOTAL", fmt.format(transaction.totalAmount)))
        sb.appendLine()
        sb.appendLine("      Terima Kasih")
        sb.appendLine()

        return sb.toString()
    }
}
