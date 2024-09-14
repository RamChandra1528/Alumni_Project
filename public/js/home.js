document.addEventListener('DOMContentLoaded', function() {
    // Navbar toggler functionality
    const navbarToggler = document.getElementById('navbar-toggler');
    const navLinks = document.getElementById('nav-links');
    const closeBtn = document.getElementById('close-btn');

    if (navbarToggler && navLinks) {
        navbarToggler.addEventListener('click', function() {
            const currentDisplay = getComputedStyle(navLinks).display;
            navLinks.style.display = currentDisplay === 'flex' ? 'none' : 'flex';
        });
    }

    if (closeBtn && navLinks) {
        closeBtn.addEventListener('click', function() {
            navLinks.style.display = 'none';
        });
    }

    // Fetch and display user info
    fetch('/api/user-info') // Replace with your actual API endpoint
        .then(response => response.json())
        .then(data => {
            if (data.isLoggedIn) {
                const userNameElement = document.getElementById("userName");
                const logoutBtn = document.getElementById("logoutBtn");

                if (userNameElement) {
                    userNameElement.textContent = `Welcome, ${data.userName}`;
                }

                if (logoutBtn) {
                    logoutBtn.style.display = "inline-block"; // Show the logout button

                    // Logout functionality
                    logoutBtn.addEventListener('click', function(event) {
                        event.preventDefault();
                        // Call your server-side logout logic here
                        alert("Logging out...");
                        // Optionally, clear the localStorage
                        localStorage.removeItem('userName');
                        // Redirect to the login page or homepage after logout
                        window.location.href = "/login"; 
                    });
                }

                // Optionally, store the username in localStorage
                localStorage.setItem('userName', data.userName);
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });

    // Search Alumni Functionality
    const directorySearch = document.getElementById('directory-search');
    if (directorySearch) {
        directorySearch.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                searchAlumni();
            }
        });
    }

    // Set username from localStorage if available
    setUserName();
});

// Function to set the username dynamically
function setUserName() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `Welcome, ${userName}`;
        }
    }
}

// Example function to simulate setting the user's name after login
function simulateLogin(name) {
    localStorage.setItem('userName', name);
    setUserName();
}

// Search function (implement your actual search logic)
function searchAlumni() {
    const searchTerm = document.getElementById('directory-search').value;
    if (searchTerm.trim() === '') {
        alert('Please enter a search term');
        return;
    }
    // Implement search functionality here, e.g., redirect to search results
    console.log('Search term:', searchTerm);
}
// ////////////////////////------------------------>text for movr 
document.addEventListener("DOMContentLoaded", function() {
    const text = document.querySelector('.animated-text');
    const textContent = text.textContent;
    text.innerHTML = ''; // Clear the current content

    for (let i = 0; i < textContent.length; i++) {
        const span = document.createElement('span');
        span.textContent = textContent[i];
        span.style.animationDelay = `${i * 0.1}s`; // Adjust the delay for each letter
        text.appendChild(span);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.getElementById('animated-text');
    const text = textElement.innerText;
    textElement.innerHTML = text.split('').map(letter => `<span>${letter}</span>`).join('');
});


//////////////////////////////////////// Mode Toggle
document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('modeToggle');
    
    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
        });
    }

    const savedMode = localStorage.getItem('darkMode') === 'true';
    if (savedMode) {
        document.body.classList.add('dark-mode');
    }
});
