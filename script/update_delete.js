// update_delete.js
console.log("update_delete.js");

import { apiRequest } from './helper.js';
import { loadPosts }  from './postUI.js';
import { toast, setLoading } from './ui_feedback.js';

// ── Delete ──────────────────────────────────────────────
export async function delete_user_post(id) {
  setLoading("delete_post", true, "Deleting...");

  try {
    const response = await apiRequest(`delete_post/${id}`, "DELETE");

    if (response) {
      toast.success("Post deleted");
      loadPosts("get_posts",     "user_posts",     true);
      loadPosts("get_all_posts", "postsContainer", false);
    }

  } catch (err) {
    toast.error("Failed to delete post");
    console.error("Error deleting post:", err);
  } finally {
    setLoading("delete_post", false);
  }
}

// ── Update ──────────────────────────────────────────────
export async function update_post(id, title, description) {
  console.log(title, description);

  if (!title || !description) {
    toast.warning("Title and description cannot be empty");
    return;
  }

  setLoading("update_post", true, "Saving...");

  try {
    const data = await apiRequest(
      `update_post/${id}`,
      "PUT",
      { title, description }
    );

    if (data) {
      toast.success(data.message || "Post updated!");
      loadPosts("get_posts",     "user_posts",     true);
      loadPosts("get_all_posts", "postsContainer", false);
    }

  } catch (err) {
    toast.error(err.message || "Failed to update post");
    console.error("Error updating post:", err);
  } finally {
    setLoading("update_post", false);
  }
}
