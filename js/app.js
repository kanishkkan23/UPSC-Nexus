/* ===========================================
   UPSC CLOUD PROJECT
   Home Page JavaScript
=========================================== */


// ================================
// Navbar Scroll Effect
// ================================

window.addEventListener("scroll", function () {

    const header = document.querySelector("header");

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});



// ================================
// Smooth Scroll for Navigation Links
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});



// ================================
// Fade-in Animation on Scroll
// ================================

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.2
});


const hiddenElements = document.querySelectorAll(

".card,.phase-card,.feature-box,.stat-box"

);

hiddenElements.forEach((el)=>{

    el.classList.add("hidden");

    observer.observe(el);

});




// ================================
// Hero Button Animation
// ================================

const heroButton = document.querySelector(".btn");

if(heroButton){

heroButton.addEventListener("mouseenter",()=>{

    heroButton.style.transform="scale(1.05)";

});

heroButton.addEventListener("mouseleave",()=>{

    heroButton.style.transform="scale(1)";

});

}




// ================================
// Statistics Counter Animation
// ================================

const counters=document.querySelectorAll(".stat-box h3");

let started=false;

window.addEventListener("scroll",()=>{

const stats=document.querySelector(".statistics");

if(!stats) return;

const position=stats.offsetTop-400;

if(window.scrollY>position && !started){

started=true;

counters.forEach(counter=>{

const target=counter.innerText.replace("+","");

let count=0;

const speed=target/100;

const updateCounter=()=>{

if(count<target){

count+=speed;

counter.innerText=Math.ceil(count)+"+";

requestAnimationFrame(updateCounter);

}else{

counter.innerText=target+"+";

}

};

updateCounter();

});

}

});




// ================================
// Highlight Active Navigation Link
// ================================

const sections=document.querySelectorAll("section");

const navLinks=document.querySelectorAll(".nav-links a");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const sectionTop=section.offsetTop-120;

if(pageYOffset>=sectionTop){

current=section.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")==="#"+current){

link.classList.add("active");

}

});

});




// ================================
// Welcome Message
// ================================

window.addEventListener("load",()=>{

console.log("Welcome to UPSC Cloud Project");

});




// ================================
// Future Functions
// ================================

// Login

function login(){

window.location.href="pages/login.html";

}


// Register

function register(){

window.location.href="pages/register.html";

}


// Dashboard

function dashboard(){

window.location.href="pages/dashboard.html";

}