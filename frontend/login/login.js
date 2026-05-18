/* ===== CREDENTIALS ===== */
const CREDENTIALS = {
    admin: {
        email: 'admin@oppty.com',
        password: 'admin123',
        redirect: '../admin/admin.html',
        name: 'Admin'
    },
    student: {
        email: 'student@oppty.com',
        password: 'student123',
        redirect: '../courses/courses.html',
        name: 'Student'
    }
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
const rememberMe   = document.getElementById('remember-me');
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
    const icon = toast.querySelector('i');
    icon.style.color = isError ? 'var(--accent-red)' : 'var(--accent-green)';
    icon.className = isError ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-check';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

function setLoading(state, btn, txt, ldr, ico) {
    if (state) {
        txt.style.display = 'none';
        ico.style.display = 'none';
        ldr.classList.add('show');
        btn.classList.add('loading');
    } else {
        txt.style.display = '';
        ico.style.display = '';
        ldr.classList.remove('show');
        btn.classList.remove('loading');
    }
}

function showAlertBox(box, msgEl, msg) {
    msgEl.textContent = msg;
    box.classList.add('show');
    box.style.animation = 'none';
    void box.offsetWidth;
    box.style.animation = '';
}
function hideAlertBox(box) { box.classList.remove('show'); }

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

/* ===== TOGGLE PASSWORD (LOGIN) ===== */
togglePass.addEventListener('click', () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    eyeIcon.className = isPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
});

/* ===== TOGGLE PASSWORD (SIGNUP) ===== */
signupTogglePass.addEventListener('click', () => {
    const isPass = signupPassword.type === 'password';
    signupPassword.type = isPass ? 'text' : 'password';
    signupEyeIcon.className = isPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
});

/* ===== REAL-TIME VALIDATION — LOGIN ===== */
emailInput.addEventListener('input', () => {
    hideAlertBox(alertBox);
    if (emailInput.value.trim()) {
        setFieldState(emailInput, emailError, validateEmail(emailInput.value));
    } else {
        emailInput.classList.remove('error', 'success');
        emailError.classList.remove('show');
    }
});

passInput.addEventListener('input', () => {
    hideAlertBox(alertBox);
    if (passInput.value.length > 0) {
        setFieldState(passInput, passError, passInput.value.length >= 6);
    } else {
        passInput.classList.remove('error', 'success');
        passError.classList.remove('show');
    }
});

/* ===== REAL-TIME VALIDATION — SIGNUP ===== */
signupName.addEventListener('input', () => {
    hideAlertBox(signupAlert);
    if (signupName.value.trim()) {
        setFieldState(signupName, signupNameError, signupName.value.trim().length >= 3);
    } else {
        signupName.classList.remove('error', 'success');
        signupNameError.classList.remove('show');
    }
});

signupEmail.addEventListener('input', () => {
    hideAlertBox(signupAlert);
    if (signupEmail.value.trim()) {
        setFieldState(signupEmail, signupEmailError, validateEmail(signupEmail.value));
    } else {
        signupEmail.classList.remove('error', 'success');
        signupEmailError.classList.remove('show');
    }
});

signupPhone.addEventListener('input', () => {
    hideAlertBox(signupAlert);
    // strip non-digits live
    signupPhone.value = signupPhone.value.replace(/[^\d]/g, '');
    if (signupPhone.value) {
        setFieldState(signupPhone, signupPhoneError, validatePhone(signupPhone.value));
    } else {
        signupPhone.classList.remove('error', 'success');
        signupPhoneError.classList.remove('show');
    }
});

signupPassword.addEventListener('input', () => {
    hideAlertBox(signupAlert);
    if (signupPassword.value.length > 0) {
        setFieldState(signupPassword, signupPassError, signupPassword.value.length >= 6);
    } else {
        signupPassword.classList.remove('error', 'success');
        signupPassError.classList.remove('show');
    }
});

/* ===== REMEMBER ME ===== */
window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('lms_remembered_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
        emailInput.classList.add('success');
    }
});

/* ===== LOGIN FORM SUBMIT ===== */
form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideAlertBox(alertBox);

    const email = emailInput.value.trim();
    const password = passInput.value;

    let valid = true;
    if (!validateEmail(email)) {
        setFieldState(emailInput, emailError, false);
        valid = false;
    } else {
        setFieldState(emailInput, emailError, true);
    }
    if (password.length < 6) {
        setFieldState(passInput, passError, false);
        valid = false;
    } else {
        setFieldState(passInput, passError, true);
    }
    if (!valid) return;

    let matched = null;
    for (const key in CREDENTIALS) {
        const cred = CREDENTIALS[key];
        if (email.toLowerCase() === cred.email.toLowerCase() && password === cred.password) {
            matched = { ...cred, role: key };
            break;
        }
    }

    setLoading(true, btnLogin, btnText, btnLoader, btnIcon);

    setTimeout(() => {
        setLoading(false, btnLogin, btnText, btnLoader, btnIcon);

        if (!matched) {
            showAlertBox(alertBox, alertMsg, 'Invalid email or password. Please try again.');
            passInput.classList.add('error');
            passInput.value = '';
            return;
        }

        if (rememberMe.checked) {
            localStorage.setItem('lms_remembered_email', email);
        } else {
            localStorage.removeItem('lms_remembered_email');
        }

        sessionStorage.setItem('lms_user', JSON.stringify({
            email: matched.email,
            name: matched.name,
            role: matched.role,
            loginTime: new Date().toISOString()
        }));

        showToast(`Welcome back, ${matched.name}! Redirecting...`);

        setTimeout(() => {
            window.location.href = matched.redirect;
        }, 1500);

    }, 1500);
});

/* ===== SIGNUP MODAL — OPEN / CLOSE ===== */
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
    [signupNameError, signupEmailError, signupPhoneError, signupPassError].forEach(el => {
        el.classList.remove('show');
    });
}

openSignupBtn.addEventListener('click', (e) => { e.preventDefault(); openSignupModal(); });
closeSignupBtn.addEventListener('click', closeSignupModal);
cancelSignupBtn.addEventListener('click', closeSignupModal);
backToLoginBtn.addEventListener('click', (e) => { e.preventDefault(); closeSignupModal(); });

// Close on overlay click
signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal) closeSignupModal();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && signupModal.classList.contains('show')) closeSignupModal();
});

/* ===== SIGNUP FORM SUBMIT ===== */
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideAlertBox(signupAlert);

    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const phone = signupPhone.value.trim();
    const password = signupPassword.value;

    let valid = true;

    if (name.length < 3) {
        setFieldState(signupName, signupNameError, false); valid = false;
    } else setFieldState(signupName, signupNameError, true);

    if (!validateEmail(email)) {
        setFieldState(signupEmail, signupEmailError, false); valid = false;
    } else setFieldState(signupEmail, signupEmailError, true);

    if (!validatePhone(phone)) {
        setFieldState(signupPhone, signupPhoneError, false); valid = false;
    } else setFieldState(signupPhone, signupPhoneError, true);

    if (password.length < 6) {
        setFieldState(signupPassword, signupPassError, false); valid = false;
    } else setFieldState(signupPassword, signupPassError, true);

    if (!valid) {
        showAlertBox(signupAlert, signupAlertMsg, 'Please fix the highlighted errors.');
        return;
    }

    // Check if email already used (demo: hardcoded list + localStorage)
    const existingUsers = JSON.parse(localStorage.getItem('lms_signups') || '[]');
    const emailExists = existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase())
        || Object.values(CREDENTIALS).some(c => c.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
        showAlertBox(signupAlert, signupAlertMsg, 'This email is already registered.');
        setFieldState(signupEmail, signupEmailError, false);
        return;
    }

    setLoading(true, signupBtn, signupBtnText, signupBtnLoader, signupBtnIcon);

    setTimeout(() => {
        setLoading(false, signupBtn, signupBtnText, signupBtnLoader, signupBtnIcon);

        // Save to localStorage (demo)
        existingUsers.push({
            name, email, phone, password,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('lms_signups', JSON.stringify(existingUsers));

        showToast(`Welcome, ${name}! Account created successfully.`);
        closeSignupModal();

        // Auto-fill login
        emailInput.value = email;
        emailInput.classList.add('success');
        passInput.focus();

    }, 1500);
});

/* ===== FORGOT PASSWORD ===== */
document.querySelector('.forgot-link').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Password reset link sent to your email!', false);
});