/*==========================================================
            UPSC CLOUD PROJECT
                DASHBOARD.JS
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

    console.log("Dashboard Loaded Successfully");

    updateGreeting();

    animateProgressBars();

    initializeStudyPlanner();

    initializeSearch();

    await loadUserProfile();

});


/*==========================================================
                GREETING MESSAGE
==========================================================*/

function updateGreeting() {

    const heading = document.querySelector(".welcome-text h1");

    if (!heading) return;

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) {

        greeting = "🌅 Good Morning, Aspirant";

    }

    else if (hour < 17) {

        greeting = "☀️ Good Afternoon, Aspirant";

    }

    else {

        greeting = "🌙 Good Evening, Aspirant";

    }

    heading.textContent = greeting;

}


/*==========================================================
                ANIMATE PROGRESS BAR
==========================================================*/

function animateProgressBars() {

    const bars = document.querySelectorAll(".progress-fill");

    bars.forEach(bar => {

        const finalWidth = bar.style.width;

        bar.style.width = "0";

        setTimeout(() => {

            bar.style.width = finalWidth;

        }, 400);

    });

}


/*==========================================================
                SEARCH FUNCTION
==========================================================*/

function initializeSearch() {

    const searchInput = document.querySelector(".search-box input");

    if (!searchInput) return;

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const cards = document.querySelectorAll(".dashboard-card");

        cards.forEach(card => {

            const text = card.innerText.toLowerCase();

            if (text.includes(value)) {

                card.style.display = "block";

            }

            else {

                card.style.display = "none";

            }

        });

    });

}


/*==========================================================
            STUDY PLANNER (LOCAL STORAGE)
==========================================================*/

function initializeStudyPlanner() {

    const checkboxes = document.querySelectorAll(".planner-box input[type='checkbox']");

    checkboxes.forEach((checkbox, index) => {

        const saved = localStorage.getItem("planner_" + index);

        if (saved === "true") {

            checkbox.checked = true;

        }

        checkbox.addEventListener("change", () => {

            localStorage.setItem(

                "planner_" + index,

                checkbox.checked

            );

        });

    });

}

/*==========================================================
                LIVE COUNTDOWN
==========================================================*/

function updateCountdown() {

    const countdownElement = document.getElementById("countdownDays");

    if (!countdownElement) return;

    // Set UPSC Prelims Date (Change when official date is announced)
    const examDate = new Date("May 24, 2026 09:30:00").getTime();

    function calculateDays() {

        const now = new Date().getTime();

        const difference = examDate - now;

        if (difference <= 0) {

            countdownElement.innerHTML = "Exam Day 🎉";

            return;

        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));

        countdownElement.innerHTML = days + " Days";

    }

    calculateDays();

    setInterval(calculateDays, 1000 * 60 * 60);

}

updateCountdown();


/*==========================================================
            NOTIFICATION ICON ANIMATION
==========================================================*/

const notificationIcon = document.querySelector(".fa-bell");

if(notificationIcon){

    setInterval(() => {

        notificationIcon.classList.add("fa-shake");

        setTimeout(() => {

            notificationIcon.classList.remove("fa-shake");

        },1000);

    },8000);

}


/*==========================================================
            CONTINUE LEARNING BUTTON
==========================================================*/

const continueButton = document.querySelector(".welcome-text button");

if(continueButton){

    continueButton.addEventListener("click",()=>{

        window.location.href="prelims.html";

    });

}


/*==========================================================
                STATISTICS COUNTER
==========================================================*/

const statNumbers = document.querySelectorAll(".stat-card h3");

statNumbers.forEach((counter)=>{

    const target = parseInt(counter.innerText);

    let count = 0;

    const increment = Math.ceil(target/60);

    const updateCounter = ()=>{

        if(count < target){

            count += increment;

            counter.innerText = count;

            requestAnimationFrame(updateCounter);

        }

        else{

            counter.innerText = target;

        }

    };

    updateCounter();

});


/*==========================================================
                HOVER EFFECT
==========================================================*/

const dashboardCards = document.querySelectorAll(".dashboard-card");

dashboardCards.forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-12px) scale(1.03)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0px) scale(1)";

    });

});


/*==========================================================
                QUICK LINKS EFFECT
==========================================================*/

const quickLinks = document.querySelectorAll(".links-grid a");

quickLinks.forEach(link=>{

    link.addEventListener("mouseenter",()=>{

        link.style.transition=".3s";

    });

});


/*==========================================================
            TABLE ROW HIGHLIGHT
==========================================================*/

const rows = document.querySelectorAll("table tr");

rows.forEach((row,index)=>{

    if(index!==0){

        row.addEventListener("mouseover",()=>{

            row.style.background="#FFF8EE";

        });

        row.addEventListener("mouseout",()=>{

            row.style.background="";

        });

    }

});


/*==========================================================
                UPDATE CURRENT YEAR
==========================================================*/

const copyright = document.querySelector(".copyright");

if(copyright){

    copyright.innerHTML =

    "© " +

    new Date().getFullYear() +

    " UPSC Cloud Portal | Designed for UPSC Aspirants | All Rights Reserved.";

}

/*==========================================================
                WELCOME NOTIFICATION
==========================================================*/

window.addEventListener("load", () => {

    setTimeout(() => {

        alert("🎉 Welcome to UPSC Cloud Dashboard!\n\nContinue your preparation and achieve your IAS dream.");

    }, 1000);

});


/*==========================================================
                USER PROFILE & DYNAMIC DISPLAY
==========================================================*/

let currentUserProfile = null;

async function loadUserProfile() {
    if (!window.supabaseClient) return;

    try {
        const { data: { user }, error: userError } = await window.supabaseClient.auth.getUser();
        if (userError || !user) {
            console.error("No logged-in auth user:", userError);
            return;
        }

        const { data, error } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error("Error loading user profile metadata:", error);
            return;
        }

        if (data) {
            currentUserProfile = data;
            updateUserDisplay();
        }
    } catch (e) {
        console.error("Exception loading user profile:", e);
    }
}

function updateUserDisplay() {
    if (!currentUserProfile) return;

    // Welcome Banner Greeting
    const welcomeTextHeading = document.querySelector(".welcome-text h1");
    if (welcomeTextHeading) {
        const hour = new Date().getHours();
        let greeting = "";
        if (hour < 12) greeting = "🌅 Good Morning";
        else if (hour < 17) greeting = "☀️ Good Afternoon";
        else greeting = "🌙 Good Evening";

        welcomeTextHeading.textContent = `${greeting}, ${currentUserProfile.full_name} 👋`;
    }

    // Update Date & Time with full name
    updateDateTime();

    // Render custom profile image if available
    const avatarUrl = currentUserProfile.avatar_url || "../assets/images/user.png";
    const topbarAvatar = document.getElementById("topbar-avatar");
    if (topbarAvatar) {
        topbarAvatar.src = avatarUrl;
    }
    const welcomeAvatar = document.getElementById("welcome-avatar");
    if (welcomeAvatar) {
        welcomeAvatar.src = avatarUrl;
    }

    // Check if user is an admin and show Admin Panel sidebar link
    if (currentUserProfile.is_admin) {
        const menuUl = document.querySelector("aside.sidebar ul.menu");
        if (menuUl && !document.getElementById("admin-sidebar-link")) {
            const li = document.createElement("li");
            li.id = "admin-sidebar-link";
            li.innerHTML = `
                <a href="admin-dashboard.html">
                    <i class="fas fa-lock"></i>
                    Admin Panel
                </a>
            `;
            // Insert before profile
            const profileLi = menuUl.querySelector("a[href='profile.html']")?.parentElement;
            if (profileLi) {
                menuUl.insertBefore(li, profileLi);
            } else {
                menuUl.appendChild(li);
            }
        }
    }
}

/*==========================================================
                LIVE DATE & TIME
==========================================================*/

function updateDateTime() {

    const profile = document.querySelector(".profile span");

    if (!profile) return;

    const now = new Date();

    const date = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const displayName = currentUserProfile ? currentUserProfile.full_name : "Aspirant";

    profile.innerHTML =
        "Welcome, " + displayName + " <br><small>" + date + " | " + time + "</small>";

}

updateDateTime();

setInterval(updateDateTime, 60000);


/*==========================================================
                DAILY MOTIVATIONAL QUOTES
==========================================================*/

const quotes = [

"Success doesn't come from what you do occasionally. It comes from what you do consistently.",

"Discipline is choosing between what you want now and what you want most.",

"Every topper was once a beginner.",

"Small progress every day adds up to big results.",

"Believe in yourself and all that you are.",

"Dream. Prepare. Achieve.",

"The future depends on what you do today.",

"Your hard work today becomes your success tomorrow."

];

const quoteText = document.querySelector(".quote-box p");

if (quoteText) {

    let quoteIndex = 0;

    setInterval(() => {

        quoteIndex++;

        if (quoteIndex >= quotes.length) {

            quoteIndex = 0;

        }

        quoteText.style.opacity = "0";

        setTimeout(() => {

            quoteText.innerHTML = quotes[quoteIndex];

            quoteText.style.opacity = "1";

        }, 500);

    }, 8000);

}


/*==========================================================
                BUTTON RIPPLE EFFECT
==========================================================*/

const buttons = document.querySelectorAll("button");

buttons.forEach(button => {

    button.addEventListener("click", function(e){

        const circle = document.createElement("span");

        const diameter = Math.max(this.clientWidth,this.clientHeight);

        circle.style.width = diameter + "px";

        circle.style.height = diameter + "px";

        circle.style.position = "absolute";

        circle.style.borderRadius = "50%";

        circle.style.background = "rgba(255,255,255,.4)";

        circle.style.transform = "scale(0)";

        circle.style.animation = "ripple .6s linear";

        circle.style.left = (e.offsetX - diameter/2) + "px";

        circle.style.top = (e.offsetY - diameter/2) + "px";

        this.appendChild(circle);

        setTimeout(()=>{

            circle.remove();

        },600);

    });

});


/*==========================================================
                FADE-IN ON SCROLL
==========================================================*/

const observer = new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";

            entry.target.style.transform="translateY(0)";

        }

    });

},{threshold:0.2});

document.querySelectorAll(

".dashboard-card,.progress-card,.planner-box,.stat-card,.updates-box,.quote-box"

).forEach(item=>{

    item.style.opacity="0";

    item.style.transform="translateY(40px)";

    item.style.transition=".8s";

    observer.observe(item);

});


/*==========================================================
                SAVE LAST VISITED PAGE
==========================================================*/

localStorage.setItem("lastVisited","Dashboard");


/*==========================================================
                LOGOUT CONFIRMATION
==========================================================*/

const logoutButton = document.querySelector(".logout a");

if(logoutButton){

    logoutButton.addEventListener("click", async (e)=>{

        e.preventDefault();

        const confirmation = confirm("Are you sure you want to logout?");

        if(confirmation){

            if (window.supabaseClient) {
                await window.supabaseClient.auth.signOut();
            }
            window.location.href = "login.html";

        }

    });

}


/*==========================================================
                CONSOLE MESSAGE
==========================================================*/

console.log("--------------------------------------");
console.log("UPSC CLOUD DASHBOARD READY");
console.log("Frontend Developed Successfully");
console.log("--------------------------------------");