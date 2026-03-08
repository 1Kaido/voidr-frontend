console.log("postEvent.js loaded")

import {editUserPost} from './user_edit.js';
import {findUserId} from './find_user.js'
export function attachPostEvent(container) {
  if (!container) return;
  
  container.addEventListener("click", (e) => {
    /*
    
    */
    editUserPost(e);
    findUserId(e);
    const button = e.target.closest(".likes-btn, .dislikes-btn");
    if (!button) return;
    
    const post = button.closest(".post-container");
    const isLike = button.classList.contains("likes-btn");
    const otherButton = post.querySelector(
      isLike ? ".dislikes-btn" : ".likes-btn"
    );
    
    let count = parseInt(button.textContent) || 0;
    let otherCount = parseInt(otherButton.textContent) || 0;
    
    if (button.classList.contains("active")) {
      button.classList.remove("active");
      count--;
    } else {
      if (otherButton.classList.contains("active")) {
        otherButton.classList.remove("active");
        otherCount--;
        otherButton.innerHTML = `<i class="fa-regular fa-${
          isLike ? "thumbs-down" : "thumbs-up"
        }"></i> ${otherCount}`;
      }
      
      button.classList.add("active");
      count++;
    }
    
    button.innerHTML = `<i class="fa-solid fa-${
      isLike ? "thumbs-up" : "thumbs-down"
    }"></i> ${count}`;
  });
}