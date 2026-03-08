
console.log("navRoutes.js");

export function showPage(pageId){
  const page = document.getElementById(pageId);
  if(!page) return;

  document.querySelectorAll(".page")
    .forEach(p => p.classList.remove("active"));

  page.classList.add("active");
}

export function navRouter(navId){

  const nav = document.getElementById(navId);

  if(!nav) return;

  nav.addEventListener("click", (e)=>{

    const navItem = e.target.closest("li");

    if(!navItem) return;

    const pageId = navItem.dataset.page;

    if(!pageId) return;

    showPage(pageId);

  });

}

