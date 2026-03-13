import { login, setToken } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailEl = document.getElementById("login-email");
  const passwordEl = document.getElementById("login-password");
  const errorEl = document.getElementById("login-error");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    if (!email || !password) {
      errorEl.textContent = "Enter your email and password.";
      return;
    }

    errorEl.textContent = "";

    try {
      const data = await login(email, password);

      // Save token
      setToken(data.token);

      // Redirect to dashboard
      window.location.href = "dashboard.html";

    } catch (err) {
      errorEl.textContent = "Invalid email or password.";
      console.error(err);
    }
  });
});
