# Agoda Hotels/Flight Search Automation

This repository contains the automated test suite for the Agoda Hotels/Flight Search functionality, built using **Playwright** and **TypeScript**. The project is designed to demonstrate professional automation practices, focusing on maintainability, scalability, and performance.

## 🚀 Project Overview

The main objective is to automate a real-world test case:

- Searching for a one-way flight from **Ho Chi Minh (SGN)** to **Valencia (VLC)** for **2 adults** in **Economic class**, departing at **current date + 2**.
- Searching for a overnight stays hotel **Muong Thanh Saigon Centre Hotel** for **4 adults** and **2 children**, check-in at **current date + 2** and check-out at **current date + 3**.

## 🛠 Tech Stack

- **Framework:** Playwright

- **Language:** TypeScript

- **Test Runner:** Playwright Test

- **Design Patterns:** Page Object Model (POM), Fixtures, Data-Driven Testing

- **Additional:** Allure report

## 🏗 Key Design Patterns & Technical Solutions

### 1. Page Object Model (POM) & Components

To ensure high maintainability, the UI is divided into reusable pieces. Complex elements like the **DatePicker** and **Passenger Selector** are treated as independent Components, preventing the Page classes from becoming bloated.

### 2. Fixtures

We utilize a **Fixtures** to ensure a single browser instance is used efficiently and provides clean, isolated browser contexts for each test, ensuring no session leakage and meeting the requirement for a clean test environment.

### 3. Dynamic Date Handling (DateHelper)

Following the requirement for a **current date + 2** departure, a dedicated `DateHelper` utility calculates the target date dynamically. This ensures the test remains valid regardless of when it is executed.

### 4. Performance Optimization (Network Interception)

To meet the evaluation criteria for test duration, we implemented `page.route` to block unnecessary third-party trackers and analytics scripts. This significantly speeds up the page load time on a heavy site like Agoda.

### 5. Data-Driven Testing (DDT)

All test inputs (locations, guest count, class) are managed through a structured JSON data factory. This allows for easy scalability if more scenarios need to be added in the future.

## 💻 Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Run tests: `npx playwright test`.
4. View report: `npx playwright show-report`.
