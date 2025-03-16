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

        // Send HTTP POST request to the Flask /signup endpoint
        fetch('http://127.0.0.1:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: firstName, // using firstName as username
                email: email,
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(err => { throw new Error(err["Signup error"] || "Signup failed"); });
        })
        .then(data => {
            console.log("Signup successful:", data);
            errorMessage.textContent = "Registration successful!";
            errorMessage.style.color = "green";
            // Optionally, you can store the token if needed
            localStorage.setItem("token", data.token);
            // Redirect to login page or dashboard
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        })
        .catch(error => {
            console.error("Error during signup:", error);
            errorMessage.textContent = error.message;
            errorMessage.style.color = "red";
        });
    });
});
