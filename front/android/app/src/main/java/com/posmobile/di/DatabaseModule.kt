package com.posmobile.di

import android.content.Context
import androidx.room.Room
import com.posmobile.data.database.POSDatabase
import com.posmobile.data.database.dao.CategoryDao
import com.posmobile.data.database.dao.CustomerDao
import com.posmobile.data.database.dao.ProductDao
import com.posmobile.data.database.dao.TransactionDao
import com.posmobile.data.database.dao.UserDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): POSDatabase {
        return Room.databaseBuilder(
            context,
            POSDatabase::class.java,
            "pos_mobile.db"
        ).fallbackToDestructiveMigration().build()
    }

    @Provides fun provideProductDao(db: POSDatabase): ProductDao = db.productDao()
    @Provides fun provideCategoryDao(db: POSDatabase): CategoryDao = db.categoryDao()
    @Provides fun provideCustomerDao(db: POSDatabase): CustomerDao = db.customerDao()
    @Provides fun provideTransactionDao(db: POSDatabase): TransactionDao = db.transactionDao()
    @Provides fun provideUserDao(db: POSDatabase): UserDao = db.userDao()
}
