// find_user.js
console.log("find_user.js");

import { apiRequest } from './helper.js';
import { loadPosts } from './postUI.js';
import { openOverlay, closeOverlay } from "./overlay.js";
import { toast } from './ui_feedback.js';

async function findUserData(id) {

  // Show overlay immediately with loading spinner
  openOverlay(`
    <div class="back_btn">Back</div>
    <div class="user-profile-loading">
      <div class="spinner-ring" style="width:24px;height:24px;border-width:2px;color:#4a8ff5"></div>
      <span style="font-size:13px;color:#4e5668">Loading profile...</span>
    </div>
  `);

  try {
    const user = await apiRequest(`/find_user/${id}`);

    // Replace loading with actual profile
    openOverlay(`
      <div class="back_btn">Back</div>
      <div class="username">
        @${user.username}
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <div class="user_pic_class"></div>
      <div id="userFoundData"></div>
    `);

    loadPosts(`user_posts/${user.id}`, "userFoundData", false);

  } catch (err) {
    console.error("findUserData error:", err);
    toast.error("Could not load user profile");
    closeOverlay();
  }

  // { once: true } prevents listener stacking on repeated profile opens
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("back_btn")) {
      closeOverlay();
    }
  }, { once: true });
}


export function findUserId(e) {
  const username_clickable = e.target.closest(".username");
  if (!username_clickable) return;

  const user_post = username_clickable.closest(".post-container");
  if (!user_post) return;

  const user_id = user_post.dataset.userId;
  if (!user_id) return;

  findUserData(user_id);
}
