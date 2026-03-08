// postUI.js
console.log("PostUI.js");

import { timeAgo, apiRequest } from "./helper.js";
import { toast } from "./ui_feedback.js";

function formatNumber(num) {
  return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num;
}


// ── Skeleton loader ─────────────────────────────────────
function showSkeleton(containerElement, count = 3) {
  containerElement.innerHTML = "";
  for (let i = 0; i < count; i++) {
    containerElement.innerHTML += `
      <div class="post-skeleton">
        <div class="sk-line sk-username"></div>
        <div class="sk-line sk-title"></div>
        <div class="sk-line sk-title sk-title-short"></div>
        <div class="sk-line sk-desc"></div>
        <div class="sk-line sk-desc"></div>
        <div class="sk-line sk-desc sk-desc-short"></div>
        <div class="sk-actions">
          <div class="sk-line sk-btn"></div>
          <div class="sk-line sk-btn"></div>
        </div>
      </div>
    `;
  }
}


// ── Error state ─────────────────────────────────────────
function showError(containerElement, message = "Failed to load posts") {
  containerElement.innerHTML = `
    <div class="posts-error">
      <div class="posts-error-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <p class="posts-error-title">Something went wrong</p>
      <p class="posts-error-msg">${message}</p>
      <button class="posts-error-retry" onclick="location.reload()">
        <i class="fa-solid fa-rotate-right"></i> Retry
      </button>
    </div>
  `;
}


// ── Empty state ─────────────────────────────────────────
function showEmpty(containerElement, myPosts) {
  containerElement.innerHTML = `
    <div class="posts-empty">
      <div class="posts-empty-icon">
        <i class="fa-solid fa-ghost"></i>
      </div>
      <p class="posts-empty-title">${myPosts ? "No posts yet" : "The void is empty"}</p>
      <p class="posts-empty-msg">${myPosts ? "Create your first post!" : "Be the first to break the silence."}</p>
    </div>
  `;
}


// ── Create post card ────────────────────────────────────
function createPost(postData, myPosts) {
  const post = document.createElement("div");
  post.className = "post-container";
  post.dataset.id     = postData.id;
  post.dataset.userId = postData.user_id;

  let html = `
    <div class="username">
      @${postData.username}
      <i class="fa-solid fa-circle-check"></i>
    </div>
  `;

  if (myPosts) {
    html += `<div class="edit_posts">Edit</div>`;
  }

  html += `
    <div class="post-title">${postData.title}</div>
    <div class="post-description">${postData.description}</div>
    <div class="post-actions">
      <button class="likes-btn">
        <i class="fa-regular fa-thumbs-up"></i> ${formatNumber(0)}
      </button>
      <button class="dislikes-btn">
        <i class="fa-regular fa-thumbs-down"></i> ${formatNumber(0)}
      </button>
    </div>
    <div class="post-time">${timeAgo(postData.date_time)}</div>
  `;

  post.innerHTML = html;
  return post;
}


// ── Load posts ──────────────────────────────────────────
export async function loadPosts(route, container, myPosts) {
  if (!container) return;

  const containerElement = document.getElementById(container);
  if (!containerElement) return;

  // Show skeleton while fetching
  showSkeleton(containerElement);

  try {
    const data = await apiRequest(route, "GET");

    containerElement.innerHTML = "";

    if (!data || data.length === 0) {
      showEmpty(containerElement, myPosts);
      return;
    }

    for (const postData of data) {
      containerElement.appendChild(createPost(postData, myPosts));
    }

  } catch (err) {
    console.error("loadPosts error:", err);
    showError(containerElement, err.message || "Could not load posts");
    toast.error("Failed to load posts");
  }
}
