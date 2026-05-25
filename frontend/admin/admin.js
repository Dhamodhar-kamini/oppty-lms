'use strict';

/* ============================================================
   STORAGE HELPERS
   ============================================================ */
const KEYS = {
    courses: 'oppty_courses',
    users:   'oppty_users',
    coupons: 'oppty_coupons'
};

function loadData(key, fallback = []) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
}

function saveData(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { console.warn('Storage error:', e); }
}

/* ============================================================
   TOAST
   ============================================================ */
const toastEl  = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');

function showToast(msg, type = 'success') {
    toastMsg.textContent = msg;
    toastEl.querySelector('i').style.color =
        type === 'error' ? 'var(--accent-red)' : 'var(--accent-green)';
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 2800);
}

/* ============================================================
   SIDEBAR & NAVIGATION
   ============================================================ */
const mobileToggle   = document.getElementById('mobile-toggle');
const sidebar        = document.getElementById('sidebar');
const closeSidebarEl = document.getElementById('close-sidebar');
const courseToggle   = document.getElementById('course-toggle');
const subMenu        = document.getElementById('sub-menu');
const chevron        = courseToggle.querySelector('.chevron');

mobileToggle.addEventListener('click', () => sidebar.classList.add('show'));
closeSidebarEl.addEventListener('click', () => sidebar.classList.remove('show'));
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992 &&
        !sidebar.contains(e.target) &&
        !mobileToggle.contains(e.target) &&
        sidebar.classList.contains('show'))
        sidebar.classList.remove('show');
});

courseToggle.addEventListener('click', (e) => {
    e.preventDefault();
    courseToggle.classList.toggle('active');
    subMenu.classList.toggle('show');
    chevron.style.transform = subMenu.classList.contains('show') ? 'rotate(-180deg)' : 'rotate(0deg)';
});

function navigateTo(sn) {
    document.querySelectorAll('.nav-item, .sub-menu a').forEach(el => el.classList.remove('active'));
    const tn = document.querySelector(`[data-section="${sn}"]`);
    if (tn) tn.classList.add('active');

    if (['all-courses', 'add-course', 'course-detail'].includes(sn)) {
        subMenu.classList.add('show');
        courseToggle.classList.add('active');
        chevron.style.transform = 'rotate(-180deg)';
    }

    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(sn + '-section');
    if (target) {
        target.classList.add('active');
        target.querySelectorAll('.fade-in-up').forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = '';
        });
    }

    if (window.innerWidth <= 992) sidebar.classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateDashStats();
}

document.querySelectorAll('[data-section], [data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(el.dataset.section || el.dataset.nav);
    });
});

/* ============================================================
   PROFILE MODAL
   ============================================================ */
const profileModal    = document.getElementById('profile-modal');
const avatarPreviewEl = document.getElementById('avatar-preview-img');
const adminAvatarEl   = document.getElementById('admin-avatar');
const profileNameEl   = document.getElementById('profile-name-input');
const userNameDisplay = document.querySelector('.user-name');

document.getElementById('profile-trigger').addEventListener('click', () => profileModal.classList.add('show'));
document.getElementById('close-modal').addEventListener('click', () => profileModal.classList.remove('show'));
document.getElementById('cancel-profile').addEventListener('click', () => profileModal.classList.remove('show'));
profileModal.addEventListener('click', (e) => { if (e.target === profileModal) profileModal.classList.remove('show'); });

document.getElementById('avatar-upload').addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => { avatarPreviewEl.src = ev.target.result; };
    r.readAsDataURL(f);
});

document.getElementById('save-profile').addEventListener('click', () => {
    const name = profileNameEl.value.trim() || 'ADMIN';
    adminAvatarEl.src = avatarPreviewEl.src;
    userNameDisplay.textContent = name;
    localStorage.setItem('adminAvatar', avatarPreviewEl.src);
    localStorage.setItem('adminName', name);
    profileModal.classList.remove('show');
    showToast('Profile updated!');
});

/* ============================================================
   LOGOUT MODAL
   ============================================================ */
const logoutModal = document.getElementById('logout-modal');
document.getElementById('logout-btn').addEventListener('click', (e) => { e.preventDefault(); logoutModal.classList.add('show'); });
document.getElementById('cancel-logout').addEventListener('click', () => logoutModal.classList.remove('show'));
document.getElementById('confirm-logout').addEventListener('click', () => { showToast('Logging out...'); setTimeout(() => window.location.href = '../login/login.html', 800); });
logoutModal.addEventListener('click', (e) => { if (e.target === logoutModal) logoutModal.classList.remove('show'); });

/* ============================================================
   DASHBOARD STATS
   ============================================================ */
function updateDashStats() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('dash-total-users',   loadData(KEYS.users).length);
    set('dash-total-courses', loadData(KEYS.courses).length);
    set('dash-total-coupons', loadData(KEYS.coupons).length);
}

/* ============================================================
   INIT: LOAD SAVED PROFILE
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
    const sa = localStorage.getItem('adminAvatar');
    const sn = localStorage.getItem('adminName');
    if (sa) { adminAvatarEl.src = sa; avatarPreviewEl.src = sa; }
    if (sn) { userNameDisplay.textContent = sn; profileNameEl.value = sn; }
    updateDashStats();
});

/* ============================================================
   USERS MODULE
   ============================================================ */
const USERS_PER_PAGE = 15;
let usersData = loadData(KEYS.users, []);
let usersPage  = 1;
let editUserId = null;

// Seed 2 dummy users only if storage is empty
if (usersData.length === 0) {
    usersData = [
        { id: 'U_SEED1', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'Instructor', joined: '2024-01-15', status: 'active' },
        { id: 'U_SEED2', name: 'Mike Chen',     email: 'mike.chen@example.com',     role: 'Student',    joined: '2024-03-22', status: 'active' }
    ];
    saveData(KEYS.users, usersData);
}

function renderUsers(page = 1) {
    usersPage = page;
    const start = (page - 1) * USERS_PER_PAGE;
    const pg    = usersData.slice(start, start + USERS_PER_PAGE);
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    if (usersData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:48px;color:var(--text-muted)">
            <i class="fa-solid fa-users" style="font-size:2.5rem;display:block;margin-bottom:12px;color:var(--border-light)"></i>
            No users yet. Click "Add User" to get started.</td></tr>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = pg.map(u => {
        const initials = u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const colors   = ['#2563eb','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4'];
        const bg       = colors[(u.name.charCodeAt(0) + u.name.charCodeAt(1)) % colors.length];
        return `<tr>
            <td>
                <div class="course-cell">
                    <div style="width:40px;height:40px;border-radius:50%;background:${bg};color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.82rem;flex-shrink:0">${initials}</div>
                    <div><strong>${u.name}</strong></div>
                </div>
            </td>
            <td style="font-size:0.88rem;color:var(--text-muted)">${u.email}</td>
            <td>
                <span style="padding:4px 12px;border-radius:100px;font-size:0.75rem;font-weight:700;background:${u.role === 'Instructor' ? '#ede9fe' : '#dbeafe'};color:${u.role === 'Instructor' ? '#5b21b6' : '#1e40af'}">${u.role}</span>
            </td>
            <td style="font-size:0.85rem;color:var(--text-muted)">${u.joined}</td>
            <td><span class="status ${u.status}">${u.status.charAt(0).toUpperCase() + u.status.slice(1)}</span></td>
            <td>
                <button class="btn-icon-sm" title="Edit" onclick="openEditUser('${u.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon-sm danger" title="Delete" onclick="deleteUser('${u.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');

    renderUsersPagination();
}

function renderUsersPagination() {
    const tp   = Math.max(1, Math.ceil(usersData.length / USERS_PER_PAGE));
    const pEl  = document.getElementById('pagination');
    if (!pEl) return;
    if (tp <= 1) { pEl.innerHTML = ''; return; }

    let h = `<button class="page-btn" ${usersPage === 1 ? 'disabled' : ''} onclick="renderUsers(${usersPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
    for (let i = 1; i <= tp; i++)
        h += `<button class="page-btn ${i === usersPage ? 'active' : ''}" onclick="renderUsers(${i})">${i}</button>`;
    h += `<button class="page-btn" ${usersPage === tp ? 'disabled' : ''} onclick="renderUsers(${usersPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
    pEl.innerHTML = h;
}

function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    usersData = usersData.filter(u => u.id !== id);
    saveData(KEYS.users, usersData);
    const tp = Math.max(1, Math.ceil(usersData.length / USERS_PER_PAGE));
    if (usersPage > tp) usersPage = tp;
    renderUsers(usersPage);
    showToast('User deleted!');
    updateDashStats();
}

/* ----- Add / Edit User Modal ----- */
const userModal      = document.getElementById('user-modal');
const userForm       = document.getElementById('user-form');
const userModalTitle = document.getElementById('user-modal-title');
const userSubmitText = document.getElementById('user-submit-text');

function openAddUser() {
    editUserId = null;
    userModalTitle.textContent = 'Add User';
    userSubmitText.textContent  = 'Add User';
    userForm.reset();
    userModal.classList.add('show');
}

function openEditUser(id) {
    const u = usersData.find(x => x.id === id);
    if (!u) return;
    editUserId = id;
    userModalTitle.textContent = 'Edit User';
    userSubmitText.textContent  = 'Save Changes';
    document.getElementById('user-name-input').value   = u.name;
    document.getElementById('user-email-input').value  = u.email;
    document.getElementById('user-role-input').value   = u.role;
    document.getElementById('user-status-input').value = u.status;
    userModal.classList.add('show');
}

function closeUserModal() { editUserId = null; userModal.classList.remove('show'); }

document.getElementById('open-add-user-btn').addEventListener('click', openAddUser);
document.getElementById('close-user-modal').addEventListener('click', closeUserModal);
document.getElementById('cancel-user').addEventListener('click', closeUserModal);
userModal.addEventListener('click', (e) => { if (e.target === userModal) closeUserModal(); });

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name   = document.getElementById('user-name-input').value.trim();
    const email  = document.getElementById('user-email-input').value.trim().toLowerCase();
    const role   = document.getElementById('user-role-input').value;
    const status = document.getElementById('user-status-input').value;

    if (!name || !email || !role) { showToast('Please fill all required fields.', 'error'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { showToast('Please enter a valid email.', 'error'); return; }

    const dup = usersData.find(u => u.email === email && u.id !== editUserId);
    if (dup) { showToast('Email already exists!', 'error'); return; }

    if (editUserId) {
        const idx = usersData.findIndex(u => u.id === editUserId);
        if (idx > -1) {
            usersData[idx] = { ...usersData[idx], name, email, role, status };
            showToast('User updated successfully!');
        }
    } else {
        usersData.unshift({
            id: 'U_' + Date.now(),
            name, email, role, status,
            joined: new Date().toISOString().split('T')[0]
        });
        showToast('User added successfully!');
    }

    saveData(KEYS.users, usersData);
    closeUserModal();
    renderUsers(usersPage);
    updateDashStats();
});

renderUsers(1);

/* ============================================================
   COURSES MODULE
   ============================================================ */
let coursesData = loadData(KEYS.courses, []);

// Seed 2 dummy courses only if storage is empty
if (coursesData.length === 0) {
    coursesData = [
        {
            id: 'C_SEED1',
            title: 'Python for Data Science',
            instructor: 'Dr. Smith',
            students: 0, price: '$79', level: 'Intermediate', status: 'published',
            img: '', imgName: '',
            description: 'Master pandas, NumPy, and Matplotlib for powerful data analysis and visualization.',
            subtopics: [
                {
                    title: 'Introduction to Python',
                    video: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
                    notesData: '', notesName: '',
                    description: 'Setting up your Python environment and writing your first script.',
                    duration: '20 min',
                    mcqs: [
                        { q: 'What does Python use to define code blocks?', a: 'Curly braces {}', b: 'Indentation', c: 'Parentheses ()', d: 'Square brackets []', correct: 'B' },
                        { q: 'Which function is used to display output in Python?', a: 'echo()', b: 'console.log()', c: 'print()', d: 'write()', correct: 'C' }
                    ]
                },
                {
                    title: 'Data Types & Variables',
                    video: 'https://www.youtube.com/watch?v=khKv-8q7YmY',
                    notesData: '', notesName: '',
                    description: 'Strings, integers, floats, lists, tuples, and dictionaries.',
                    duration: '35 min',
                    mcqs: []
                }
            ]
        },
        {
            id: 'C_SEED2',
            title: 'Web Development Bootcamp',
            instructor: 'Jane Wilson',
            students: 0, price: '$49', level: 'Beginner', status: 'draft',
            img: '', imgName: '',
            description: 'Learn HTML, CSS, and JavaScript from scratch and build real projects.',
            subtopics: []
        }
    ];
    saveData(KEYS.courses, coursesData);
}

let currentCourseIdx = null;
let courseThumbData  = null;
let courseThumbName  = '';

/* ----- Thumbnail Upload ----- */
const courseThumbUploadEl  = document.getElementById('course-thumb-upload');
const courseThumbFileEl    = document.getElementById('course-thumb-file');
const courseThumbPreviewEl = document.getElementById('course-thumb-preview');
const courseThumbImgEl     = document.getElementById('course-thumb-img');
const courseThumbNameEl    = document.getElementById('course-thumb-name');
const removeCourseThumbEl  = document.getElementById('remove-course-thumb');

courseThumbUploadEl.addEventListener('click', () => courseThumbFileEl.click());

courseThumbFileEl.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB.', 'error'); return; }
    courseThumbName = f.name;
    const r = new FileReader();
    r.onload = (ev) => {
        courseThumbData = ev.target.result;
        courseThumbImgEl.src = courseThumbData;
        courseThumbNameEl.textContent = f.name;
        courseThumbPreviewEl.style.display = 'flex';
        courseThumbUploadEl.style.display  = 'none';
    };
    r.readAsDataURL(f);
});

removeCourseThumbEl.addEventListener('click', () => {
    courseThumbData = null; courseThumbName = '';
    courseThumbFileEl.value = '';
    courseThumbPreviewEl.style.display = 'none';
    courseThumbUploadEl.style.display  = '';
});

/* ----- Render Courses Grid ----- */
function renderAdminCourses() {
    coursesData = loadData(KEYS.courses, []);
    const grid = document.getElementById('admin-courses-grid');
    if (!grid) return;

    const placeholder = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80';

    if (coursesData.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:64px 24px;color:var(--text-muted)">
                <i class="fa-solid fa-graduation-cap" style="font-size:3rem;color:var(--border-light);display:block;margin-bottom:16px"></i>
                <h3 style="font-size:1.1rem;font-weight:700;color:var(--text-main);margin-bottom:8px">No courses yet</h3>
                <p style="margin-bottom:24px">Create your first course to get started</p>
                <button class="btn-primary" style="margin:0 auto" onclick="navigateTo('add-course')">
                    <i class="fa-solid fa-plus"></i> Add Course
                </button>
            </div>`;
        return;
    }

    grid.innerHTML = coursesData.map((c, i) => `
        <div class="admin-course-card fade-in-up" style="animation-delay:${i * 0.05}s" onclick="openCourseDetail(${i})">
            <div class="course-thumb">
                <img src="${c.img || placeholder}" alt="${c.title}"
                    onerror="this.src='${placeholder}'">
                <div class="play-overlay"><i class="fa-solid fa-arrow-right"></i></div>
            </div>
            <div class="admin-course-body">
                <h3>${c.title}</h3>
                <div class="admin-course-meta">
                    <span class="students"><i class="fa-solid fa-users"></i> ${c.students || 0}</span>
                    <span class="price">${c.price}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                    <span class="status ${c.status}">${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>
                    <span style="font-size:0.78rem;color:var(--text-muted);font-weight:600">
                        <i class="fa-solid fa-list"></i> ${(c.subtopics || []).length} subtopics
                    </span>
                </div>
                <div class="admin-course-actions" onclick="event.stopPropagation()">
                    <button class="btn-icon-sm" title="Manage" onclick="openCourseDetail(${i})">
                        <i class="fa-solid fa-folder-open"></i>
                    </button>
                    <button class="btn-icon-sm danger" title="Delete" onclick="deleteCourse(event,${i})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>`).join('');
}

function deleteCourse(e, i) {
    e.stopPropagation();
    if (!confirm('Delete this course and all its content?')) return;
    coursesData.splice(i, 1);
    saveData(KEYS.courses, coursesData);
    renderAdminCourses();
    showToast('Course deleted!');
    updateDashStats();
}

/* ----- Add Course Form ----- */
document.getElementById('add-course-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const course_name = document.getElementById('course-title').value.trim();
    const instructor  = document.getElementById('course-instructor').value.trim();
    const price       = document.getElementById('course-price').value;
    const description = document.getElementById('course-description').value.trim();

    if (!courseThumbData) {
        showToast('Please upload a thumbnail image.', 'error');
        return;
    }

    // Convert base64 image to file
    const blob = await fetch(courseThumbData).then(res => res.blob());

    const formData = new FormData();

    // Match Django model names exactly
    formData.append('course_name', course_name);
    formData.append('price', price || 0);
    formData.append('instructor', instructor);
    formData.append('description', description);

    // thumbnail field matches Django model
    formData.append('thumbnail', blob, courseThumbName);

    try {

        const response = await fetch('http://192.168.1.8:8000/api/create_course/', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to create course');
        }

        showToast('Course created successfully!');

        document.getElementById('add-course-form').reset();

        courseThumbData = null;
        courseThumbName = '';

        courseThumbPreviewEl.style.display = 'none';
        courseThumbUploadEl.style.display = '';

        renderAdminCourses();
        updateDashStats();

        setTimeout(() => navigateTo('all-courses'), 600);

    } catch (error) {
        console.error(error);
        showToast(error.message || 'Something went wrong', 'error');
    }
});

/* ============================================================
   COURSE DETAIL & SUBTOPICS
   ============================================================ */
function openCourseDetail(i) {
    coursesData = loadData(KEYS.courses, []);
    currentCourseIdx = i;
    const c = coursesData[i];
    if (!c) return;

    document.getElementById('detail-course-title').textContent = c.title;
    document.getElementById('detail-course-meta').textContent  =
        `${c.instructor} · ${c.level} · ${c.students || 0} students`;

    const ph = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80';
    document.getElementById('detail-banner').innerHTML = `
        <img src="${c.img || ph}" class="banner-thumb" alt="${c.title}" onerror="this.src='${ph}'">
        <div class="banner-info">
            <h2>${c.title}</h2>
            <p>${c.description || ''}</p>
            <div class="banner-tags">
                <span><i class="fa-solid fa-user"></i> ${c.instructor}</span>
                <span><i class="fa-solid fa-layer-group"></i> ${c.level}</span>
                <span><i class="fa-solid fa-tag"></i> ${c.price}</span>
                <span class="status ${c.status}">${c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>
            </div>
        </div>`;

    renderSubtopics();
    navigateTo('course-detail');
}

document.getElementById('back-to-courses').addEventListener('click', () => navigateTo('all-courses'));

function renderSubtopics() {
    coursesData = loadData(KEYS.courses, []);
    const c    = coursesData[currentCourseIdx];
    if (!c) return;
    const subs = c.subtopics || [];
    const list = document.getElementById('subtopics-list');
    const countEl = document.getElementById('subtopic-count');
    countEl.textContent = subs.length + ' Subtopic' + (subs.length !== 1 ? 's' : '');

    if (subs.length === 0) {
        list.innerHTML = `
            <div class="empty-subtopics">
                <i class="fa-solid fa-folder-open"></i>
                <h3>No subtopics yet</h3>
                <p>Click "Add Subtopic" to start building course content</p>
            </div>`;
        return;
    }

    list.innerHTML = subs.map((s, i) => {
        const mcqCount = (s.mcqs || []).length;
        return `
        <div class="subtopic-item">
            <div class="subtopic-number">${i + 1}</div>
            <div class="subtopic-content">
                <h4>${s.title}</h4>
                ${s.description ? `<p>${s.description}</p>` : ''}
                <div class="subtopic-attachments">
                    <span class="attachment-badge video" onclick="playSubtopicVideo(${i})">
                        <i class="fa-solid fa-play"></i> Watch Video
                    </span>
                    ${s.notesName
                        ? `<span class="attachment-badge notes" onclick="downloadNotes(${i})">
                               <i class="fa-solid fa-file-arrow-down"></i> ${s.notesName}
                           </span>`
                        : ''}
                    ${s.duration
                        ? `<span class="attachment-badge duration">
                               <i class="fa-solid fa-clock"></i> ${s.duration}
                           </span>`
                        : ''}
                    <span class="attachment-badge test" onclick="openMcqModal(${i})">
                        <i class="fa-solid fa-clipboard-question"></i> MCQ Test (${mcqCount})
                    </span>
                </div>
            </div>
            <div class="subtopic-actions">
                <button class="btn-icon-sm" title="Edit" onclick="editSubtopic(${i})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon-sm danger" title="Delete" onclick="deleteSubtopic(${i})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>`;
    }).join('');
}

/* ----- Video Preview ----- */
const previewModal  = document.getElementById('preview-modal');
const videoWrapperEl = document.getElementById('video-wrapper');

function getEmbedURL(url) {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v='))
        return 'https://www.youtube.com/embed/' + url.split('v=')[1].split('&')[0];
    if (url.includes('youtu.be/'))
        return 'https://www.youtube.com/embed/' + url.split('youtu.be/')[1].split('?')[0];
    if (url.includes('youtube.com/embed/') || url.includes('vimeo.com/')) return url;
    return url;
}

function playSubtopicVideo(i) {
    coursesData = loadData(KEYS.courses, []);
    const s = coursesData[currentCourseIdx].subtopics[i];
    document.getElementById('preview-title').textContent = s.title;
    const eu = getEmbedURL(s.video);
    videoWrapperEl.innerHTML = (eu.includes('youtube.com/embed') || eu.includes('vimeo.com'))
        ? `<iframe src="${eu}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`
        : `<video src="${eu}" controls></video>`;
    document.getElementById('preview-details').innerHTML =
        `<p style="color:var(--text-muted);font-size:0.9rem;margin-top:8px">${s.description || ''}</p>`;
    previewModal.classList.add('show');
}

function closePreviewModal() { previewModal.classList.remove('show'); videoWrapperEl.innerHTML = ''; }
document.getElementById('close-preview').addEventListener('click', closePreviewModal);
previewModal.addEventListener('click', (e) => { if (e.target === previewModal) closePreviewModal(); });

function downloadNotes(i) {
    coursesData = loadData(KEYS.courses, []);
    const s = coursesData[currentCourseIdx].subtopics[i];
    if (s.notesData) {
        const a = document.createElement('a');
        a.href = s.notesData; a.download = s.notesName; a.click();
    } else showToast('Notes: ' + s.notesName);
}

/* ----- Add / Edit Subtopic Modal ----- */
const subtopicModal  = document.getElementById('subtopic-modal');
const subtopicForm   = document.getElementById('subtopic-form');
const notesUpArea    = document.getElementById('notes-upload-area');
const notesFileInput = document.getElementById('subtopic-notes');
const uploadedFileEl = document.getElementById('uploaded-file-name');
const fileNameTextEl = document.getElementById('file-name-text');
const removeFileEl   = document.getElementById('remove-file');

let editingSubIdx    = null;
let uploadedFileData = null;
let uploadedFileN    = '';

document.getElementById('add-subtopic-btn').addEventListener('click', () => {
    editingSubIdx = null;
    document.getElementById('subtopic-modal-title').textContent = 'Add Subtopic';
    document.getElementById('subtopic-submit-text').textContent = 'Add Subtopic';
    subtopicForm.reset();
    uploadedFileData = null; uploadedFileN = '';
    uploadedFileEl.style.display = 'none'; notesUpArea.style.display = '';
    subtopicModal.classList.add('show');
});

function editSubtopic(i) {
    coursesData = loadData(KEYS.courses, []);
    const s = coursesData[currentCourseIdx].subtopics[i];
    editingSubIdx = i;
    document.getElementById('subtopic-modal-title').textContent = 'Edit Subtopic';
    document.getElementById('subtopic-submit-text').textContent = 'Save Changes';
    document.getElementById('subtopic-title').value       = s.title;
    document.getElementById('subtopic-video').value       = s.video;
    document.getElementById('subtopic-description').value = s.description || '';
    document.getElementById('subtopic-duration').value    = s.duration || '';
    if (s.notesName) {
        uploadedFileN = s.notesName; uploadedFileData = s.notesData || null;
        fileNameTextEl.textContent = s.notesName;
        uploadedFileEl.style.display = 'flex'; notesUpArea.style.display = 'none';
    } else {
        uploadedFileN = ''; uploadedFileData = null;
        uploadedFileEl.style.display = 'none'; notesUpArea.style.display = '';
    }
    subtopicModal.classList.add('show');
}

function closeSubtopicModal() { subtopicModal.classList.remove('show'); }
document.getElementById('close-subtopic').addEventListener('click', closeSubtopicModal);
document.getElementById('cancel-subtopic').addEventListener('click', closeSubtopicModal);
subtopicModal.addEventListener('click', (e) => { if (e.target === subtopicModal) closeSubtopicModal(); });

notesUpArea.addEventListener('click', () => notesFileInput.click());
notesUpArea.addEventListener('dragover', (e) => { e.preventDefault(); notesUpArea.style.borderColor = 'var(--primary)'; });
notesUpArea.addEventListener('dragleave', () => { notesUpArea.style.borderColor = ''; });
notesUpArea.addEventListener('drop', (e) => {
    e.preventDefault(); notesUpArea.style.borderColor = '';
    if (e.dataTransfer.files.length) handleNoteFile(e.dataTransfer.files[0]);
});
notesFileInput.addEventListener('change', (e) => { if (e.target.files.length) handleNoteFile(e.target.files[0]); });

function handleNoteFile(f) {
    uploadedFileN = f.name;
    const r = new FileReader();
    r.onload = (ev) => {
        uploadedFileData = ev.target.result;
        fileNameTextEl.textContent = f.name;
        uploadedFileEl.style.display = 'flex'; notesUpArea.style.display = 'none';
    };
    r.readAsDataURL(f);
}

removeFileEl.addEventListener('click', () => {
    uploadedFileData = null; uploadedFileN = ''; notesFileInput.value = '';
    uploadedFileEl.style.display = 'none'; notesUpArea.style.display = '';
});

subtopicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    coursesData = loadData(KEYS.courses, []);
    const sub = {
        title:       document.getElementById('subtopic-title').value.trim(),
        video:       document.getElementById('subtopic-video').value.trim(),
        notesData:   uploadedFileData || '',
        notesName:   uploadedFileN,
        description: document.getElementById('subtopic-description').value.trim(),
        duration:    document.getElementById('subtopic-duration').value.trim(),
        mcqs:        []
    };
    if (!coursesData[currentCourseIdx].subtopics)
        coursesData[currentCourseIdx].subtopics = [];

    if (editingSubIdx !== null) {
        sub.mcqs = coursesData[currentCourseIdx].subtopics[editingSubIdx].mcqs || [];
        coursesData[currentCourseIdx].subtopics[editingSubIdx] = sub;
        showToast('Subtopic updated!');
    } else {
        coursesData[currentCourseIdx].subtopics.push(sub);
        showToast('Subtopic added!');
    }

    saveData(KEYS.courses, coursesData);
    closeSubtopicModal();
    renderSubtopics();
    renderAdminCourses();
});

function deleteSubtopic(i) {
    if (!confirm('Delete this subtopic and its MCQ test?')) return;
    coursesData = loadData(KEYS.courses, []);
    coursesData[currentCourseIdx].subtopics.splice(i, 1);
    saveData(KEYS.courses, coursesData);
    renderSubtopics();
    renderAdminCourses();
    showToast('Subtopic deleted!');
}

/* ============================================================
   MCQ MODULE
   ============================================================ */
const mcqModal   = document.getElementById('mcq-modal');
const mcqForm    = document.getElementById('mcq-form');
let   mcqSubIdx  = null;

function openMcqModal(subIdx) {
    coursesData = loadData(KEYS.courses, []);
    mcqSubIdx = subIdx;
    const s = coursesData[currentCourseIdx].subtopics[subIdx];
    document.getElementById('mcq-modal-title').textContent = 'MCQ Test — ' + s.title;
    mcqForm.reset();
    renderMcqList();
    mcqModal.classList.add('show');
}

function closeMcqModal() {
    mcqModal.classList.remove('show');
    renderSubtopics(); // refresh badge count
}

document.getElementById('close-mcq').addEventListener('click', closeMcqModal);
document.getElementById('close-mcq-done').addEventListener('click', closeMcqModal);
mcqModal.addEventListener('click', (e) => { if (e.target === mcqModal) closeMcqModal(); });

function renderMcqList() {
    coursesData = loadData(KEYS.courses, []);
    const s    = coursesData[currentCourseIdx].subtopics[mcqSubIdx];
    const mcqs = s.mcqs || [];
    const list = document.getElementById('mcq-questions-list');

    if (mcqs.length === 0) {
        list.innerHTML = `
            <div class="mcq-questions-empty">
                <i class="fa-solid fa-clipboard-question" style="font-size:2rem;margin-bottom:10px;display:block;color:var(--border-light)"></i>
                No questions added yet. Use the form below to add your first question.
            </div>`;
        return;
    }

    list.innerHTML = mcqs.map((m, i) => `
        <div class="mcq-question-card">
            <div class="mcq-q-header">
                <div class="mcq-q-number">${i + 1}</div>
                <h5>${m.q}</h5>
                <button class="btn-icon-sm danger" title="Delete question" onclick="deleteMcq(${i})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="mcq-options-grid">
                ${['A','B','C','D'].map(opt => `
                    <div class="mcq-option ${m.correct === opt ? 'correct' : ''}">
                        <span class="mcq-option-label">${opt}</span>
                        ${m[opt.toLowerCase()]}
                        ${m.correct === opt ? ' <i class="fa-solid fa-check" style="margin-left:auto;color:var(--accent-green)"></i>' : ''}
                    </div>`).join('')}
            </div>
        </div>`).join('');
}

mcqForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('mcq-question').value.trim();
    const a = document.getElementById('mcq-opt-a').value.trim();
    const b = document.getElementById('mcq-opt-b').value.trim();
    const c = document.getElementById('mcq-opt-c').value.trim();
    const d = document.getElementById('mcq-opt-d').value.trim();
    const correct = document.getElementById('mcq-correct').value;

    if (!q || !a || !b || !c || !d || !correct) { showToast('Please fill all fields.', 'error'); return; }

    coursesData = loadData(KEYS.courses, []);
    if (!coursesData[currentCourseIdx].subtopics[mcqSubIdx].mcqs)
        coursesData[currentCourseIdx].subtopics[mcqSubIdx].mcqs = [];

    coursesData[currentCourseIdx].subtopics[mcqSubIdx].mcqs.push({ q, a, b, c, d, correct });
    saveData(KEYS.courses, coursesData);
    mcqForm.reset();
    renderMcqList();
    showToast('Question added!');
});

function deleteMcq(i) {
    if (!confirm('Delete this question?')) return;
    coursesData = loadData(KEYS.courses, []);
    coursesData[currentCourseIdx].subtopics[mcqSubIdx].mcqs.splice(i, 1);
    saveData(KEYS.courses, coursesData);
    renderMcqList();
    showToast('Question deleted!');
}

/* ============================================================
   COUPON MODULE (IIFE — private scope)
   ============================================================ */
(() => {
    'use strict';

    const COUPONS_PER_PAGE = 15;

    let couponsData  = loadData(KEYS.coupons, []);
    let cpPage       = 1;
    let cpFilter     = 'all';
    let cpSearch     = '';
    let cpEditId     = null;
    let cpDeleteId   = null;
    let cpDiscType   = 'percentage';

    // Seed 2 dummy coupons only if empty
    if (couponsData.length === 0) {
        couponsData = [
            {
                id: 'CP_SEED1', code: 'WELCOME20',
                description: '20% off for new users',
                discountType: 'percentage', discountValue: 20,
                minOrder: 0, maxUses: 100, usedCount: 12,
                startDate: '2024-01-01', expiryDate: '2025-12-31',
                status: 'active', course: 'All Courses', createdAt: '2024-01-01'
            },
            {
                id: 'CP_SEED2', code: 'FLAT10',
                description: '$10 flat discount on any course',
                discountType: 'flat', discountValue: 10,
                minOrder: 30, maxUses: 50, usedCount: 22,
                startDate: '2024-06-01', expiryDate: '2025-06-01',
                status: 'active', course: 'All Courses', createdAt: '2024-06-01'
            }
        ];
        saveData(KEYS.coupons, couponsData);
    }

    /* DOM refs */
    const el  = (id) => document.getElementById(id);
    const D   = {};
    const IDS = [
        'coupon-tbody','coupon-count-badge','coupon-page-info','coupon-page-btns',
        'coupon-search-input','coupon-modal','coupon-modal-title','coupon-submit-text',
        'coupon-form','coupon-code-input','coupon-description-input','coupon-value-input',
        'coupon-min-order','coupon-course-select','coupon-start-date','coupon-expiry-date',
        'coupon-max-uses','coupon-unlimited','close-coupon-modal','cancel-coupon',
        'type-percent-btn','type-flat-btn','value-suffix','preview-coupon-code',
        'preview-coupon-discount','generate-code-btn','coupon-delete-modal',
        'delete-coupon-code','coupon-delete-cancel','coupon-delete-confirm','open-add-coupon-btn'
    ];
    IDS.forEach(id => { D[id.replace(/-/g,'_')] = el(id); });

    /* Utils */
    function todayStr()    { return new Date().toISOString().split('T')[0]; }
    function fmtDate(d)    { return d ? new Date(d).toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'}) : '—'; }
    function getDays(d)    { const n = new Date(); n.setHours(0,0,0,0); const t = new Date(d); t.setHours(0,0,0,0); return Math.ceil((t-n)/86400000); }
    function esc(s)        { const dv = document.createElement('div'); dv.textContent = s||''; return dv.innerHTML; }
    function genCode()     { const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let r=''; for(let i=0;i<8;i++) r+=c[Math.floor(Math.random()*c.length)]; return r; }

    function resolveStatus(cp) {
        if (cp.status === 'inactive') return 'inactive';
        const n = new Date(); n.setHours(0,0,0,0);
        const s = new Date(cp.startDate);  s.setHours(0,0,0,0);
        const e = new Date(cp.expiryDate); e.setHours(0,0,0,0);
        if (n < s) return 'scheduled';
        if (n > e) return 'expired';
        if (cp.maxUses > 0 && cp.usedCount >= cp.maxUses) return 'expired';
        return 'active';
    }

    function getFiltered() {
        const q = cpSearch.toLowerCase().trim();
        return couponsData.filter(cp => {
            const st = resolveStatus(cp);
            return (cpFilter === 'all' || st === cpFilter) &&
                   (!q || cp.code.toLowerCase().includes(q) ||
                    (cp.description||'').toLowerCase().includes(q) ||
                    (cp.course||'').toLowerCase().includes(q));
        });
    }

    function updateCourseSelect() {
        if (!D.coupon_course_select) return;
        const courses = loadData(KEYS.courses, []);
        D.coupon_course_select.innerHTML =
            '<option value="All Courses">All Courses</option>' +
            courses.map(c => `<option value="${esc(c.title)}">${esc(c.title)}</option>`).join('');
    }

    /* Render table */
    function renderTable() {
        couponsData = loadData(KEYS.coupons, []);
        const filtered  = getFiltered();
        const total     = filtered.length;
        const totalPgs  = Math.max(1, Math.ceil(total / COUPONS_PER_PAGE));
        if (cpPage > totalPgs) cpPage = totalPgs;
        const start = (cpPage - 1) * COUPONS_PER_PAGE;
        const page  = filtered.slice(start, start + COUPONS_PER_PAGE);

        if (D.coupon_count_badge) D.coupon_count_badge.textContent = total + ' Coupon' + (total !== 1 ? 's' : '');
        const tbody = D.coupon_tbody; if (!tbody) return;

        if (page.length === 0) {
            tbody.innerHTML = `
                <tr><td colspan="7" style="padding:0">
                    <div class="coupon-empty">
                        <div class="coupon-empty-icon"><i class="fa-solid fa-ticket-simple"></i></div>
                        <h3>${cpSearch ? 'No coupons match your search' : 'No coupons yet'}</h3>
                        <p>${cpSearch ? 'Try a different search term or filter' : 'Create your first coupon to get started'}</p>
                        ${!cpSearch ? '<button class="btn-primary" id="cp-empty-btn" style="margin:0 auto"><i class="fa-solid fa-plus"></i> Create Coupon</button>' : ''}
                    </div>
                </td></tr>`;
            const eb = document.getElementById('cp-empty-btn');
            if (eb) eb.addEventListener('click', openAdd);
            renderPag(0, 0, 0, 1);
            updateDashStats();
            return;
        }

        const frag = document.createDocumentFragment();
        page.forEach(cp => {
            const st    = resolveStatus(cp);
            const days  = getDays(cp.expiryDate);
            const isUn  = cp.maxUses === 0;
            const pct   = isUn ? 0 : Math.min(100, Math.round((cp.usedCount / cp.maxUses) * 100));
            const fc    = pct >= 100 ? 'full' : pct >= 85 ? 'danger' : '';
            let vc, vt;
            if      (st === 'expired')   { vc = 'expired';  vt = 'Expired'; }
            else if (st === 'scheduled') { vc = 'valid';    vt = 'Starts in ' + Math.abs(getDays(cp.startDate)) + 'd'; }
            else if (days <= 30)         { vc = 'expiring'; vt = days + 'd left'; }
            else                         { vc = 'valid';    vt = days + 'd left'; }
            const dc  = cp.discountType === 'percentage' ? 'percentage' : 'flat';
            const di  = cp.discountType === 'percentage' ? 'fa-percent' : 'fa-dollar-sign';
            const dl  = cp.discountType === 'percentage' ? cp.discountValue + '% OFF' : '$' + cp.discountValue + ' OFF';
            const tgi = st === 'inactive' ? 'fa-toggle-off' : 'fa-toggle-on';
            const tr  = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="coupon-code-cell">
                        <span class="coupon-code-tag" data-code="${esc(cp.code)}" title="Click to copy">${esc(cp.code)}</span>
                        <button class="copy-btn" data-code="${esc(cp.code)}" title="Copy"><i class="fa-regular fa-copy"></i></button>
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">${esc(cp.description||'')}</div>
                </td>
                <td><span class="discount-badge ${dc}"><i class="fa-solid ${di}"></i> ${dl}</span></td>
                <td style="font-size:0.85rem;color:var(--text-muted);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(cp.course||'All Courses')}">${esc(cp.course||'All Courses')}</td>
                <td>
                    <div class="usage-cell">
                        <span class="usage-numbers">${cp.usedCount}${isUn?' / ∞':' / '+cp.maxUses}</span>
                        ${!isUn
                            ? `<div class="usage-bar-wrap"><div class="usage-bar-fill ${fc}" style="width:${pct}%"></div></div>`
                            : `<span style="font-size:0.72rem;color:var(--accent-purple);font-weight:700"><i class="fa-solid fa-infinity"></i> Unlimited</span>`}
                    </div>
                </td>
                <td>
                    <div class="validity-cell">
                        <span class="validity-date">${fmtDate(cp.expiryDate)}</span>
                        <span class="validity-remaining ${vc}">${vt}</span>
                    </div>
                </td>
                <td><span class="coupon-status ${st}">${st.charAt(0).toUpperCase()+st.slice(1)}</span></td>
                <td>
                    <div class="coupon-actions">
                        <button class="coupon-toggle-btn edit" data-action="edit" data-id="${cp.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="coupon-toggle-btn toggle" data-action="toggle" data-id="${cp.id}" title="${st==='inactive'?'Enable':'Disable'}"><i class="fa-solid ${tgi}"></i></button>
                        <button class="coupon-toggle-btn delete" data-action="delete" data-id="${cp.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>`;
            frag.appendChild(tr);
        });
        tbody.innerHTML = '';
        tbody.appendChild(frag);
        renderPag(start + 1, Math.min(start + COUPONS_PER_PAGE, total), total, totalPgs);
        updateDashStats();
    }

    function renderPag(f, t, tot, tp) {
        if (D.coupon_page_info) D.coupon_page_info.textContent = tot === 0 ? 'No results' : `Showing ${f}–${t} of ${tot} coupons`;
        if (!D.coupon_page_btns) return;
        if (tp <= 1) { D.coupon_page_btns.innerHTML = ''; return; }

        let startP = Math.max(1, cpPage - 2);
        let endP   = Math.min(tp, startP + 4);
        if (endP - startP < 4) startP = Math.max(1, endP - 4);

        let h = `<button class="c-page-btn" ${cpPage===1?'disabled':''} data-page="${cpPage-1}"><i class="fa-solid fa-chevron-left"></i></button>`;
        if (startP > 1) { h += `<button class="c-page-btn" data-page="1">1</button>`; if (startP > 2) h += `<button class="c-page-btn" disabled>…</button>`; }
        for (let i = startP; i <= endP; i++) h += `<button class="c-page-btn ${i===cpPage?'active':''}" data-page="${i}">${i}</button>`;
        if (endP < tp) { if (endP < tp - 1) h += `<button class="c-page-btn" disabled>…</button>`; h += `<button class="c-page-btn" data-page="${tp}">${tp}</button>`; }
        h += `<button class="c-page-btn" ${cpPage===tp?'disabled':''} data-page="${cpPage+1}"><i class="fa-solid fa-chevron-right"></i></button>`;
        D.coupon_page_btns.innerHTML = h;
    }

    /* Open modals */
    function openAdd() {
        cpEditId = null; cpDiscType = 'percentage';
        D.coupon_modal_title.textContent = 'Create Coupon';
        D.coupon_submit_text.textContent  = 'Create Coupon';
        D.coupon_form.reset();
        setDT('percentage'); updatePrev();
        D.coupon_start_date.value = todayStr();
        D.coupon_unlimited.checked = false;
        D.coupon_max_uses.disabled = false;
        updateCourseSelect();
        D.coupon_modal.classList.add('show');
    }

    function openEdit(id) {
        couponsData = loadData(KEYS.coupons, []);
        const cp = couponsData.find(x => x.id === id); if (!cp) return;
        cpEditId = id; cpDiscType = cp.discountType;
        D.coupon_modal_title.textContent = 'Edit Coupon';
        D.coupon_submit_text.textContent  = 'Save Changes';
        D.coupon_code_input.value         = cp.code;
        D.coupon_description_input.value  = cp.description || '';
        D.coupon_value_input.value        = cp.discountValue;
        D.coupon_min_order.value          = cp.minOrder || '';
        D.coupon_start_date.value         = cp.startDate;
        D.coupon_expiry_date.value        = cp.expiryDate;
        updateCourseSelect();
        D.coupon_course_select.value = cp.course || 'All Courses';
        if (cp.maxUses === 0) {
            D.coupon_unlimited.checked = true; D.coupon_max_uses.disabled = true; D.coupon_max_uses.value = '';
        } else {
            D.coupon_unlimited.checked = false; D.coupon_max_uses.disabled = false; D.coupon_max_uses.value = cp.maxUses;
        }
        setDT(cp.discountType); updatePrev();
        D.coupon_modal.classList.add('show');
    }

    function closeModal() { cpEditId = null; D.coupon_modal.classList.remove('show'); }

    function setDT(type) {
        cpDiscType = type;
        D.type_percent_btn.classList.toggle('active', type === 'percentage');
        D.type_flat_btn.classList.toggle('active', type === 'flat');
        D.value_suffix.textContent = type === 'percentage' ? '%' : '$';
        D.coupon_value_input.max   = type === 'percentage' ? 100 : 999999;
        updatePrev();
    }

    function updatePrev() {
        const code = (D.coupon_code_input?.value || '').toUpperCase() || 'COUPONCODE';
        const val  = D.coupon_value_input?.value || '0';
        if (D.preview_coupon_code)     D.preview_coupon_code.textContent     = code;
        if (D.preview_coupon_discount) D.preview_coupon_discount.textContent =
            cpDiscType === 'percentage' ? val + '% discount' : '$' + val + ' flat discount';
    }

    function handleSubmit(e) {
        e.preventDefault();
        const code  = (D.coupon_code_input.value || '').trim().toUpperCase();
        const desc  = (D.coupon_description_input.value || '').trim();
        const dv    = parseFloat(D.coupon_value_input.value)  || 0;
        const mo    = parseFloat(D.coupon_min_order.value)    || 0;
        const course = D.coupon_course_select.value || 'All Courses';
        const sd    = D.coupon_start_date.value;
        const ed    = D.coupon_expiry_date.value;
        const isUn  = D.coupon_unlimited.checked;
        const mu    = isUn ? 0 : (parseInt(D.coupon_max_uses.value) || 0);

        if (!code)                            { showToast('Enter a coupon code.', 'error');         return; }
        if (!/^[A-Z0-9]+$/.test(code))        { showToast('Code: letters and numbers only.', 'error'); return; }
        if (code.length > 20)                 { showToast('Code max 20 characters.', 'error');     return; }
        if (dv <= 0)                          { showToast('Enter a valid discount value.', 'error'); return; }
        if (cpDiscType === 'percentage' && dv > 100) { showToast('Percentage cannot exceed 100%.', 'error'); return; }
        if (!sd)                              { showToast('Set a start date.', 'error');            return; }
        if (!ed)                              { showToast('Set an expiry date.', 'error');          return; }
        if (sd > ed)                          { showToast('Expiry must be after start date.', 'error'); return; }
        if (!isUn && mu <= 0)                 { showToast('Set max uses or enable unlimited.', 'error'); return; }

        couponsData = loadData(KEYS.coupons, []);
        if (couponsData.find(c => c.code === code && c.id !== cpEditId)) { showToast(`Code "${code}" already exists!`, 'error'); return; }

        if (cpEditId) {
            const idx = couponsData.findIndex(c => c.id === cpEditId);
            if (idx > -1) {
                couponsData[idx] = { ...couponsData[idx], code, description: desc, discountType: cpDiscType, discountValue: dv, minOrder: mo, course, startDate: sd, expiryDate: ed, maxUses: mu };
                showToast('Coupon updated!');
            }
        } else {
            couponsData.unshift({ id: 'CP_' + Date.now(), code, description: desc, discountType: cpDiscType, discountValue: dv, minOrder: mo, maxUses: mu, usedCount: 0, startDate: sd, expiryDate: ed, status: 'active', course, createdAt: todayStr() });
            showToast('Coupon created!');
        }

        saveData(KEYS.coupons, couponsData);
        closeModal();
        renderTable();
    }

    /* Bind events */
    function bind() {
        /* Table delegation */
        D.coupon_tbody?.addEventListener('click', (e) => {
            const copyEl = e.target.closest('[data-code]');
            if (copyEl) {
                navigator.clipboard.writeText(copyEl.dataset.code)
                    .then(() => showToast(`Copied "${copyEl.dataset.code}"!`))
                    .catch(() => showToast('Copy failed.', 'error'));
                return;
            }
            const ab = e.target.closest('[data-action]');
            if (!ab) return;
            const { action, id } = ab.dataset;
            if (action === 'edit') { openEdit(id); }
            else if (action === 'toggle') {
                couponsData = loadData(KEYS.coupons, []);
                const cp = couponsData.find(x => x.id === id); if (!cp) return;
                const st = resolveStatus(cp);
                if (st === 'expired')   { showToast('Cannot enable an expired coupon.', 'error'); return; }
                if (st === 'scheduled') { showToast('Scheduled coupons activate automatically.'); return; }
                cp.status = cp.status === 'inactive' ? 'active' : 'inactive';
                saveData(KEYS.coupons, couponsData);
                renderTable();
                showToast(cp.status === 'active' ? 'Coupon enabled!' : 'Coupon disabled!');
            }
            else if (action === 'delete') {
                couponsData = loadData(KEYS.coupons, []);
                cpDeleteId = id;
                const cp = couponsData.find(x => x.id === id);
                if (D.delete_coupon_code) D.delete_coupon_code.textContent = cp ? cp.code : '';
                D.coupon_delete_modal?.classList.add('show');
            }
        });

        /* Pagination */
        D.coupon_page_btns?.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-page]');
            if (!btn || btn.disabled) return;
            cpPage = parseInt(btn.dataset.page);
            renderTable();
            document.getElementById('coupons-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        /* Search debounced */
        D.coupon_search_input?.addEventListener('input', (() => {
            let timer;
            return (e) => { clearTimeout(timer); timer = setTimeout(() => { cpSearch = e.target.value; cpPage = 1; renderTable(); }, 250); };
        })());

        /* Filter buttons */
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.addEventListener('click', () => {
                cpFilter = b.dataset.filter; cpPage = 1;
                document.querySelectorAll('.filter-btn').forEach(x => x.classList.toggle('active', x.dataset.filter === cpFilter));
                renderTable();
            });
        });

        /* Discount type */
        D.type_percent_btn?.addEventListener('click', () => setDT('percentage'));
        D.type_flat_btn?.addEventListener('click',    () => setDT('flat'));

        /* Live preview */
        D.coupon_code_input?.addEventListener('input',  updatePrev);
        D.coupon_value_input?.addEventListener('input', updatePrev);

        /* Generate code */
        D.generate_code_btn?.addEventListener('click', () => { D.coupon_code_input.value = genCode(); updatePrev(); });

        /* Unlimited toggle */
        D.coupon_unlimited?.addEventListener('change', () => {
            D.coupon_max_uses.disabled = D.coupon_unlimited.checked;
            if (D.coupon_unlimited.checked) D.coupon_max_uses.value = '';
        });

        /* Form submit */
        D.coupon_form?.addEventListener('submit', handleSubmit);

        /* Open add */
        D.open_add_coupon_btn?.addEventListener('click', openAdd);

        /* Close modal */
        D.close_coupon_modal?.addEventListener('click', closeModal);
        D.cancel_coupon?.addEventListener('click', closeModal);
        D.coupon_modal?.addEventListener('click', (e) => { if (e.target === D.coupon_modal) closeModal(); });

        /* Delete modal */
        D.coupon_delete_cancel?.addEventListener('click', () => { cpDeleteId = null; D.coupon_delete_modal?.classList.remove('show'); });
        D.coupon_delete_confirm?.addEventListener('click', () => {
            if (cpDeleteId) {
                couponsData = loadData(KEYS.coupons, []);
                couponsData = couponsData.filter(c => c.id !== cpDeleteId);
                saveData(KEYS.coupons, couponsData);
            }
            cpDeleteId = null;
            D.coupon_delete_modal?.classList.remove('show');
            renderTable();
            showToast('Coupon deleted!');
        });
        D.coupon_delete_modal?.addEventListener('click', (e) => {
            if (e.target === D.coupon_delete_modal) { cpDeleteId = null; D.coupon_delete_modal.classList.remove('show'); }
        });

        /* Escape key */
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (D.coupon_modal?.classList.contains('show'))        closeModal();
            if (D.coupon_delete_modal?.classList.contains('show')) { cpDeleteId = null; D.coupon_delete_modal.classList.remove('show'); }
        });
    }

    bind();
    renderTable();
})(); // end coupon IIFE

/* ============================================================
   INTERSECTION OBSERVER — animate .fade-in-up on scroll
   ============================================================ */
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => {
        if (en.isIntersecting) {
            en.target.style.animationPlayState = 'running';
            fadeObserver.unobserve(en.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.animationPlayState = 'paused';
    fadeObserver.observe(el);
});