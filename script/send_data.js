// send_data.js
console.log("send_data.js Loaded");

import { apiRequest } from "./helper.js";
import { loadPosts } from "./postUI.js";
import { toast, setLoading } from "./ui_feedback.js";

document.getElementById("send_btn").addEventListener("click", send);

async function send() {
  const post_title       = document.getElementById("post_title").value.trim();
  const post_description = document.getElementById("post_description").value.trim();

  if (!post_title || !post_description) {
    toast.warning("Both title and description are required");
    return;
}

if (post_title.length > 200) {
    toast.warning("Title too long — max 100 characters");
    return;
}

if (post_description.length > 1000) {
    toast.warning("Description too long — max 1000 characters");
    return;
}

  setLoading("send_btn", true, "Posting...");

  try {
    const data = await apiRequest("post", "POST", { post_title, post_description });

    toast.success(data.message || "Post created!");

    // Clear fields
    document.getElementById("post_title").value       = "";
    document.getElementById("post_description").value = "";

    // Reload feeds
    loadPosts("get_all_posts", "postsContainer", false);
    loadPosts("get_posts",     "user_posts",     true);

  } catch (error) {
    toast.error(error.message || "Failed to create post");
    console.error("Error:", error);
  } finally {
    setLoading("send_btn", false);
  }
}
