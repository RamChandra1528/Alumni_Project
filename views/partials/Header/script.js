// JavaScript to toggle the active class on the links
const toggleBtn = document.querySelector('.toggle_btn');
const links = document.querySelector('.links');

toggleBtn.addEventListener('click', () => {
    links.classList.toggle('active');
});