/*==========================================================
                UPSC CLOUD PROJECT
                    MAINS.JS
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

    console.log("UPSC Mains Page Loaded Successfully");

    updateGreeting();

    smoothScrolling();

    animateSections();

    highlightNavigation();

});

/*==========================================================
                HERO GREETING
==========================================================*/

function updateGreeting(){

    const heroHeading = document.querySelector(".hero-content h3");

    if(!heroHeading) return;

    const hour = new Date().getHours();

    let greeting = "";

    if(hour < 12){

        greeting = "🌅 Good Morning! Master answer writing today.";

    }

    else if(hour < 17){

        greeting = "☀️ Stay focused. Every answer improves your rank.";

    }

    else{

        greeting = "🌙 Revise today's GS topics before ending your study session.";

    }

    heroHeading.innerHTML = greeting;

}

/*==========================================================
                SMOOTH SCROLLING
==========================================================*/

function smoothScrolling(){

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link=>{

        link.addEventListener("click",function(e){

            e.preventDefault();

            const target=document.querySelector(this.getAttribute("href"));

            if(target){

                target.scrollIntoView({

                    behavior:"smooth"

                });

            }

        });

    });

}

/*==========================================================
            SECTION REVEAL ANIMATION
==========================================================*/

function animateSections(){

    const sections=document.querySelectorAll(".content-section,.motivation-section,.action-section");

    const observer=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.style.opacity="1";

                entry.target.style.transform="translateY(0px)";

            }

        });

    },{

        threshold:0.2

    });

    sections.forEach(section=>{

        section.style.opacity="0";

        section.style.transform="translateY(60px)";

        section.style.transition=".8s ease";

        observer.observe(section);

    });

}

/*==========================================================
            ACTIVE NAVIGATION
==========================================================*/

function highlightNavigation(){

    const sections=document.querySelectorAll("section");

    const navLinks=document.querySelectorAll("nav a");

    window.addEventListener("scroll",()=>{

        let current="";

        sections.forEach(section=>{

            const sectionTop=section.offsetTop-150;

            const sectionHeight=section.clientHeight;

            if(window.scrollY>=sectionTop){

                current=section.getAttribute("id");

            }

        });

        navLinks.forEach(link=>{

            link.classList.remove("active");

            const href=link.getAttribute("href");

            if(current && href.includes(current)){

                link.classList.add("active");

            }

        });

    });

}

/*==========================================================
                READING PROGRESS BAR
==========================================================*/

const progressBar = document.createElement("div");

progressBar.id = "readingProgress";

document.body.prepend(progressBar);

progressBar.style.cssText = `
position:fixed;
top:0;
left:0;
width:0%;
height:5px;
background:#7C3AED;
z-index:9999;
transition:width .2s;
`;

window.addEventListener("scroll",()=>{

    const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress =
        (window.pageYOffset / totalHeight) * 100;

    progressBar.style.width = progress + "%";

});


/*==========================================================
                BACK TO TOP BUTTON
==========================================================*/

const backButton = document.createElement("button");

backButton.innerHTML = "↑";

backButton.id = "backToTop";

document.body.appendChild(backButton);

backButton.style.cssText = `
position:fixed;
bottom:25px;
right:25px;
width:55px;
height:55px;
border:none;
border-radius:50%;
background:#6D28D9;
color:white;
font-size:24px;
cursor:pointer;
display:none;
box-shadow:0 8px 20px rgba(0,0,0,.25);
transition:.3s;
z-index:999;
`;

window.addEventListener("scroll",()=>{

    if(window.scrollY>350){

        backButton.style.display="block";

    }else{

        backButton.style.display="none";

    }

});

backButton.addEventListener("mouseenter",()=>{

    backButton.style.transform="scale(1.1)";

});

backButton.addEventListener("mouseleave",()=>{

    backButton.style.transform="scale(1)";

});

backButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});


/*==========================================================
                READING TIME ESTIMATOR
==========================================================*/

window.addEventListener("load",()=>{

    const article = document.querySelector("body");

    const words = article.innerText.trim().split(/\s+/).length;

    const readingTime = Math.ceil(words / 200);

    console.log("Estimated Reading Time :", readingTime,"minutes");

});


/*==========================================================
            RANDOM UPSC MAINS TIPS
==========================================================*/

const mainsTips=[

"Practice answer writing every day.",

"Use headings and sub-headings in every answer.",

"Draw flowcharts wherever possible.",

"Revise your notes every weekend.",

"Read one newspaper consistently.",

"Practice previous year questions regularly.",

"Focus on quality instead of quantity.",

"Always conclude answers positively."

];

function showRandomTip(){

    const tipBox=document.querySelector(".motivation-section blockquote");

    if(!tipBox) return;

    let index=0;

    setInterval(()=>{

        index++;

        if(index>=mainsTips.length){

            index=0;

        }

        tipBox.style.opacity="0";

        setTimeout(()=>{

            tipBox.innerHTML=mainsTips[index];

            tipBox.style.opacity="1";

        },300);

    },5000);

}

showRandomTip();


/*==========================================================
                TABLE ROW HIGHLIGHT
==========================================================*/

const rows=document.querySelectorAll("tbody tr");

rows.forEach(row=>{

    row.addEventListener("mouseenter",()=>{

        row.style.background="#EDE9FE";

    });

    row.addEventListener("mouseleave",()=>{

        row.style.background="";

    });

});


/*==========================================================
                TIP BOX HOVER
==========================================================*/

const tips=document.querySelectorAll(".tip");

tips.forEach(tip=>{

    tip.addEventListener("mouseenter",()=>{

        tip.style.transform="translateY(-8px)";

    });

    tip.addEventListener("mouseleave",()=>{

        tip.style.transform="translateY(0px)";

    });

});

/*==========================================================
                WELCOME TOAST MESSAGE
==========================================================*/

window.addEventListener("load", () => {

    const toast = document.createElement("div");

    toast.className = "welcome-toast";

    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Welcome to the UPSC Mains Module
    `;

    toast.style.cssText = `
        position:fixed;
        top:90px;
        right:20px;
        background:#4C1D95;
        color:white;
        padding:15px 22px;
        border-radius:10px;
        box-shadow:0 8px 20px rgba(0,0,0,.25);
        font-weight:600;
        z-index:9999;
        animation:slideIn .5s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transition = ".5s";

        setTimeout(() => {

            toast.remove();

        },500);

    },3500);

});


/*==========================================================
                BUTTON RIPPLE EFFECT
==========================================================*/

const buttons = document.querySelectorAll(
".btn-primary,.btn-secondary,.btn-outline"
);

buttons.forEach(button=>{

    button.addEventListener("click",function(e){

        const ripple=document.createElement("span");

        ripple.classList.add("ripple");

        const rect=this.getBoundingClientRect();

        ripple.style.left=(e.clientX-rect.left)+"px";

        ripple.style.top=(e.clientY-rect.top)+"px";

        this.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});


/*==========================================================
            ROADMAP STEP ANIMATION
==========================================================*/

const roadmapSteps=document.querySelectorAll(".roadmap div");

roadmapSteps.forEach((step,index)=>{

    step.style.opacity="0";

    step.style.transform="translateY(25px)";

    step.style.transition=".6s";

    setTimeout(()=>{

        step.style.opacity="1";

        step.style.transform="translateY(0)";

    },index*250);

});


/*==========================================================
            HIGHLIGHT IMPORTANT BOXES
==========================================================*/

const infoBoxes=document.querySelectorAll(".info-box,.highlight-box");

const infoObserver=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.transform="scale(1.02)";

            entry.target.style.transition=".5s";

        }

    });

},{
    threshold:0.4
});

infoBoxes.forEach(box=>{

    infoObserver.observe(box);

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
                PAGE SCROLL PERCENTAGE
==========================================================*/

window.addEventListener("scroll",()=>{

    const total=document.documentElement.scrollHeight-window.innerHeight;

    const percent=Math.round((window.scrollY/total)*100);

    document.title=`UPSC Mains (${percent}% Read)`;

});


/*==========================================================
                CONSOLE BRANDING
==========================================================*/

console.clear();

console.log(
"%cUPSC CLOUD PROJECT",
"color:#6D28D9;font-size:28px;font-weight:bold;"
);

console.log(
"%cUPSC Civil Services Examination Portal",
"color:#4C1D95;font-size:18px;"
);

console.log(
"%cModule Loaded : MAINS",
"color:green;font-size:16px;font-weight:bold;"
);

console.log(
"%cFrontend Developed using HTML, CSS & JavaScript",
"color:#2563EB;font-size:14px;"
);

console.log(
"%cReady for Supabase Backend Integration",
"color:#EA580C;font-size:14px;font-weight:bold;"
);