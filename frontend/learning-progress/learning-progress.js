// Ensure this database structure matches your my-course.js structure
const enrolledCoursesData = [
    {
        id: "course-content-panda",
        title: "Cinematic Web Animations & Interactions",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        lessonsCount: 10,
    },
    {
        id: "course-content-django",
        title: "Advanced Django Architecture & API Integration",
        image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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

    // Fetch global progress database from browser storage
    const progressDB = JSON.parse(localStorage.getItem('opptyProgress')) || {};

    let totalLessonsAcrossAllCourses = 0;
    let totalCompletedAcrossAllCourses = 0;

    // Render the Active Courses List
    const activeList = document.getElementById('active-courses-list');
    
    enrolledCoursesData.forEach(course => {
        // Calculate Progress dynamically
        const completedArray = progressDB[course.id] || [];
        const completedCount = completedArray.length;
        
        // Aggregate for overall stats
        totalLessonsAcrossAllCourses += course.lessonsCount;
        totalCompletedAcrossAllCourses += completedCount;

        let progressPercent = Math.round((completedCount / course.lessonsCount) * 100);
        progressPercent = Math.min(progressPercent, 100); // cap at 100%

        const listItemHTML = `
            <div class="progress-list-item">
                <img src="${course.image}" alt="${course.title}" class="item-thumb">
                <div class="item-details">
                    <h4 class="item-title">${course.title}</h4>
                    <div class="item-progress-wrap">
                        <div class="mini-bar-bg">
                            <div class="mini-bar-fill" style="width: 0%;" data-target-width="${progressPercent}%"></div>
                        </div>
                        <span class="item-percent">${progressPercent}%</span>
                    </div>
                </div>
            </div>
        `;
        activeList.insertAdjacentHTML('beforeend', listItemHTML);
    });

    // Animate individual bars after a short delay
    setTimeout(() => {
        document.querySelectorAll('.mini-bar-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-target-width');
        });
    }, 100);

    // Update Top Overview Stats
    document.getElementById('stat-enrolled').textContent = enrolledCoursesData.length;
    document.getElementById('stat-completed').textContent = totalCompletedAcrossAllCourses;

    // Update Overall Circular Chart
    const circle = document.getElementById('progress-meter');
    const percentText = document.getElementById('overall-percent');
    
    let overallPercent = 0;
    if(totalLessonsAcrossAllCourses > 0) {
        overallPercent = Math.round((totalCompletedAcrossAllCourses / totalLessonsAcrossAllCourses) * 100);
        overallPercent = Math.min(overallPercent, 100);
    }

    // Calculate stroke offset: Dash array is ~283 for r=45
    // Offset = 283 - (283 * percentage / 100)
    const circumference = 283;
    const offset = circumference - (circumference * overallPercent / 100);

    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
        animateValue(percentText, 0, overallPercent, 1500);
    }, 100);
});

// Helper function to animate number counting up
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + "%";
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}