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

        // Validate input fields
        if (!email || !password) {
            errorMessage.textContent = "Please enter both email and password.";
            errorMessage.style.color = "red";
            return;
        }

        // Send HTTP POST request to the Flask /login endpoint
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(err => { throw new Error(err["Login error"] || "Login failed"); });
        })
        .then(data => {
            console.log("Login successful:", data);
            errorMessage.textContent = "Login successful!";
            errorMessage.style.color = "green";
            // Store the token for subsequent requests
            localStorage.setItem("token", data.token);
            // Redirect to the dashboard or homepage
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        })
        .catch(error => {
            console.error("Error during login:", error);
            errorMessage.textContent = error.message;
            errorMessage.style.color = "red";
        });
    });
});
