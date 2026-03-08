// backButtons.js
import { showPage } from './navRouter.js';

document.addEventListener('DOMContentLoaded', () => {
  const backBtnMakePost = document.getElementById('back_btn_make_post');
  
  const backBtnProfile = document.getElementById('back_btn_profile');
  
  
  
  if (backBtnMakePost) {
    backBtnMakePost.addEventListener('click', () => {
      showPage('home_page');
    });
  }
  
  if (backBtnProfile) {
    backBtnProfile.addEventListener('click', () => {
      showPage('home_page');
    });
  }
});


let buttons = document.getElementsByClassName("back_btn_universal");

for (let btn of buttons) {
  btn.addEventListener("click", () => {
    
    console.log("gh");
    
    let con = document.getElementById("userFoundContainer");
    
    if (!con) return;
    
    con.remove();
    
  });
}