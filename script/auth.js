import { apiRequest } from "./helper.js";
import { BASE_URL, BASE_PATH } from './configs.js'
console.log("requireAuth loaded");

export async function requireAuth() {
    try {
        const data = await apiRequest("check_auth", "GET");
        console.log("User ID:", data.user_id);
    } catch (err) {
        console.log("Auth check failed:", err);
        localStorage.removeItem("token");
        window.location.href = `${BASE_PATH}/templates/sign_up_page.html`;
    }
}
