/*==========================================================
                UPSC CLOUD PROJECT
                    PRELIMS.JS
==========================================================*/

document.addEventListener("DOMContentLoaded", async () => {
    // Session Guard
    if (window.supabaseClient) {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            window.location.href = "login.html";
            return;
        }
    }

    console.log("UPSC Prelims Page Loaded Successfully");

    animateStatistics();

    smoothScrolling();

    animateTimeline();

    updateGreeting();

});

/*==========================================================
                HERO GREETING
==========================================================*/

function updateGreeting() {

    const heroHeading = document.querySelector(".hero-content h3");

    if (!heroHeading) return;

    const hour = new Date().getHours();

    let message = "";

    if (hour < 12) {

        message = "🌅 Good Morning! Begin your Prelims preparation today.";

    }

    else if (hour < 17) {

        message = "☀️ Keep learning! Every topic brings you closer to success.";

    }

    else {

        message = "🌙 Revise today's topics and prepare for tomorrow.";

    }

    heroHeading.innerHTML = message;

}

/*==========================================================
                STATISTICS COUNTER
==========================================================*/

function animateStatistics() {

    const counters = document.querySelectorAll(".stat-box h1");

    counters.forEach(counter => {

        const originalText = counter.innerText;

        const target = parseInt(originalText);

        let count = 0;

        const increment = Math.ceil(target / 80);

        const updateCounter = () => {

            if (count < target) {

                count += increment;

                counter.innerText = count + "+";

                requestAnimationFrame(updateCounter);

            }

            else {

                counter.innerText = originalText;

            }

        };

        updateCounter();

    });

}

/*==========================================================
                SMOOTH SCROLL
==========================================================*/

function smoothScrolling() {

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {

        link.addEventListener("click", function(e){

            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if(target){

                target.scrollIntoView({

                    behavior:"smooth"

                });

            }

        });

    });

}

/*==========================================================
                TIMELINE ANIMATION
==========================================================*/

function animateTimeline(){

    const timelineItems = document.querySelectorAll(".timeline-content");

    const observer = new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.style.opacity="1";

                entry.target.style.transform="translateX(0)";

            }

        });

    },{

        threshold:0.3

    });

    timelineItems.forEach(item=>{

        item.style.opacity="0";

        item.style.transform="translateX(80px)";

        item.style.transition=".8s";

        observer.observe(item);

    });

}

/*==========================================================
            ACTIVE NAVIGATION ON SCROLL
==========================================================*/

window.addEventListener("scroll", () => {

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav ul li a");

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href && href.includes(current)) {

            link.classList.add("active");

        }

    });

});


/*==========================================================
                CARD HOVER EFFECT
==========================================================*/

const cards = document.querySelectorAll(
".overview-card,.subject-card,.book-card,.pattern-card,.stat-box"
);

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transition = ".35s";
        card.style.transform = "translateY(-10px) scale(1.02)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0px) scale(1)";

    });

});


/*==========================================================
                BUTTON RIPPLE EFFECT
==========================================================*/

const buttons = document.querySelectorAll(
".btn-primary,.btn-secondary,.btn-outline"
);

buttons.forEach(button => {

    button.addEventListener("click", function(e){

        const ripple = document.createElement("span");

        const x = e.clientX - button.offsetLeft;
        const y = e.clientY - button.offsetTop;

        ripple.style.left = x + "px";
        ripple.style.top = y + "px";

        ripple.classList.add("ripple");

        button.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        },600);

    });

});


/*==========================================================
            SECTION FADE-IN ANIMATION
==========================================================*/

const revealSections = document.querySelectorAll(
".overview,.exam-pattern,.syllabus,.books,.stats,.roadmap,.tips-section,.action-section,.motivation"
);

const revealObserver = new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";
            entry.target.style.transform="translateY(0)";

        }

    });

},{
    threshold:0.2
});

revealSections.forEach(section=>{

    section.style.opacity="0";
    section.style.transform="translateY(60px)";
    section.style.transition=".8s ease";

    revealObserver.observe(section);

});


/*==========================================================
            BOOK CARD RANDOM HIGHLIGHT
==========================================================*/

setInterval(()=>{

    const books=document.querySelectorAll(".book-card");

    books.forEach(book=>{

        book.style.boxShadow="0 10px 25px rgba(0,0,0,.08)";

    });

    const random=Math.floor(Math.random()*books.length);

    books[random].style.boxShadow="0 0 25px rgba(249,115,22,.6)";

},3000);

/*==========================================================
                BACK TO TOP BUTTON
==========================================================*/

const topButton = document.createElement("button");

topButton.innerHTML = "⬆";

topButton.id = "backToTop";

document.body.appendChild(topButton);

topButton.style.cssText = `
position:fixed;
bottom:30px;
right:30px;
width:55px;
height:55px;
border:none;
border-radius:50%;
background:#F97316;
color:white;
font-size:22px;
cursor:pointer;
display:none;
box-shadow:0 10px 20px rgba(0,0,0,.25);
transition:.3s;
z-index:999;
`;

window.addEventListener("scroll",()=>{

    if(window.scrollY>400){

        topButton.style.display="block";

    }

    else{

        topButton.style.display="none";

    }

});

topButton.addEventListener("mouseenter",()=>{

    topButton.style.transform="scale(1.1)";

});

topButton.addEventListener("mouseleave",()=>{

    topButton.style.transform="scale(1)";

});

topButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/*==========================================================
            READING PROGRESS BAR
==========================================================*/

const progress=document.createElement("div");

progress.id="readingProgress";

document.body.prepend(progress);

progress.style.cssText=`
position:fixed;
top:0;
left:0;
height:5px;
background:#F97316;
width:0%;
z-index:9999;
`;

window.addEventListener("scroll",()=>{

    const totalHeight=document.documentElement.scrollHeight-window.innerHeight;

    const progressWidth=(window.pageYOffset/totalHeight)*100;

    progress.style.width=progressWidth+"%";

});

/*==========================================================
            MOTIVATIONAL QUOTES
==========================================================*/

const quotes=[

"Success is the sum of small efforts repeated every day.",

"Consistency beats intensity in UPSC preparation.",

"Discipline today creates success tomorrow.",

"Every PYQ solved is a step closer to success.",

"Dream, Prepare, Persevere and Achieve.",

"Stay patient. Great things take time."

];

const quoteBox=document.querySelector(".motivation blockquote");

let quoteIndex=0;

if(quoteBox){

    setInterval(()=>{

        quoteIndex++;

        if(quoteIndex>=quotes.length){

            quoteIndex=0;

        }

        quoteBox.style.opacity="0";

        setTimeout(()=>{

            quoteBox.innerHTML=quotes[quoteIndex];

            quoteBox.style.opacity="1";

        },300);

    },5000);

}

/*==========================================================
            PAGE LOADED NOTIFICATION
==========================================================*/

window.addEventListener("load",()=>{

    const toast=document.createElement("div");

    toast.innerHTML="✅ Welcome to the UPSC Preliminary Examination Module";

    toast.style.cssText=`

        position:fixed;
        top:90px;
        right:25px;
        background:#22C55E;
        color:white;
        padding:15px 22px;
        border-radius:10px;
        font-weight:600;
        box-shadow:0 10px 20px rgba(0,0,0,.2);
        z-index:9999;
        animation:slideIn .6s;

    `;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },3500);

});

/*==========================================================
            KEYBOARD SHORTCUTS
==========================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Home"){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    if(e.key==="End"){

        window.scrollTo({

            top:document.body.scrollHeight,

            behavior:"smooth"

        });

    }

});

/*==========================================================
            CONSOLE MESSAGE
==========================================================*/

console.log("%cUPSC CLOUD PROJECT","color:#F97316;font-size:24px;font-weight:bold;");

console.log("%cPrelims Module Loaded Successfully","color:green;font-size:16px;");

console.log("%cDeveloped using HTML, CSS & JavaScript","color:blue;font-size:14px;");