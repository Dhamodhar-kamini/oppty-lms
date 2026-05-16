// Sidebar Elements
const mobileToggle = document.getElementById('mobile-toggle');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');

// Open Sidebar
mobileToggle.addEventListener('click', () => {
    sidebar.classList.add('show');
});

// Close Sidebar via X button
closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('show');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    }
});

// Course Submenu Toggle Functionality (Fixed)
const courseToggle = document.getElementById('course-toggle');
const subMenu = document.getElementById('sub-menu');
const chevron = courseToggle.querySelector('.chevron');

// Set initial state of chevron if submenu is showing
if (subMenu.classList.contains('show')) {
    chevron.style.transform = 'rotate(-180deg)';
}

courseToggle.addEventListener('click', (e) => {
    e.preventDefault();
    
    courseToggle.classList.toggle('active');
    subMenu.classList.toggle('show');
    
    if (subMenu.classList.contains('show')) {
        chevron.style.transform = 'rotate(-180deg)';
    } else {
        chevron.style.transform = 'rotate(0deg)';
    }
});

// Animation Observer for Course Cards
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});