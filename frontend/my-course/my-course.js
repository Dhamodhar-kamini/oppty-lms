// Data with IDs that match the course-content database perfectly
const enrolledCoursesData = [
    {
        id: "course-content-panda", // Passes ID to URL
        category: "UI/UX",
        title: "Cinematic Web Animations & Interactions",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        authorImg: "https://i.pravatar.cc/150?img=15", 
        authorName: "Oppty TechHub",
        lessonsCount: 10,
        completedLessons: 6,
        progress: 60
    },
    {
        id: "course-content-django", // Passes ID to URL
        category: "BACKEND",
        title: "Advanced Django Architecture & API Integration",
        image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        authorImg: "https://i.pravatar.cc/150?img=33", 
        authorName: "Alex",
        lessonsCount: 25,
        completedLessons: 5,
        progress: 20
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

    // Render Enrolled Courses
    const grid = document.getElementById('enrolled-courses-grid');
    if (grid) {
        grid.innerHTML = '';
        enrolledCoursesData.forEach((course, index) => {
            const delay = 0.1 + (index * 0.1);
            
            // This is the crucial link: window.location.href='course-content.html?id=...'
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
                                <span>Completed: ${course.completedLessons}/${course.lessonsCount}</span>
                                <span class="percent">${course.progress}%</span>
                            </div>
                            <div class="progress-bar-bg">
                                <div class="progress-fill" style="width: ${course.progress}%;"></div>
                            </div>
                        </div>
                    </div>
                </article>
            `;
            grid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
});