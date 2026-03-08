export function openOverlay(html){
  const overlay = document.getElementById("overlay");
  const content = document.getElementById("overlayContent");

  content.innerHTML = html;
  overlay.classList.remove("hidden");
}

export function closeOverlay(){
  const overlay = document.getElementById("overlay");
  overlay.classList.add("hidden");
}