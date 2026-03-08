import { loadPosts } from "./postUI.js";
import { attachPostEvent } from "./postsEvent.js";

console.log("ui.js loaded")
const mainPostsContainer = document.getElementById("postsContainer");
const userPostsContainer = document.getElementById("user_posts");

// Attach listeners ONCE
attachPostEvent(mainPostsContainer);
attachPostEvent(userPostsContainer);

// Load data
loadPosts("get_all_posts", "postsContainer", false);
loadPosts("get_posts", "user_posts", true,false);