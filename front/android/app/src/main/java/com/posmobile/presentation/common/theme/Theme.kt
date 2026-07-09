package com.posmobile.presentation.common.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = Gold,
    onPrimary = Black,
    primaryContainer = GoldLight,
    secondary = Gray700,
    onSecondary = White,
    background = Gray100,
    onBackground = Black,
    surface = White,
    onSurface = Black,
    surfaceVariant = Gray200,
    onSurfaceVariant = Gray900,
    outline = Gray300,
    error = Color(0xFFB00020)
)

private val DarkColorScheme = darkColorScheme(
    primary = Gold,
    onPrimary = Black,
    primaryContainer = GoldDark,
    secondary = Gray500,
    onSecondary = Black,
    background = Black,
    onBackground = White,
    surface = Gray900,
    onSurface = White,
    surfaceVariant = Gray700,
    onSurfaceVariant = Gray200,
    outline = Gray500,
    error = Color(0xFFCF6679)
)

@Composable
fun POSMobileTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }
    MaterialTheme(
        colorScheme = colorScheme,
        typography = POSMobileTypography,
        content = content
    )
}
