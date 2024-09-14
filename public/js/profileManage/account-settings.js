// Handle the sidebar link clicks to show relevant content
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();

        // Remove 'active' class from all sections and links
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        document.querySelectorAll('.menu a').forEach(link => link.classList.remove('active'));

        // Add 'active' class to the clicked link and corresponding section
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        this.classList.add('active');
    });
});

// JavaScript for dark mode toggle and collapsible sections remains the same

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
});

// Collapsible sections
document.querySelectorAll('.content-box h3').forEach(header => {
    header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const arrow = this.querySelector('.arrow');
        const expanded = this.getAttribute('aria-expanded') === 'true';

        if (expanded) {
            content.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
        } else {
            content.style.display = 'block';
            arrow.style.transform = 'rotate(90deg)';
        }

        this.setAttribute('aria-expanded', !expanded);
    });
});
