// user_edit.js
import { create_element, apiRequest } from './helper.js';
import { addClick } from './eventListener.js';
import { delete_user_post,update_post } from './update_delete.js';
import {openOverlay,closeOverlay} from './overlay.js'


let pageHTML = `
<div class="back_btn">Back</div>
<input id="post_title" type="text">

<textarea id="post_description" type="text"></textarea>
<button id="delete_post">Delete</button>
<button id="update_post">Update</button>
`;

export function editUserPost(e) {

  const edit_btn = e.target.closest(".edit_posts");
  if (!edit_btn) return;

  const user_post = edit_btn.closest(".post-container");

  const title = user_post.querySelector(".post-title").innerText;
  const description = user_post.querySelector(".post-description").innerText;
  const post_id = user_post.dataset.id;

  const overlay = document.getElementById("overlay");

  overlay.innerHTML = pageHTML;
  overlay.classList.remove("hidden");

  const inputs = overlay.querySelectorAll("input");

  let input_title = inputs[0].value = title;
  const input_description = overlay.querySelector("textarea").value = description;
  
  const input_title_update = document.getElementById("post_title").value;
  
  const input_description_update = document.getElementById("post_description").value
  
  
  overlay.querySelector(".back_btn").onclick = () => {
    overlay.classList.add("hidden");
  };

  addClick("delete_post", async () => {
    await delete_user_post(post_id);
    overlay.classList.add("hidden");
  });
  
  addClick("update_post", async () => {
  const title_update = overlay.querySelector("#post_title").value;
  const description_update = overlay.querySelector("#post_description").value;


  await update_post(post_id, title_update, description_update);
  overlay.classList.add("hidden");
});

}