// get_user_data.js
console.log("get_data.js Loaded");

import { loadPosts } from './postUI.js';
import { apiRequest, create_element } from './helper.js';
import { addClick } from "./eventListener.js";
import { toast } from './ui_feedback.js';
import { BASE_URL, BASE_PATH } from './configs.js'
export const data = await apiRequest("get_posts", "GET");
console.log(data);

create_element("user_data", "", "user_pic_class");
create_element("user_data", `<div id="logout">Logout</div>`, "user_bio_class");



async function logout() {
  try {
    await apiRequest("logout", "POST");
  } catch (e) {
    // ignore logout errors — clear token anyway
  }
}

addClick("logout", async () => {
  await logout();
  toast.info("Logged out. See you in the void 👋");
  localStorage.removeItem("token");
  setTimeout(() => {
    window.location.href = `${BASE_PATH}/templates/sign_up_page.html`;
  }, 1000);
});
