# Activity Ranking API - Test Framework

A comprehensive test framework for validating the Activity Ranking API feature with BDD scenarios, automated tests, and manual test scripts.

## 📋 Project Overview

This project implements a comprehensive testing approach for an Activity Ranking API that:
- Accepts **Indian city names** as input
- Fetches 7-day weather forecasts from Open-Meteo APIs
- Ranks **India-relevant activities** (Trekking, Water Sports, Temple Tourism, Beach Activities) based on weather suitability
- Provides autocomplete suggestions as users type

### Deliverables

1. **BDD Test Criteria** (`features/activity-ranking.feature`)
   - 14 Gherkin scenarios with Indian cities and activities
   - 95%+ test coverage of acceptance criteria

2. **Automated Tests** (`tests/`)
   - Cucumber + Playwright integration
   - 40+ automated test steps with Page Object Model
   - Playwright configuration for cross-browser testing

3. **Manual Test Script** (`manual-test-script.md`)
   - 19 comprehensive test cases with Indian examples
   - Edge case validation
   - Accessibility and cross-browser testing
   - Regression test checklist

---

## 🏗️ Project Structure

```
.
├── features/
│   └── activity-ranking.feature          # BDD scenarios in Gherkin format
├── tests/
│   └── steps.ts                          # Cucumber step definitions
├── src/
│   ├── pages/
│   │   ├── BasePage.ts                   # Base page object with common methods
│   │   ├── ActivitySearchPage.ts         # Activity search page object with locators
│   │   └── index.ts                      # Page object exports
│   └── ActivityRankingService.ts         # API service layer
├── manual-test-script.md                 # Manual testing procedures
├── cucumber.js                           # Cucumber configuration
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript configuration
├── .vscode/mcp.json                      # Playwright MCP server configuration
└── README.md                             # This file
```

### New Architecture: Page Object Model

**Page Objects** (`src/pages/`):
- `BasePage.ts` - Base class with standardized Playwright locator methods
- `ActivitySearchPage.ts` - Page-specific methods and locators for activity search

**Benefits**:
- ✅ Centralized locators (all selectors in one place)
- ✅ Maintainable (selector changes only require one update)
- ✅ Reusable methods across test suite
- ✅ Self-documenting code with descriptive method names

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm 8+
- Playwright browsers (auto-installed on first run)
- Open-Meteo API access (public, no authentication required)

### Installation

1. **Clone or navigate to repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

### Configuration

No environment variables required. The framework uses:
- **Activity Ranking API**: `http://localhost:3000/api`
- **Weather API**: `https://api.open-meteo.com/v1/forecast` (public endpoint)

---

## 🧪 Running Tests

### Run All Cucumber Tests

```bash
npm test
```

**Output:**
- Progress bar showing test execution
- Real-time pass/fail status
- Console output with detailed step information

### Run Specific Feature

```bash
npx cucumber-js features/activity-ranking.feature --require tests/steps.ts --require-module ts-node/register
```

### Debug Mode with Detailed Logging

```bash
npm run test:debug
```

---

## 📝 Test Coverage

### BDD Scenarios (14 total)

| Category | Scenarios | Focus |
|----------|-----------|-------|
| Core Functionality | 3 | API integration, ranking accuracy, 7-day data |
| Autocomplete | 3 | Suggestions, selection, performance |
| Input Validation | 3 | Invalid cities, empty input, special characters |
| API Handling | 2 | Timeouts, no data scenarios |
| Edge Cases | 2 | Rapid typing debounce, special characters |
| Data Accuracy | 1 | Field validation, ranking criteria |

### Test Approach

**Acceptance Criteria Coverage:**
- ✓ API accepts city/town names
- ✓ Fetches 7-day weather data
- ✓ Ranks activities based on suitability
- ✓ Response includes date, activity name, rank, reasoning
- ✓ Autocomplete provides suggestions
- ✓ Suggestions based on predefined list
- ✓ Selection triggers activity ranking request

---

## 🌍 Indian Cities & Activities

### Predefined Cities (13)
- New Delhi
- Mumbai
- Bangalore
- Hyderabad
- Chennai
- Kolkata
- Pune
- Goa
- Jaipur
- Agra
- Shimla
- Manali
- Kerala

### Activities (4 India-Relevant)
- **Trekking** - Mountain/hiking activities (high in clear, dry weather)
- **Water Sports** - Monsoon/waterfall activities (high during/after rain)
- **Temple Tourism** - Cultural sightseeing (year-round, weather-independent)
- **Beach Activities** - Coastal experiences (high in coastal cities, affected by monsoon)

---

## 🔄 Technology Stack

### Core Dependencies
- **@cucumber/cucumber** ^12.2.0 - BDD test framework
- **@playwright/test** ^1.56.1 - Browser automation & testing
- **TypeScript** ^5.9.3 - Type-safe development
- **ts-node** ^10.9.2 - TypeScript execution

### API Communication
- **Playwright APIRequestContext** - Native HTTP client (replaces axios)
- No external HTTP client needed

### Development Tools
- **Playwright MCP Server** - Microsoft Model Context Protocol for AI assistance
- **Visual Studio Code** - Recommended IDE

---

## 🔍 BDD Scenarios Breakdown

### Scenario 1: Successfully fetch and rank activities for a valid city
**Purpose**: Validate basic API integration
**Validates**: Response structure, all 4 activities present, ranks 1-10

### Scenario 2: Activity ranking reflects weather conditions accurately
**Purpose**: Test ranking logic
**Validates**: High ranks for suitable activities, reasoning accuracy

### Scenario 3: Activities are ranked for all 7 days
**Purpose**: Verify data completeness
**Validates**: Exactly 7 days, all activities per day, consecutive dates

### Scenarios 4-6: Autocomplete functionality
**Purpose**: Test search suggestion feature
**Validates**: Suggestion display, selection, alphabetical sorting

### Scenarios 7-9: Input validation edge cases
**Purpose**: Ensure robustness
**Validates**: Invalid city handling, empty search, special characters

### Scenarios 10-11: API performance and resilience
**Purpose**: Test error scenarios
**Validates**: Timeout handling, fallback for no data

### Scenarios 12-14: Advanced edge cases and data accuracy
**Purpose**: Comprehensive coverage
**Validates**: Rapid typing debounce, weather-based ranking logic

---

## 🛠️ Custom Configuration

### Adding New Test Steps

1. **Create step definition in `tests/steps.ts`**:
   ```typescript
   When('I do something with {string}', async function (param: string) {
     // Implementation
   });
   ```

2. **Use in Gherkin scenario**:
   ```gherkin
   When I do something with "value"
   ```

3. **Run tests**:
   ```bash
   npm run test:cucumber
   ```

### Modifying Test Data

Edit predefined cities in `tests/steps.ts`:
```typescript
const predefinedCities = [
  'London',
  'Los Angeles',
  // Add more cities here
];
```

### Adjusting Timeouts

Modify in `src/ActivityRankingService.ts`:
```typescript
timeout: 5000, // milliseconds
```

---

## 🎓 BDD Testing Best Practices Applied

### 1. **User-Centric Scenarios**
Each scenario describes user behavior, not technical implementation:
```gherkin
✓ When I search for "London"
✗ When I make an HTTP GET request to /api/activities/rank
```

### 2. **Clear Acceptance Criteria**
Each scenario has explicit expected results:
```gherkin
Then the response should contain exactly 7 days of data
And each day should have all four activity types ranked
```

### 3. **Given-When-Then Structure**
Standard BDD format for readability:
- **Given**: Initial state
- **When**: Action
- **Then**: Expected result

### 4. **Reusable Steps**
Steps are generic and reusable across scenarios:
```typescript
When('I search for {string}', ...);  // Used in multiple scenarios
```

### 5. **Comprehensive Coverage**
Tests cover:
- Happy path (valid city search)
- Edge cases (special characters, timeouts)
- Error scenarios (invalid input, no data)
- Performance (debouncing, response times)

---

## 🚨 Known Limitations & Omissions

### Limitations

1. **Backend Dependency**
   - Tests assume activity ranking backend exists at `http://localhost:3000/api`
   - Cannot run without backend service
   - **Trade-off**: Real integration testing vs. mocking

2. **Open-Meteo API Dependency**
   - Tests require internet connectivity
   - Open-Meteo rate limits could affect test runs
   - **Trade-off**: Real weather data vs. mocked responses

3. **No Visual Regression Testing**
   - Screenshots/visual comparisons not implemented
   - **Reason**: Scope focused on functional testing

4. **Limited Performance Testing**
   - Response times validated but not extensively profiled
   - **Reason**: Manual test script covers performance checks

### Omissions (Time-Based Decisions)

1. **Database Testing**
   - No tests for data persistence
   - **Reason**: Scope is API and UI testing only

2. **Load Testing**
   - No concurrent user scenarios
   - **Reason**: Time constraint (2-3 hours)

3. **API Mocking with Mock Server**
   - Uses real backend instead of mock server
   - **Reason**: Integration testing more valuable for this feature

4. **Detailed Analytics Tracking**
   - No event tracking or analytics validation
   - **Reason**: Out of acceptance criteria scope

5. **Internationalization Testing**
   - No testing for multiple languages
   - **Reason**: Not mentioned in requirements

---

## 🔧 Troubleshooting

### Issue: "Activity Ranking API is not available"

**Solution:**
```bash
# Start your backend service
node server.js  # or your server command

# Verify it's running
curl http://localhost:3000/api/activities/rank?city=London
```

### Issue: "Open-Meteo API is not available"

**Solution:**
```bash
# Check internet connection
ping api.open-meteo.com

# Verify endpoint
curl https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278
```

### Issue: Timeout on tests

**Solution:**
```bash
# Increase timeout in cucumber.js
timeout: 10000  # 10 seconds instead of 5

# Or run with explicit timeout
npx cucumber-js features/activity-ranking.feature --timeout 10000
```

### Issue: TypeScript compilation errors

**Solution:**
```bash
# Recompile
npx tsc

# Clear cache
rm -rf dist/
npm run build
```

---

### Key Files
- `features/activity-ranking.feature`: BDD scenarios
- `tests/steps.ts`: Cucumber step definitions (40+ steps)
- `src/ActivityRankingService.ts`: API service layer
- `src/pages/ActivitySearchPage.ts`: Page object model
- `manual-test-script.md`: Manual test procedures

---

### Highlights

✓ Comprehensive BDD coverage with 14 scenarios
✓ 40+ reusable step definitions
✓ Production-ready code structure
✓ Clear separation of concerns
✓ Extensive manual test procedures
✓ Well-documented and commented
✓ Cross-browser testing ready

---
