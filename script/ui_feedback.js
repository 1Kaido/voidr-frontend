/**
 * ui_feedback.js — VOIDR
 * Toast notifications + loading states
 * 
 * Usage:
 *   import { toast, setLoading } from '/script/ui_feedback.js';
 * 
 *   toast.success("Post created!");
 *   toast.error("Something went wrong");
 *   toast.info("Loading...");
 * 
 *   setLoading("send_btn", true);   // shows spinner, disables btn
 *   setLoading("send_btn", false);  // restores btn
 */

// ── inject styles once ──────────────────────────────────
(function injectStyles() {
  if (document.getElementById("voidr-feedback-styles")) return;
  const style = document.createElement("style");
  style.id = "voidr-feedback-styles";
  style.textContent = `
    /* Toast container */
    #voidr-toast-container {
      position: fixed;
      bottom: 80px;       /* above mobile nav */
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      pointer-events: none;
      width: 100%;
      max-width: 360px;
      padding: 0 16px;
    }

    @media (min-width: 640px) {
      #voidr-toast-container {
        bottom: 24px;
      }
    }

    /* Single toast */
    .voidr-toast {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid transparent;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.4;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      pointer-events: all;
      animation: toastIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .voidr-toast.removing {
      animation: toastOut 0.25s ease forwards;
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateY(12px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }

    @keyframes toastOut {
      from { opacity: 1; transform: translateY(0)    scale(1);    }
      to   { opacity: 0; transform: translateY(8px)  scale(0.95); }
    }

    /* Toast types */
    .voidr-toast.success {
      background: rgba(22, 25, 32, 0.95);
      border-color: rgba(34, 197, 94, 0.3);
      color: #f0f2f5;
    }
    .voidr-toast.success .toast-icon {
      color: #22c55e;
      background: rgba(34,197,94,0.12);
    }

    .voidr-toast.error {
      background: rgba(22, 25, 32, 0.95);
      border-color: rgba(239, 68, 68, 0.3);
      color: #f0f2f5;
    }
    .voidr-toast.error .toast-icon {
      color: #ef4444;
      background: rgba(239,68,68,0.12);
    }

    .voidr-toast.info {
      background: rgba(22, 25, 32, 0.95);
      border-color: rgba(74, 143, 245, 0.3);
      color: #f0f2f5;
    }
    .voidr-toast.info .toast-icon {
      color: #4a8ff5;
      background: rgba(74,143,245,0.12);
    }

    .voidr-toast.warning {
      background: rgba(22, 25, 32, 0.95);
      border-color: rgba(234, 179, 8, 0.3);
      color: #f0f2f5;
    }
    .voidr-toast.warning .toast-icon {
      color: #eab308;
      background: rgba(234,179,8,0.12);
    }

    /* Icon bubble */
    .toast-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      flex-shrink: 0;
    }

    .toast-message { flex: 1; }

    /* Close button */
    .toast-close {
      background: transparent;
      border: none;
      color: #4e5668;
      cursor: pointer;
      font-size: 14px;
      padding: 2px;
      flex-shrink: 0;
      transition: color 0.15s ease;
      line-height: 1;
    }
    .toast-close:hover { color: #8c97aa; }

    /* ── Button loading state ── */
    .btn-loading {
      position: relative;
      pointer-events: none;
      opacity: 0.75;
    }

    .btn-loading .btn-original-text { visibility: hidden; }

    .btn-spinner {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 13px;
      color: inherit;
    }

    /* Spinner ring */
    .spinner-ring {
      width: 16px;
      height: 16px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      opacity: 0.8;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
})();


// ── Toast container ─────────────────────────────────────
function getContainer() {
  let container = document.getElementById("voidr-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "voidr-toast-container";
    document.body.appendChild(container);
  }
  return container;
}


// ── Show a toast ────────────────────────────────────────
function showToast(message, type = "info", duration = 3500) {
  const container = getContainer();

  const icons = {
    success: "fa-circle-check",
    error:   "fa-circle-xmark",
    info:    "fa-circle-info",
    warning: "fa-triangle-exclamation",
  };

  const el = document.createElement("div");
  el.className = `voidr-toast ${type}`;
  el.innerHTML = `
    <div class="toast-icon">
      <i class="fa-solid ${icons[type] || icons.info}"></i>
    </div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Close">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  // Close on button click
  el.querySelector(".toast-close").addEventListener("click", () => removeToast(el));

  container.appendChild(el);

  // Auto remove
  const timer = setTimeout(() => removeToast(el), duration);

  // Cancel auto-remove on hover
  el.addEventListener("mouseenter", () => clearTimeout(timer));
  el.addEventListener("mouseleave", () => setTimeout(() => removeToast(el), 1500));
}

function removeToast(el) {
  if (!el || el.classList.contains("removing")) return;
  el.classList.add("removing");
  el.addEventListener("animationend", () => el.remove(), { once: true });
}


// ── Public toast API ────────────────────────────────────
export const toast = {
  success: (msg, duration) => showToast(msg, "success", duration),
  error:   (msg, duration) => showToast(msg, "error",   duration),
  info:    (msg, duration) => showToast(msg, "info",    duration),
  warning: (msg, duration) => showToast(msg, "warning", duration),
};


// ── Button loading state ────────────────────────────────
/**
 * setLoading(buttonId, isLoading, loadingText?)
 * Wraps button content in a spinner while loading.
 */
export function setLoading(buttonId, isLoading, loadingText = "Loading...") {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  if (isLoading) {
    // Save original content
    btn.dataset.originalHtml = btn.innerHTML;
    btn.classList.add("btn-loading");
    btn.innerHTML = `
      <span class="btn-original-text">${btn.dataset.originalHtml}</span>
      <span class="btn-spinner">
        <span class="spinner-ring"></span>
        ${loadingText}
      </span>
    `;
  } else {
    btn.classList.remove("btn-loading");
    if (btn.dataset.originalHtml) {
      btn.innerHTML = btn.dataset.originalHtml;
      delete btn.dataset.originalHtml;
    }
  }
}
