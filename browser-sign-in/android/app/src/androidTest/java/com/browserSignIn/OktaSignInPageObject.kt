package com.browserSignIn

import android.webkit.WebView
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.uiautomator.By
import androidx.test.uiautomator.UiDevice
import androidx.test.uiautomator.UiSelector
import androidx.test.uiautomator.Until

class OktaSignInPageObject {

    private val device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())
    private val selector = UiSelector()
    private val timeout = 1000 * 60L

    init {
        device.wait(Until.findObject(By.clazz(WebView::class.java)), timeout)
    }

    fun enterUsername(username: String) {
        val usernameInputField = device.findObject(selector.resourceId("okta-signin-username"))
        usernameInputField.waitForExists(timeout)
        usernameInputField.text = username
    }

    fun enterPassword(password: String) {
        val passwordInputField = device.findObject(selector.resourceId("okta-signin-password"))
        passwordInputField.waitForExists(timeout)
        passwordInputField.text = password
    }

    fun submitCredentials() {
        val submitBtn = device.findObject(selector.resourceId("okta-signin-submit"))
        submitBtn.waitForExists(timeout)
        submitBtn.click()
    }

    fun abortAuthentication() {
        val abortButton = device.findObject(selector.descriptionContains("Close tab"))
        abortButton.waitForExists(timeout)
        abortButton.click()
    }

    fun isErrorInfoBoxExists(): Boolean {
        val errorContainer = device.findObject(selector.descriptionContains("Unable to sign in"))
        errorContainer.waitForExists(timeout)
        return errorContainer.exists()
    }
}