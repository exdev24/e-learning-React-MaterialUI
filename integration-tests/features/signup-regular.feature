Feature: Signup and enroll
  User can sign up and enroll

  Scenario: User Signup
    Given I am not a registered user
    When I go to the "home" page
    And I click on first link "Sign Up / Log In" with class name '.register'
    And I fill in "Enter your email" with "test.signup@gmail.com"
    And I fill in "Create a password" with "insecure"
    And I fill in "Your name" with "John"
    And I fill in "Child Name" with "Joe"
    And I click on "Sign Up" button with class name '.btn-signup'
    And I see a message "Explore Our Live Online Classes"

  Scenario: enroll a trial class
    When I go to the "signin" page
    And I fill in "Enter your email" with "test.signup@gmail.com"
    And I fill in "Enter your password" with "insecure"
    And I click on "Sign In" button with class name '.btn-signin'
    Then I see a message "Scratch Ninja"
    When I click on "Learn more and enroll" button with class name '.check-schedule-enroll'
    And I click on "Enroll" button with class name '.enroll_scratch_0'
    And I click on "Next" button with class name '.enroll_next'
    Then I see a message "Registration Completed!"

  Scenario: enroll a paid class
    When I go to the "signin" page
    And I fill in "Enter your email" with "test.signup@gmail.com"
    And I fill in "Enter your password" with "insecure"
    And I click on "Sign In" button with class name '.btn-signin'
    Then I see a message "Scratch Ninja"
    When I click on "Learn more and enroll" button with class name '.check-schedule-enroll'
    And I click on "Enroll" button with class name '.enroll_scratch_1'
    And I click on "Next" button with class name '.enroll_next'
    And I fill in hosted field "braintree-hosted-field-number" with "4111 1111 1111 1111"
    And I fill in hosted field "braintree-hosted-field-expirationDate" with "06 / 23"
    And I fill in hosted field "braintree-hosted-field-cvv" with "123"
    And I fill in "Cardholder name" with "joe"
    And I click on "Next" button with class name '.enroll_next'
    Then I see a message "Registration Completed!"
