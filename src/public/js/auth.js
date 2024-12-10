document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('sign-up-btn');
    const signInButton = document.getElementById('sign-in-btn');
    const container = document.querySelector('.container-auth');
    const avatarInput = document.getElementById('avatar');
    const avatarPreview = document.getElementById('avatar-preview');
    const registerForm = document.querySelector('.sign-up-form');
    const loginForm = document.querySelector('.sign-in-form');

    signUpButton.addEventListener('click', () => {
        container.classList.add('sign-up-mode');
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove('sign-up-mode');
    });

    // Handle avatar preview
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Show preview container
                avatarPreview.style.display = 'block';
                
                // Create preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Clear previous preview
                    avatarPreview.innerHTML = '';
                    
                    // Create and add new preview image
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Avatar preview';
                    avatarPreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                // Hide preview if no file selected
                avatarPreview.style.display = 'none';
                avatarPreview.innerHTML = '';
            }
        });
    }

    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            
            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.error) {
                    // Show error message
                    showMessage(data.error, 'error');
                } else {
                    // Registration successful, redirect
                    window.location.href = '/';
                }
            } catch (error) {
                showMessage('An error occurred during registration', 'error');
            }
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataObj)
                });

                const data = await response.json();

                if (data.error) {
                    // Show error message
                    showMessage(data.error, 'error');
                } else {
                    // Login successful, redirect
                    window.location.href = '/';
                }
            } catch (error) {
                showMessage('An error occurred during login', 'error');
            }
        });
    }

    // Function to show messages
    function showMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        // Insert message after the form
        const activeForm = container.classList.contains('sign-up-mode') ? registerForm : loginForm;
        activeForm.insertAdjacentElement('afterend', messageElement);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
});
