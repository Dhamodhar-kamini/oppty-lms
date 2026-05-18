// ===== SIDEBAR TOGGLE =====
const mobileToggle = document.getElementById('mobile-toggle');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');

mobileToggle.addEventListener('click', () => sidebar.classList.add('show'));
closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('show'));

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    }
});

// ===== COURSE SUBMENU TOGGLE =====
const courseToggle = document.getElementById('course-toggle');
const subMenu = document.getElementById('sub-menu');
const chevron = courseToggle.querySelector('.chevron');

courseToggle.addEventListener('click', (e) => {
    e.preventDefault();
    courseToggle.classList.toggle('active');
    subMenu.classList.toggle('show');
    chevron.style.transform = subMenu.classList.contains('show') ? 'rotate(-180deg)' : 'rotate(0deg)';
});

// ===== NAVIGATION (SECTION SWITCH) =====
const navItems = document.querySelectorAll('[data-section]');
const sections = document.querySelectorAll('.content-section');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.dataset.section + '-section';
        
        // Update active nav
        document.querySelectorAll('.nav-item, .sub-menu a').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        
        // Show section
        sections.forEach(sec => sec.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            // Re-trigger animations
            targetSection.querySelectorAll('.fade-in-up').forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = '';
            });
        }
        
        if (window.innerWidth <= 992) sidebar.classList.remove('show');
    });
});

// ===== POPULATE USERS TABLE =====
const usersData = [
    { name: 'John Doe', email: 'john@example.com', role: 'Student', joined: '2024-01-15', status: 'active', img: 11 },
    { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Instructor', joined: '2023-11-20', status: 'active', img: 47 },
    { name: 'Alex Morgan', email: 'alex@example.com', role: 'Instructor', joined: '2023-08-10', status: 'active', img: 33 },
    { name: 'Emma Davis', email: 'emma@example.com', role: 'Student', joined: '2024-02-28', status: 'suspended', img: 5 },
    { name: 'Michael Brown', email: 'michael@example.com', role: 'Student', joined: '2024-03-12', status: 'active', img: 12 },
];

const usersTableBody = document.getElementById('users-table-body');
if (usersTableBody) {
    usersTableBody.innerHTML = usersData.map(user => `
        <tr>
            <td>
                <div class="course-cell">
                    <img src="https://i.pravatar.cc/150?img=${user.img}" alt="" style="border-radius:50%;width:40px;height:40px;">
                    <div><strong>${user.name}</strong></div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.joined}</td>
            <td><span class="status ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
            <td>
                <button class="btn-icon-sm"><i class="fa-solid fa-eye"></i></button>
                <button class="btn-icon-sm"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon-sm danger"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// ===== POPULATE ADMIN COURSES GRID =====
const coursesData = [
    { title: 'Cinematic Web Animations', students: 1247, price: '$69', status: 'published', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80' },
    { title: 'Advanced Django Architecture', students: 892, price: '$49', status: 'published', img: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&q=80' },
    { title: 'Type-Safe DBs with Prisma', students: 2103, price: 'FREE', status: 'draft', img: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&q=80' },
];

const adminCoursesGrid = document.getElementById('admin-courses-grid');
if (adminCoursesGrid) {
    adminCoursesGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;';
    adminCoursesGrid.innerHTML = coursesData.map(course => `
        <div style="background:var(--bg-surface);border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--border-light);box-shadow:var(--shadow-sm);">
            <img src="${course.img}" style="width:100%;height:160px;object-fit:cover;">
            <div style="padding:20px;">
                <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:12px;">${course.title}</h3>
                <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
                    <span style="color:var(--text-muted);font-size:0.85rem;"><i class="fa-solid fa-users"></i> ${course.students}</span>
                    <span style="font-weight:800;color:var(--primary);">${course.price}</span>
                </div>
                <span class="status ${course.status}">${course.status}</span>
                <div style="margin-top:16px;display:flex;gap:8px;">
                    <button class="btn-icon-sm"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon-sm danger"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== ANIMATION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});