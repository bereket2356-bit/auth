// script.js

// ────────────────────────────────────────────────
//  BASE VARIABLES & HELPERS
// ────────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api/auth";   // change to production URL later
const container = document.getElementById('container');

// Toggle animation (only exists on main login/signup page)
const registerBtn = document.getElementById('register');
const loginBtn    = document.getElementById('login');

if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}

// Simple message helper (you can replace with toast library later)
function showMessage(text, isError = false) {
    alert(text);   // ← basic for now
    // console.log(isError ? "[ERROR]" : "[INFO]", text);
}

// ────────────────────────────────────────────────
//  SIGN UP FORM  (only on main page)
// ────────────────────────────────────────────────

const signUpForm = document.querySelector(".sign-up form");
if (signUpForm) {
    signUpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name     = signUpForm.querySelector('input[placeholder="Name"]').value.trim();
        const email    = signUpForm.querySelector('input[type="email"]').value.trim();
        const password = signUpForm.querySelector('input[type="password"]').value;

        if (!name || name.length < 2)     return showMessage("Name must be at least 2 characters", true);
        if (!email || !email.includes("@")) return showMessage("Please enter a valid email", true);
        if (!password || password.length < 6) return showMessage("Password must be at least 6 characters", true);

        try {
            const res = await fetch(`${API_BASE}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                showMessage(data.message || "Registration failed", true);
                return;
            }

            showMessage("Account created! You can now sign in.");
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Switch to login view
            container.classList.remove("active");
            signUpForm.reset();

        } catch (err) {
            showMessage("Network error – please try again", true);
            console.error("Signup error:", err);
        }
    });
}

// ────────────────────────────────────────────────
//  SIGN IN FORM  (only on main page)
// ────────────────────────────────────────────────

const signInForm = document.querySelector(".sign-in form");
if (signInForm) {
    signInForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email    = signInForm.querySelector('input[type="email"]').value.trim();
        const password = signInForm.querySelector('input[type="password"]').value;

        if (!email || !password) {
            showMessage("Email and password are required", true);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                showMessage(data.message || "Login failed", true);
                return;
            }

            showMessage(`Welcome back, ${data.user.name || "user"}!`);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // TODO: redirect to dashboard / home
            // window.location.href = "/dashboard.html";
            signInForm.reset();

        } catch (err) {
            showMessage("Network error – please try again", true);
            console.error("Login error:", err);
        }
    });
}

// ────────────────────────────────────────────────
//  FORGOT PASSWORD FORM  (only on forgot-password.html)
// ────────────────────────────────────────────────

const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = forgotForm.querySelector('input[type="email"]');
        if (!emailInput) {
            showMessage("Email field not found on page", true);
            return;
        }

        const email = emailInput.value.trim();

        if (!email || !email.includes("@")) {
            showMessage("Please enter a valid email address", true);
            return;
        }

        console.log("Sending forgot-password request for:", email);

        try {
            const res = await fetch(`${API_BASE}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                showMessage("If this email is registered, you will receive a reset link shortly.");
                forgotForm.reset();
                // Optional: go back to login after a few seconds
                setTimeout(() => {
                    window.location.href = "index.html"; // or wherever your login is
                }, 2500);
            } else {
                showMessage(data.message || "Request failed", true);
            }

        } catch (err) {
            console.error("Forgot password network error:", err);
            showMessage("Could not connect to the server – check your connection", true);
        }
    });
}

// ────────────────────────────────────────────────
//  Optional: Check if already logged in (on any page)
// ────────────────────────────────────────────────

window.addEventListener("load", () => {
    const token = localStorage.getItem("token");
    if (token) {
        console.log("Token found in storage – user appears logged in");
        // You can add: fetch user info or redirect here
        // Example:
        // fetch(`${API_BASE}/me`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // }).then(r => r.json()).then(console.log);
    }
});