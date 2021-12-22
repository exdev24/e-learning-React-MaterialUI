Feature: Express signup flow
  User can sign up and enroll

  Scenario: squeeze page and express enroll
    Given I am not a registered user
    When I go to the "squeeze" page
    And I click on first link "Check Schedule & Enroll for Free" with class name '.check-schedule-enroll'
    When I click on "Select" button with class name '.select'
    And I fill in "Child Name" with "Joe"
    And I fill in "Year of birth" with "2010"
    And I fill in "Enter your email" with "john.express@gmail.com"
    And I fill in "Create a password" with "insecure"
    And I fill in "Your name" with "John"
    And I click on "Enroll" button with class name '.enroll_free'
    Then I see a message "Class is Confirmed"
    When I go to the "settings" page
    Then I see my name "John"
    And I see my email "john.express@gmail.com"
    And I click on "Class Schedules" button with class name '.class_schedules'
    Then I see a message "Class Time"
    And I see student name "Joe"
