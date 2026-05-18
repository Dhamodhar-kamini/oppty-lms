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

// Course Submenu Toggle Functionality
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

/* ===== Advanced Tech Icon Cross-Fade Loop ===== */
const iconClasses = [
    'fa-brands fa-react',
    'fa-brands fa-node-js',
    'fa-brands fa-vuejs',
    'fa-brands fa-python',
    'fa-brands fa-docker'
];

let currentIconIndex = 0;
const currentIconNode = document.querySelector('.tech-icon-current');
const nextIconNode = document.querySelector('.tech-icon-next');
const intervalTime = 3000; // Time in ms for a full cycle
const transitionTime = 1000; // Match the transition duration from CSS

function changeHeroIcon() {
    currentIconIndex = (currentIconIndex + 1) % iconClasses.length;
    
    // Set the hidden element to the new icon and add class structure
    nextIconNode.className = `${iconClasses[currentIconIndex]} tech-icon tech-icon-next`;

    // Trigger cross-fade
    nextIconNode.classList.remove('tech-icon-next');
    nextIconNode.classList.add('tech-icon-current');
    
    currentIconNode.classList.remove('tech-icon-current');
    currentIconNode.classList.add('tech-icon-next');

    // Wait for transition, then finalize roles
    setTimeout(() => {
        currentIconNode.className = `${iconClasses[currentIconIndex]} tech-icon tech-icon-current`;
        nextIconNode.className = `${iconClasses[(currentIconIndex + 1) % iconClasses.length]} tech-icon tech-icon-next`;
    }, transitionTime);
}

setInterval(changeHeroIcon, intervalTime);