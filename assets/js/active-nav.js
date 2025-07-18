/**
 * Active Navigation Indicator
 * Automatically sets the active class on the current page's navigation link
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove any existing active classes
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to the current page's link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Handle different page matches
        if (
            (currentPage === 'index.html' && (href === 'index.html' || href === '/' || href === './')) ||
            (currentPage === '' && (href === 'index.html' || href === '/' || href === './')) ||
            href === currentPage
        ) {
            link.classList.add('active');
        }
    });
    
    // Fallback: if no active link is found, activate Home
    const activeLink = document.querySelector('.nav-links a.active');
    if (!activeLink) {
        const homeLink = document.querySelector('.nav-links a[href="index.html"], .nav-links a[href="/"], .nav-links a[href="./"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
});
