//loader section
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('oppty-global-loader');
    
    // The total time of our CSS animation is 1.2s (icon) + 0.8s (logo) = ~2000ms
    const MIN_LOADER_TIME = 2200; 
    const startTime = Date.now();

    function hideLoader() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsedTime);

        setTimeout(() => {
            if (loader) loader.classList.add('hide-loader');
        }, remainingTime);
    }

    // --- 1. HIDE LOADER ON PAGE LOAD ---
    window.addEventListener('load', hideLoader);

    // Fallback if window is already loaded
    if (document.readyState === 'complete') {
        hideLoader();
    }

    // --- 2. SHOW LOADER ON PAGE EXIT (Link Clicks) ---
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            const targetAttr = this.getAttribute('target');

            // Ignore links that open in new tabs, anchor links, or JS triggers
            if (
                !targetUrl || 
                targetUrl.startsWith('#') || 
                targetUrl.startsWith('javascript') || 
                targetUrl.startsWith('mailto:') || 
                targetAttr === '_blank'
            ) {
                return; 
            }

            e.preventDefault(); 
            if (loader) {
                // Reset the loader animation by forcing a quick reflow
                loader.classList.remove('hide-loader');
                
                // Re-trigger the CSS animations so they play again
                const icon = loader.querySelector('.loader-icon');
                const fullLogo = loader.querySelector('.loader-full-logo');
                if(icon && fullLogo) {
                    icon.style.animation = 'none';
                    fullLogo.style.animation = 'none';
                    icon.offsetHeight; /* trigger reflow */
                    icon.style.animation = null; 
                    fullLogo.style.animation = null; 
                }
            }

            // Wait for overlay to fade in, then navigate
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400); 
        });
    });
});




// Base Database for enrolled courses
const enrolledCoursesData = [
    {
        id: "course-content-panda",
        category: "UI/UX",
        title: "Cinematic Web Animations & Interactions",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        authorImg: "https://i.pravatar.cc/150?img=15", 
        authorName: "Oppty TechHub",
        lessonsCount: 5 // Must match the total lessons in course-content.js mock data
    },
    {
        id: "course-content-django",
        category: "BACKEND",
        title: "Advanced Django Architecture & API Integration",
        image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        authorImg: "https://i.pravatar.cc/150?img=33", 
        authorName: "Alex",
        lessonsCount: 2
    }
];

document.addEventListener('DOMContentLoaded', () => {

    // Sidebar Logic
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    if (mobileToggle) mobileToggle.addEventListener('click', () => sidebar.classList.add('show'));
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('show'));

    const courseToggle = document.getElementById('course-toggle');
    const subMenu = document.getElementById('sub-menu');
    const chevron = courseToggle.querySelector('.chevron');

    if(courseToggle) {
        courseToggle.addEventListener('click', (e) => {
            e.preventDefault();
            subMenu.classList.toggle('show');
            chevron.style.transform = subMenu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }

    // Render Enrolled Courses with DYNAMIC Progress from LocalStorage
    const grid = document.getElementById('enrolled-courses-grid');
    
    // Fetch global progress database from browser storage
    const progressDB = JSON.parse(localStorage.getItem('opptyProgress')) || {};

    if (grid) {
        grid.innerHTML = '';
        enrolledCoursesData.forEach((course, index) => {
            
            // Calculate Progress dynamically
            const completedArray = progressDB[course.id] || [];
            const completedCount = completedArray.length;
            let progressPercent = Math.round((completedCount / course.lessonsCount) * 100);
            progressPercent = Math.min(progressPercent, 100); // cap at 100%

            const delay = 0.1 + (index * 0.1);
            
            const cardHTML = `
                <article class="course-card fade-in-up" style="animation-delay: ${delay}s" onclick="window.location.href='../course-content/course-content.html?id=${course.id}'">
                    <div class="card-image-wrapper">
                        <span class="card-category">${course.category}</span>
                        <img src="${course.image}" alt="${course.title}">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${course.title}</h3>
                        <div class="card-meta">
                            <span class="author"><img src="${course.authorImg}" alt="Author"> ${course.authorName}</span>
                            <span><i class="fa-solid fa-play-circle" style="color: var(--primary-blue);"></i> ${course.lessonsCount} Lessons</span>
                        </div>
                        
                        <div class="progress-container">
                            <div class="progress-text">
                                <span>Completed: ${completedCount}/${course.lessonsCount}</span>
                                <span class="percent">${progressPercent}%</span>
                            </div>
                            <div class="progress-bar-bg">
                                <div class="progress-fill" style="width: ${progressPercent}%;"></div>
                            </div>
                        </div>
                    </div>
                </article>
            `;
            grid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
});