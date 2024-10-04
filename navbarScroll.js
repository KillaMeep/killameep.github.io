let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Check if the user is scrolling down
    if (scrollTop > lastScrollTop) {
        // Downscroll - hide navbar
        navbar.classList.add('hidden');
    } else {
        // Upscroll - show navbar
        navbar.classList.remove('hidden');
    }

    // Update last scroll position
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
});
