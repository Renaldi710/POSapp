package com.posmobile.ui.screens.categories

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.posmobile.domain.model.Category
import com.posmobile.domain.usecase.ManageCategoryUseCase
import com.posmobile.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CategoriesViewModel @Inject constructor(
    private val manageCategory: ManageCategoryUseCase
) : ViewModel() {

    private val _categories = MutableStateFlow<Resource<List<Category>>>(Resource.Loading)
    val categories = _categories.asStateFlow()

    private val _saveResult = MutableStateFlow<Resource<Unit>?>(null)
    val saveResult = _saveResult.asStateFlow()

    init { load() }

    fun load() {
        viewModelScope.launch {
            _categories.value = Resource.Loading
            val result = manageCategory.getAll()
            _categories.value = if (result.isSuccess) {
                Resource.Success(result.getOrDefault(emptyList()))
            } else {
                Resource.Error(result.exceptionOrNull()?.message ?: "Failed to load categories")
            }
        }
    }

    fun create(name: String) {
        viewModelScope.launch {
            _saveResult.value = Resource.Loading
            val result = manageCategory.create(name)
            if (result.isSuccess) {
                load()
                _saveResult.value = Resource.Success(Unit)
            } else {
                _saveResult.value = Resource.Error(result.exceptionOrNull()?.message ?: "Failed to create category")
            }
        }
    }

    fun update(id: Long, name: String) {
        viewModelScope.launch {
            _saveResult.value = Resource.Loading
            val result = manageCategory.update(id, name)
            if (result.isSuccess) {
                load()
                _saveResult.value = Resource.Success(Unit)
            } else {
                _saveResult.value = Resource.Error(result.exceptionOrNull()?.message ?: "Failed to update category")
            }
        }
    }

    fun delete(id: Long) {
        viewModelScope.launch {
            val result = manageCategory.delete(id)
            if (result.isSuccess) load()
            else _saveResult.value = Resource.Error(result.exceptionOrNull()?.message ?: "Failed to delete category")
        }
    }

    fun clearSaveResult() { _saveResult.value = null }
}
