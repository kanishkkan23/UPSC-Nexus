/* ==========================================================
                    ADMIN DASHBOARD LOGIC
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Session and admin validation (redundant double check)
    if (window.supabaseClient) {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session) {
            // Load admin profile name
            const { data: profile } = await window.supabaseClient
                .from('profiles')
                .select('full_name')
                .eq('id', session.user.id)
                .single();
            if (profile) {
                document.getElementById("admin-profile-name").textContent = profile.full_name;
            }
        }
    }

    // 2. Load statistics counters
    loadAdminStats();

    // 3. Load catalog lists
    loadCatalogPYQs();
    loadCatalogMaterials();
    loadCatalogVideos();

    // 4. Load download audit logs
    loadAuditLogs();

    // 5. Handle form type conditional input changes
    const resourceTypeSelect = document.getElementById("resource-type");
    if (resourceTypeSelect) {
        resourceTypeSelect.addEventListener("change", handleFormTypeChange);
    }

    // 6. Handle file upload form submission
    const uploadForm = document.getElementById("upload-form");
    if (uploadForm) {
        uploadForm.addEventListener("submit", handleFormSubmit);
    }

    // 7. Drag-and-drop animations
    setupDragAndDrop();

    // 8. Logout handler
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const confirmLogout = confirm("Are you sure you want to log out of Admin Portal?");
            if (confirmLogout) {
                if (window.supabaseClient) {
                    await window.supabaseClient.auth.signOut();
                }
                window.location.href = "login.html";
            }
        });
    }
});

/* ==========================================================
                DYNAMIC FORM TYPE CHANGE
========================================================== */

function handleFormTypeChange() {
    const type = document.getElementById("resource-type").value;
    const containerExtra = document.getElementById("container-extra");
    const containerSubject = document.getElementById("container-subject");
    const subjectInput = document.getElementById("resource-subject");
    const containerFile = document.getElementById("container-file");
    const containerUrl = document.getElementById("container-url");
    const fileInput = document.getElementById("resource-file");
    const urlInput = document.getElementById("resource-url");
    if (!containerExtra) return;

    if (type === "pyq") {
        // Hide subject field (not needed for PYQs)
        if (containerSubject) containerSubject.style.display = "none";
        if (subjectInput) { subjectInput.removeAttribute("required"); subjectInput.value = ""; }

        // Show PDF upload, hide YouTube URL
        if (containerFile) containerFile.style.display = "block";
        if (containerUrl) containerUrl.style.display = "none";
        if (fileInput) fileInput.setAttribute("required", "required");
        if (urlInput) { urlInput.removeAttribute("required"); urlInput.value = ""; }

        // Show Year + Stage inputs
        containerExtra.innerHTML = `
            <div style="display: flex; gap: 15px; width: 100%;">
                <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <label for="resource-extra">UPSC Examination Year</label>
                    <input type="number" id="resource-extra" min="2000" max="${new Date().getFullYear() + 2}" placeholder="e.g. 2025" required>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <label for="resource-stage">Stage / Paper Type</label>
                    <select id="resource-stage" required>
                        <option value="" disabled selected>Select Stage</option>
                        <option value="Prelims">Prelims (GS I)</option>
                        <option value="CSAT">CSAT (GS II)</option>
                        <option value="Mains">Mains (GS I-IV)</option>
                        <option value="Essay">Essay</option>
                        <option value="Ethics">Ethics</option>
                    </select>
                </div>
            </div>
        `;

    } else if (type === "material") {
        // Show subject field
        if (containerSubject) containerSubject.style.display = "block";
        if (subjectInput) subjectInput.setAttribute("required", "required");

        // Show PDF upload, hide YouTube URL
        if (containerFile) containerFile.style.display = "block";
        if (containerUrl) containerUrl.style.display = "none";
        if (fileInput) fileInput.setAttribute("required", "required");
        if (urlInput) { urlInput.removeAttribute("required"); urlInput.value = ""; }

        // Show Category dropdown
        containerExtra.innerHTML = `
            <label for="resource-extra">Category (Stage / Exam Stage)</label>
            <select id="resource-extra" required>
                <option value="" disabled selected>Select Category</option>
                <option value="Prelims">Prelims Guide</option>
                <option value="Mains">Mains Guide</option>
                <option value="Interview">Interview Tip</option>
                <option value="NCERT">NCERT Books</option>
                <option value="PDFs">Reference Notes</option>
            </select>
        `;

    } else if (type === "video") {
        // Show subject field
        if (containerSubject) containerSubject.style.display = "block";
        if (subjectInput) subjectInput.setAttribute("required", "required");

        // Hide PDF upload, show YouTube URL
        if (containerFile) containerFile.style.display = "none";
        if (containerUrl) containerUrl.style.display = "block";
        if (fileInput) fileInput.removeAttribute("required");
        if (urlInput) urlInput.setAttribute("required", "required");

        // Show Duration input
        containerExtra.innerHTML = `
            <label for="resource-extra">Video Duration</label>
            <input type="text" id="resource-extra" placeholder="e.g. 45 mins, 1 hr 20 mins">
        `;
    }
}

/* ==========================================================
                LOAD ADMINISTRATIVE STATS
========================================================== */

async function loadAdminStats() {
    if (!window.supabaseClient) return;

    try {
        // A. Count total users
        const { count: usersCount, error: errUsers } = await window.supabaseClient
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (!errUsers && usersCount !== null) {
            document.getElementById("stat-users").textContent = usersCount;
        }

        // B. Count total PYQs
        const { count: pyqsCount, error: errPyqs } = await window.supabaseClient
            .from('pyqs')
            .select('*', { count: 'exact', head: true });

        if (!errPyqs && pyqsCount !== null) {
            document.getElementById("stat-pyqs").textContent = pyqsCount;
        }

        // C. Count total study materials
        const { count: matCount, error: errMat } = await window.supabaseClient
            .from('study_materials')
            .select('*', { count: 'exact', head: true });

        if (!errMat && matCount !== null) {
            document.getElementById("stat-materials").textContent = matCount;
        }

        // D. Count total downloads
        const { count: dlCount, error: errDl } = await window.supabaseClient
            .from('download_history')
            .select('*', { count: 'exact', head: true });

        if (!errDl && dlCount !== null) {
            document.getElementById("stat-downloads").textContent = dlCount;
        }

        // E. Count total videos
        const { count: vidCount, error: errVid } = await window.supabaseClient
            .from('videos')
            .select('*', { count: 'exact', head: true });

        if (!errVid && vidCount !== null) {
            document.getElementById("stat-videos").textContent = vidCount;
        }
    } catch (e) {
        console.error("Failed to load admin stats:", e);
    }
}

/* ==========================================================
                LOAD CATALOG DATA (READ / DELETE)
========================================================== */

async function loadCatalogPYQs() {
    const body = document.getElementById("catalog-pyqs-body");
    if (!body || !window.supabaseClient) return;

    try {
        const { data: pyqs, error } = await window.supabaseClient
            .from('pyqs')
            .select('*')
            .order('year', { ascending: false });

        if (error) throw error;

        if (!pyqs || pyqs.length === 0) {
            body.innerHTML = `<tr><td colspan="5" style="text-align: center;">No papers uploaded yet.</td></tr>`;
            return;
        }

        body.innerHTML = "";
        pyqs.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${item.year}</strong></td>
                <td>${item.subject}</td>
                <td>${item.paper_type}</td>
                <td><a href="${item.file_url}" target="_blank"><i class="fas fa-file-pdf"></i> View File</a></td>
                <td>
                    <button class="action-btn-delete" onclick="deleteResource('${item.id}', 'pyq', '${item.file_url}')">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
            body.appendChild(tr);
        });
    } catch (e) {
        console.error("Error loading PYQ catalog:", e);
        body.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Failed to load catalog files.</td></tr>`;
    }
}

async function loadCatalogMaterials() {
    const body = document.getElementById("catalog-materials-body");
    if (!body || !window.supabaseClient) return;

    try {
        const { data: materials, error } = await window.supabaseClient
            .from('study_materials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!materials || materials.length === 0) {
            body.innerHTML = `<tr><td colspan="5" style="text-align: center;">No study materials uploaded yet.</td></tr>`;
            return;
        }

        body.innerHTML = "";
        materials.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${item.title}</strong></td>
                <td>${item.subject}</td>
                <td>${item.category}</td>
                <td><a href="${item.file_url}" target="_blank"><i class="fas fa-file-pdf"></i> View File</a></td>
                <td>
                    <button class="action-btn-delete" onclick="deleteResource('${item.id}', 'material', '${item.file_url}')">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
            body.appendChild(tr);
        });
    } catch (e) {
        console.error("Error loading materials catalog:", e);
        body.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Failed to load study materials.</td></tr>`;
    }
}

async function loadCatalogVideos() {
    const body = document.getElementById("catalog-videos-body");
    if (!body || !window.supabaseClient) return;

    try {
        const { data: videos, error } = await window.supabaseClient
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!videos || videos.length === 0) {
            body.innerHTML = `<tr><td colspan="5" style="text-align: center;">No video lectures published yet.</td></tr>`;
            return;
        }

        body.innerHTML = "";
        videos.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${item.title}</strong></td>
                <td>${item.subject}</td>
                <td>${item.duration || 'N/A'}</td>
                <td><a href="https://www.youtube.com/watch?v=${item.youtube_id}" target="_blank"><i class="fab fa-youtube"></i> ${item.youtube_id}</a></td>
                <td>
                    <button class="action-btn-delete" onclick="deleteResource('${item.id}', 'video', '')">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
            body.appendChild(tr);
        });
    } catch (e) {
        console.error("Error loading videos catalog:", e);
        body.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Failed to load video lectures.</td></tr>`;
    }
}

/* ==========================================================
                DELETE RESOURCE (DATABASE + STORAGE)
========================================================== */

window.deleteResource = async function(id, type, fileUrl) {
    if (!window.supabaseClient) return;
    const confirmDelete = confirm(`Are you sure you want to delete this resource?\nThis action cannot be undone.`);
    if (!confirmDelete) return;

    try {
        let table = "";
        if (type === "pyq") table = "pyqs";
        else if (type === "material") table = "study_materials";
        else if (type === "video") table = "videos";

        // 1. Delete from database
        const { error: dbError } = await window.supabaseClient
            .from(table)
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        // 2. Extract file path from URL to delete from bucket (only for file uploads)
        if (type !== "video" && fileUrl) {
            const bucket = type === "pyq" ? "pyqs" : "study-materials";
            const urlParts = fileUrl.split(`/public/${bucket}/`);
            if (urlParts.length > 1) {
                const filePath = decodeURIComponent(urlParts[1]);
                const { error: storageError } = await window.supabaseClient
                    .storage
                    .from(bucket)
                    .remove([filePath]);
                
                if (storageError) {
                    console.warn("File could not be deleted from storage bucket (it might be missing):", storageError);
                }
            }
        }

        alert("Resource deleted successfully!");
        
        // Refresh catalog lists & stats
        loadAdminStats();
        if (type === "pyq") {
            loadCatalogPYQs();
        } else if (type === "material") {
            loadCatalogMaterials();
        } else if (type === "video") {
            loadCatalogVideos();
        }
    } catch (e) {
        console.error("Delete operation failed:", e);
        alert("Error deleting resource: " + e.message);
    }
};

/* ==========================================================
                LOAD AUDIT TRAIL LOGS
========================================================== */

async function loadAuditLogs() {
    const body = document.getElementById("audit-logs-body");
    if (!body || !window.supabaseClient) return;

    try {
        const { data: logs, error } = await window.supabaseClient
            .from('download_history')
            .select(`
                downloaded_at,
                resource_type,
                profiles (
                    full_name,
                    email
                )
            `)
            .order('downloaded_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        if (!logs || logs.length === 0) {
            body.innerHTML = `<tr><td colspan="4" style="text-align: center;">No downloads have been executed yet.</td></tr>`;
            return;
        }

        body.innerHTML = "";
        logs.forEach(log => {
            const date = new Date(log.downloaded_at).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });

            const userName = log.profiles ? log.profiles.full_name : "Unknown User";
            const userEmail = log.profiles ? log.profiles.email : "-";

            const tr = document.createElement("tr");
            const typeLabel = log.resource_type === 'pyq' ? 'PYQ' : 'STUDY MATERIAL';
            const badgeClass = log.resource_type === 'pyq' ? 'badge-pyq' : 'badge-material';

            tr.innerHTML = `
                <td><strong>${userName}</strong></td>
                <td>${userEmail}</td>
                <td><span class="badge-status ${badgeClass}" style="padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; background: ${log.resource_type === 'pyq' ? '#E0F2FE' : '#DCFCE7'}; color: ${log.resource_type === 'pyq' ? '#0369A1' : '#15803D'};">${typeLabel}</span></td>
                <td>${date}</td>
            `;
            body.appendChild(tr);
        });
    } catch (e) {
        console.error("Error loading audit logs:", e);
        body.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">Failed to load user audits.</td></tr>`;
    }
}

/* ==========================================================
                FORM SUBMIT & FILE UPLOAD
========================================================== */

async function handleFormSubmit(e) {
    e.preventDefault();
    if (!window.supabaseClient) return;

    const statusMsg = document.getElementById("upload-status");
    const type = document.getElementById("resource-type").value;
    const title = document.getElementById("resource-title").value;
    const subject = document.getElementById("resource-subject").value;
    const extraInput = document.getElementById("resource-extra");
    const description = document.getElementById("resource-desc").value;
    const fileInput = document.getElementById("resource-file");

    if (type !== "video" && (!fileInput.files || fileInput.files.length === 0)) {
        statusMsg.className = "status-msg error";
        statusMsg.textContent = "Please select a PDF file to upload.";
        return;
    }

    const extraValue = extraInput.value;

    try {
        statusMsg.className = "status-msg info";
        
        // Retrieve logged in user's profile ID
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        const userId = session ? session.user.id : null;

        if (type === "video") {
            statusMsg.textContent = "Saving video details to database...";
            const youtubeUrl = document.getElementById("resource-url").value;
            
            // Extract Youtube Video ID
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = youtubeUrl.match(regExp);
            const youtubeId = (match && match[2].length === 11) ? match[2] : null;

            if (!youtubeId) {
                throw new Error("Invalid YouTube Video URL. Please provide a valid YouTube watch link.");
            }

            const { error: dbError } = await window.supabaseClient
                .from('videos')
                .insert({
                    title: title,
                    youtube_id: youtubeId,
                    subject: subject,
                    duration: extraValue,
                    uploaded_by: userId
                });

            if (dbError) throw dbError;

        } else {
            statusMsg.textContent = "Uploading PDF file to storage...";
            const file = fileInput.files[0];
            const bucketName = type === "pyq" ? "pyqs" : "study-materials";
            
            // 1. Generate unique file name
            const timestamp = Date.now();
            const cleanFileName = file.name.replace(/\s+/g, '_');
            const storagePath = `${timestamp}_${cleanFileName}`;

            // 2. Upload file to Supabase Storage bucket
            const { data: storageData, error: storageError } = await window.supabaseClient
                .storage
                .from(bucketName)
                .upload(storagePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (storageError) throw storageError;

            // 3. Retrieve public URL
            const { data: { publicUrl } } = window.supabaseClient
                .storage
                .from(bucketName)
                .getPublicUrl(storagePath);

            statusMsg.textContent = "Saving catalog details to database...";

            // 4. Insert record into correct database table
            if (type === "pyq") {
                const stageVal = document.getElementById("resource-stage").value;
                const { error: dbError } = await window.supabaseClient
                    .from('pyqs')
                    .insert({
                        year: parseInt(extraValue),
                        subject: title, // Use the Title input as the Subject (paper title) in DB
                        paper_type: stageVal,
                        file_url: publicUrl,
                        description: description,
                        uploaded_by: userId
                    });
                if (dbError) throw dbError;
            } else {
                const { error: dbError } = await window.supabaseClient
                    .from('study_materials')
                    .insert({
                        title: title,
                        subject: subject,
                        category: extraValue,
                        description: description,
                        file_url: publicUrl,
                        uploaded_by: userId
                    });
                if (dbError) throw dbError;
            }
        }

        statusMsg.className = "status-msg success";
        statusMsg.textContent = "Resource successfully published!";
        
        // Reset form
        document.getElementById("upload-form").reset();
        const fileMsg = document.querySelector(".file-message");
        if (fileMsg) fileMsg.textContent = "Choose PDF file or drag it here";
        handleFormTypeChange();

        // Refresh dynamic components
        loadAdminStats();
        if (type === "pyq") {
            loadCatalogPYQs();
        } else if (type === "material") {
            loadCatalogMaterials();
        } else if (type === "video") {
            loadCatalogVideos();
        }

    } catch (err) {
        console.error("Publishing operation failed:", err);
        statusMsg.className = "status-msg error";
        statusMsg.textContent = "Publishing failed: " + err.message;
    }
}

/* ==========================================================
                UTILITIES & PAGE INTERACTION
========================================================== */

window.switchTab = function(tabName) {
    // Switch active buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    // Switch active contents
    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active");
    });

    const activeBtn = Array.from(document.querySelectorAll(".tab-btn"))
        .find(btn => btn.innerText.toLowerCase().includes(tabName));
    if (activeBtn) activeBtn.classList.add("active");

    const activeContent = document.getElementById("tab-" + tabName);
    if (activeContent) activeContent.classList.add("active");
};

function setupDragAndDrop() {
    const fileArea = document.querySelector(".file-drop-area");
    const fileInput = document.getElementById("resource-file");
    
    if (!fileArea || !fileInput) return;

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            document.querySelector(".file-message").textContent = fileInput.files[0].name;
        }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        fileArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            fileArea.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            fileArea.classList.remove('dragover');
        }, false);
    });

    fileArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            fileInput.files = files;
            document.querySelector(".file-message").textContent = files[0].name;
        }
    });
}
