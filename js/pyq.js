/*==========================================================
                    PYQ MODULE
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

    console.log("PYQ Module Loaded");

    initializeSearch();

    initializeFilters();

    revealSections();

    updateGreeting();

    // Fetch and load dynamic PYQs from Supabase
    fetchPYQs();

});

/*==========================================================
                DYNAMIC HERO GREETING
==========================================================*/

function updateGreeting(){

    const heading = document.querySelector(".hero-content h3");

    if(!heading) return;

    const hour = new Date().getHours();

    if(hour < 12){

        heading.textContent =
        "🌅 Good Morning! Practice Previous Year Questions.";

    }

    else if(hour < 17){

        heading.textContent =
        "☀️ Keep Solving PYQs. Every Question Builds Confidence.";

    }

    else{

        heading.textContent =
        "🌙 Revise Today's PYQs Before You End Your Study Session.";

    }

}

/*==========================================================
             SUPABASE PYQS DATA LOADING
==========================================================*/

let allPYQs = [];

async function fetchPYQs() {
    if (!window.supabaseClient) {
        setupDownloadHandlers();
        return;
    }

    try {
        const { data, error } = await window.supabaseClient
            .from("pyqs")
            .select("*")
            .order("year", { ascending: false });

        if (error) {
            console.error("Error fetching PYQs from Supabase:", error);
            setupDownloadHandlers();
            return;
        }

        if (data && data.length > 0) {
            allPYQs = data;
            renderPYQs();
        } else {
            console.log("No custom PYQs found in Supabase. Using default static placeholders.");
            setupDownloadHandlers();
        }
    } catch (err) {
        console.error("Failed to query pyqs table:", err);
        setupDownloadHandlers();
    }
}

function renderPYQs() {
    const latestBody = document.getElementById("latest-papers-body");
    const prelimsBody = document.getElementById("prelims-papers-body");
    const mainsBody = document.getElementById("mains-papers-body");

    if (latestBody) latestBody.innerHTML = "";
    if (prelimsBody) prelimsBody.innerHTML = "";
    if (mainsBody) mainsBody.innerHTML = "";

    // Render Latest Papers (newest 5 papers)
    const latestPapers = [...allPYQs].slice(0, 5);
    latestPapers.forEach(paper => {
        const tr = document.createElement("tr");
        tr.dataset.category = paper.paper_type;
        tr.innerHTML = `
            <td>${paper.year}</td>
            <td>${paper.paper_type}</td>
            <td>${paper.subject}</td>
            <td>
                <button class="download-btn" data-id="${paper.id}" data-url="${paper.file_url}" data-type="pyq">
                    Download
                </button>
            </td>
        `;
        if (latestBody) latestBody.appendChild(tr);
    });

    // Render Prelims Papers
    const prelimsPapers = allPYQs.filter(p => 
        p.paper_type.toLowerCase().includes("prelims") || 
        p.paper_type.toLowerCase().includes("csat")
    );
    prelimsPapers.forEach(paper => {
        const tr = document.createElement("tr");
        tr.dataset.category = paper.paper_type;
        tr.innerHTML = `
            <td>${paper.year}</td>
            <td>${paper.subject}</td>
            <td>100</td>
            <td>
                <button class="download-btn" data-id="${paper.id}" data-url="${paper.file_url}" data-type="pyq">
                    View PDF
                </button>
            </td>
        `;
        if (prelimsBody) prelimsBody.appendChild(tr);
    });

    // Render Mains Papers
    const mainsPapers = allPYQs.filter(p => 
        p.paper_type.toLowerCase().includes("mains") || 
        p.paper_type.toLowerCase().includes("essay") || 
        p.paper_type.toLowerCase().includes("ethics")
    );
    mainsPapers.forEach(paper => {
        const tr = document.createElement("tr");
        tr.dataset.category = paper.paper_type;
        tr.innerHTML = `
            <td>${paper.year}</td>
            <td>${paper.subject}</td>
            <td>250</td>
            <td>
                <button class="download-btn" data-id="${paper.id}" data-url="${paper.file_url}" data-type="pyq">
                    Download
                </button>
            </td>
        `;
        if (mainsBody) mainsBody.appendChild(tr);
    });

    setupDownloadHandlers();
}

/*==========================================================
                    LIVE SEARCH
==========================================================*/

function initializeSearch(){

    const input = document.getElementById("searchInput");

    if(!input) return;

    input.addEventListener("keyup", function(){

        const keyword = this.value.toLowerCase();

        const rows = document.querySelectorAll("tbody tr");

        rows.forEach(row => {

            const text = row.innerText.toLowerCase();

            if(text.includes(keyword)){

                row.style.display = "";

            }

            else{

                row.style.display = "none";

            }

        });

    });

}

/*==========================================================
                FILTER BUTTONS
==========================================================*/

function initializeFilters(){

    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            const filterValue = button.innerText.trim().toLowerCase();
            const rows = document.querySelectorAll("tbody tr");

            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                const category = row.dataset.category ? row.dataset.category.toLowerCase() : "";

                if (filterValue === "all") {
                    row.style.display = "";
                } else if (category.includes(filterValue) || text.includes(filterValue)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });

        });

    });

}

/*==========================================================
                SCROLL REVEAL ANIMATION
==========================================================*/

function revealSections(){

    const sections = document.querySelectorAll(

        ".content-section,.statistics-section,.action-section"

    );

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.style.opacity = "1";

                entry.target.style.transform = "translateY(0)";

            }

        });

    },{

        threshold:0.2

    });

    sections.forEach(section => {

        section.style.opacity = "0";

        section.style.transform = "translateY(50px)";

        section.style.transition = ".8s";

        observer.observe(section);

    });

}

/*==========================================================
                ANIMATED STATISTICS COUNTERS
==========================================================*/

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            const counter = entry.target;

            const target = Number(counter.dataset.target);

            let current = 0;

            const increment = Math.ceil(target / 100);

            function updateCounter(){

                current += increment;

                if(current >= target){

                    counter.innerText = target.toLocaleString() + "+";

                }

                else{

                    counter.innerText = current.toLocaleString();

                    requestAnimationFrame(updateCounter);

                }

            }

            updateCounter();

            counterObserver.unobserve(counter);

        }

    });

},{
    threshold:0.5
});

counters.forEach(counter=>{

    counterObserver.observe(counter);

});

/*==========================================================
                DOWNLOAD BUTTONS
==========================================================*/

async function setupDownloadHandlers() {
    const downloadButtons = document.querySelectorAll(".download-btn");

    downloadButtons.forEach(button => {
        // Clone and replace to prevent multiple listeners
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);

        newBtn.addEventListener("click", async function(e) {
            e.stopPropagation();

            const resourceId = this.dataset.id;
            const resourceUrl = this.dataset.url;
            const resourceType = this.dataset.type || "pyq";
            const row = this.closest("tr");
            
            let paper = "Question Paper";
            if (row) {
                const cells = row.querySelectorAll("td");
                if (cells.length >= 3) {
                    paper = `${cells[0].innerText} - ${cells[2].innerText}`;
                }
            }

            if (resourceUrl && resourceUrl !== "undefined" && resourceUrl !== "#") {
                // Log download dynamically
                try {
                    const { data: { session } } = await window.supabaseClient.auth.getSession();
                    if (session && resourceId) {
                        const { error } = await window.supabaseClient.from("download_history").insert({
                            user_id: session.user.id,
                            resource_id: resourceId,
                            resource_type: resourceType
                        });
                        if (error) throw error;
                        console.log(`Log saved in download_history for ${resourceId}`);
                    }
                } catch (err) {
                    console.error("Error logging download:", err);
                }

                // Open URL in new window/tab
                window.open(resourceUrl, "_blank");
            } else {
                alert(
                    paper +
                    "\n\nPDF download will be available when the document file is uploaded by an administrator."
                );
            }
        });
    });
}

/*==========================================================
                TREND BAR ANIMATION
==========================================================*/

const progressBars = document.querySelectorAll(".progress");

const progressObserver = new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            const bar = entry.target;

            const finalWidth = bar.style.width || window.getComputedStyle(bar).width;

            const widthClass = bar.classList.contains("polity") ? "90%" :
                               bar.classList.contains("environment") ? "85%" :
                               bar.classList.contains("economy") ? "80%" :
                               bar.classList.contains("history") ? "75%" :
                               bar.classList.contains("geography") ? "78%" : "70%";

            bar.style.width = "0";

            setTimeout(()=>{

                bar.style.transition = "width 1.5s ease";

                bar.style.width = widthClass;

            },100);

            progressObserver.unobserve(bar);

        }

    });

},{
    threshold:0.5
});

progressBars.forEach(bar=>{

    progressObserver.observe(bar);

});

/*==========================================================
                READING PROGRESS BAR
==========================================================*/

const readingBar = document.createElement("div");

readingBar.id = "readingProgress";

readingBar.style.cssText = `
position:fixed;
top:0;
left:0;
width:0%;
height:5px;
background:#F59E0B;
z-index:9999;
transition:width .2s;
`;

document.body.prepend(readingBar);

window.addEventListener("scroll",()=>{

    const scrollTop = window.pageYOffset;

    const height = document.documentElement.scrollHeight - window.innerHeight;

    const progress = (scrollTop / height) * 100;

    readingBar.style.width = progress + "%";

});

/*==========================================================
                BACK TO TOP BUTTON
==========================================================*/

const topButton = document.createElement("button");

topButton.innerHTML = "↑";

topButton.id = "backToTop";

topButton.style.cssText = `
position:fixed;
bottom:25px;
right:25px;
width:55px;
height:55px;
border:none;
border-radius:50%;
background:#7F1D1D;
color:white;
font-size:24px;
cursor:pointer;
display:none;
box-shadow:0 8px 20px rgba(0,0,0,.25);
transition:.3s;
z-index:999;
`;

document.body.appendChild(topButton);

window.addEventListener("scroll",()=>{

    if(window.scrollY > 300){

        topButton.style.display = "block";

    }

    else{

        topButton.style.display = "none";

    }

});

topButton.addEventListener("mouseenter",()=>{

    topButton.style.transform = "scale(1.1)";

});

topButton.addEventListener("mouseleave",()=>{

    topButton.style.transform = "scale(1)";

});

topButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/*==========================================================
                WELCOME TOAST MESSAGE
==========================================================*/

window.addEventListener("load", () => {

    const toast = document.createElement("div");

    toast.className = "welcome-toast";

    toast.innerHTML = `
        <i class="fas fa-file-alt"></i>
        Welcome to the UPSC Previous Year Questions Portal
    `;

    toast.style.cssText = `
        position:fixed;
        top:90px;
        right:20px;
        background:#7F1D1D;
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

".btn-primary,.btn-secondary,.btn-outline,.download-btn,.filter-btn"

);

buttons.forEach(button=>{

    button.addEventListener("click",function(e){

        const ripple = document.createElement("span");

        ripple.classList.add("ripple");

        const rect = this.getBoundingClientRect();

        ripple.style.left =

        (e.clientX - rect.left) + "px";

        ripple.style.top =

        (e.clientY - rect.top) + "px";

        this.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});

/*==========================================================
                DAILY PYQ TIPS
==========================================================*/

const pyqTips=[

"Practice the latest PYQs before moving to older papers.",

"Always analyze why each option is correct or incorrect.",

"Revise the concepts related to every incorrect answer.",

"Track frequently repeated topics every week.",

"Attempt papers within the actual UPSC time limit.",

"Maintain a notebook for repeated mistakes.",

"Don't memorize answers—understand the concepts.",

"Review your performance after every mock test.",

"Practice both Prelims and Mains PYQs regularly.",

"Consistency in solving PYQs improves accuracy."

];

function rotateTips(){

    const section=document.querySelector(".strategy-list");

    if(!section) return;

    const tip=document.createElement("p");

    tip.style.marginTop="25px";
    tip.style.fontWeight="600";
    tip.style.color="#B91C1C";
    tip.style.fontSize="18px";

    section.after(tip);

    let index=0;

    tip.textContent="💡 Tip : "+pyqTips[index];

    setInterval(()=>{

        index=(index+1)%pyqTips.length;

        tip.style.opacity="0";

        setTimeout(()=>{

            tip.textContent="💡 Tip : "+pyqTips[index];

            tip.style.opacity="1";

        },300);

    },6000);

}

rotateTips();

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

    const totalHeight=

    document.documentElement.scrollHeight-

    window.innerHeight;

    const percentage=Math.round(

    (window.scrollY/totalHeight)*100

    );

    document.title=

    `PYQ Module (${percentage}% Read)`;

});

/*==========================================================
                CONSOLE BRANDING
==========================================================*/

console.clear();

console.log(

"%cUPSC CLOUD PROJECT",

"color:#7F1D1D;font-size:28px;font-weight:bold;"

);

console.log(

"%cPrevious Year Questions Module",

"color:#B91C1C;font-size:18px;font-weight:bold;"

);

console.log(

"%cHTML • CSS • JavaScript",

"color:#F59E0B;font-size:15px;"

);

console.log(

"%cReady for Supabase Backend Integration",

"color:#EA580C;font-size:15px;font-weight:bold;"

);

/*==========================================================
                PAGE VISIT TIMER
==========================================================*/

let pageSeconds=0;

setInterval(()=>{

    pageSeconds++;

    console.log(

        "Time Spent on PYQ Page :",

        pageSeconds,

        "seconds"

    );

},1000);

/*==========================================================
                EXIT MESSAGE
==========================================================*/

window.addEventListener("beforeunload",()=>{

    console.log(

        "Keep Practicing! Every PYQ brings you one step closer to UPSC success."

    );

});

/*==========================================================
                END OF PYQ.JS
==========================================================*/