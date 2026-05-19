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