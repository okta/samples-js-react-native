package com.customsignin

import android.app.Activity
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.action.ViewActions.typeText
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import org.hamcrest.CoreMatchers.`is`
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import android.content.Intent
import android.view.WindowManager

import org.junit.Before




@RunWith(AndroidJUnit4::class)
@LargeTest
class CustomSignInTest {

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    /*@Test
    fun verifyCommonSignInFlow() {
        val testUsername = BuildConfig.USERNAME
        val testPassword = BuildConfig.PASSWORD

        await()

        onView(withTagValue(`is`("usernameTextInput")))
                .perform(click())
                .perform(typeText(testUsername))
        onView(withTagValue(`is`("passwordTextInput")))
                .perform(click())
                .perform(typeText(testPassword))

        onView(withTagValue(`is`("loginButton"))).perform(click())

        await()
        onView(withTagValue(`is`("nameTitleLabel"))).check(matches(isDisplayed()))
    }*/

    fun unlockScreen() {
        activityRule.scenario.onActivity {
            it.runOnUiThread {
                it.window.addFlags(
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                )
            }
        }
    }

    @Test
    fun verifyInvalidCredentialsSignInFlow() {
        val incorrectUsername = String(BuildConfig.USERNAME.map(Char::inc).toCharArray())
        val incorrectPassword = String(BuildConfig.PASSWORD.map(Char::inc).toCharArray())

        await(1000)

        unlockScreen()

        onView(withTagValue(`is`("usernameTextInput"))).check(matches(isDisplayed()))

        /*onView(withTagValue(`is`("usernameTextInput")))
                .perform(click())

        println("clicked")

        await(1000)
        onView(withTagValue(`is`("usernameTextInput")))
            .perform(typeText(incorrectUsername))

        await(1000)
        onView(withTagValue(`is`("passwordTextInput")))
                .perform(click())

        await(1000)
        onView(withTagValue(`is`("passwordTextInput")))
            .perform(typeText(incorrectPassword))

        await(1000)
        onView(withTagValue(`is`("loginButton"))).perform(click())
        await()

        onView(withTagValue(`is`("errorBox"))).check(matches(isDisplayed()))
        onView(withTagValue(`is`("loginButton"))).check(matches(isDisplayed()))*/
    }

    @Deprecated("temporary")
    private fun await(sleepTimeMillis: Int = 120000) {
        try {
            Thread.sleep(10000)
        } catch (e: InterruptedException) {
            e.printStackTrace()
        }
    }
}