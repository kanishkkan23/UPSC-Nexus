/*==========================================================
                UPSC CLOUD PROJECT
             STUDY MATERIALS.JS
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

    console.log("Study Materials Module Loaded");

    initializeSearch();

    initializeFilters();

    revealSections();

    updateGreeting();

    // Fetch and load dynamic study materials from Supabase
    fetchMaterials();

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
        "🌅 Good Morning! Build your knowledge today.";

    }

    else if(hour < 17){

        heading.textContent =
        "☀️ Keep learning. Every chapter brings you closer to success.";

    }

    else{

        heading.textContent =
        "🌙 Revise today's topics before ending your study session.";

    }

}

/*==========================================================
             SUPABASE STUDY MATERIALS LOADING
==========================================================*/

let allMaterials = [];

async function fetchMaterials() {
    if (!window.supabaseClient) {
        setupDownloadHandlers();
        return;
    }

    try {
        const { data, error } = await window.supabaseClient
            .from("study_materials")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching materials from Supabase:", error);
            setupDownloadHandlers();
            return;
        }

        if (data && data.length > 0) {
            allMaterials = data;
            renderMaterials();
        } else {
            console.log("No custom study materials found in Supabase. Using default static placeholders.");
            setupDownloadHandlers();
        }
    } catch (err) {
        console.error("Failed to query study_materials table:", err);
        setupDownloadHandlers();
    }
}

function renderMaterials() {
    const listBody = document.getElementById("materials-list-body");
    if (!listBody) return;

    listBody.innerHTML = "";

    allMaterials.forEach(material => {
        const tr = document.createElement("tr");
        tr.dataset.category = material.category;
        tr.innerHTML = `
            <td>${material.title}</td>
            <td>${material.category}</td>
            <td>
                <button class="download-btn" data-id="${material.id}" data-url="${material.file_url}" data-type="material">
                    Download
                </button>
            </td>
        `;
        listBody.appendChild(tr);
    });

    setupDownloadHandlers();
}

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
            const resourceType = this.dataset.type || "material";
            const row = this.closest("tr");
            
            let resourceName = "Study Material";
            if (row) {
                const cells = row.querySelectorAll("td");
                if (cells.length >= 1) {
                    resourceName = cells[0].innerText;
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
                    resourceName +
                    "\n\nPDF download will be available when the document file is uploaded by an administrator."
                );
            }
        });
    });
}

/*==========================================================
                    LIVE SEARCH
==========================================================*/

function initializeSearch(){

    const input = document.getElementById("searchInput");

    if(!input) return;

    input.addEventListener("keyup", function(){

        const keyword = this.value.toLowerCase();

        const tables = document.querySelectorAll("tbody tr");

        tables.forEach(row=>{

            const text = row.innerText.toLowerCase();

            if(text.includes(keyword)){

                row.style.display="table-row";

            }

            else{

                row.style.display="none";

            }

        });

    });

}

/*==========================================================
                CATEGORY FILTER BUTTONS
==========================================================*/

function initializeFilters(){

    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            buttons.forEach(btn=>{

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
                SECTION REVEAL
==========================================================*/

function revealSections(){

    const sections=document.querySelectorAll(

        ".content-section,.statistics-section,.motivation-section,.action-section"

    );

    const observer=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.style.opacity="1";

                entry.target.style.transform="translateY(0)";

            }

        });

    },{

        threshold:0.20

    });

    sections.forEach(section=>{

        section.style.opacity="0";

        section.style.transform="translateY(60px)";

        section.style.transition=".8s";

        observer.observe(section);

    });

}

/*==========================================================
                WELCOME TOAST MESSAGE
==========================================================*/

window.addEventListener("load", () => {

    const toast = document.createElement("div");

    toast.className = "welcome-toast";

    toast.innerHTML = `
        <i class="fas fa-book-open"></i>
        Welcome to the UPSC Study Materials Library
    `;

    toast.style.cssText = `
        position:fixed;
        top:90px;
        right:20px;
        background:#1E3A8A;
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

        }, 500);

    }, 3500);

});

/*==========================================================
                BUTTON RIPPLE EFFECT
==========================================================*/

const buttons = document.querySelectorAll(
".btn-primary,.btn-secondary,.btn-outline,.download-btn,.resource-btn"
);

buttons.forEach(button => {

    button.addEventListener("click", function(e){

        const ripple = document.createElement("span");

        ripple.classList.add("ripple");

        const rect = this.getBoundingClientRect();

        ripple.style.left = (e.clientX - rect.left) + "px";

        ripple.style.top = (e.clientY - rect.top) + "px";

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

});

/*==========================================================
                DAILY STUDY TIPS
==========================================================*/

const studyTips = [

    "Read newspapers every day for at least one hour.",

    "Revise yesterday's topics before learning something new.",

    "Practice at least 50 MCQs daily.",

    "Write one Mains answer every day.",

    "Prepare short notes for quick revision.",

    "Focus on conceptual understanding instead of memorization.",

    "Take one mock test every week.",

    "Analyze your mistakes after every test.",

    "Maintain consistency instead of studying for long hours occasionally.",

    "Believe in your preparation and stay disciplined."

];

function rotateStudyTips(){

    const quote = document.querySelector(
        ".motivation-section blockquote"
    );

    if(!quote) return;

    let index = 0;

    setInterval(() => {

        index++;

        if(index >= studyTips.length){

            index = 0;

        }

        quote.style.opacity = "0";

        setTimeout(() => {

            quote.innerHTML = studyTips[index];

            quote.style.opacity = "1";

        },300);

    },6000);

}

rotateStudyTips();

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

    const totalHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

    const percentage = Math.round(
        (window.scrollY / totalHeight) * 100
    );

    document.title =
    `Study Materials (${percentage}% Read)`;

});

/*==========================================================
                CONSOLE BRANDING
==========================================================*/

console.clear();

console.log(
"%cUPSC CLOUD PROJECT",
"color:#2563EB;font-size:28px;font-weight:bold;"
);

console.log(
"%cStudy Materials Module",
"color:#1E3A8A;font-size:18px;font-weight:bold;"
);

console.log(
"%cHTML • CSS • JavaScript",
"color:#0EA5E9;font-size:15px;"
);

console.log(
"%cReady for Supabase Backend Integration",
"color:#EA580C;font-size:15px;font-weight:bold;"
);

/*==========================================================
                PAGE VISIT TIMER
==========================================================*/

let studySeconds = 0;

setInterval(()=>{

    studySeconds++;

    console.log(
        "Time Spent on Study Materials Page :",
        studySeconds,
        "seconds"
    );

},1000);

/*==========================================================
                GOOD LUCK MESSAGE
==========================================================*/

window.addEventListener("beforeunload",()=>{

    console.log(
        "Happy Learning! Keep preparing for UPSC."
    );

});

/*==========================================================
                END OF STUDYMATERIALS.JS
==========================================================*/