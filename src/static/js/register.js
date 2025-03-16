document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const firstNameInput = document.getElementById("firstname-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const repeatPasswordInput = document.getElementById("repeat-password-input");
    const registerButton = document.querySelector(".btn");
    const errorMessage = document.getElementById("error-message");

    registerButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        const firstName = firstNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const repeatPassword = repeatPasswordInput.value.trim();

        // Validate input fields
        if (!firstName || !email || !password || !repeatPassword) {
            errorMessage.textContent = "Please fill in all fields.";
            errorMessage.style.color = "red";
            return;
        }

        // Check if passwords match
        if (password !== repeatPassword) {
            errorMessage.textContent = "Passwords do not match.";
            errorMessage.style.color = "red";
            return;
        }

        // Store user data (for testing purposes only)
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            errorMessage.textContent = "User with this email already exists.";
            errorMessage.style.color = "red";
            return;
        }

        users.push({ firstName, email, password });
        localStorage.setItem("users", JSON.stringify(users));

        // Simulate successful registration
        errorMessage.textContent = "Registration successful!";
        errorMessage.style.color = "green";

        // Redirect or perform other actions
        setTimeout(() => {
            window.location.href = "login.html"; // Redirect to login page
        }, 1000);
    });
});
