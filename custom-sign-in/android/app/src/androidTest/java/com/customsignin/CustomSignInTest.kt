package com.customsignin

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

@RunWith(AndroidJUnit4::class)
@LargeTest
class CustomSignInTest {

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    @Test
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
    }

    @Test
    fun verifyInvalidCredentialsSignInFlow() {
        val incorrectUsername = String(BuildConfig.USERNAME.map(Char::inc).toCharArray())
        val incorrectPassword = String(BuildConfig.PASSWORD.map(Char::inc).toCharArray())

        await()

        onView(withTagValue(`is`("usernameTextInput")))
                .perform(click())
                .perform(typeText(incorrectUsername))
        onView(withTagValue(`is`("passwordTextInput")))
                .perform(click())
                .perform(typeText(incorrectPassword))

        onView(withTagValue(`is`("loginButton"))).perform(click())
        await()

        onView(withTagValue(`is`("errorBox"))).check(matches(isDisplayed()))
        onView(withTagValue(`is`("loginButton"))).check(matches(isDisplayed()))
    }

    @Deprecated("temporary")
    private fun await() {
        try {
            Thread.sleep(5000)
        } catch (e: InterruptedException) {
            e.printStackTrace()
        }
    }
}