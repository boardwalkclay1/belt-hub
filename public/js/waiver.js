import { apiGet, apiPost } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("waiver-list");
  const form = document.getElementById("waiver-form");
  const content = document.getElementById("waiver-content");

  async function loadWaivers() {
    const waivers = await apiGet("/admin/waivers");
    list.innerHTML = waivers
      .map(w => `
        <div class="waiver-item">
          <div>${w.title}</div>
          <div>${w.created_at}</div>
        </div>
      `)
      .join("");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await apiPost("/admin/waivers", {
      title: "Waiver",
      content_html: content.value
    });
    content.value = "";
    await loadWaivers();
  });

  loadWaivers();
});
