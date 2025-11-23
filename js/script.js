document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.app-header');

    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Check on load in case of refresh
    handleScroll();

    console.log('Premium Web App Loaded');
});
