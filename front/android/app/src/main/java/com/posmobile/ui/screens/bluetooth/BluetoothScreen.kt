package com.posmobile.ui.screens.bluetooth

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
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
fun BluetoothScreen(
    onBack: () -> Unit,
    viewModel: BluetoothViewModel = hiltViewModel()
) {
    val devices by viewModel.devices.collectAsState()
    val connectionStatus by viewModel.connectionStatus.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Bluetooth Printer", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Button(onClick = onBack, shape = RoundedCornerShape(8.dp)) { Text("Back") }
        }
        Spacer(Modifier.height(8.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = White)
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text("Status", fontWeight = FontWeight.SemiBold)
                Text(connectionStatus, color = if (connectionStatus == "Connected") Gold else Gray700)
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = { viewModel.refresh() },
                        shape = RoundedCornerShape(8.dp)
                    ) { Text("Refresh") }
                    if (connectionStatus == "Connected") {
                        Button(
                            onClick = { viewModel.disconnect() },
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Gray700)
                        ) { Text("Disconnect") }
                        Button(
                            onClick = { viewModel.printTest() },
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Gold)
                        ) { Text("Print Test", color = Black) }
                    }
                }
            }
        }
        Spacer(Modifier.height(12.dp))
        Text("Paired Devices", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
        Spacer(Modifier.height(8.dp))

        if (devices.isEmpty()) {
            Text("No paired devices found.", color = Gray500)
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                items(devices) { device ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = White),
                        onClick = { viewModel.connect(device) }
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(device.name ?: "Unknown", fontWeight = FontWeight.SemiBold)
                                Text(device.address, fontSize = 12.sp, color = Gray500)
                            }
                            Button(
                                onClick = { viewModel.connect(device) },
                                shape = RoundedCornerShape(4.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Gold)
                            ) {
                                Text("Connect", color = Black, fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}
