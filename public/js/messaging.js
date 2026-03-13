import { apiGet, apiPost } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const filterEl = document.getElementById("audience-filter");
  const channelEl = document.getElementById("channel");
  const subjectEl = document.getElementById("message-subject");
  const bodyEl = document.getElementById("message-body");
  const queueBtn = document.querySelector(".btn:last-of-type");
  const table = document.getElementById("messages-table-body");

  // Load recent messages
  async function loadMessages() {
    try {
      const messages = await apiGet("/admin/messages");

      table.innerHTML = messages
        .map(m => `
          <tr>
            <td>${m.type}</td>
            <td>${m.channel}</td>
            <td>${m.audience}</td>
            <td>${m.created_at}</td>
            <td>${m.status}</td>
          </tr>
        `)
        .join("");

    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }

  // Queue a new campaign
  queueBtn.addEventListener("click", async () => {
    try {
      await apiPost("/admin/messages", {
        audience: filterEl.value,
        channel: channelEl.value,
        subject: subjectEl.value.trim(),
        body: bodyEl.value.trim()
      });

      alert("Campaign queued");
      await loadMessages();

    } catch (err) {
      console.error("Failed to queue campaign:", err);
      alert("Error queuing campaign");
    }
  });

  loadMessages();
});
