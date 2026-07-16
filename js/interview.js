/*==========================================================
                UPSC CLOUD PROJECT
                  INTERVIEW.JS
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

    console.log("UPSC Interview Module Loaded");

    updateGreeting();

    smoothScrolling();

    initializeAccordion();

    revealSections();

});

/*==========================================================
                DYNAMIC GREETING
==========================================================*/

function updateGreeting(){

    const heading = document.querySelector(".hero-content h3");

    if(!heading) return;

    const hour = new Date().getHours();

    let greeting = "";

    if(hour < 12){

        greeting = "🌅 Good Morning! Build confidence before the Interview.";

    }

    else if(hour < 17){

        greeting = "☀️ Stay calm. Confidence comes from preparation.";

    }

    else{

        greeting = "🌙 Revise your DAF and current affairs before ending today's preparation.";

    }

    heading.innerHTML = greeting;

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
                FAQ ACCORDION
==========================================================*/

function initializeAccordion(){

    const accordionButtons = document.querySelectorAll(".accordion-btn");

    accordionButtons.forEach(button=>{

        button.addEventListener("click",()=>{

            const content = button.nextElementSibling;

            const symbol = button.querySelector("span");

            if(content.style.maxHeight){

                content.style.maxHeight = null;

                symbol.textContent = "+";

            }

            else{

                document.querySelectorAll(".accordion-content").forEach(item=>{

                    item.style.maxHeight = null;

                });

                document.querySelectorAll(".accordion-btn span").forEach(icon=>{

                    icon.textContent = "+";

                });

                content.style.maxHeight = content.scrollHeight + "px";

                symbol.textContent = "−";

            }

        });

    });

}

/*==========================================================
                SECTION REVEAL
==========================================================*/

function revealSections(){

    const sections = document.querySelectorAll(

        ".content-section,.motivation-section,.action-section"

    );

    const observer = new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.style.opacity="1";

                entry.target.style.transform="translateY(0px)";

            }

        });

    },{

        threshold:0.20

    });

    sections.forEach(section=>{

        section.style.opacity="0";

        section.style.transform="translateY(60px)";

        section.style.transition=".8s ease";

        observer.observe(section);

    });

}

/*==========================================================
            PRACTICE QUESTION GENERATOR
==========================================================*/

const interviewQuestions = [

    "Tell us about yourself.",

    "Why do you want to join the Civil Services?",

    "Why should we select you?",

    "Tell us about your hometown.",

    "Explain your optional subject in simple words.",

    "What are your strengths?",

    "What is your biggest weakness and how are you improving it?",

    "Describe a difficult decision you have taken in life.",

    "Who is your role model and why?",

    "How would you handle corruption as a District Collector?",

    "What administrative reforms would you introduce?",

    "Tell us about your hobbies.",

    "How do you manage stress?",

    "What is one major issue facing India today?",

    "How can technology improve governance?",

    "If you were the Chief Secretary of your state, what would be your first priority?",

    "Why did you choose your graduation subject?",

    "What motivates you every day?",

    "How will you balance development and environmental protection?",

    "What does ethical leadership mean to you?"

];

const questionButton = document.getElementById("generateQuestion");

const questionBox = document.getElementById("questionBox");

if(questionButton){

    questionButton.addEventListener("click",()=>{

        const randomIndex = Math.floor(

            Math.random()*interviewQuestions.length

        );

        questionBox.style.opacity="0";

        setTimeout(()=>{

            questionBox.innerHTML=

            interviewQuestions[randomIndex];

            questionBox.style.opacity="1";

        },250);

    });

}

/*==========================================================
                READING PROGRESS BAR
==========================================================*/

const progressBar=document.createElement("div");

progressBar.id="readingProgress";

document.body.prepend(progressBar);

progressBar.style.cssText=`

position:fixed;
top:0;
left:0;
height:5px;
width:0%;
background:#10B981;
z-index:9999;
transition:width .2s;

`;

window.addEventListener("scroll",()=>{

    const totalHeight=

    document.documentElement.scrollHeight-

    window.innerHeight;

    const progress=

    (window.pageYOffset/totalHeight)*100;

    progressBar.style.width=progress+"%";

});

/*==========================================================
                BACK TO TOP BUTTON
==========================================================*/

const backButton=document.createElement("button");

backButton.innerHTML="↑";

backButton.id="backToTop";

document.body.appendChild(backButton);

backButton.style.cssText=`

position:fixed;
bottom:25px;
right:25px;
width:55px;
height:55px;
border:none;
border-radius:50%;
background:#047857;
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

    }

    else{

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

    const words=document.body.innerText

        .trim()

        .split(/\s+/).length;

    const readingTime=Math.ceil(words/200);

    console.log(

        "Estimated Reading Time :",

        readingTime,

        "minutes"

    );

});

/*==========================================================
                DAILY INTERVIEW TIPS
==========================================================*/

const interviewTips=[

"Always answer honestly.",

"Confidence is more important than perfect answers.",

"Maintain eye contact while speaking.",

"Read newspapers every day.",

"Revise your DAF regularly.",

"Listen carefully before answering.",

"Stay calm even if you don't know the answer.",

"Support your opinions with logical reasoning.",

"Never argue with the Interview Board.",

"Keep your answers simple and structured."

];

function rotateInterviewTips(){

    const quote=document.querySelector(

        ".motivation-section blockquote"

    );

    if(!quote) return;

    let index=0;

    setInterval(()=>{

        index++;

        if(index>=interviewTips.length){

            index=0;

        }

        quote.style.opacity="0";

        setTimeout(()=>{

            quote.innerHTML=interviewTips[index];

            quote.style.opacity="1";

        },300);

    },6000);

}

rotateInterviewTips();

/*==========================================================
                WELCOME TOAST MESSAGE
==========================================================*/

window.addEventListener("load", () => {

    const toast = document.createElement("div");

    toast.className = "welcome-toast";

    toast.innerHTML = `
        <i class="fas fa-user-tie"></i>
        Welcome to the UPSC Personality Test Module
    `;

    toast.style.cssText = `
        position:fixed;
        top:90px;
        right:20px;
        background:#065F46;
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
                TIMELINE ANIMATION
==========================================================*/

const timelineItems=document.querySelectorAll(".timeline-item");

timelineItems.forEach((item,index)=>{

    item.style.opacity="0";

    item.style.transform="translateX(-40px)";

    item.style.transition=".6s";

    setTimeout(()=>{

        item.style.opacity="1";

        item.style.transform="translateX(0)";

    },index*250);

});


/*==========================================================
            HIGHLIGHT BOX ANIMATION
==========================================================*/

const highlightBoxes=document.querySelectorAll(".highlight-box");

const highlightObserver=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.transform="scale(1.02)";

            entry.target.style.transition=".5s";

        }

    });

},{
    threshold:0.4
});

highlightBoxes.forEach(box=>{

    highlightObserver.observe(box);

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
            PAGE READING PERCENTAGE
==========================================================*/

window.addEventListener("scroll",()=>{

    const total=

    document.documentElement.scrollHeight-

    window.innerHeight;

    const percentage=Math.round(

        (window.scrollY/total)*100

    );

    document.title=

    `UPSC Interview (${percentage}% Read)`;

});


/*==========================================================
                CONSOLE BRANDING
==========================================================*/

console.clear();

console.log(

"%cUPSC CLOUD PROJECT",

"color:#047857;font-size:28px;font-weight:bold;"

);

console.log(

"%cUPSC Civil Services Examination Portal",

"color:#065F46;font-size:18px;"

);

console.log(

"%cModule Loaded : INTERVIEW",

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


/*==========================================================
                PAGE VISIT TIMER
==========================================================*/

let seconds = 0;

setInterval(()=>{

    seconds++;

    console.log(

        "Time spent on Interview Page :",

        seconds,

        "seconds"

    );

},1000);


/*==========================================================
                GOOD LUCK MESSAGE
==========================================================*/

window.addEventListener("beforeunload",()=>{

    console.log(

        "Best Wishes for your UPSC Interview Preparation!"

    );

});


/*==========================================================
                END OF INTERVIEW.JS
==========================================================*/