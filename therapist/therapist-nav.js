"use strict";
document.addEventListener("DOMContentLoaded",function(){
 const sidebar=document.getElementById("therapist-sidebar"),menu=document.getElementById("therapist-menu-button"),overlay=document.getElementById("therapist-sidebar-overlay");
 const links=[...document.querySelectorAll(".sidebar-nav .nav-link")],file=location.pathname.split("/").pop();
 links.forEach(link=>{const active=link.getAttribute("href")===file;link.classList.toggle("active",active);if(active)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current");});
 function close(returnFocus){sidebar.classList.remove("open");overlay.classList.remove("visible");menu.setAttribute("aria-expanded","false");if(returnFocus)menu.focus();}
 menu.addEventListener("click",()=>{const open=sidebar.classList.toggle("open");overlay.classList.toggle("visible",open);menu.setAttribute("aria-expanded",String(open));if(open)sidebar.querySelector(".nav-link")?.focus();});
 overlay.addEventListener("click",()=>close(true));document.addEventListener("keydown",e=>{if(e.key==="Escape"&&sidebar.classList.contains("open"))close(true);});window.addEventListener("resize",()=>{if(innerWidth>820)close(false);});
});
