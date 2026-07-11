package com.posmobile.ui.screens.settings

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.posmobile.ui.theme.Black
import com.posmobile.ui.theme.Gold
import com.posmobile.ui.theme.Gray500
import com.posmobile.ui.theme.Gray700
import com.posmobile.ui.theme.White

@Composable
fun SettingsScreen(
    onBack: () -> Unit,
    onNavigateToBluetooth: () -> Unit,
    viewModel: SettingsViewModel = hiltViewModel()
) {
    var serverUrl by remember { mutableStateOf(viewModel.serverUrl) }
    var printerName by remember { mutableStateOf(viewModel.printerName) }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp)
    ) {
        Row(modifier = Modifier.fillMaxWidth()) {
            Text("Settings", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
            Button(onClick = onBack, shape = RoundedCornerShape(8.dp)) { Text("Back") }
        }

        Spacer(Modifier.height(16.dp))

        Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = White)) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Server", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = serverUrl,
                    onValueChange = { serverUrl = it },
                    label = { Text("Server URL") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Gold, cursorColor = Gold)
                )
                Spacer(Modifier.height(8.dp))
                Button(
                    onClick = { viewModel.saveServerUrl(serverUrl) },
                    shape = RoundedCornerShape(8.dp),
                    colors = androidx.compose.material3.ButtonDefaults.buttonColors(containerColor = Gold)
                ) {
                    Text("Save", color = Black)
                }
            }
        }

        Spacer(Modifier.height(12.dp))

        Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = White)) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Printer", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = printerName,
                    onValueChange = { printerName = it },
                    label = { Text("Printer Name") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Gold, cursorColor = Gold)
                )
                Spacer(Modifier.height(8.dp))
                Row {
                    Button(
                        onClick = { viewModel.savePrinterName(printerName) },
                        shape = RoundedCornerShape(8.dp),
                        colors = androidx.compose.material3.ButtonDefaults.buttonColors(containerColor = Gold)
                    ) {
                        Text("Save", color = Black)
                    }
                    Spacer(Modifier.weight(1f))
                    Button(
                        onClick = onNavigateToBluetooth,
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Bluetooth Setup")
                    }
                }
            }
        }

        Spacer(Modifier.height(12.dp))

        Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = White)) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Bluetooth Status", fontWeight = FontWeight.SemiBold)
                Text(
                    if (viewModel.isBluetoothEnabled) "Enabled" else "Disabled",
                    color = if (viewModel.isBluetoothEnabled) Gold else Gray500
                )
            }
        }
    }
}
