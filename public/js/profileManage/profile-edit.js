document.addEventListener('DOMContentLoaded', () => {
    const editProfileForm = document.getElementById('editProfileForm');

    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle form submission for profile editing
        const username = e.target.username.value;
        const email = e.target.email.value;
        const bio = e.target.bio.value;
        
        console.log('Profile updated:', { username, email, bio });
        alert('Profile updated successfully!');
    });
});

// JS to handle profile dropdown and responsive behavior
document.addEventListener('DOMContentLoaded', function() {
    const profileDropdown = document.getElementById('profileDropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Toggle dropdown on profile click
    profileDropdown.addEventListener('click', function() {
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicked outside
    window.addEventListener('click', function(event) {
        if (!profileDropdown.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Example: Dynamically set the username
  document.addEventListener('DOMContentLoaded', function() {
    const profileDropdown = document.getElementById('profileDropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const userNameElement = document.querySelector('.profile-name');

    // Fetch the username dynamically from server
    fetch('/get-username') // Adjust this URL to your actual endpoint
        .then(response => response.json()) // Assuming the response is JSON
        .then(data => {
            const userName = data.username || 'User'; // Replace 'User' with a default name if not found
            userNameElement.textContent = userName;
        })
        .catch(error => {
            console.error('Error fetching username:', error);
            userNameElement.textContent = 'User'; // Set to default in case of an error
        });

    // Toggle dropdown on profile click
    profileDropdown.addEventListener('click', function() {
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicked outside
    window.addEventListener('click', function(event) {
        if (!profileDropdown.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});


    // Adjust the dropdown alignment when window resizes
    window.addEventListener('resize', function() {
        const dropdownRect = dropdownMenu.getBoundingClientRect();
        if (window.innerWidth < dropdownRect.right) {
            dropdownMenu.style.left = 'auto';
            dropdownMenu.style.right = '0';
        }
    });
});
