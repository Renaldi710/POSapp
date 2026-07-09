package com.posmobile.di

import com.posmobile.data.repository.AuthRepositoryImpl
import com.posmobile.data.repository.CategoryRepositoryImpl
import com.posmobile.data.repository.CustomerRepositoryImpl
import com.posmobile.data.repository.ProductRepositoryImpl
import com.posmobile.data.repository.TransactionRepositoryImpl
import com.posmobile.domain.repository.AuthRepository
import com.posmobile.domain.repository.CategoryRepository
import com.posmobile.domain.repository.CustomerRepository
import com.posmobile.domain.repository.ProductRepository
import com.posmobile.domain.repository.TransactionRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds @Singleton
    abstract fun bindAuthRepository(impl: AuthRepositoryImpl): AuthRepository

    @Binds @Singleton
    abstract fun bindCategoryRepository(impl: CategoryRepositoryImpl): CategoryRepository

    @Binds @Singleton
    abstract fun bindCustomerRepository(impl: CustomerRepositoryImpl): CustomerRepository

    @Binds @Singleton
    abstract fun bindProductRepository(impl: ProductRepositoryImpl): ProductRepository

    @Binds @Singleton
    abstract fun bindTransactionRepository(impl: TransactionRepositoryImpl): TransactionRepository
}
