/*==========================================================
                UPSC CLOUD PROJECT
                Authentication JavaScript
==========================================================*/

// Check if user is already logged in, redirect to dashboard if true
document.addEventListener("DOMContentLoaded", async () => {
    if (window.supabaseClient) {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session) {
            window.location.href = "dashboard.html";
        }
    }
});

// ==========================================
// DOM ELEMENTS
// ==========================================

const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const loginButton = document.querySelector("button");



// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

if (togglePassword) {

    togglePassword.addEventListener("click", function () {

        if (password.type === "password") {

            password.type = "text";

            this.classList.remove("fa-eye");

            this.classList.add("fa-eye-slash");

        }

        else {

            password.type = "password";

            this.classList.remove("fa-eye-slash");

            this.classList.add("fa-eye");

        }

    });

}



// ==========================================
// EMAIL VALIDATION
// ==========================================

function validateEmail(emailValue) {

    const pattern =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(emailValue);

}



// ==========================================
// PASSWORD VALIDATION
// ==========================================

function validatePassword(passwordValue) {

    return passwordValue.length >= 6;

}



// ==========================================
// SHOW ERROR
// ==========================================

function showError(input, message) {

    removeMessage(input);

    input.classList.add("error-input");

    const error = document.createElement("small");

    error.className = "error";

    error.innerText = message;

    input.parentElement.appendChild(error);

}



// ==========================================
// SHOW SUCCESS
// ==========================================

function showSuccess(input) {

    removeMessage(input);

    input.classList.remove("error-input");

    input.classList.add("success-input");

}



// ==========================================
// REMOVE MESSAGE
// ==========================================

function removeMessage(input) {

    const msg = input.parentElement.querySelector("small");

    if (msg) {

        msg.remove();

    }

}



// ==========================================
// LOGIN FORM VALIDATION
// ==========================================

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        let valid = true;



        // EMAIL

        if (email.value.trim() === "") {

            showError(email, "Email is required");

            valid = false;

        }

        else if (!validateEmail(email.value.trim())) {

            showError(email, "Enter a valid email");

            valid = false;

        }

        else {

            showSuccess(email);

        }



        // PASSWORD

        if (password.value.trim() === "") {

            showError(password, "Password is required");

            valid = false;

        }

        else if (!validatePassword(password.value.trim())) {

            showError(password, "Password must be at least 6 characters");

            valid = false;

        }

        else {

            showSuccess(password);

        }



        // LOGIN SUCCESS

        if (valid) {

            login();

        }

    });

}



// ==========================================
// LOGIN FUNCTION
// ==========================================

async function login() {

    loginButton.classList.add("loading");
    loginButton.innerHTML = "Logging in...";
    loginButton.disabled = true;

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({

        email: email.value.trim(),
        password: password.value

    });

    if (error) {

        alert(error.message);

        loginButton.classList.remove("loading");
        loginButton.innerHTML = "Login";
        loginButton.disabled = false;

        return;

    }

    alert("Login Successful!");

    window.location.href = "dashboard.html";

}



// ==========================================
// INPUT EVENTS
// ==========================================

if (email) {

    email.addEventListener("input", () => {

        removeMessage(email);

        email.classList.remove("error-input");

    });

}

if (password) {

    password.addEventListener("input", () => {

        removeMessage(password);

        password.classList.remove("error-input");

    });

}



// ==========================================
// ENTER KEY SUPPORT
// ==========================================

document.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        if (loginForm) {

            loginForm.requestSubmit();

        }

    }

});



// ==========================================
// FUTURE SUPABASE FUNCTION
// ==========================================

/*

async function loginUser(){

const {data,error}=await supabase.auth.signInWithPassword({

email:email.value,

password:password.value

});

}

*/



// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log("Authentication Module Loaded Successfully");

/*==========================================================
            REGISTRATION MODULE
==========================================================*/

// ==========================================
// REGISTER FORM ELEMENTS
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    const fullName = document.getElementById("fullname");
    const registerEmail = document.getElementById("registerEmail");
    const mobile = document.getElementById("mobile");
    const dob = document.getElementById("dob");
    const gender = document.getElementById("gender");
    const language = document.getElementById("language");
    const state = document.getElementById("state");
    const qualification = document.getElementById("qualification");
    const attempt = document.getElementById("attempt");

    const registerPassword = document.getElementById("registerPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    const toggleRegisterPassword = document.getElementById("toggleRegisterPassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    const strengthFill = document.getElementById("strengthFill");
    const strengthText = document.getElementById("strengthText");

    const terms = document.getElementById("terms");


    // ==========================================
    // SHOW PASSWORD
    // ==========================================

    function togglePassword(input, icon) {

        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    }

    toggleRegisterPassword.addEventListener("click", () => {

        togglePassword(registerPassword, toggleRegisterPassword);

    });

    toggleConfirmPassword.addEventListener("click", () => {

        togglePassword(confirmPassword, toggleConfirmPassword);

    });


    // ==========================================
    // PASSWORD STRENGTH
    // ==========================================

    registerPassword.addEventListener("input", () => {

        const pass = registerPassword.value;

        let strength = 0;

        if (pass.length >= 8) strength++;

        if (/[A-Z]/.test(pass)) strength++;

        if (/[0-9]/.test(pass)) strength++;

        if (/[!@#$%^&*]/.test(pass)) strength++;

        if (strength == 1) {

            strengthFill.style.width = "25%";
            strengthFill.style.background = "red";
            strengthText.innerHTML = "Weak Password";

        }

        else if (strength == 2) {

            strengthFill.style.width = "50%";
            strengthFill.style.background = "orange";
            strengthText.innerHTML = "Medium Password";

        }

        else if (strength == 3) {

            strengthFill.style.width = "75%";
            strengthFill.style.background = "#2196f3";
            strengthText.innerHTML = "Good Password";

        }

        else if (strength == 4) {

            strengthFill.style.width = "100%";
            strengthFill.style.background = "green";
            strengthText.innerHTML = "Strong Password";

        }

        else {

            strengthFill.style.width = "0%";
            strengthText.innerHTML = "Password Strength";

        }

    });


    // ==========================================
    // MOBILE VALIDATION
    // ==========================================

    function validMobile(number) {

        return /^[6-9]\d{9}$/.test(number);

    }


    // ==========================================
    // REGISTER FORM SUBMIT
    // ==========================================

    registerForm.addEventListener("submit", (e) => {

        e.preventDefault();

        let valid = true;

        // Full Name

        if (fullName.value.trim() == "") {

            showError(fullName, "Full Name is required");

            valid = false;

        } else {

            showSuccess(fullName);

        }


        // Email

        if (registerEmail.value.trim() == "") {

            showError(registerEmail, "Email is required");

            valid = false;

        }

        else if (!validateEmail(registerEmail.value.trim())) {

            showError(registerEmail, "Enter valid Email");

            valid = false;

        }

        else {

            showSuccess(registerEmail);

        }


        // Mobile

        if (!validMobile(mobile.value.trim())) {

            showError(mobile, "Enter valid mobile number");

            valid = false;

        }

        else {

            showSuccess(mobile);

        }


        // Dropdown Validation

        if (dob.value == "") valid = false;

        if (gender.value == "") valid = false;

        if (language.value == "") valid = false;

        if (state.value == "") valid = false;

        if (qualification.value == "") valid = false;

        if (attempt.value == "") valid = false;


        // Password

        if (registerPassword.value.length < 8) {

            showError(registerPassword, "Minimum 8 characters");

            valid = false;

        }

        else {

            showSuccess(registerPassword);

        }


        // Confirm Password

        if (confirmPassword.value != registerPassword.value) {

            showError(confirmPassword, "Passwords do not match");

            valid = false;

        }

        else {

            showSuccess(confirmPassword);

        }


        // Terms

        if (!terms.checked) {

            alert("Please accept Terms & Conditions");

            valid = false;

        }


        // Success

        if (valid) {

            registerUser();

        }

    });


    // ==========================================
    // REGISTER USER
    // ==========================================

    async function registerUser() {
        console.log("Register function started");

        const submitButton = registerForm.querySelector("button[type='submit']");
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Creating Account...";

        const { data, error } = await window.supabaseClient.auth.signUp({
            email: registerEmail.value.trim(),
            password: registerPassword.value,
            options: {
                data: {
                    full_name: fullName.value.trim(),
                    mobile: mobile.value.trim(),
                    dob: dob.value,
                    gender: gender.value,
                    preferred_language: language.value,
                    state: state.value,
                    qualification: qualification.value,
                    attempt: attempt.value,
                    is_admin: false
                }
            }
        });

        if (error) {
            alert("Registration Failed: " + error.message);
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            console.error(error);
            return;
        }

        console.log("Registration success:", data);
        alert("Registration Successful! Please check your email for verification (if enabled) and login.");
        window.location.href = "login.html";
    }

}