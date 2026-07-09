package com.posmobile.data.database.entities

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "products",
    foreignKeys = [ForeignKey(
        entity = CategoryEntity::class,
        parentColumns = ["id"],
        childColumns = ["category_id"],
        onDelete = ForeignKey.CASCADE
    )],
    indices = [Index("category_id")]
)
data class ProductEntity(
    @PrimaryKey val id: Long = 0,
    @ColumnInfo(name = "category_id") val categoryId: Long,
    val name: String,
    val price: Double,
    val stock: Int
)
