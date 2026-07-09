package com.posmobile.presentation.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.posmobile.presentation.common.components.ErrorDialog
import com.posmobile.presentation.common.components.LoadingIndicator
import com.posmobile.presentation.common.theme.Black
import com.posmobile.presentation.common.theme.Gold
import com.posmobile.presentation.common.theme.White
import com.posmobile.util.Resource

@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    viewModel: LoginViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    LaunchedEffect(state) {
        if (state is Resource.Success<*>) onLoginSuccess()
    }

    Box(
        modifier = Modifier.fillMaxSize().background(Black).padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        if (state is Resource.Loading) {
            LoadingIndicator()
        }

        state?.let {
            if (it is Resource.Error) {
                ErrorDialog(message = it.message, onDismiss = { })
            }
        }

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "POSMobile",
                fontSize = 36.sp,
                fontWeight = FontWeight.Bold,
                color = Gold
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = "Point of Sale",
                fontSize = 14.sp,
                color = White
            )
            Spacer(Modifier.height(48.dp))
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Gold,
                    cursorColor = Gold,
                    focusedLabelColor = Gold
                ),
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(16.dp))
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Gold,
                    cursorColor = Gold,
                    focusedLabelColor = Gold
                ),
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(32.dp))
            Button(
                onClick = { viewModel.login(email, password) },
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Gold),
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                Text("Login", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        }
    }
}
