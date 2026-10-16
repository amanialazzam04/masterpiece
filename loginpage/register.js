
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("register-form");

    const nameInput = document.getElementById("full-name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput =
        document.getElementById("confirm-password");

    const termsCheckbox = document.getElementById("terms");
    const accountTypeInputs = Array.from(
        document.querySelectorAll('input[name="accountType"]')
    );
    const togglePasswordButton =
        document.getElementById("toggle-password");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const confirmPasswordError =
        document.getElementById("confirm-password-error");
    const termsError = document.getElementById("terms-error");
    const formMessage = document.getElementById("form-message");

    // Show or hide password
    togglePasswordButton.addEventListener("click", function () {
        const showPassword = passwordInput.type === "password";

        passwordInput.type = showPassword ? "text" : "password";

        togglePasswordButton.textContent =
            showPassword ? "Hide" : "Show";

        togglePasswordButton.setAttribute(
            "aria-label",
            showPassword ? "Hide password" : "Show password"
        );

        togglePasswordButton.setAttribute(
            "aria-pressed",
            String(showPassword)
        );
    });

    // Clear previous errors
    function clearErrors() {
        nameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        termsError.textContent = "";

        [
            nameInput,
            emailInput,
            passwordInput,
            confirmPasswordInput
        ].forEach(function (input) {
            input.removeAttribute("aria-invalid");
        });

        formMessage.textContent = "";
        formMessage.className = "form-message";
    }

    // Check email format
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Display a general message
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = "form-message " + type;
    }

    // Register form
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors();

        const fullName = nameInput.value.trim();
        const email = emailInput.value.trim();
        const normalizedEmail = email.toLowerCase();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const selectedAccountType = document.querySelector(
            'input[name="accountType"]:checked'
        );

        let isValid = true;

        // Validate name
        if (fullName.length < 2) {
            nameError.textContent =
                "Please enter your full name.";

            nameInput.setAttribute("aria-invalid", "true");
            isValid = false;
        }

        // Validate email
        if (email === "") {
            emailError.textContent =
                "Please enter your email address.";

            emailInput.setAttribute("aria-invalid", "true");
            isValid = false;
        } else if (!validateEmail(email)) {
            emailError.textContent =
                "Please enter a valid email address.";

            emailInput.setAttribute("aria-invalid", "true");
            isValid = false;
        } else if (!normalizedEmail.endsWith("@nafas.local")) {
            emailError.textContent =
                "Use a fictional test email ending in @nafas.local.";

            emailInput.setAttribute("aria-invalid", "true");
            isValid = false;
        }

        if (!selectedAccountType) {
            showMessage("Choose a portal role for this local demo account.", "error");
            isValid = false;
        }

        // Validate password
        if (password.length < 8) {
            passwordError.textContent =
                "Password must be at least 8 characters.";

            passwordInput.setAttribute("aria-invalid", "true");
            isValid = false;
        }

        // Confirm password
        if (confirmPassword === "") {
            confirmPasswordError.textContent =
                "Please confirm your password.";

            confirmPasswordInput.setAttribute(
                "aria-invalid",
                "true"
            );

            isValid = false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent =
                "Passwords do not match.";

            confirmPasswordInput.setAttribute(
                "aria-invalid",
                "true"
            );

            isValid = false;
        }

        // Validate terms
        if (!termsCheckbox.checked) {
            termsError.textContent =
                "Please agree to the terms to continue.";

            isValid = false;
        }

        // Stop if any field is invalid
        if (!isValid) {
            const firstInvalidInput =
                form.querySelector('[aria-invalid="true"]');

            if (firstInvalidInput) {
                firstInvalidInput.focus();
            }

            return;
        }

        const predefinedEmails = [
            "user.demo@nafas.local",
            "family.demo@nafas.local",
            "therapist.demo@nafas.local",
            "admin.demo@nafas.local"
        ];
        if (predefinedEmails.includes(normalizedEmail)) {
            emailError.textContent = "That email is reserved for a predefined demo account. Choose another test email.";
            emailInput.setAttribute("aria-invalid", "true");
            emailInput.focus();
            return;
        }

        const storageKey = "nafas.frontendDemoAccounts.v1";
        let demoAccounts = {};
        try {
            demoAccounts = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
            if (!demoAccounts || typeof demoAccounts !== "object" || Array.isArray(demoAccounts)) {
                demoAccounts = {};
            }
            if (demoAccounts[normalizedEmail]) {
                emailError.textContent = "A demo account with this email already exists in this tab. Sign in or use another test email.";
                emailInput.setAttribute("aria-invalid", "true");
                emailInput.focus();
                return;
            }
            demoAccounts[normalizedEmail] = {
                password: password,
                role: selectedAccountType.value
            };
            sessionStorage.setItem(storageKey, JSON.stringify(demoAccounts));
        } catch (error) {
            showMessage("This browser blocked temporary storage. Allow session storage or use one of the predefined demo accounts.", "error");
            return;
        }

        const roleNames = {
            user: "Personal User",
            family: "Family Member",
            therapist: "Therapist",
            admin: "Admin demo"
        };
        showMessage(
            `${roleNames[selectedAccountType.value]} demo account created in this tab only. No server account was created. Go to Sign in to test this portal.`,
            "success"
        );
    });

    // Clear field errors while typing
    [
        nameInput,
        emailInput,
        passwordInput,
        confirmPasswordInput
    ].forEach(function (input) {
        input.addEventListener("input", function () {
            input.removeAttribute("aria-invalid");

            const errorId = {
                "full-name": nameError,
                "email": emailError,
                "password": passwordError,
                "confirm-password": confirmPasswordError
            }[input.id];

            if (errorId) {
                errorId.textContent = "";
            }

            formMessage.textContent = "";
            formMessage.className = "form-message";
        });

    accountTypeInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            formMessage.textContent = "";
            formMessage.className = "form-message";
        });
    });
    });

    termsCheckbox.addEventListener("change", function () {
        termsError.textContent = "";
    });
});
