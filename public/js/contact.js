document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const response = await fetch('/send-email', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    document.getElementById('responseMessage').textContent = result.message;
});

const toggleBtn = document.querySelector('.toggle_btn');
const links = document.querySelector('.links');

toggleBtn.addEventListener('click', () => {
links.classList.toggle('active');
});
