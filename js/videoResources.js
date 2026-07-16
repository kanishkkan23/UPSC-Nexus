/*==========================================================
                UPSC CLOUD PROJECT
             VIDEO RESOURCES.JS
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

    console.log("Video Resources Module Loaded");

    // Fetch and render dynamic videos from Supabase
    fetchVideos();
});

/*==========================================================
             SUPABASE VIDEO LOADING
==========================================================*/

let allVideos = [];

async function fetchVideos() {
    if (!window.supabaseClient) return;

    try {
        const { data, error } = await window.supabaseClient
            .from("videos")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching videos from Supabase:", error);
            return;
        }

        if (data && data.length > 0) {
            allVideos = data;
            renderVideos();
        } else {
            console.log("No videos found in Supabase. Keeping static placeholders.");
        }
    } catch (err) {
        console.error("Failed to query videos table:", err);
    }
}

function renderVideos() {
    const videoGrid = document.querySelector(".video-grid");
    if (!videoGrid) return;

    // Replace static placeholder boxes with dynamic content
    videoGrid.innerHTML = "";

    allVideos.forEach(video => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg" 
                     alt="${video.title}" 
                     loading="lazy">
                <div class="play-overlay">
                    <i class="fas fa-play-circle"></i>
                </div>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <div class="video-meta">
                    <span class="video-subject"><i class="fas fa-book"></i> ${video.subject}</span>
                    ${video.duration ? `<span class="video-duration"><i class="fas fa-clock"></i> ${video.duration}</span>` : ''}
                </div>
                <a href="https://www.youtube.com/watch?v=${video.youtube_id}" target="_blank" class="resource-btn">
                    <i class="fab fa-youtube"></i> Watch on YouTube
                </a>
            </div>
        `;
        videoGrid.appendChild(card);
    });
}
