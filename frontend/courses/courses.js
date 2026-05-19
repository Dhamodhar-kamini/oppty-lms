document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MASTER COURSE DATABASE (Dynamic Generation)
    // ==========================================
    const coursesData = [
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
            tags: ['<span class="tag tag-free">FREE</span>']
        }
    ];

    const gridContainer = document.getElementById('dynamic-courses-grid'); // Make sure your HTML grid uses this ID

    if (gridContainer) {
        let generatedHTML = '';

        coursesData.forEach((course, index) => {
            const delay = (0.2 + (index * 0.1)).toFixed(1);
            const badgeHTML = course.badge ? `<span class="${course.badge.type}">${course.badge.text}</span>` : '';

            generatedHTML += `
                <article class="course-card fade-in-up" data-course-id="${course.id}" style="animation-delay: ${delay}s;">
                    <div class="card-image-wrapper">
                        ${badgeHTML}
                        <img src="${course.image}" alt="${course.title}">
                        <div class="image-overlay"></div>
                    </div>
                    <div class="card-body">
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

        gridContainer.innerHTML = generatedHTML;
    }


    // ==========================================
    // 2. GLOBAL LOADER & NAVIGATION HANDLING
    // ==========================================
    const loader = document.getElementById('oppty-global-loader');
    
    // --- FADE OUT ON PAGE LOAD ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) loader.classList.add('hide-loader');
        }, 800); 
    });

    if (document.readyState === 'complete') {
        setTimeout(() => {
            if (loader) loader.classList.add('hide-loader');
        }, 800);
    }

    // --- FADE IN ON PAGE EXIT (Standard Links) ---
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            const targetAttr = this.getAttribute('target');

            if (!targetUrl || targetUrl.startsWith('#') || targetUrl.startsWith('javascript') || targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:') || targetAttr === '_blank') {
                return; 
            }

            e.preventDefault(); 
            if (loader) {
                loader.classList.remove('hide-loader'); 
            }
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400); 
        });
    });

    // --- TRIGGER LOADER FROM DYNAMIC CARDS ---
    if (gridContainer) {
        const courseCards = gridContainer.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            card.addEventListener('click', function() {
                const courseId = this.getAttribute('data-course-id');
                if (courseId) {
                    if (loader) {
                        loader.classList.remove('hide-loader');
                        // Optional: Reset custom CSS animations if you are using the Oppty Text loader
                        const icon = loader.querySelector('.loader-icon');
                        const fullLogo = loader.querySelector('.loader-full-logo');
                        if (icon && fullLogo) {
                            icon.style.animation = 'none';
                            fullLogo.style.animation = 'none';
                            icon.offsetHeight; 
                            icon.style.animation = null; 
                            fullLogo.style.animation = null; 
                        }
                    }
                    setTimeout(() => {
                        window.location.href = `../course-preview/course-preview.html?id=${courseId}`;
                    }, 400); 
                }
            });
        });
    }

    // ==========================================
    // 3. SIDEBAR & MENU LOGIC
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => sidebar.classList.add('show'));
    }
    
    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('show'));
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar && mobileToggle) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        }
    });

    const courseToggle = document.getElementById('course-toggle');
    const subMenu = document.getElementById('sub-menu');
    const chevron = courseToggle ? courseToggle.querySelector('.chevron') : null;

    if (subMenu && chevron) {
        if (subMenu.classList.contains('show')) {
            chevron.style.transform = 'rotate(-180deg)';
        }
    }

    if (courseToggle && subMenu && chevron) {
        courseToggle.addEventListener('click', (e) => {
            e.preventDefault();
            courseToggle.classList.toggle('active');
            subMenu.classList.toggle('show');
            chevron.style.transform = subMenu.classList.contains('show') ? 'rotate(-180deg)' : 'rotate(0deg)';
        });
    }

    // ==========================================
    // 4. ANIMATION OBSERVER FOR COURSE CARDS
    // ==========================================
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to dynamic elements
    setTimeout(() => {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }, 100); // Slight delay to ensure dynamic DOM is fully parsed


    // ==========================================
    // 5. ADVANCED TECH ICON CROSS-FADE LOOP
    // ==========================================
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
    const intervalTime = 3000; 
    const transitionTime = 1000; 

    function changeHeroIcon() {
        if (!currentIconNode || !nextIconNode) return; // Prevent errors if elements don't exist on page
        
        currentIconIndex = (currentIconIndex + 1) % iconClasses.length;
        
        nextIconNode.className = `${iconClasses[currentIconIndex]} tech-icon tech-icon-next`;

        nextIconNode.classList.remove('tech-icon-next');
        nextIconNode.classList.add('tech-icon-current');
        
        currentIconNode.classList.remove('tech-icon-current');
        currentIconNode.classList.add('tech-icon-next');

        setTimeout(() => {
            currentIconNode.className = `${iconClasses[currentIconIndex]} tech-icon tech-icon-current`;
            nextIconNode.className = `${iconClasses[(currentIconIndex + 1) % iconClasses.length]} tech-icon tech-icon-next`;
        }, transitionTime);
    }

    if (currentIconNode && nextIconNode) {
        setInterval(changeHeroIcon, intervalTime);
    }
});