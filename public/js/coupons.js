import { apiGet, apiPost } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const table = document.getElementById("coupons-table-body");
  const form = document.getElementById("coupon-form");

  async function loadCoupons() {
    const coupons = await apiGet("/admin/coupons");

    table.innerHTML = coupons
      .map(c => `
        <tr>
          <td>${c.code}</td>
          <td>${c.type}</td>
          <td>${c.value}</td>
          <td>${c.minimum_spend || 0}</td>
          <td>${c.active ? "Active" : "Inactive"}</td>
        </tr>
      `)
      .join("");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const code = document.getElementById("coupon-code").value;
    const type = document.getElementById("coupon-type").value;
    const value = document.getElementById("coupon-value").value;
    const min = document.getElementById("coupon-min").value;

    await apiPost("/admin/coupons", {
      code,
      type,
      value: Number(value),
      minimum_spend: Number(min)
    });

    form.reset();
    await loadCoupons();
  });

  loadCoupons();
});
