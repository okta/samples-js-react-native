package com.browserSignIn

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.uiautomator.By
import com.browsersignin.BuildConfig
import com.browsersignin.MainActivity
import org.hamcrest.CoreMatchers
import org.hamcrest.CoreMatchers.`is`
import org.hamcrest.CoreMatchers.not
import org.junit.Assert
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith


@RunWith(AndroidJUnit4::class)
@LargeTest
class BrowserSignInTest {

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    @Test
    fun verifyCommonSignInFlow() {
        val testUsername = BuildConfig.USERNAME
        val testPassword = BuildConfig.PASSWORD

        await()
        onView(withTagValue(`is`("loginButton"))).perform(click())

        val signInPage = OktaSignInPageObject()
        signInPage.enterUsername(testUsername)
        signInPage.enterPassword(testPassword)
        signInPage.submitCredentials()

        await()
        onView(withTagValue(`is`("logoutButton"))).check(matches(isDisplayed()))
    }

    @Test
    fun verifyIncorrectCredentialsSignInFlow() {
        val incorrectUsername = String(BuildConfig.USERNAME.map(Char::inc).toCharArray())
        val incorrectPassword = String(BuildConfig.PASSWORD.map(Char::inc).toCharArray())

        await()
        onView(withTagValue(`is`("loginButton"))).perform(click())

        val signInPage = OktaSignInPageObject()
        signInPage.enterUsername(incorrectUsername)
        signInPage.enterPassword(incorrectPassword)
        signInPage.submitCredentials()

        val isErrorLoginStateDisplayed = signInPage.isErrorInfoBoxExists()
        Assert.assertTrue("okta error is shown", isErrorLoginStateDisplayed)
    }

    @Test
    fun verifyCanceledSignInFlow() {
        val testUsername = BuildConfig.USERNAME

        await()
        onView(withText("LOGIN")).perform(click())

        val signInPage = OktaSignInPageObject()
        signInPage.enterUsername(testUsername)
        signInPage.abortAuthentication()

        await()
        onView(withText("LOGIN")).check(matches(isDisplayed()))
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