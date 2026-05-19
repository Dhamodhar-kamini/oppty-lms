// Mock Database - Now includes video URL, curriculum, and reviews!
const coursesDB = {
    "course-animation-1": {
        title: "Cinematic Web Animations & Interactions",
        desc: "Master max-level visual effects, scroll-jacking, and high-end futuristic UI design using modern CSS and JS.",
        fullDesc: "In this comprehensive masterclass, you will go beyond basic web design and learn the secrets behind award-winning, cinematic websites. We cover advanced CSS properties, hardware acceleration, and modern JavaScript animation libraries like GSAP and Framer Motion. <br><br>Whether you are building a portfolio that demands attention or a landing page for a high-tech product, this course gives you the exact blueprint to create 'wow' moments for your users.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1", // Using Rickroll for safe testing, replace with actual video
        price: "$99.00",
        originalPrice: "$199.00",
        level: "Advanced",
        tags: ['<span class="tag">UI/UX</span>', '<span class="tag tag-new">NEW</span>'],
        learnList: [
            "Build smooth, 60fps cinematic web animations.",
            "Master scroll-triggered interactions like Apple.",
            "Implement 3D transforms and parallax effects.",
            "Create futuristic UI components that stand out."
        ],
        curriculum: [
            { title: "Introduction to GSAP", duration: "15:20" },
            { title: "ScrollTrigger Mastery", duration: "45:00" },
            { title: "Building a 3D Canvas Scene", duration: "1:20:00" },
            { title: "Micro-interactions & Polish", duration: "32:15" }
        ],
        reviews: [
            { name: "Alex Rivera", avatar: "https://i.pravatar.cc/150?img=12", text: "This course completely changed how I build websites. The GSAP section is mind-blowing!" },
            { name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=5", text: "Very clear instructions. My portfolio looks 10x better now." }
        ]
    },
    "course-django-1": {
        title: "Advanced Django Backend Architecture",
        desc: "Scale backend logic, implement robust authentication systems, and build high-performance APIs.",
        fullDesc: "Take your Python skills to the enterprise level. This course dives deep into Django, teaching you how to architect robust, scalable backend systems. You'll learn to handle complex database relationships, implement secure JWT authentication, and build blazing-fast REST APIs.<br><br>Perfect for developers looking to transition from building simple web apps to engineering systems that can handle thousands of concurrent users.",
        image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/tQzZqEIfD88?autoplay=1",
        price: "$149.00",
        originalPrice: "$249.00",
        level: "Intermediate",
        tags: ['<span class="tag">BACKEND</span>', '<span class="tag tag-hot">HOT</span>'],
        learnList: [
            "Architect scalable Django project structures.",
            "Implement secure JWT Authentication.",
            "Build robust REST APIs with Django Rest Framework.",
            "Optimize database queries for high performance."
        ],
        curriculum: [
            { title: "Setting up a Scalable Architecture", duration: "25:00" },
            { title: "Advanced ORM Queries & Optimizations", duration: "55:30" },
            { title: "JWT Auth & Permissions", duration: "40:15" },
            { title: "Deploying to AWS via Docker", duration: "1:10:00" }
        ],
        reviews: [
            { name: "John Doe", avatar: "https://i.pravatar.cc/150?img=8", text: "Finally, a course that goes beyond the basics of Django." }
        ]
    },
    "course-prisma-1": {
        title: "Prisma DB & Next.js Fullstack Integration",
        desc: "Seamlessly connect your Next.js/React stack with automated schemas and flawless database queries.",
        fullDesc: "Stop wrestling with complex SQL queries and ORM configurations. Learn how Prisma radically simplifies database management for modern React and Next.js applications. This course covers everything from schema design to automated migrations and type-safe client generation.<br><br>By the end, you'll be able to spin up robust, type-safe full-stack applications in a fraction of the time.",
        image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/F41JvRjLdks?autoplay=1",
        price: "Free",
        originalPrice: "$49.00",
        level: "Beginner",
        tags: ['<span class="tag">DATABASE</span>', '<span class="tag tag-free" style="background:#10b981; color:white;">FREE</span>'],
        learnList: [
            "Design optimal database schemas with Prisma.",
            "Integrate Prisma client with Next.js App Router.",
            "Execute type-safe CRUD operations.",
            "Handle database migrations automatically."
        ],
        curriculum: [
            { title: "Intro to Prisma Studio & Schemas", duration: "15:00" },
            { title: "Connecting Next.js 14 via Server Actions", duration: "35:00" },
            { title: "CRUD Operations & Relationships", duration: "45:00" }
        ],
        reviews: [
            { name: "Mike T.", avatar: "https://i.pravatar.cc/150?img=11", text: "Amazing free resource to get started with modern databases." }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Global Loader Handling ---
    const loader = document.getElementById('oppty-global-loader');
    
    // Hide on load
    window.addEventListener('load', () => {
        setTimeout(() => { if (loader) loader.classList.add('hide-loader'); }, 600); 
    });
    if (document.readyState === 'complete') {
        setTimeout(() => { if (loader) loader.classList.add('hide-loader'); }, 600);
    }

    // Show on navigation
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            if (!targetUrl || targetUrl.startsWith('#') || targetUrl.startsWith('javascript')) return; 
            
            e.preventDefault(); 
            if (loader) {
                loader.classList.remove('hide-loader'); 
                const icon = loader.querySelector('.loader-icon');
                const fullLogo = loader.querySelector('.loader-full-logo');
                if(icon && fullLogo) {
                    icon.style.animation = 'none';
                    fullLogo.style.animation = 'none';
                    icon.offsetHeight; 
                    icon.style.animation = null; 
                    fullLogo.style.animation = null; 
                }
            }
            setTimeout(() => { window.location.href = targetUrl; }, 400); 
        });
    });


    // --- 2. Sidebar Logic ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    if(mobileToggle) mobileToggle.addEventListener('click', () => sidebar.classList.add('show'));
    if(closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('show'));

    const courseToggle = document.getElementById('course-toggle');
    const subMenu = document.getElementById('sub-menu');
    const chevron = courseToggle ? courseToggle.querySelector('.chevron') : null;

    if (courseToggle && subMenu && chevron) {
        courseToggle.addEventListener('click', (e) => {
            e.preventDefault();
            subMenu.classList.toggle('show');
            chevron.style.transform = subMenu.classList.contains('show') ? 'rotate(-180deg)' : 'rotate(0deg)';
        });
    }

    // --- 3. Dynamic Course Data Loading ---
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    const courseData = coursesDB[courseId] || coursesDB['course-animation-1'];

    if (courseData) {
        document.getElementById('preview-title').textContent = courseData.title;
        document.querySelector('.preview-subtitle').textContent = courseData.desc;
        document.getElementById('preview-poster').src = courseData.image;
        document.getElementById('preview-price').textContent = courseData.price;
        document.getElementById('preview-original-price').textContent = courseData.originalPrice;
        document.getElementById('preview-level').innerHTML = `<i class="fa-solid fa-layer-group"></i> ${courseData.level}`;
        
        const tagsContainer = document.getElementById('preview-tags');
        tagsContainer.innerHTML = courseData.tags.join('');

        // Populate ABOUT Tab
        let listHTML = '';
        courseData.learnList.forEach(item => {
            listHTML += `<li><i class="fa-solid fa-check"></i> ${item}</li>`;
        });
        document.getElementById('tab-about').innerHTML = `
            <h3>What you'll learn</h3>
            <ul class="learning-list">${listHTML}</ul>
            <h3>Description</h3>
            <p>${courseData.fullDesc}</p>
        `;

        // Populate CURRICULUM Tab
        let currHTML = '<ul class="curriculum-list">';
        courseData.curriculum.forEach(item => {
            currHTML += `
                <li class="curriculum-item">
                    <div class="curriculum-item-left"><i class="fa-solid fa-circle-play"></i> ${item.title}</div>
                    <div class="curriculum-item-right">${item.duration}</div>
                </li>
            `;
        });
        currHTML += '</ul>';
        document.getElementById('tab-curriculum').innerHTML = `<h3>Course Content</h3>${currHTML}`;

        // Populate REVIEWS Tab
        let revHTML = '';
        courseData.reviews.forEach(item => {
            revHTML += `
                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <img src="${item.avatar}" class="reviewer-avatar">
                            <span>${item.name}</span>
                        </div>
                        <div class="review-stars">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        </div>
                    </div>
                    <p class="review-text">${item.text}</p>
                </div>
            `;
        });
        document.getElementById('tab-reviews').innerHTML = `<h3>Student Feedback</h3>${revHTML}`;
    }

    // --- 4. Tab Switching Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- 5. Video Play Modal Logic ---
    const openVideoBtn = document.getElementById('open-video-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('close-video');
    const youtubePlayer = document.getElementById('youtube-player');

    if (openVideoBtn && videoModal && closeVideoBtn && youtubePlayer) {
        openVideoBtn.addEventListener('click', () => {
            // Set the video URL and open modal
            youtubePlayer.src = courseData.videoUrl;
            videoModal.classList.add('show');
        });

        const closeVideo = () => {
            videoModal.classList.remove('show');
            // Stop video playing in background by clearing src
            setTimeout(() => { youtubePlayer.src = ""; }, 300);
        };

        closeVideoBtn.addEventListener('click', closeVideo);

        // Close on clicking outside the video content
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideo();
        });
    }

    // --- 6. Enroll Button Logic ---
    const enrollBtn = document.getElementById('btn-enroll');
    if (enrollBtn) {
        if (courseData.price.toLowerCase() === 'free') {
            enrollBtn.textContent = 'Enroll for Free';
        }
        
        enrollBtn.addEventListener('click', () => {
            enrollBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            setTimeout(() => {
                enrollBtn.innerHTML = '<i class="fa-solid fa-check"></i> Enrolled!';
                enrollBtn.style.background = 'var(--success-green)';
            }, 1500);
        });
    }
});