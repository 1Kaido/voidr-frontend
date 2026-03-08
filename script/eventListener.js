console.log("Eventistner.js");

export function addClick(button_id, callback) {
  
  const btn = document.getElementById(button_id);
  
  if (!btn) return;
  
  btn.addEventListener("click", callback);
  
}
