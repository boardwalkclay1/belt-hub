import { apiGet, apiPost } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const depositEl = document.getElementById("deposit-amount");
  const hourlyEl = document.getElementById("hourly-rate");
  const stripeEl = document.getElementById("stripe-key");
  const emailEl = document.getElementById("email-provider-key");
  const smsEl = document.getElementById("sms-provider-key");
  const saveBtn = document.querySelector(".btn");

  // Load settings
  try {
    const settings = await apiGet("/admin/settings");

    depositEl.value = settings.deposit_amount || 100;
    hourlyEl.value = settings.hourly_rate || 25;
    stripeEl.value = settings.stripe_key || "";
    emailEl.value = settings.email_key || "";
    smsEl.value = settings.sms_key || "";

  } catch (err) {
    console.error("Failed to load settings:", err);
  }

  // Save settings
  saveBtn.addEventListener("click", async () => {
    try {
      await apiPost("/admin/settings", {
        deposit_amount: Number(depositEl.value),
        hourly_rate: Number(hourlyEl.value),
        stripe_key: stripeEl.value.trim(),
        email_key: emailEl.value.trim(),
        sms_key: smsEl.value.trim()
      });

      alert("Settings saved");

    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Error saving settings");
    }
  });
});
