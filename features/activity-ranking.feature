Feature: Activity Ranking API - City-Based Weather Forecast Integration for India

  As a user
  I want to enter an Indian city name and receive activity recommendations for the next 7 days
  Based on weather conditions ranked from most to least suitable (Trekking, Water Sports, Temple Tourism, Beach Activities)
  So that I can plan my activities according to the best weather conditions

  Background:
    Given the Activity Ranking API is available
    And the Open-Meteo weather API is available
    And I am on the activity search page

  # Core Functionality - API Integration and Ranking
  Scenario: Successfully fetch and rank activities for a valid Indian city
    When I search for "Mumbai"
    Then the system should fetch 7-day weather data for "Mumbai"
    And the response should contain activities ranked by suitability
    And each activity should have "<Field>" and "<Description>"
      | Field        | Description                              |
      | Date         | Valid date within next 7 days            |
      | Activity     | One of: Trekking, Water Sports, Temple Tourism, Beach Activities |
      | Rank         | Integer between 1 and 10                 |
      | Reasoning    | Text explaining the rank (weather data) |
    And the response status should be 200

  Scenario: Activity ranking reflects weather conditions accurately
    When I search for "Manali"
    And the weather forecast shows "Heavy rain expected"
    Then "Trekking" should have a low rank (1-3)
    And "Water Sports" should have a high rank (7-10)
    And the reasoning for "Water Sports" should mention "rain"

  Scenario: Activities are ranked for all 7 days
    When I search for "Goa"
    Then the response should contain exactly 7 days of data
    And each day should have all four activity types ranked
    And the dates should be consecutive starting from today

  # Autocomplete Functionality
  Scenario: Display autocomplete suggestions while typing
    When I type "New" in the search box
    Then autocomplete suggestions should appear with cities starting with "New"
    And suggestions should include at least "New Delhi"
    And suggestions should appear within 300ms of typing

  Scenario: Autocomplete suggestions are based on predefined city list
    When I type "M" in the search box
    Then the suggestions should include predefined cities: "Mumbai", "Manali"
    And suggestions should be sorted alphabetically
    And no more than 10 suggestions should be displayed

  Scenario: Selecting a suggestion triggers activity ranking request
    When I type "San" in the search box
    And autocomplete shows "San Francisco" as a suggestion
    And I click on "San Francisco"
    Then the search should be populated with "San Francisco"
    And the activity ranking should be fetched for "San Francisco"
    And the results should be displayed

  # Edge Cases - Input Validation
  Scenario: Handle invalid city name gracefully
    When I search for "XyzNotAnIndianCity123"
    Then the system should return a 400 or 404 error
    And an error message should display: "City not found. Please check the spelling."
    And no activity rankings should be displayed

  Scenario: Handle empty search input
    When I clear the search box and press Enter
    Then no autocomplete suggestions should appear
    And no API request should be made
    And a message should display: "Please enter a city name"

  Scenario: Handle special characters in city names
    When I search for "Māthura"
    Then the system should correctly encode the city name
    And weather data should be fetched for Māthura
    And activity rankings should be displayed correctly

  # Edge Cases - API and Performance
  Scenario: Handle API timeout gracefully
    When I search for "Delhi"
    And the weather API takes longer than 5 seconds to respond
    Then the system should display a timeout message after 5 seconds
    And a retry button should be available
    And the user should be able to retry the search

  Scenario: Handle no data scenario
    When I search for a remote location with no available weather data
    Then the system should display: "Weather data unavailable for this location"
    And a fallback message with generic activity recommendations should be shown

  # Edge Cases - Autocomplete
  Scenario: Autocomplete handles rapid typing
    When I quickly type "S", "a", "n" within 100ms
    Then the autocomplete should debounce and show suggestions for "San"
    And no duplicate API calls should be made

  Scenario: No suggestions for nonsensical input
    When I type "!!!@@@###" in the search box
    Then no autocomplete suggestions should appear
    And a message should display: "No matching cities found"

  # Data Accuracy
  Scenario: Ranking reflects realistic weather criteria
    When I search for "Goa"
    Then "Beach Activities" should be ranked based on:
      | Criteria       | Expected |
      | Wave height    | High     |
      | Wind direction | Offshore |
    And "Trekking" should be ranked based on monsoon patterns

  Scenario: Response includes all required fields
    When I search for "Jaipur"
    Then each activity result should have:
      | Required Field | Format           |
      | date           | YYYY-MM-DD       |
      | activity       | String           |
      | rank           | Integer (1-10)   |
      | reasoning      | Non-empty string |
