"use strict";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("form-message");
const togglePassword = document.getElementById("toggle-password");
const DEMO_ACCOUNT_STORAGE_KEY = "nafas.frontendDemoAccounts.v1";

const predefinedAccounts = {
    "user.demo@nafas.local": {
        password: "NafasUser123!",
        role: "user",
        route: "../personal/dashbord.html"
    },
    "family.demo@nafas.local": {
        password: "NafasFamily123!",
        role: "family",
        route: "../family/family-dashboard.html"
    },
    "therapist.demo@nafas.local": {
        password: "NafasTherapist123!",
        role: "therapist",
        route: "../therapist/therapist-dashboard.html"
    },
    "admin.demo@nafas.local": {
        password: "NafasAdmin123!",
        role: "admin",
        route: "../admin/admin-dashboard.html"
    }
};

function showMessage(text, type) {
    message.textContent = text;
    message.className = `form-message show ${type}`;
}

function getRegisteredDemoAccounts() {
    try {
        const accounts = JSON.parse(sessionStorage.getItem(DEMO_ACCOUNT_STORAGE_KEY) || "{}");
        return accounts && typeof accounts === "object" && !Array.isArray(accounts) ? accounts : {};
    } catch (error) {
        return {};
    }
}

togglePassword.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "Hide" : "Show";
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    if (!email || !password) {
        showMessage("Enter the email and password for one of the demo accounts.", "error");
        return;
    }

    const account = predefinedAccounts[email] || getRegisteredDemoAccounts()[email];
    if (!account || account.password !== password) {
        showMessage("Those demo credentials were not recognized. Check the email and password, or create a local demo account.", "error");
        return;
    }

    const routes = {
        user: "../personal/dashbord.html",
        family: "../family/family-dashboard.html",
        therapist: "../therapist/therapist-dashboard.html",
        admin: "../admin/admin-dashboard.html"
    };
    const route = routes[account.role];
    if (!route) {
        showMessage("This local demo account has an unsupported role. Create another account to continue.", "error");
        return;
    }

    showMessage("Demo sign-in successful. Opening the selected account's fixed portal…", "success");
    window.location.href = route;
});

document.getElementById("forgot-link").addEventListener("click", function (event) {
    event.preventDefault();
    showMessage("Password recovery is not available in this frontend demo.", "error");
});
