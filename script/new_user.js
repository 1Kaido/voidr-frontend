// new_user.js
console.log("new_user.js loaded");

import { validate_username, validatePassword, apiRequest } from './helper.js';
import { toast, setLoading } from './ui_feedback.js';
import { BASE_URL, BASE_PATH }
document.getElementById("signup_btn")
  .addEventListener("click", () => check_user("sign_up", "signup_btn", "Creating account..."));

document.getElementById("login_btn")
  .addEventListener("click", () => check_user("login", "login_btn", "Signing in..."));

async function check_user(route, btnId, loadingText) {
  const username = document.getElementById("new_username").value.trim();
  const password = document.getElementById("new_password").value;

  // Validate
  if (!username) {
    toast.warning("Please enter a username");
    return;
  }

  if (!validate_username(username)) {
    toast.error("Username must be 3–20 chars, letters/numbers/._  only");
    return;
  }

  if (!validatePassword(password)) {
    toast.error("Password must be 9–32 chars, no 3+ consecutive periods");
    return;
  }

  setLoading(btnId, true, loadingText);

  try {
    const response = await apiRequest(route, "POST", { username, password });

    localStorage.setItem("token", response.access_token);
    toast.success("Welcome to VOIDR! ⚡");

    // Small delay so user sees the success toast
    setTimeout(() => {
      window.location.href = `${BASE_PATH}/templates/sign_up_page.html`;
      
    }, 800);

  } catch (error) {
    toast.error(error.message || "Something went wrong");
    console.error(error);
  } finally {
    setLoading(btnId, false);
  }
}
