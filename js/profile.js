/* ==========================================
            UPSC CLOUD PROJECT
                PROFILE.JS
========================================== */

document.addEventListener("DOMContentLoaded", async () => {
    // Session Guard
    if (window.supabaseClient) {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            window.location.href = "login.html";
            return;
        }
        
        await loadUserProfile();
        setupEventListeners();
    }
});

let originalProfileData = null;
let currentUserId = null;

// ==========================================
// LOAD PROFILE
// ==========================================
async function loadUserProfile() {
    try {
        const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();
        if (authError || !user) {
            console.error("Auth User Fetch Error:", authError);
            window.location.href = "login.html";
            return;
        }

        currentUserId = user.id;

        const { data, error } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error("Profile Database Fetch Error:", error);
            alert("Error loading profile details.");
            return;
        }

        if (data) {
            originalProfileData = data;
            populateProfileDetails(data, user.email);
        }
    } catch (e) {
        console.error("Unexpected error loading profile:", e);
    }
}

// ==========================================
// POPULATE HTML FIELDS
// ==========================================
function populateProfileDetails(profile, email) {
    // Profile Sidebar Header
    const topBarSpan = document.querySelector(".profile span");
    if (topBarSpan) {
        const now = new Date();
        const date = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        topBarSpan.innerHTML = `Welcome, ${profile.full_name || 'Aspirant'} <br><small>${date}</small>`;
    }

    // Render Avatar if available
    const avatarUrl = profile.avatar_url || "../assets/images/user.png";
    const avatarImg = document.getElementById("avatarImage");
    if (avatarImg) {
        avatarImg.src = avatarUrl;
    }
    const topbarAvatar = document.getElementById("topbar-avatar");
    if (topbarAvatar) {
        topbarAvatar.src = avatarUrl;
    }

    // Left summary card
    document.getElementById("summaryName").textContent = profile.full_name || "Aspirant Name";
    document.getElementById("summaryEmail").textContent = email;
    document.getElementById("summaryAttempt").textContent = profile.attempt || "Not Selected";
    document.getElementById("summaryLanguage").textContent = profile.preferred_language || "Not Selected";
    document.getElementById("summaryState").textContent = profile.state || "Not Selected";
    
    const roleBadge = document.getElementById("summaryRole");
    if (roleBadge) {
        roleBadge.textContent = profile.is_admin ? "Administrator" : "Aspirant";
    }

    // Form inputs
    document.getElementById("profileName").value = profile.full_name || "";
    document.getElementById("profileEmail").value = email;
    document.getElementById("profileMobile").value = profile.mobile || "";
    document.getElementById("profileDob").value = profile.dob || "";
    document.getElementById("profileGender").value = profile.gender || "";
    document.getElementById("profileLanguage").value = profile.preferred_language || "";
    document.getElementById("profileState").value = profile.state || "";
    document.getElementById("profileQualification").value = profile.qualification || "";
    document.getElementById("profileAttempt").value = profile.attempt || "";
}

// ==========================================
// SET UP EDIT INTERACTION
// ==========================================
function setupEventListeners() {
    const btnEdit = document.getElementById("btnEditProfile");
    const btnCancel = document.getElementById("btnCancelEdit");
    const profileForm = document.getElementById("profileForm");
    const formActions = document.getElementById("formActions");
    
    const inputsToToggle = profileForm.querySelectorAll("input:not(#profileEmail), select");

    btnEdit.addEventListener("click", () => {
        // Toggle input active state
        inputsToToggle.forEach(input => {
            input.disabled = false;
        });

        // Show save/cancel actions, hide edit button
        formActions.style.display = "flex";
        btnEdit.style.display = "none";
    });

    btnCancel.addEventListener("click", () => {
        // Reset values
        if (originalProfileData) {
            populateProfileDetails(originalProfileData, document.getElementById("profileEmail").value);
        }

        // Disable inputs
        inputsToToggle.forEach(input => {
            input.disabled = true;
        });

        // Toggle buttons
        formActions.style.display = "none";
        btnEdit.style.display = "flex";
    });

    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btnSave = document.getElementById("btnSaveProfile");
        const originalSaveText = btnSave.textContent;
        btnSave.disabled = true;
        btnSave.textContent = "Saving...";

        const updatedData = {
            full_name: document.getElementById("profileName").value.trim(),
            mobile: document.getElementById("profileMobile").value.trim(),
            dob: document.getElementById("profileDob").value || null,
            gender: document.getElementById("profileGender").value,
            preferred_language: document.getElementById("profileLanguage").value,
            state: document.getElementById("profileState").value,
            qualification: document.getElementById("profileQualification").value,
            attempt: document.getElementById("profileAttempt").value,
            updated_at: new Date().toISOString()
        };

        try {
            const { data, error } = await window.supabaseClient
                .from('profiles')
                .update(updatedData)
                .eq('id', currentUserId)
                .select()
                .single();

            if (error) {
                alert("Error saving profile changes: " + error.message);
                console.error(error);
            } else {
                alert("Profile changes saved successfully!");
                originalProfileData = data;
                populateProfileDetails(data, document.getElementById("profileEmail").value);
                
                // Disable inputs
                inputsToToggle.forEach(input => {
                    input.disabled = true;
                });

                // Toggle buttons
                formActions.style.display = "none";
                btnEdit.style.display = "flex";
            }
        } catch (err) {
            console.error("Exception during profile save:", err);
            alert("An unexpected error occurred while saving.");
        } finally {
            btnSave.disabled = false;
            btnSave.textContent = originalSaveText;
        }
    });

    // Avatar upload setup
    const avatarTrigger = document.getElementById("avatarTrigger");
    const avatarInput = document.getElementById("avatarFileInput");
    const avatarImage = document.getElementById("avatarImage");
    const topbarAvatar = document.getElementById("topbar-avatar");

    if (avatarTrigger && avatarInput) {
        avatarTrigger.addEventListener("click", () => {
            avatarInput.click();
        });

        avatarInput.addEventListener("change", async (e) => {
            if (!avatarInput.files || avatarInput.files.length === 0) return;
            const file = avatarInput.files[0];
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file.");
                return;
            }

            try {
                // Upload avatar image
                const storagePath = `${currentUserId}_avatar_${Date.now()}.png`;
                const { data, error } = await window.supabaseClient.storage
                    .from("avatars")
                    .upload(storagePath, file, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (error) throw error;

                // Get public URL
                const { data: { publicUrl } } = window.supabaseClient.storage
                    .from("avatars")
                    .getPublicUrl(storagePath);

                // Save link to profiles database
                const { error: dbError } = await window.supabaseClient
                    .from("profiles")
                    .update({ avatar_url: publicUrl })
                    .eq("id", currentUserId);

                if (dbError) throw dbError;

                // Update both avatar image elements
                if (avatarImage) avatarImage.src = publicUrl;
                if (topbarAvatar) topbarAvatar.src = publicUrl;
                
                // Update originalProfileData so it retains the new avatar when edit is cancelled
                if (originalProfileData) {
                    originalProfileData.avatar_url = publicUrl;
                }
                
                alert("Profile avatar updated successfully!");
            } catch (err) {
                console.error("Avatar upload failed:", err);
                alert("Upload failed: " + err.message);
            }
        });
    }

    // Logout connection
    const logoutBtn = document.querySelector(".logout a");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const confirmation = confirm("Are you sure you want to logout?");
            if (confirmation) {
                if (window.supabaseClient) {
                    await window.supabaseClient.auth.signOut();
                }
                window.location.href = "login.html";
            }
        });
    }
}
