document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('copyright-year');
    if (el) el.textContent = new Date().getFullYear();
});
