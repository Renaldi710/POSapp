package com.posmobile.domain.model

data class SyncQueueItem(
    val id: Long = 0,
    val entityType: String,
    val entityId: Long,
    val action: String,
    val payload: String,
    val createdAt: Long = System.currentTimeMillis()
)
