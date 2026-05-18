// Database matching IDs passed from my-course.js
const courseContentDatabase = {
    'course-content-panda': {
        courseTitle: "Cinematic Web Animations & Interactions",
        chapters: [
            {
                title: "Chapter 1: Welcome to the Course",
                lessons: [
                    { title: "Welcome to the course", type: "video", desc: "Start your journey into high-end UI design with this comprehensive introduction. We will cover the tools needed and set expectations for the final project." },
                    { title: "What is UI design?", type: "doc", desc: "Read this document to understand the foundational principles of User Interface design and how it differs from User Experience." },
                    { title: "What is color theory?", type: "video", desc: "Learn how to mix and match colors logically. We will explore the color wheel, complementary colors, and psychological impacts." }
                ]
            },
            {
                title: "Chapter 2: Core Layout Principles",
                lessons: [
                    { title: "Grid systems explained", type: "video", desc: "Understand how 12-column grids establish rhythm and structure in your web applications." },
                    { title: "Spacing and Typography", type: "doc", desc: "A guide on macro and micro whitespace, and choosing the perfect font pairings." }
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
                    { title: "Architecture Overview", type: "video", desc: "How web servers actually work under the hood." },
                    { title: "Database schemas", type: "doc", desc: "Documentation on setting up PostgreSQL with Django ORM." }
                ]
            }
        ]
    }
};

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
    const courseId = urlParams.get('id') || 'course-content-panda'; // fallback
    const courseData = courseContentDatabase[courseId] || courseContentDatabase['course-content-panda'];

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

            html += `
                <div class="lesson-item" onclick="playLesson(this, '${safeTitle}', '${safeDesc}', '${lesson.type}')">
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
        playLesson(firstLessonElement, firstLessonData.title, firstLessonData.desc, firstLessonData.type);
    }
});

// Interactive Player Functions
window.toggleAccordion = function(chapterId) {
    const chapterElement = document.getElementById(chapterId);
    const headerElement = chapterElement.querySelector('.chapter-header');
    
    chapterElement.classList.toggle('open');
    headerElement.classList.toggle('active');
};

window.playLesson = function(element, title, desc, type) {
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

    document.getElementById('current-lesson-desc').innerHTML = `<strong>Overview:</strong><br><br>${desc}`;

    document.querySelectorAll('.lesson-item').forEach(item => item.classList.remove('active-lesson'));
    element.classList.add('active-lesson');
};