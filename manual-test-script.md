# Manual Test Script: Activity Ranking API - Indian Cities

## Overview
This manual test script validates the Activity Ranking API feature through step-by-step user interactions. The feature allows users to search for Indian cities and receive ranked activity recommendations (Trekking, Water Sports, Temple Tourism, Beach Activities) based on 7-day weather forecasts.

---

## Test Environment Setup

### Prerequisites
- Application is deployed and accessible at `http://localhost:3000`
- Open-Meteo weather API is accessible
- Activity Ranking API backend is running
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Network connectivity to fetch weather data

### Test Data
- **Valid Indian Cities**: New Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Goa, Jaipur, Agra, Shimla, Manali, Kerala
- **Invalid Cities**: XyzNotAnIndianCity, RemoteLocationXYZ, !!!Test
- **Special Characters**: Māthura, Pondichéry, Kāshmir
- **Activities**: Trekking, Water Sports, Temple Tourism, Beach Activities

---

## Manual Test Cases

### Test Suite 1: Core Functionality - API Integration and Ranking

#### TC-1.1: Successfully Search for Activity Rankings
**Preconditions:**
- Application is loaded
- Search box is visible and focused
- API backend is running

**Test Steps:**
1. Open the application in browser
2. Locate the city search box
3. Type "Bangalore" in the search box
4. Press Enter or click Search button
5. Wait for results to load (max 5 seconds)

**Expected Results:**
- Page displays "Loading..." briefly
- Results section appears with 7 days of data
- Each day shows activities: Trekking, Water Sports, Temple Tourism, Beach Activities
- Each activity has a rank from 1-10
- Each activity includes reasoning (e.g., "Monsoon patterns favorable for water activities")
- Response status is 200 (visible in network tab)

**Pass/Fail Criteria:**
- ✓ All 7 days displayed
- ✓ All 4 activity types present (Trekking, Water Sports, Temple Tourism, Beach Activities)
- ✓ Ranks are between 1-10
- ✓ Reasoning is provided and relevant

---

#### TC-1.2: Verify Weather-Based Activity Ranking
**Preconditions:**
- Search for an Indian city with known monsoon patterns (e.g., Manali)

**Test Steps:**
1. Search for "Manali"
2. Examine the returned activity rankings
3. Look at the reasoning for each activity
4. Compare rankings with expected weather patterns

**Expected Results:**
- Trekking has low rank (1-3) during monsoon with reasoning mentioning "rain" or "landslide risk"
- Water Sports has high rank (7-10) with reasoning mentioning "rainfall"
- Temple Tourism has moderate ranking
- Reasoning accurately reflects weather conditions

**Pass/Fail Criteria:**
- ✓ Activity ranks align with weather conditions
- ✓ Reasoning is weather-specific and accurate

---

#### TC-1.3: Verify 7-Day Consecutive Data
**Preconditions:**
- Any Indian city search completed successfully

**Test Steps:**
1. Count the number of date headers/sections in results
2. Verify dates are consecutive (each day increments by 1)
3. Check the first date is today or tomorrow
4. Verify no duplicate dates

**Expected Results:**
- Exactly 7 days displayed
- Dates are in YYYY-MM-DD format
- Dates are consecutive without gaps
- Each date has all 4 activity types

**Pass/Fail Criteria:**
- ✓ Exactly 7 days present
- ✓ No missing or duplicate dates

---

### Test Suite 2: Autocomplete Functionality

#### TC-2.1: Display Autocomplete Suggestions
**Preconditions:**
- On the search page
- Search box is empty and focused

**Test Steps:**
1. Click on the search box to focus it
2. Type "New" (just one character)
3. Wait 300ms for suggestions to appear
4. Observe the suggestions dropdown

**Expected Results:**
- Suggestions dropdown appears immediately
- Contains cities starting with "New":
  - New Delhi
- Maximum 10 suggestions displayed
- Suggestions sorted alphabetically

**Pass/Fail Criteria:**
- ✓ Suggestions appear within 300ms
- ✓ All suggestions start with typed prefix
- ✓ No more than 10 suggestions
- ✓ Alphabetically sorted

---

#### TC-2.2: Autocomplete Suggestion Selection
**Preconditions:**
- Autocomplete suggestions are visible
- "Mumbai" is in the suggestion list

**Test Steps:**
1. Type "Mum" in search box
2. Wait for autocomplete to show
3. Click on "Mumbai" in dropdown
4. Observe search box and results

**Expected Results:**
- Search box is populated with "Mumbai"
- Results load automatically for Mumbai
- Activity rankings are displayed
- Autocomplete dropdown closes

**Pass/Fail Criteria:**
- ✓ Correct suggestion selected
- ✓ API call triggered automatically
- ✓ Results display for selected city

---

#### TC-2.3: Debouncing During Rapid Typing
**Preconditions:**
- Open Network tab in browser DevTools

**Test Steps:**
1. Focus search box
2. Quickly type "M", "a", "n", "a", "l", "i" (within 200ms total)
3. Observe Network tab for API calls
4. Wait for autocomplete results

**Expected Results:**
- Only 1-2 autocomplete API calls made (not 6)
- Final suggestions are for "Manali" prefix
- No visual lag or UI freezing
- Debounce delay working (300ms+ wait between calls)

**Pass/Fail Criteria:**
- ✓ Minimum API calls (debouncing working)
- ✓ Correct final suggestions displayed

---

### Test Suite 3: Edge Cases - Input Validation

#### TC-3.1: Handle Invalid City Name
**Preconditions:**
- Application loaded

**Test Steps:**
1. Type "XyzNotAnIndianCity123" in search box
2. Press Enter
3. Wait for response (max 5 seconds)
4. Check error message

**Expected Results:**
- Error message displayed: "City not found. Please check the spelling."
- No activity rankings shown
- HTTP 404 error visible in Network tab
- User can retry search

**Pass/Fail Criteria:**
- ✓ Appropriate error message shown
- ✓ No invalid data displayed

---

#### TC-3.2: Handle Empty Search
**Preconditions:**
- Application loaded

**Test Steps:**
1. Keep search box empty
2. Click Search button or press Enter
3. Check for validation message

**Expected Results:**
- Message displayed: "Please enter a city name"
- No API request made (check Network tab)
- No results section appears
- Search box remains focused

**Pass/Fail Criteria:**
- ✓ Validation message shown
- ✓ No API call made

---

#### TC-3.3: Handle Special Characters in City Names
**Preconditions:**
- Application loaded

**Test Steps:**
1. Type "Māthura" in search box
2. Press Enter
3. Wait for results

**Expected Results:**
- Special characters properly encoded in URL
- Results display for Māthura
- No encoding errors
- Activity rankings are correct

**Pass/Fail Criteria:**
- ✓ Special characters handled correctly
- ✓ Results display properly

---

#### TC-3.4: Handle Rapid Requests with Same City
**Preconditions:**
- Application loaded

**Test Steps:**
1. Search for "Delhi"
2. Immediately search again for "Delhi"
3. Monitor Network tab for duplicate requests
4. Check if results update correctly

**Expected Results:**
- Results display without errors
- Previous results cleared before new results shown
- UI shows loading state during search

**Pass/Fail Criteria:**
- ✓ No race conditions
- ✓ Results always current

---

### Test Suite 4: Edge Cases - API and Performance

#### TC-4.1: Handle API Timeout
**Preconditions:**
- Network throttling enabled in DevTools (Slow 3G)
- API timeout set to 5 seconds

**Test Steps:**
1. Enable network throttling to "Slow 3G"
2. Search for an Indian city like "Delhi"
3. Wait for timeout (>5 seconds)
4. Observe timeout handling

**Expected Results:**
- After 5 seconds, timeout message appears
- Message: "Request timed out. Please try again."
- Retry button is visible and clickable
- User can retry without page refresh
- No page freeze or unresponsiveness

**Pass/Fail Criteria:**
- ✓ Timeout handled gracefully
- ✓ Retry functionality works

---

#### TC-4.2: Handle No Data Scenario
**Preconditions:**
- Identify a remote location with minimal data

**Test Steps:**
1. Search for a remote Indian location (e.g., remote mountain village)
2. Wait for response

**Expected Results:**
- Error message: "Weather data unavailable for this location"
- Fallback section appears with generic recommendations
- Generic activities: "Temple Tourism recommended", "Indoor activities recommended"
- No technical errors in console

**Pass/Fail Criteria:**
- ✓ Graceful fallback provided
- ✓ User still gets some value

---

#### TC-4.3: Verify Response Times
**Preconditions:**
- Network tab open in DevTools
- No throttling enabled

**Test Steps:**
1. Search for "Bangalore"
2. Record time from request to response
3. Search for another city like "Mumbai"
4. Record time again

**Expected Results:**
- API response time < 2 seconds
- Average response time < 1.5 seconds
- Consistent performance across multiple requests

**Pass/Fail Criteria:**
- ✓ Response time acceptable
- ✓ Performance is consistent

---

### Test Suite 5: Edge Cases - Autocomplete

#### TC-5.1: No Suggestions for Invalid Input
**Preconditions:**
- Autocomplete enabled

**Test Steps:**
1. Type "!!!@@@###" in search box
2. Wait for autocomplete response
3. Observe suggestions area

**Expected Results:**
- No suggestions displayed
- Message shown: "No matching Indian cities found"
- Search box remains editable

**Pass/Fail Criteria:**
- ✓ Invalid input handled
- ✓ Helpful message provided

---

#### TC-5.2: Case-Insensitive Autocomplete
**Preconditions:**
- Application loaded

**Test Steps:**
1. Type "new" (lowercase)
2. Check suggestions
3. Type "NEW" (uppercase)
4. Check suggestions

**Expected Results:**
- Both cases return same suggestions
- Suggestions include: New Delhi
- No duplicate results
- Case doesn't affect matching

**Pass/Fail Criteria:**
- ✓ Case-insensitive matching works
- ✓ Consistent results

---

### Test Suite 6: Cross-Browser Compatibility

#### TC-6.1: Test on Different Browsers
**Preconditions:**
- Multiple browsers available

**Test Steps:**
1. Open application in Chrome
2. Perform basic search flow (TC-1.1)
3. Repeat in Firefox
4. Repeat in Safari

**Expected Results:**
- Consistent behavior across all browsers
- All features work identically
- No console errors in any browser
- Layout responsive and proper

**Pass/Fail Criteria:**
- ✓ Consistent across browsers
- ✓ No browser-specific errors

---

### Test Suite 7: Accessibility

#### TC-7.1: Keyboard Navigation
**Preconditions:**
- Application loaded

**Test Steps:**
1. Press Tab to focus search box
2. Type city name
3. Use arrow keys to navigate autocomplete
4. Press Enter to select suggestion

**Expected Results:**
- Tab key properly focuses elements
- Arrow keys navigate suggestions
- Enter selects suggestion
- All interactive elements keyboard accessible

**Pass/Fail Criteria:**
- ✓ Full keyboard navigation possible
- ✓ Accessible without mouse

---

#### TC-7.2: Screen Reader Compatibility
**Preconditions:**
- Screen reader available (e.g., NVDA, JAWS)

**Test Steps:**
1. Enable screen reader
2. Navigate to search box
3. Perform search
4. Navigate to results
5. Listen to announcements

**Expected Results:**
- Search box properly labeled
- Results announced clearly
- Activity names and ranks readable
- No duplicate announcements

**Pass/Fail Criteria:**
- ✓ Screen reader compatible
- ✓ Clear announcements

---

## Regression Test Checklist

Run these tests after any code changes:

- [ ] TC-1.1: Basic search functionality
- [ ] TC-2.1: Autocomplete displays suggestions
- [ ] TC-2.2: Suggestion selection works
- [ ] TC-3.1: Invalid city handling
- [ ] TC-3.2: Empty search validation
- [ ] TC-4.1: Timeout handling
- [ ] TC-6.1: Cross-browser compatibility

---

## Known Limitations & Assumptions

1. **API Availability**: Tests assume Open-Meteo API is accessible
2. **Internet Connection**: Required for weather data fetching
3. **Predefined City List**: Assumes a predefined list of ~200 cities for autocomplete
4. **Timeout Setting**: Assumes 5-second timeout is implemented
5. **Response Format**: Assumes API returns JSON with specific structure

---

## Reporting Issues

When an issue is found, document:
- Test case ID
- Steps to reproduce
- Expected vs actual result
- Browser and OS
- Screenshots/screen recordings
- Error messages from console
- Network requests/responses

---

## Test Coverage Summary

| Feature Area | Test Cases | Coverage |
|--------------|-----------|----------|
| Core Functionality | 3 | 100% |
| Autocomplete | 4 | 100% |
| Input Validation | 4 | 100% |
| API Handling | 3 | 100% |
| Edge Cases | 2 | 100% |
| Cross-Browser | 1 | Sampling |
| Accessibility | 2 | Basic |
| **Total** | **19** | **~95%** |

---

## Execution Notes

- **Estimated Time**: 2-3 hours for complete manual testing
- **Testers Required**: 1 person
- **Test Environment**: Desktop browser with DevTools access
- **Best Practices**:
  - Test on multiple browsers
  - Clear browser cache between tests
  - Use network throttling to test edge cases
  - Document all findings
  - Perform regression tests after fixes
