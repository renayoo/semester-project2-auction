document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

    if (!form) {
        console.error("Register form not found.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const errorMessages = document.getElementById("errorMessages");
        const successMessages = document.getElementById("successMessages");
        errorMessages.innerText = "";
        successMessages.innerText = "";

        // Gather form data
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const bio = document.getElementById("bio").value.trim();

        // Validate required fields
        if (!name || !email || !password) {
            errorMessages.innerText = "Name, email, and password are required.";
            return;
        }

        try {
            const userData = {
                name,
                email,
                password,
                bio: bio || undefined
            };

            // Send data to the registration API
            const response = await fetch("https://v2.api.noroff.dev/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const responseData = await response.json();

            if (response.status !== 201) {
                throw new Error(responseData.message || "Registration failed. Please check the inputs.");
            }

            successMessages.innerText = "Registration successful! Redirecting to login...";

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = "/auth/login/index.html";
            }, 2000);

        } catch (error) {
            console.error("Registration failed:", error);
            errorMessages.innerText = "Error: " + error.message;
        }
    });
});
