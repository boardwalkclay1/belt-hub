import { apiGet } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const customers = await apiGet("/admin/customers");
    const rentals = await apiGet("/admin/rentals");
    const waivers = await apiGet("/admin/waivers");
    const coupons = await apiGet("/admin/coupons");

    document.getElementById("count-customers").textContent = customers.length;
    document.getElementById("count-rentals").textContent = rentals.length;
    document.getElementById("count-waivers").textContent = waivers.length;
    document.getElementById("count-coupons").textContent = coupons.length;

  } catch (err) {
    console.error("Dashboard load failed:", err);
  }
});
