import { getToken } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  // If user is already logged in, skip login page
  const token = getToken();
  if (token) {
    window.location.href = "dashboard.html";
    return;
  }

  // Register service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
      .catch(err => console.error("SW registration failed:", err));
  }
});
