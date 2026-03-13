import { apiGet, apiPost } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const table = document.getElementById("rentals-table-body");

  try {
    const rentals = await apiGet("/admin/rentals");

    table.innerHTML = rentals
      .map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.customer_id}</td>
          <td>${r.status}</td>
          <td>${r.start_time}</td>
          <td>${r.end_time || ""}</td>
          <td>
            <button class="capture-btn" data-id="${r.id}">
              Capture Deposit
            </button>
          </td>
        </tr>
      `)
      .join("");

    document.querySelectorAll(".capture-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await apiPost(`/admin/rentals/${id}/deposit/capture`, {
          amount_cents: 10000
        });
        alert("Deposit captured");
      });
    });

  } catch (err) {
    console.error("Failed to load rentals:", err);
  }
});
