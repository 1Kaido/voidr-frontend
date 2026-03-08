// helper.js
console.log("Helper.js Loaded");

import { BASE_URL } from "./configs.js";


/* ======================================================
   TIME AGO
   Bugs fixed:
   1. Future timestamps showed "-100s ago"
   2. Invalid date showed "NaNs ago"
   3. null showed "56y ago" (treated as epoch 0)
   ====================================================== */

export function timeAgo(timestamp) {
  if (!timestamp) return "unknown";

  const past = new Date(timestamp);

  // Guard against invalid dates
  if (isNaN(past.getTime())) return "unknown";

  const diff = Date.now() - past.getTime();

  // Guard against future timestamps
  if (diff < 0) return "just now";

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours   / 24);
  const weeks   = Math.floor(days    / 7);
  const months  = Math.floor(days    / 30);
  const years   = Math.floor(days    / 365);

  if (years   > 0) return years   + "y ago";
  if (months  > 0) return months  + "mo ago";
  if (weeks   > 0) return weeks   + "w ago";
  if (days    > 0) return days    + "d ago";
  if (hours   > 0) return hours   + "h ago";
  if (minutes > 0) return minutes + "m ago";
  if (seconds < 5) return "just now";
  return seconds + "s ago";
}


/* ======================================================
   VALIDATE USERNAME
   No bugs — kept as-is, just added .trim() guard
   ====================================================== */

export function validate_username(username) {
  if (!username) return false;

  // trim before validating — catches "user " trailing spaces
  const trimmed = username.trim();

  const usernameRegex    = /^(?![._])[A-Za-z0-9._]{3,20}(?<![._])$/;
  const consecutiveRegex = /[._]{2,}/;

  if (!usernameRegex.test(trimmed))    return false;
  if (consecutiveRegex.test(trimmed))  return false;

  return true;
}


/* ======================================================
   VALIDATE PASSWORD
   Bugs fixed:
   1. "         " (9 spaces) passed — passwords shouldn't be only spaces
   2. No trim() — "password " (trailing space) was accepted
   ====================================================== */

export function validatePassword(password) {
  if (!password) return false;

  // Must not be only whitespace
  if (!password.trim()) return false;

  // Length: 9–32 chars
  if (password.length <= 8 || password.length > 32) return false;

  // No 3+ consecutive periods
  if (/\.{3,}/.test(password)) return false;

  return true;
}


/* ======================================================
   API REQUEST
   Bug fixed:
   1. No network error handling — fetch() itself can throw
      (e.g. no internet, server down) — was unhandled
   ====================================================== */

export async function apiRequest(route, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const options = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}/${route}`, options);
  } catch {
    // Network error — no internet, server unreachable etc.
    throw new Error("Network error — check your connection");
  }

  // Token expired — try refresh
  if (response.status === 401) {
    const newToken = await refreshToken();
    if (newToken) {
      options.headers["Authorization"] = `Bearer ${newToken}`;
      try {
        response = await fetch(`${BASE_URL}/${route}`, options);
      } catch {
        throw new Error("Network error — check your connection");
      }
    } else {
      localStorage.removeItem("token");
      window.location.href = "/templates/sign_up_page.html";
      return;
    }
  }

  // Parse JSON safely
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}


/* ======================================================
   REFRESH TOKEN
   ====================================================== */

async function refreshToken() {
  try {
    const res = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    return data.access_token;
  } catch {
    return null;
  }
}


/* ======================================================
   CREATE ELEMENT
   Bug fixed:
   1. No null check — crashes if container id doesn't exist in DOM
   ====================================================== */

export function create_element(container, inner_data, addClass) {
  const user_data_container = document.getElementById(container);

  if (!user_data_container) {
    console.warn(`create_element: #${container} not found in DOM`);
    return;
  }

  const box = document.createElement("div");
  box.innerHTML = inner_data;
  box.classList.add(addClass);
  user_data_container.append(box);
}
