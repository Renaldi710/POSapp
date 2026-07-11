package com.posmobile.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.posmobile.data.database.dao.CategoryDao
import com.posmobile.data.database.dao.CustomerDao
import com.posmobile.data.database.dao.ProductDao
import com.posmobile.data.database.dao.TransactionDao
import com.posmobile.data.database.dao.UserDao
import com.posmobile.data.database.entities.CategoryEntity
import com.posmobile.data.database.entities.CustomerEntity
import com.posmobile.data.database.entities.ProductEntity
import com.posmobile.data.database.entities.TransactionEntity
import com.posmobile.data.database.entities.TransactionItemEntity
import com.posmobile.data.database.entities.UserEntity

@Database(
    entities = [
        CategoryEntity::class,
        CustomerEntity::class,
        ProductEntity::class,
        TransactionEntity::class,
        TransactionItemEntity::class,
        UserEntity::class
    ],
    version = 3,
    exportSchema = false
)
abstract class POSDatabase : RoomDatabase() {
    abstract fun categoryDao(): CategoryDao
    abstract fun customerDao(): CustomerDao
    abstract fun productDao(): ProductDao
    abstract fun transactionDao(): TransactionDao
    abstract fun userDao(): UserDao
}
