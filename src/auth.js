document.addEventListener('DOMContentLoaded', () => {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBw9AB4HQRclx88rL5vUheQRkWThgSpVt0",
        authDomain: "edubuddyai.firebaseapp.com",
        projectId: "edubuddyai",
        storageBucket: "edubuddyai.appspot.com",
        messagingSenderId: "635464961692",
        appId: "1:635464961692:web:ea70f15b6b012c2ae3e759",
        measurementId: "G-RR5W8KGG7M"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Sign-Up functionality
    const passwordInput = document.getElementById('passwordSignIn');
    const confirmPassword = document.getElementById('confirmPasswordSignIn');
    const signUpButton = document.getElementById('signUpButton');
    const nameInput = document.getElementById('nameSignIn');
    const emailInput = document.getElementById('emailSignIn');
    const loginButton = document.getElementById('loginButton');
    const loginEmailInput = document.getElementById('emailLogin');
    const loginPasswordInput = document.getElementById('passwordLogin');
    const accountAction = document.getElementById('accountAction');
    const logoutButton = document.getElementById('logoutButton');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const loginForm = document.getElementById('loginForm');
    const signInForm = document.getElementById('signInForm');
    const accountInfo = document.getElementById('accountInfo');
    const toggleButtons = document.querySelector('.toggle-buttons');
    const loginImage = document.querySelector('.login-image'); 
    const accountImage = document.querySelector('.account-image'); 


    // Check auth state on page load
    checkAuthState();

    if (signUpButton) {
        signUpButton.addEventListener('click', async (e) => {
            e.preventDefault();
            if (passwordInput.value !== confirmPassword.value) {
                console.error("Passwords do not match.");
                return;
            }

            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                const response = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("User signed up successfully:", data);
                    nameInput.value = '';
                    emailInput.value = '';
                    passwordInput.value = '';
                    confirmPassword.value = '';
                    showNotification("You have successfully signed up!", "success");
                } else {
                    const errorData = await response.json();
                    console.error('Error signing up user:', errorData.message);
                    showNotification("There was an error with your sign up.", "error");
                }
            } catch (error) {
                console.error('Error signing up user:', error);
                showNotification("There was an error with your sign up.", "error");
            }
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = loginEmailInput.value;
            const password = loginPasswordInput.value;
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("User logged in successfully:", data);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    showNotification("You have successfully logged in!", "success");
                    updateUIOnLogin(data.user);
                } else {
                    const errorData = await response.json();
                    console.error('Error logging in user:', errorData.message);
                    showNotification("There was an error with your log in.", "error");
                }
            } catch (error) {
                console.error('Error logging in user:', error);
                showNotification("There was an error with your log in.", "error");
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('user');
            updateUIOnLogout();
        });
    }

    function updateUIOnLogin(user) {
        accountAction.textContent = 'My Account';
        accountAction.href = 'login.html';
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${user.email}!`;
        }
        if (loginForm) loginForm.classList.add('form-hidden');
        if (signInForm) signInForm.classList.add('form-hidden');
        if (accountInfo) accountInfo.classList.remove('form-hidden');
        if (toggleButtons) toggleButtons.classList.add('form-hidden');
        if (loginImage) loginImage.classList.add('form-hidden'); // Hide login image
        if (accountImage) accountImage.classList.remove('form-hidden'); // Show account image
    }

    function updateUIOnLogout() {
        accountAction.textContent = 'Enter your account';
        accountAction.href = 'login.html';
        if (welcomeMessage) {
            welcomeMessage.textContent = '';
        }
        if (loginForm) loginForm.classList.remove('form-hidden');
        if (signInForm) signInForm.classList.add('form-hidden');
        if (accountInfo) accountInfo.classList.add('form-hidden');
        if (toggleButtons) toggleButtons.classList.remove('form-hidden');
        if (loginImage) loginImage.classList.remove('form-hidden'); // Show login image
        if (accountImage) accountImage.classList.add('form-hidden'); // Hide account image
    }

    function checkAuthState() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            updateUIOnLogin(user);
        } else {
            updateUIOnLogout();
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement("div");
        notification.classList.add("custom-notification", type === 'error' ? "error" : "success");

        const icon = document.createElement("span");
        icon.classList.add("custom-notification-icon");
        icon.textContent = type === 'error' ? "⚠️" : "✓"; // Warning icon for error, checkmark for success

        const text = document.createElement("span");
        text.classList.add("custom-notification-text");
        text.textContent = message;

        notification.appendChild(icon);
        notification.appendChild(text);
        document.body.appendChild(notification);

        // Slide down animation
        setTimeout(() => {
            notification.style.top = "0";
        }, 100);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.top = "-100px";
            setTimeout(() => {
                notification.remove();
            }, 300); // Wait for slide-up animation to finish
        }, 5000);
    }

    // Contact Us form functionality
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Get the form data
            const Name = document.getElementById('ContactName').value;
            const Phone = document.getElementById('ConctactPhone').value;
            const Email = document.getElementById('ConctactEmail').value;
            const Message = document.getElementById('ConctactMessage').value;

            // Try to add a new document in the "contacts" collection
            try {
                const docRef = await db.collection("Details").add({
                    Name: Name,
                    Phone: Phone,
                    Email: Email,
                    Message: Message
                });
                console.log("Document written with ID: ", docRef.id);
                alert('Contact details submitted successfully!');
                contactForm.reset(); // Clear the form
            } catch (error) {
                // Handle errors if the document could not be added
                console.error("Error adding document: ", error);
                alert('Failed to submit contact details. Please try again later.');
            }
        });
    }
});
