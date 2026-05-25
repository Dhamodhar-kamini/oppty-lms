document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('dynamic-courses-grid');
    const loader = document.getElementById('oppty-global-loader');
    
    // Set your Django backend URL here
    const BACKEND_URL = 'http://127.0.0.1:8000'; 

    // ==========================================
    // 1. FETCH COURSES FROM BACKEND
    // ==========================================
    async function fetchAndRenderCourses() {
        if (!gridContainer) return;

        try {
            // Fetch from your Django API
            const response = await fetch(`${BACKEND_URL}/api/courses/`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const coursesData = await response.json();
            let generatedHTML = '';

            coursesData.forEach((course, index) => {
                const delay = (0.2 + (index * 0.1)).toFixed(1);
                
                // Handle the image URL (Django returns a relative path, so we prefix it)
                const imageUrl = course.thumbnail ? `${BACKEND_URL}${course.thumbnail}` : 'https://via.placeholder.com/800x500?text=No+Thumbnail';

                generatedHTML += `
                    <article class="course-card fade-in-up" data-course-id="${course.id}" style="animation-delay: ${delay}s;">
                        <div class="card-image-wrapper">
                            <img src="${imageUrl}" alt="${course.course_name}">
                            <div class="image-overlay"></div>
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${course.course_name}</h3>
                            <p class="card-desc">${course.description || 'No description provided.'}</p>
                            
                            <div class="card-meta">
                                <span class="level"><i class="fa-solid fa-user-tie"></i> ${course.instructor || 'TBA'}</span>
                            </div>
                            
                            <div class="card-footer">
                                <div class="tags">
                                    <span class="tag">₹${course.price}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                `;
            });

            gridContainer.innerHTML = generatedHTML;

            // Initialize interactions AFTER the DOM is built
            initCardInteractions();
            initScrollObserver();

        } catch (error) {
            console.error("Error fetching courses:", error);
            gridContainer.innerHTML = '<p style="color: white; text-align: center;">Failed to load courses. Please check your connection.</p>';
        }
    }

    // Call the function to trigger the fetch on load
    fetchAndRenderCourses();


    // ==========================================
    // 2. CARD INTERACTIONS & LOADER LOGIC
    // ==========================================
    function initCardInteractions() {
        const courseCards = gridContainer.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            card.addEventListener('click', function() {
                const courseId = this.getAttribute('data-course-id');
                if (courseId) {
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
                    }
                    setTimeout(() => {
                        window.location.href = `../course-preview/course-preview.html?id=${courseId}`;
                    }, 400); 
                }
            });
        });
    }

    // ==========================================
    // 3. ANIMATION OBSERVER
    // ==========================================
    function initScrollObserver() {
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
    }

    // ==========================================
    // 4. GLOBAL LOADER & NAV (Standard Links)
    // ==========================================
    window.addEventListener('load', () => {
        setTimeout(() => { if (loader) loader.classList.add('hide-loader'); }, 800); 
    });

    document.querySelectorAll('a:not(.course-card)').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            const targetAttr = this.getAttribute('target');

            if (!targetUrl || targetUrl.startsWith('#') || targetUrl.startsWith('javascript') || targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:') || targetAttr === '_blank') {
                return; 
            }

            e.preventDefault(); 
            if (loader) loader.classList.remove('hide-loader'); 
            setTimeout(() => { window.location.href = targetUrl; }, 400); 
        });
    });

    // ==========================================
    // 5. SIDEBAR & MENU LOGIC
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const courseToggle = document.getElementById('course-toggle');
    const subMenu = document.getElementById('sub-menu');
    const chevron = courseToggle ? courseToggle.querySelector('.chevron') : null;

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => sidebar.classList.add('show'));
    }
    
    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('show'));
    }

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar && mobileToggle) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        }
    });

    if (courseToggle && subMenu && chevron) {
        if (subMenu.classList.contains('show')) chevron.style.transform = 'rotate(-180deg)';
        courseToggle.addEventListener('click', (e) => {
            e.preventDefault();
            courseToggle.classList.toggle('active');
            subMenu.classList.toggle('show');
            chevron.style.transform = subMenu.classList.contains('show') ? 'rotate(-180deg)' : 'rotate(0deg)';
        });
    }

    // ==========================================
    // 6. ADVANCED TECH ICON CROSS-FADE LOOP
    // ==========================================
    const iconClasses = [
        'fa-brands fa-react', 'fa-brands fa-node-js', 'fa-brands fa-vuejs', 
        'fa-brands fa-python', 'fa-brands fa-docker'
    ];
    let currentIconIndex = 0;
    const currentIconNode = document.querySelector('.tech-icon-current');
    const nextIconNode = document.querySelector('.tech-icon-next');
    
    function changeHeroIcon() {
        if (!currentIconNode || !nextIconNode) return; 
        currentIconIndex = (currentIconIndex + 1) % iconClasses.length;
        
        nextIconNode.className = `${iconClasses[currentIconIndex]} tech-icon tech-icon-next`;
        nextIconNode.classList.remove('tech-icon-next');
        nextIconNode.classList.add('tech-icon-current');
        
        currentIconNode.classList.remove('tech-icon-current');
        currentIconNode.classList.add('tech-icon-next');

        setTimeout(() => {
            currentIconNode.className = `${iconClasses[currentIconIndex]} tech-icon tech-icon-current`;
            nextIconNode.className = `${iconClasses[(currentIconIndex + 1) % iconClasses.length]} tech-icon tech-icon-next`;
        }, 1000);
    }

    if (currentIconNode && nextIconNode) {
        setInterval(changeHeroIcon, 3000);
    }
});