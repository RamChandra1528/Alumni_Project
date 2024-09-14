// Function to send OTP
function sendOtp() {
    const email = document.getElementById('email').value;

    fetch('/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            document.getElementById('email-section').style.display = 'none';
            document.getElementById('otp-section').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send OTP. Please try again.');
    });
}

// Function to verify OTP
function verifyOtp() {
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;

    fetch('/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            if (data.message.includes('verified')) {
                document.getElementById('otp-section').style.display = 'none';
                document.getElementById('reset-password-section').style.display = 'block';
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to verify OTP. Please try again.');
    });
}

// Function to reset password
function resetPassword() {
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;

    fetch('/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            if (data.message.includes('successful')) {
                // Optionally, redirect the user to the login page
                window.location.href = '/login';
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to reset password. Please try again.');
    });
}
