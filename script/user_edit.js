// user_edit.js
import { addClick } from './eventListener.js';
import { delete_user_post, update_post } from './update_delete.js';
import { openOverlay, closeOverlay } from './overlay.js';
import { toast } from './ui_feedback.js';

let pageHTML = `
<div class="back_btn">Back</div>
<input id="post_title" type="text">
<textarea id="post_description"></textarea>
<button id="delete_post">Delete</button>
<button id="update_post">Update</button>
`;

export function editUserPost(e) {
  const edit_btn = e.target.closest(".edit_posts");
  if (!edit_btn) return;

  const user_post = edit_btn.closest(".post-container");
  const title       = user_post.querySelector(".post-title").innerText;
  const description = user_post.querySelector(".post-description").innerText;
  const post_id     = user_post.dataset.id;

  const overlay = document.getElementById("overlay");
  overlay.innerHTML = pageHTML;
  overlay.classList.remove("hidden");

  // Pre-fill fields
  overlay.querySelector("#post_title").value       = title;
  overlay.querySelector("#post_description").value = description;

  // Back button
  overlay.querySelector(".back_btn").onclick = () => {
    overlay.classList.add("hidden");
  };

  // Delete — no validation needed
  addClick("delete_post", async () => {
    await delete_user_post(post_id);
    overlay.classList.add("hidden");
  });

  // Update — with validation
  addClick("update_post", async () => {
    const title_update       = overlay.querySelector("#post_title").value.trim();
    const description_update = overlay.querySelector("#post_description").value.trim();

    if (!title_update || !description_update) {
      toast.warning("Both fields are required");
      return;
    }
    if (title_update.length > 200) {
      toast.warning("Title too long — max 200 characters");
      return;
    }
    if (description_update.length > 1000) {
      toast.warning("Description too long — max 1000 characters");
      return;
    }

    await update_post(post_id, title_update, description_update);
    overlay.classList.add("hidden");
  });
    }
