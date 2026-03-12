const API_BASE = "https://api.thebelthub.com"; // your Workers domain

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Login failed: " + text);
        return;
      }

      const data = await res.json();

      // Save token
      localStorage.setItem("bh_auth_token", data.token);

      // Redirect to dashboard
      window.location.href = "dashboard.html";

    } catch (err) {
      alert("Error connecting to server.");
      console.error(err);
    }
  });
});
