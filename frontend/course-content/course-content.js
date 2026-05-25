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




// Database matching IDs passed from my-course.js (Now includes unique Lesson IDs!)
const courseContentDatabase = {
    'course-content-panda': {
        courseTitle: "Cinematic Web Animations & Interactions",
        chapters: [
            {
                title: "Chapter 1: Welcome to the Course",
                lessons: [
                    { id: "p1", title: "Welcome to the course", type: "video", desc: "Start your journey into high-end UI design with this comprehensive introduction. We will cover the tools needed and set expectations for the final project." },
                    { id: "p2", title: "What is UI design?", type: "doc", desc: "Read this document to understand the foundational principles of User Interface design and how it differs from User Experience." },
                    { id: "p3", title: "What is color theory?", type: "video", desc: "Learn how to mix and match colors logically. We will explore the color wheel, complementary colors, and psychological impacts." }
                ]
            },
            {
                title: "Chapter 2: Core Layout Principles",
                lessons: [
                    { id: "p4", title: "Grid systems explained", type: "video", desc: "Understand how 12-column grids establish rhythm and structure in your web applications." },
                    { id: "p5", title: "Spacing and Typography", type: "doc", desc: "A guide on macro and micro whitespace, and choosing the perfect font pairings." }
                ]
            }
        ]
    },
    'course-content-django': {
        courseTitle: "Advanced Django Architecture",
        chapters: [
            {
                title: "Chapter 1: Server Basics",
                lessons: [
                    { id: "d1", title: "Architecture Overview", type: "video", desc: "How web servers actually work under the hood." },
                    { id: "d2", title: "Database schemas", type: "doc", desc: "Documentation on setting up PostgreSQL with Django ORM." }
                ]
            }
        ]
    }
};

// Global State Variables
let currentGlobalCourseId = '';
let currentGlobalLessonId = '';

document.addEventListener('DOMContentLoaded', () => {

    // Sidebar Logic
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainSidebar = document.getElementById('main-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    if(mobileToggle) mobileToggle.addEventListener('click', () => mainSidebar.classList.add('show'));
    if(closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => mainSidebar.classList.remove('show'));

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

    // Dynamic Course Logic based on URL ID
    const urlParams = new URLSearchParams(window.location.search);
    currentGlobalCourseId = urlParams.get('id') || 'course-content-panda'; // fallback
    const courseData = courseContentDatabase[currentGlobalCourseId] || courseContentDatabase['course-content-panda'];

    document.getElementById('course-main-name').textContent = courseData.courseTitle;
    document.getElementById('total-chapters-count').textContent = courseData.chapters.length;

    const accordionContainer = document.getElementById('chapters-accordion-container');
    
    courseData.chapters.forEach((chapter, chapterIndex) => {
        const chapterId = `chapter-${chapterIndex}`;
        const isOpenClass = chapterIndex === 0 ? 'open' : '';
        const isActiveClass = chapterIndex === 0 ? 'active' : '';

        let html = `
            <div class="chapter-item ${isOpenClass}" id="${chapterId}">
                <div class="chapter-header ${isActiveClass}" onclick="toggleAccordion('${chapterId}')">
                    <span>${chapter.title}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="lesson-list">
        `;

        chapter.lessons.forEach(lesson => {
            const iconClass = lesson.type === 'video' ? 'fa-play-circle' : 'fa-file-lines';
            const safeTitle = lesson.title.replace(/'/g, "\\'");
            const safeDesc = lesson.desc.replace(/'/g, "\\'");

            // We pass the unique lesson.id to playLesson
            html += `
                <div class="lesson-item" onclick="playLesson(this, '${lesson.id}', '${safeTitle}', '${safeDesc}', '${lesson.type}')">
                    <i class="fa-solid ${iconClass}"></i>
                    <span>${lesson.title}</span>
                </div>
            `;
        });

        html += `</div></div>`;
        accordionContainer.insertAdjacentHTML('beforeend', html);
    });

    // Load first lesson immediately
    const firstLessonElement = document.querySelector('.lesson-item');
    if (firstLessonElement) {
        const firstLessonData = courseData.chapters[0].lessons[0];
        playLesson(firstLessonElement, firstLessonData.id, firstLessonData.title, firstLessonData.desc, firstLessonData.type);
    }
});

// Interactive Player Functions
window.toggleAccordion = function(chapterId) {
    const chapterElement = document.getElementById(chapterId);
    const headerElement = chapterElement.querySelector('.chapter-header');
    
    chapterElement.classList.toggle('open');
    headerElement.classList.toggle('active');
};

window.playLesson = function(element, lessonId, title, desc, type) {
    // Save current global state
    currentGlobalLessonId = lessonId;

    // Update UI Content
    const videoIcon = document.getElementById('video-center-icon');
    const videoTitle = document.getElementById('video-placeholder-title');
    document.getElementById('current-lesson-title').textContent = title;
    
    if (type === 'video') {
        videoIcon.className = 'fa-solid fa-play player-icon';
        videoTitle.textContent = `Simulated Video Player: ${title}`;
    } else {
        videoIcon.className = 'fa-solid fa-file-lines player-icon';
        videoTitle.textContent = `Document Viewer: ${title}`;
    }

    // Reset Tabs to Description View
    document.getElementById('current-lesson-desc').innerHTML = `<strong>Overview:</strong><br><br>${desc}`;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    document.querySelector('.tab-btn').classList.add('active-tab'); // Sets first tab active
    document.getElementById('tab-desc').classList.remove('hidden');
    document.getElementById('tab-res').classList.add('hidden');

    // Highlight Sidebar
    document.querySelectorAll('.lesson-item').forEach(item => item.classList.remove('active-lesson'));
    element.classList.add('active-lesson');

    // Check LocalStorage to see if THIS lesson is already completed
    checkIfCompleted();
};

// Toggle Tabs Function
window.switchTab = function(tabId, btnElement) {
    // Update Button Styling
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    btnElement.classList.add('active-tab');

    // Update Content Visibility
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
};

// Mark as Complete Functionality saving to LocalStorage
window.markCurrentLessonComplete = function() {
    let progressDB = JSON.parse(localStorage.getItem('opptyProgress')) || {};
    
    // Ensure array exists for this course
    if (!progressDB[currentGlobalCourseId]) {
        progressDB[currentGlobalCourseId] = [];
    }

    // Add lesson ID if not already there
    if (!progressDB[currentGlobalCourseId].includes(currentGlobalLessonId)) {
        progressDB[currentGlobalCourseId].push(currentGlobalLessonId);
        localStorage.setItem('opptyProgress', JSON.stringify(progressDB));
    }

    // Update Button UI to "Completed"
    updateCompleteButtonUI(true);
};

// Check if lesson is completed upon loading
function checkIfCompleted() {
    let progressDB = JSON.parse(localStorage.getItem('opptyProgress')) || {};
    const courseProgress = progressDB[currentGlobalCourseId] || [];
    const isCompleted = courseProgress.includes(currentGlobalLessonId);
    
    updateCompleteButtonUI(isCompleted);
}

// Function to handle the actual Button UI state
function updateCompleteButtonUI(isCompleted) {
    const btn = document.getElementById('btn-mark-complete');
    if(isCompleted) {
        btn.innerHTML = `<i class="fa-solid fa-check-double"></i> <span>Completed</span>`;
        btn.classList.add('completed-state');
    } else {
        btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Mark as complete</span>`;
        btn.classList.remove('completed-state');
    }
}