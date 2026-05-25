document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. GLOBAL LOADER & NAVIGATION
    // ==========================================
    const loader = document.getElementById('oppty-global-loader');
    const MIN_LOADER_TIME = 2200; 
    const startTime = Date.now();

    function hideLoaderOnLoad() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);
        setTimeout(() => {
            if (loader) loader.classList.add('hide-loader');
        }, remainingTime);
    }

    window.addEventListener('load', hideLoaderOnLoad);
    if (document.readyState === 'complete') {
        hideLoaderOnLoad();
    }

    function triggerLoaderAndNavigate(targetUrl) {
        if (loader) {
            loader.classList.remove('hide-loader');
            const icon = loader.querySelector('.loader-icon');
            const fullLogo = loader.querySelector('.loader-full-logo');
            if (icon && fullLogo) {
                icon.style.animation = 'none';
                fullLogo.style.animation = 'none';
                icon.offsetHeight; 
                icon.style.animation = null; 
                fullLogo.style.animation = null; 
            }
            setTimeout(() => {
                window.location.href = targetUrl;
            }, MIN_LOADER_TIME);
        } else {
            window.location.href = targetUrl;
        }
    }

    // Attach loader only to links that actually navigate away
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            const targetAttr = this.getAttribute('target');

            // Smooth scroll for internal hashes
            if (targetUrl && targetUrl.startsWith('#') && targetUrl !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetUrl);
                if(targetElement){
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // Also close mobile menu if it's open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if(mobileMenu.classList.contains('show')) {
                        mobileMenu.classList.remove('show');
                        document.body.style.overflow = '';
                    }
                }
                return;
            }

            if (!targetUrl || targetUrl === '#' || targetUrl.startsWith('javascript') || targetAttr === '_blank') {
                return; 
            }
            e.preventDefault(); 
            triggerLoaderAndNavigate(targetUrl);
        });
    });


    // ==========================================
    // 2. MOBILE MENU & NAVBAR
    // ==========================================
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeMobileBtn = document.getElementById('close-mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileBtn && mobileMenu && closeMobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.add('show');
            document.body.style.overflow = 'hidden'; 
        });

        closeMobileBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('show');
            document.body.style.overflow = ''; 
        });
    }


    // ==========================================
    // 3. DYNAMIC FEATURED COURSES GENERATION
    // ==========================================
    // Reusing the exact JSON structure from your courses.js to keep data unified
    const featuredCourses = [
        {
            id: "course-animation-1",
            badge: { text: "NEW", type: "badge-new" },
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Cinematic Web Animations",
            desc: "Master max-level visual effects, scroll-jacking, and high-end futuristic UI design using modern CSS and JS.",
            level: "Advanced",
            tags: ['<span class="tag">UI/UX</span>']
        },
        {
            id: "course-django-1",
            badge: { text: "HOT", type: "badge-hot" },
            image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Advanced Django Backend",
            desc: "Scale backend logic, implement robust authentication systems, and build high-performance APIs.",
            level: "Intermediate",
            tags: ['<span class="tag">BACKEND</span>']
        },
        {
            id: "course-prisma-1",
            badge: null,
            image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Prisma DB & Next.js",
            desc: "Seamlessly connect your Next.js/React stack with automated schemas and flawless database queries.",
            level: "Beginner",
            tags: ['<span class="tag tag-free" style="background:#10b981; color:white;">FREE</span>']
        }
    ];

    const courseContainer = document.getElementById('dynamic-landing-courses');
    
    if(courseContainer) {
        let html = '';
        featuredCourses.forEach((course, index) => {
            const delay = (0.2 + (index * 0.1)).toFixed(1);
            const badgeHTML = course.badge ? `<span class="${course.badge.type}">${course.badge.text}</span>` : '';
            
            html += `
                <article class="course-card fade-in-up" data-course-id="${course.id}" style="animation-delay: ${delay}s;">
                    <div class="card-image-wrapper">
                        ${badgeHTML}
                        <img src="${course.image}" alt="${course.title}">
                        <div class="image-overlay"></div>
                    </div>
                    <div class="card-body">
                        <h3>${course.title}</h3>
                        <p class="card-desc">${course.desc}</p>
                        <div class="card-meta">
                            <span class="level"><i class="fa-solid fa-layer-group"></i> ${course.level}</span>
                        </div>
                        <div class="card-footer">
                            <div class="tags">
                                ${course.tags.join('')}
                            </div>
                        </div>
                    </div>
                </article>
            `;
        });
        courseContainer.innerHTML = html;

        // Attach click listeners to navigate to preview pages
        courseContainer.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', function() {
                const id = this.getAttribute('data-course-id');
                if(id) triggerLoaderAndNavigate(`../frontend/login/login.html?id=${id}`); 
            });
        });
    }

    // ==========================================
    // 4. SCROLL ANIMATIONS (Intersection Observer)
    // ==========================================
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Give the DOM a tiny bit of time to render dynamic content before observing
    setTimeout(() => {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            scrollObserver.observe(el);
        });
    }, 100);

});