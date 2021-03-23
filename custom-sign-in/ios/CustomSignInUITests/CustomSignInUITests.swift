/*
 * Copyright (c) 2021-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import XCTest

final class CustomSignInUITests: XCTestCase {
  
  private var app: XCUIApplication!
  
  private var username = ProcessInfo.processInfo.environment["USERNAME"]!
  private var password = ProcessInfo.processInfo.environment["PASSWORD"]!
  
  private var usernameField: XCUIElement {
    app.textFields["usernameTextInput"]
  }
  
  private var passwordField: XCUIElement {
    app.secureTextFields["passwordTextInput"]
  }
  
  private var loginButton: XCUIElement {
    app.buttons["loginButton"]
  }
  
  private var resetButton: XCUIElement {
    app.buttons["resetButton"]
  }
  
  private var errorLabel: XCUIElement {
    app.staticTexts["errorBox"]
  }
  
  private var logoutButton: XCUIElement {
    app.staticTexts["Logout"]
  }
  
  override func setUpWithError() throws {
    continueAfterFailure = false
    
    app = XCUIApplication()
    app.launch()
    logoutIfPossible()
  }
  
  override func tearDownWithError() throws {
  }
  
  func testLoginScreen() throws {
    XCTAssertTrue(app.staticTexts["titleBox"].waitForExistence(timeout: .testing))
    XCTAssertFalse(errorLabel.exists)
    XCTAssertTrue(usernameField.exists)
    XCTAssertEqual(usernameField.value as? String, usernameField.placeholderValue)
    XCTAssertTrue(passwordField.exists)
    XCTAssertEqual(passwordField.value as? String, passwordField.placeholderValue)
    
    XCTAssertEqual(app.textFields.allElementsBoundByIndex.count, 1)
    XCTAssertEqual(app.secureTextFields.allElementsBoundByIndex.count, 1)
    XCTAssertTrue(loginButton.exists)
  }
  
  func testIncorrectEmailLogin() throws {
    XCTAssertTrue(usernameField.waitForExistence(timeout: .testing))
    
    usernameField.tap()
    usernameField.clearText()
    usernameField.typeText("incorrect@example.com")
    loginButton.tap()
    
    XCTAssertTrue(errorLabel.waitForExistence(timeout: .testing * 2))
    XCTAssertTrue(errorLabel.label.contains("Error:"))
    
    resetButton.tap()
    XCTAssertFalse(errorLabel.exists)
  }
  
  func testIncorrectPasswordLogin() {
    XCTAssertTrue(passwordField.waitForExistence(timeout: .testing))
    
    passwordField.tap()
    for char in "123456" {
      passwordField.typeText(String(char))
    }
    
    passwordField.typeText("\n")
    
    loginButton.tap()
    
    XCTAssertTrue(errorLabel.waitForExistence(timeout: .testing))
    XCTAssertTrue(errorLabel.label.contains("Error:"))
  }
  
  func testLogin() throws {
    XCTAssertTrue(usernameField.waitForExistence(timeout: .testing))
    
    usernameField.tap()
    usernameField.clearText()
    usernameField.typeText(username + "\n")
    
    passwordField.tap()
    
    for char in password {
      passwordField.typeText(String(char))
    }
    
    passwordField.typeText("\n")
    loginButton.tap()
    
    XCTAssertTrue(app.buttons["accessButton"].waitForExistence(timeout: .testing))
    XCTAssertTrue(app.staticTexts["nameTitleLabel"].waitForExistence(timeout: .testing))
    XCTAssertTrue(app.staticTexts["localeTitleLabel"].waitForExistence(timeout: .testing))
    XCTAssertTrue(app.staticTexts["timeZoneTitleLabel"].waitForExistence(timeout: .testing))
    XCTAssertTrue(logoutButton.exists)
  }
  
  func testLogout() throws {
    try testLogin()
    
    logoutButton.tap()
    try testLoginScreen()
  }
  
  func testAuthenticatedLaunch() throws {
    try testLogin()
    
    app.terminate()
    app.launch()
    
    XCTAssertTrue(logoutButton.waitForExistence(timeout: .testing))
    XCTAssertTrue(app.buttons["accessButton"].exists)
  }
  
  private func logoutIfPossible() {
    guard logoutButton.waitForExistence(timeout: 10) else {
      return
    }
    
    logoutButton.tap()
  }
}

private extension XCUIElement {
  
  func clearText() {
    guard let stringValue = value as? String else {
      XCTFail("Tried to clear and enter text into a non string value")
      return
    }
    
    if stringValue.isEmpty || stringValue == placeholderValue {
      return
    }
    
    for deletedChar in String(repeating: XCUIKeyboardKey.delete.rawValue, count: stringValue.count) {
      typeText(String(deletedChar))
    }
  }
}

private extension TimeInterval {
  
  static let testing: TimeInterval = 30
}

