/* ===== API CONFIGURATION ===== */
const API_URLS = {
    signup: 'http://192.168.1.17:8000/api/signup/',
    signin: 'http://192.168.1.17:8000/api/signin/'
};

/* ===== REDIRECT DESTINATIONS ===== */
const ROLE_REDIRECTS = {
    admin: '../admin/admin.html',
    student: '../courses/courses.html'
};

/* ===== DOM REFS — LOGIN ===== */
const form         = document.getElementById('login-form');
const emailInput   = document.getElementById('login-email');
const passInput    = document.getElementById('login-password');
const eyeIcon      = document.getElementById('eye-icon');
const togglePass   = document.getElementById('toggle-password');
const btnLogin     = document.getElementById('login-btn');
const btnText      = document.getElementById('btn-text');
const btnLoader    = document.getElementById('btn-loader');
const btnIcon      = document.getElementById('btn-icon');
const alertBox     = document.getElementById('alert-box');
const alertMsg     = document.getElementById('alert-msg');
const emailError   = document.getElementById('email-error');
const passError    = document.getElementById('password-error');
const toast        = document.getElementById('toast');
const toastMsg     = document.getElementById('toast-msg');

/* ===== DOM REFS — SIGNUP ===== */
const openSignupBtn   = document.getElementById('open-signup');
const closeSignupBtn  = document.getElementById('close-signup');
const cancelSignupBtn = document.getElementById('cancel-signup');
const backToLoginBtn  = document.getElementById('back-to-login');
const signupModal     = document.getElementById('signup-modal');
const signupForm      = document.getElementById('signup-form');
const signupName      = document.getElementById('signup-name');
const signupEmail     = document.getElementById('signup-email');
const signupPhone     = document.getElementById('signup-phone');
const signupPassword  = document.getElementById('signup-password');
const signupTogglePass= document.getElementById('signup-toggle-pass');
const signupEyeIcon   = document.getElementById('signup-eye-icon');
const signupBtn       = document.getElementById('signup-btn');
const signupBtnText   = document.getElementById('signup-btn-text');
const signupBtnLoader = document.getElementById('signup-btn-loader');
const signupBtnIcon   = document.getElementById('signup-btn-icon');
const signupAlert     = document.getElementById('signup-alert');
const signupAlertMsg  = document.getElementById('signup-alert-msg');

const signupNameError  = document.getElementById('signup-name-error');
const signupEmailError = document.getElementById('signup-email-error');
const signupPhoneError = document.getElementById('signup-phone-error');
const signupPassError  = document.getElementById('signup-password-error');

/* ===== UTILS ===== */
function showToast(msg, isError = false) {
    toastMsg.textContent = msg;
    toast.style.background = isError ? 'var(--accent-red)' : 'var(--text-main)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

function setLoading(state, btn, txt, ldr, ico) {
    if (state) {
        txt.style.display = 'none';
        if (ico) ico.style.display = 'none';
        ldr.classList.add('show');
        btn.classList.add('loading');
        btn.disabled = true;
    } else {
        txt.style.display = '';
        if (ico) ico.style.display = '';
        ldr.classList.remove('show');
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function showAlertBox(box, msgEl, msg) {
    msgEl.textContent = msg;
    box.classList.add('show');
    box.style.animation = 'none';
    void box.offsetWidth;
    box.style.animation = '';
}

function hideAlertBox(box) { 
    if(box) box.classList.remove('show'); 
}

function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function validatePhone(val) {
    return /^[0-9]{10,15}$/.test(val.replace(/\D/g, ''));
}

function setFieldState(input, errorEl, isValid) {
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        errorEl.classList.remove('show');
    } else {
        input.classList.add('error');
        input.classList.remove('success');
        errorEl.classList.add('show');
    }
}

/* ===== PASSWORD VISIBILITY TOGGLES ===== */
togglePass.addEventListener('click', () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    eyeIcon.textContent = isPass ? '🙈' : '👁';
});

signupTogglePass.addEventListener('click', () => {
    const isPass = signupPassword.type === 'password';
    signupPassword.type = isPass ? 'text' : 'password';
    signupEyeIcon.textContent = isPass ? '🙈' : '👁';
});

/* ===== REAL-TIME VALIDATION ===== */
emailInput.addEventListener('input', () => {
    hideAlertBox(alertBox);
    if (emailInput.value.trim()) {
        setFieldState(emailInput, emailError, validateEmail(emailInput.value));
    }
});

passInput.addEventListener('input', () => {
    hideAlertBox(alertBox);
    if (passInput.value.length > 0) {
        setFieldState(passInput, passError, passInput.value.length >= 6);
    }
});

signupName.addEventListener('input', () => {
    hideAlertBox(signupAlert);
    setFieldState(signupName, signupNameError, signupName.value.trim().length >= 3);
});

signupEmail.addEventListener('input', () => {
    hideAlertBox(signupAlert);
    setFieldState(signupEmail, signupEmailError, validateEmail(signupEmail.value));
});

signupPhone.addEventListener('input', () => {
    hideAlertBox(signupAlert);
    signupPhone.value = signupPhone.value.replace(/[^\d]/g, '');
    setFieldState(signupPhone, signupPhoneError, validatePhone(signupPhone.value));
});

signupPassword.addEventListener('input', () => {
    hideAlertBox(signupAlert);
    setFieldState(signupPassword, signupPassError, signupPassword.value.length >= 6);
});

/* ===== SIGN-IN LOGIC (POST to API) ===== */
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlertBox(alertBox);

    const email = emailInput.value.trim();
    const password = passInput.value;

    // Client-side validation
    if (!validateEmail(email) || password.length < 6) {
        showAlertBox(alertBox, alertMsg, 'Please enter a valid email and password.');
        return;
    }

    setLoading(true, btnLogin, btnText, btnLoader, btnIcon);

    try {
        const response = await fetch(API_URLS.signin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("Signin response:", data);

        if (!response.ok) {
            throw new Error(data.message || data.error || data.detail || 'Login failed.');
        }

        // Handle nested or flat data structures safely
        const userData = data.user || data; 
        const token = data.token || data.access || data.key;

        if (!userData.email) {
            throw new Error("Server error: User details missing in response.");
        }

        // Save session
        sessionStorage.setItem('lms_user', JSON.stringify({
            email: userData.email,
            name: userData.name || userData.username || 'User',
            role: (userData.role || 'student').toLowerCase(),
            loginTime: new Date().toISOString()
        }));
        if(token) sessionStorage.setItem('lms_token', token);

        showToast(`Welcome back, ${userData.name || 'User'}!`);

        setTimeout(() => {
            const role = (userData.role || 'student').toLowerCase();
            window.location.href = ROLE_REDIRECTS[role] || ROLE_REDIRECTS['student'];
        }, 1500);

    } catch (error) {
        console.error("Signin Error:", error);
        showAlertBox(alertBox, alertMsg, error.message);
        passInput.classList.add('error');
    } finally {
        setLoading(false, btnLogin, btnText, btnLoader, btnIcon);
    }
});

/* ===== SIGN-UP LOGIC (POST to API) ===== */
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlertBox(signupAlert);

    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const phone = signupPhone.value.trim();
    const password = signupPassword.value;

    if (name.length < 3 || !validateEmail(email) || !validatePhone(phone) || password.length < 6) {
        showAlertBox(signupAlert, signupAlertMsg, 'Please fix the errors in the form.');
        return;
    }

    setLoading(true, signupBtn, signupBtnText, signupBtnLoader, signupBtnIcon);

    try {
        const response = await fetch(API_URLS.signup, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });

        const data = await response.json();
        console.log("Signup response:", data);

        if (!response.ok) {
            throw new Error(data.message || data.error || data.detail || 'Registration failed.');
        }

        showToast(`Account created for ${name}! Please login.`);
        closeSignupModal();

        // Switch to login UI
        emailInput.value = email;
        emailInput.classList.add('success');
        passInput.focus();

    } catch (error) {
        console.error("Signup Error:", error);
        showAlertBox(signupAlert, signupAlertMsg, error.message);
    } finally {
        setLoading(false, signupBtn, signupBtnText, signupBtnLoader, signupBtnIcon);
    }
});

/* ===== MODAL CONTROLS ===== */
function openSignupModal() {
    signupModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => signupName.focus(), 300);
}

function closeSignupModal() {
    signupModal.classList.remove('show');
    document.body.style.overflow = '';
    signupForm.reset();
    hideAlertBox(signupAlert);
    [signupName, signupEmail, signupPhone, signupPassword].forEach(el => {
        el.classList.remove('error', 'success');
    });
}

openSignupBtn.addEventListener('click', (e) => { e.preventDefault(); openSignupModal(); });
closeSignupBtn.addEventListener('click', closeSignupModal);
cancelSignupBtn.addEventListener('click', closeSignupModal);
backToLoginBtn.addEventListener('click', (e) => { e.preventDefault(); closeSignupModal(); });

signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal) closeSignupModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && signupModal.classList.contains('show')) closeSignupModal();
});

/* ===== FORGOT PASSWORD ===== */
document.querySelector('.forgot-link').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Reset instructions sent to your email!');
});