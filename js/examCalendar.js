/*==========================================================
                SESSION GUARD & ROUTING
==========================================================*/
(async function() {
    if (window.supabaseClient) {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            window.location.href = "login.html";
        }
    }
})();

/*==========================================================
                LIVE COUNTDOWN TIMER
==========================================================*/

// Set the target exam date
const examDate = new Date("June 14, 2026 09:30:00").getTime();

const countdownElement = document.getElementById("countdown");

function updateCountdown(){

    const now = new Date().getTime();

    const distance = examDate - now;

    if(distance <= 0){

        countdownElement.innerHTML = "🎉 Examination Day Has Arrived!";

        clearInterval(timer);

        return;

    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60))
        / 1000
    );

    countdownElement.innerHTML =
        `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;

}

updateCountdown();

const timer = setInterval(updateCountdown,1000);

/*==========================================================
                CURRENT DATE
==========================================================*/

const today = new Date();

const formattedDate = today.toLocaleDateString("en-IN",{

    weekday:"long",

    day:"numeric",

    month:"long",

    year:"numeric"

});

const dateBox = document.createElement("div");

dateBox.className = "current-date";

dateBox.innerHTML = `
    <i class="fas fa-calendar-day"></i>
    Today : ${formattedDate}
`;

dateBox.style.cssText = `
    background:#DBEAFE;
    color:#1E3A8A;
    padding:12px 20px;
    border-radius:12px;
    width:fit-content;
    margin:30px auto;
    font-weight:600;
`;

const countdownSection = document.querySelector(".countdown-section");

countdownSection.insertBefore(dateBox,countdownSection.children[1]);

/*==========================================================
            SMOOTH SCROLL FOR BUTTONS
==========================================================*/

document.querySelectorAll('a[href^="#"]').forEach(link=>{

    link.addEventListener("click",function(e){

        e.preventDefault();

        const target=document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth",

                block:"start"

            });

        }

    });

});

/*==========================================================
            ACTIVE NAVIGATION LINK
==========================================================*/

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll",()=>{

    let current = "";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 120;

        if(window.scrollY >= sectionTop){

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(
            current &&
            link.getAttribute("href").includes(current)
        ){

            link.classList.add("active");

        }

    });

});

/*==========================================================
            SCROLL REVEAL ANIMATION
==========================================================*/

const revealItems = document.querySelectorAll(

".overview-box,.timeline-item,.date-card,.process-step,.check-item,.faq-item"

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

revealItems.forEach(item=>{

    item.style.opacity="0";

    item.style.transform="translateY(50px)";

    item.style.transition=".8s";

    revealObserver.observe(item);

});

/*==========================================================
                READING PROGRESS BAR
==========================================================*/

const progressBar = document.createElement("div");

progressBar.style.cssText = `
position:fixed;
top:0;
left:0;
width:0%;
height:5px;
background:linear-gradient(90deg,#F59E0B,#4338CA);
z-index:9999;
transition:.2s;
`;

document.body.appendChild(progressBar);

window.addEventListener("scroll",()=>{

    const scrollTop = document.documentElement.scrollTop;

    const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

    const progress =
    (scrollTop / scrollHeight) * 100;

    progressBar.style.width = progress + "%";

});

/*==========================================================
                BACK TO TOP BUTTON
==========================================================*/

const topButton = document.createElement("button");

topButton.innerHTML = `
<i class="fas fa-arrow-up"></i>
`;

topButton.style.cssText = `
position:fixed;
right:30px;
bottom:30px;
width:55px;
height:55px;
border:none;
border-radius:50%;
background:#4338CA;
color:white;
font-size:20px;
cursor:pointer;
display:none;
box-shadow:0 10px 25px rgba(0,0,0,.25);
transition:.3s;
z-index:999;
`;

document.body.appendChild(topButton);

window.addEventListener("scroll",()=>{

    if(window.scrollY > 400){

        topButton.style.display = "block";

    }

    else{

        topButton.style.display = "none";

    }

});

topButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/*==========================================================
                WELCOME TOAST
==========================================================*/

window.addEventListener("load",()=>{

    const toast = document.createElement("div");

    toast.innerHTML = `
        📅 Welcome to the UPSC Exam Calendar
    `;

    toast.style.cssText = `
        position:fixed;
        top:90px;
        right:20px;
        background:#4338CA;
        color:white;
        padding:16px 24px;
        border-radius:12px;
        box-shadow:0 10px 25px rgba(0,0,0,.25);
        font-weight:600;
        z-index:9999;
    `;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.style.opacity="0";

        toast.style.transition=".5s";

        setTimeout(()=>{

            toast.remove();

        },500);

    },3500);

});

/*==========================================================
            DOWNLOAD BUTTON INTERACTION
==========================================================*/

const downloadButtons =

document.querySelectorAll(".download-buttons button");

downloadButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        alert(

            "This feature will be available after backend integration."

        );

    });

});

/*==========================================================
            REMINDER PREFERENCES
==========================================================*/

const reminderBoxes =

document.querySelectorAll(

'.reminder-options input[type="checkbox"]'

);

reminderBoxes.forEach(box=>{

    box.addEventListener("change",()=>{

        if(box.checked){

            console.log(

                box.parentElement.textContent.trim(),

                "Enabled"

            );

        }

        else{

            console.log(

                box.parentElement.textContent.trim(),

                "Disabled"

            );

        }

    });

});

/*==========================================================
            DYNAMIC GREETING
==========================================================*/

function updateGreeting(){

    const heroHeading = document.querySelector(".hero-content h1");

    if(!heroHeading) return;

    const hour = new Date().getHours();

    if(hour < 12){

        heroHeading.innerHTML =
        "🌅 Good Morning! Plan Your UPSC Journey";

    }

    else if(hour < 17){

        heroHeading.innerHTML =
        "☀️ Stay Consistent With Your Preparation";

    }

    else{

        heroHeading.innerHTML =
        "🌙 Finish Today's Targets Before Tomorrow";

    }

}

updateGreeting();

/*==========================================================
                DAILY MOTIVATION QUOTES
==========================================================*/

const quotes=[

"Success in UPSC is built one disciplined day at a time.",

"Consistency always beats last-minute preparation.",

"Every revision today reduces tomorrow's stress.",

"Small daily improvements create extraordinary results.",

"Dream, Prepare, Persevere and Achieve.",

"Don't count the hours, make the hours count.",

"The syllabus looks smaller after every revision.",

"Your dedication today creates tomorrow's success."

];

const quoteBox=document.createElement("div");

quoteBox.style.cssText=`
width:90%;
max-width:900px;
margin:40px auto;
padding:20px;
background:white;
border-left:6px solid #F59E0B;
border-radius:12px;
font-size:18px;
font-weight:600;
color:#4338CA;
box-shadow:0 10px 20px rgba(0,0,0,.08);
text-align:center;
`;

document.querySelector(".overview-section").before(quoteBox);

let quoteIndex=0;

quoteBox.innerHTML="💡 "+quotes[0];

setInterval(()=>{

    quoteIndex=(quoteIndex+1)%quotes.length;

    quoteBox.style.opacity="0";

    setTimeout(()=>{

        quoteBox.innerHTML="💡 "+quotes[quoteIndex];

        quoteBox.style.opacity="1";

    },300);

},6000);

/*==========================================================
                BUTTON RIPPLE EFFECT
==========================================================*/

document.querySelectorAll(
".btn-primary,.btn-secondary,.download-buttons button"
).forEach(button=>{

    button.style.position="relative";
    button.style.overflow="hidden";

    button.addEventListener("click",function(e){

        const ripple=document.createElement("span");

        ripple.style.position="absolute";
        ripple.style.width="15px";
        ripple.style.height="15px";
        ripple.style.background="rgba(255,255,255,.6)";
        ripple.style.borderRadius="50%";
        ripple.style.left=(e.offsetX-7)+"px";
        ripple.style.top=(e.offsetY-7)+"px";
        ripple.style.transform="scale(0)";
        ripple.style.transition=".6s";

        this.appendChild(ripple);

        requestAnimationFrame(()=>{

            ripple.style.transform="scale(20)";
            ripple.style.opacity="0";

        });

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

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
        PAGE READING PERCENTAGE IN TITLE
==========================================================*/

window.addEventListener("scroll",()=>{

    const total=

    document.documentElement.scrollHeight-

    window.innerHeight;

    const percent=Math.round(

    (window.scrollY/total)*100

    );

    document.title=

    `Exam Calendar (${percent}% Read)`;

});

/*==========================================================
                CONSOLE BRANDING
==========================================================*/

console.clear();

console.log(

"%cUPSC CLOUD PROJECT",

"color:#4338CA;font-size:28px;font-weight:bold;"

);

console.log(

"%cExam Calendar Module",

"color:#3B82F6;font-size:18px;font-weight:bold;"

);

console.log(

"%cFrontend Ready for Supabase Integration",

"color:#F59E0B;font-size:15px;font-weight:bold;"

);

/*==========================================================
                PAGE VISIT TIMER
==========================================================*/

let seconds=0;

setInterval(()=>{

    seconds++;

    console.log(

        "Time Spent on Exam Calendar :",

        seconds,

        "seconds"

    );

},1000);

/*==========================================================
                EXIT MESSAGE
==========================================================*/

window.addEventListener("beforeunload",()=>{

    console.log(

        "Thank you for using UPSC Cloud. Keep preparing consistently!"

    );

});

/*==========================================================
            END OF EXAM CALENDAR JS
==========================================================*/