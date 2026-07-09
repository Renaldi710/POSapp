package com.posmobile.data.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.posmobile.data.database.entities.CustomerEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CustomerDao {

    @Query("SELECT * FROM customers ORDER BY name ASC")
    fun getAllFlow(): Flow<List<CustomerEntity>>

    @Query("SELECT * FROM customers ORDER BY name ASC")
    suspend fun getAll(): List<CustomerEntity>

    @Query("SELECT * FROM customers WHERE id = :id")
    suspend fun getById(id: Long): CustomerEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(customer: CustomerEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(customers: List<CustomerEntity>)

    @Query("DELETE FROM customers WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM customers")
    suspend fun deleteAll()
}
