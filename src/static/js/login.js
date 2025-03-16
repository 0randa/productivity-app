document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const loginButton = document.querySelector(".btn");
    const errorMessage = document.getElementById("error-message");

    loginButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            errorMessage.textContent = "Please enter both email and password.";
            errorMessage.style.color = "red";
            return;
        }

        // Store user credentials (for testing purposes only)
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPassword", password);

        // Simulating successful login
        errorMessage.textContent = "Login successful!";
        errorMessage.style.color = "green";

        // Redirect or perform other actions
        setTimeout(() => {
            window.location.href = "dashboard.html"; // Change to the appropriate page
        }, 1000);
    });
});
