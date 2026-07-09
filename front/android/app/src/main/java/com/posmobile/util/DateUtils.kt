package com.posmobile.util

import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

object DateUtils {

    private val displayFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm", Locale("id", "ID"))

    fun formatTimestamp(millis: Long): String {
        val local = LocalDateTime.ofInstant(Instant.ofEpochMilli(millis), ZoneId.systemDefault())
        return local.format(displayFormatter)
    }
}
