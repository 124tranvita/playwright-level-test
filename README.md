# Agoda Flight Search Automation

This repository contains the automated test suite for the Agoda Flight Search functionality, built using **Playwright** and **TypeScript**. The project is designed to demonstrate professional automation practices, focusing on maintainability, scalability, and performance.

## 🚀 Project Overview

The main objective is to automate a real-world test case: searching for a one-way flight from **Ho Chi Minh (SGN)** to **Valencia (VLC)** for **2 adults** in **Economic class**, departing at **current date + 2**.

## 🛠 Tech Stack

* **Framework:** Playwright 

* **Language:** TypeScript 

* **Test Runner:** Playwright Test

* **Design Patterns:** Page Object Model (POM), Factory Pattern, Singleton Pattern

## 🏗 Key Design Patterns & Technical Solutions

### 1. Page Object Model (POM) & Components

To ensure high maintainability, the UI is divided into reusable pieces. Complex elements like the **DatePicker** and **Passenger Selector** are treated as independent Components, preventing the Page classes from becoming bloated.

### 2. Context Factory & Singleton Pattern

We utilize a **BrowserManager (Singleton)** to ensure a single browser instance is used efficiently. The **ContextFactory** provides clean, isolated browser contexts for each test, ensuring no session leakage and meeting the requirement for a clean test environment.

### 3. Dynamic Date Handling (DateHelper)

Following the requirement for a **current date + 2** departure, a dedicated `DateHelper` utility calculates the target date dynamically. This ensures the test remains valid regardless of when it is executed.

### 4. Performance Optimization (Network Interception)

To meet the evaluation criteria for test duration, we implemented `page.route` to block unnecessary third-party trackers and analytics scripts. This significantly speeds up the page load time on a heavy site like Agoda.

### 5. Smart Popup Handling

Agoda often displays promotional popups. We implemented a **Smart Wait Handler** using `page.addLocatorHandler()`. This background listener automatically detects and closes interstitials without cluttering the main test logic.

### 6. Data-Driven Testing (DDT)

All test inputs (locations, guest count, class) are managed through a structured JSON data factory. This allows for easy scalability if more scenarios need to be added in the future.

## 📝 Test Case Steps (English)

As per the requirements, the test execution follows these steps:

1. **Navigate** to the Agoda homepage.


2. **Input** origin "Ho Chi Minh (SGN)" and destination "Valencia (VLC)".


3. **Select** the departure date dynamically (Current Date + 2).


4. **Configure** passengers (2 adults) and cabin class (Economic).


5. **Execute** search and handle any appearing popups.


6. **Verify** that flight details and prices are correctly displayed in the results.



## 💻 Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Run tests: `npx playwright test`.
4. View report: `npx playwright show-report`.
