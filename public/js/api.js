/* ============================================================
   API CONFIG
   ------------------------------------------------------------
   CHANGE THIS to your Cloudflare Worker URL:
   Example:
   const API_BASE = "https://thebelthub-crm.yourname.workers.dev";
   OR your custom domain:
   const API_BASE = "https://api.thebelthub.com";
============================================================ */

const API_BASE = "https://belt-hub-worker.boardwalkclay1.workers.dev/"; // <-- SET THIS


/* ============================================================
   AUTH TOKEN HELPERS
============================================================ */

export function getToken() {
  return localStorage.getItem("bh_auth_token");
}

export function setToken(token) {
  localStorage.setItem("bh_auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("bh_auth_token");
}


/* ============================================================
   CORE REQUEST WRAPPER
============================================================ */

export async function apiRequest(path, options = {}) {
  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    let msg = `API error ${res.status}`;
    try {
      const text = await res.text();
      msg = text;
    } catch (_) {}
    throw new Error(msg);
  }

  try {
    return await res.json();
  } catch (_) {
    return {};
  }
}


/* ============================================================
   AUTH (LOGIN)
============================================================ */

export async function login(email, password) {
  return apiRequest("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}


/* ============================================================
   CUSTOMERS
============================================================ */

export async function fetchCustomers(query = "") {
  const q = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiRequest(`/admin/customers${q}`);
}

export async function createCustomer(data) {
  return apiRequest("/admin/customers", {
    method: "POST",
    body: JSON.stringify(data)
  });
}


/* ============================================================
   WAIVERS
============================================================ */

export async function fetchWaivers() {
  return apiRequest("/admin/waivers");
}

export async function createWaiverVersion(content_html) {
  return apiRequest("/admin/waivers", {
    method: "POST",
    body: JSON.stringify({ content_html })
  });
}


/* ============================================================
   RENTALS
============================================================ */

export async function fetchRentals() {
  return apiRequest("/admin/rentals");
}

export async function captureDeposit(rentalId, amount_cents, reason) {
  return apiRequest(`/admin/rentals/${rentalId}/deposit/capture`, {
    method: "POST",
    body: JSON.stringify({ amount_cents, reason })
  });
}


/* ============================================================
   COUPONS
============================================================ */

export async function fetchCoupons() {
  return apiRequest("/admin/coupons");
}

export async function createCoupon(data) {
  return apiRequest("/admin/coupons", {
    method: "POST",
    body: JSON.stringify(data)
  });
}


/* ============================================================
   PUBLIC API (Client App)
============================================================ */

export async function publicUpsertCustomer(data) {
  return apiRequest("/public/customers/upsert", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function publicGetCurrentWaiver() {
  return apiRequest("/public/waivers/current");
}

export async function publicSignWaiver(data) {
  return apiRequest("/public/waivers/sign", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function publicStartRental(data) {
  return apiRequest("/public/rentals/start", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function publicEndRental(data) {
  return apiRequest("/public/rentals/end", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
