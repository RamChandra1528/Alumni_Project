// client.js

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/user-info')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch user info');
            }
        })
        .then(data => {
            if (data && data.name && data.email) {
                document.getElementById('userName').textContent = data.name;
                document.getElementById('userEmail').textContent = 'Email: ' + data.email;
            } else {
                document.getElementById('userName').textContent = 'User not found';
                document.getElementById('userEmail').textContent = 'Email: N/A';
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
            document.getElementById('userName').textContent = 'Error';
            document.getElementById('userEmail').textContent = 'Could not fetch user info';
        });
});
