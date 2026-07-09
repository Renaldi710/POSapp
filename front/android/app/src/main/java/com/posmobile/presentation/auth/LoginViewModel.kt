package com.posmobile.presentation.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.domain.usecase.LoginUseCase
import com.posmobile.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val loginUseCase: LoginUseCase
) : ViewModel() {

    private val _state = MutableStateFlow<Resource<Unit>?>(null)
    val state = _state.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _state.value = Resource.Loading
            val result = loginUseCase(email, password)
            _state.value = if (result.isSuccess) {
                Resource.Success(Unit)
            } else {
                Resource.Error(result.exceptionOrNull()?.message ?: "Login failed")
            }
        }
    }
}
