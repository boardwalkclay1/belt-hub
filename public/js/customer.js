import { apiGet } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const table = document.getElementById("customers-table-body");

  try {
    const customers = await apiGet("/admin/customers");

    table.innerHTML = customers
      .map(c => `
        <tr>
          <td>${c.first_name} ${c.last_name}</td>
          <td>${c.email || ""}</td>
          <td>${c.phone || ""}</td>
          <td>${c.created_at}</td>
        </tr>
      `)
      .join("");

  } catch (err) {
    console.error("Failed to load customers:", err);
  }
});
