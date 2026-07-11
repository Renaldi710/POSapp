package com.posmobile.ui.screens.user

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.domain.model.User
import com.posmobile.domain.repository.AuthRepository
import com.posmobile.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class UserManagementViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _state = MutableStateFlow<Resource<User>?>(null)
    val state = _state.asStateFlow()

    init { load() }

    fun load() {
        viewModelScope.launch {
            _state.value = Resource.Loading
            try {
                val user = authRepository.getUser()
                _state.value = Resource.Success(user)
            } catch (e: Exception) {
                _state.value = Resource.Error(e.message ?: "Gagal memuat user")
            }
        }
    }
}
