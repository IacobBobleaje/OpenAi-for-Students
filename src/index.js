document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signInForm = document.getElementById('signInForm');
    const passwordInput = document.getElementById('passwordSignIn');
    const confirmPassword = document.getElementById('confirmPasswordSignIn');
    const togglePassword = document.querySelector('.toggle-password');
    const toggleLogin = document.getElementById('toggleLogIn');
    const toggleSignIn = document.getElementById('toggleSignIn');

    if (toggleLogin) {
        // Toggle visibility between Log-In and Sign-In forms
        toggleLogin.addEventListener('click', () => {
            signInForm.classList.add('form-hidden');
            loginForm.classList.remove('form-hidden');
        });
    }

    if (toggleSignIn) {
        toggleSignIn.addEventListener('click', () => {
            loginForm.classList.add('form-hidden');
            signInForm.classList.remove('form-hidden');
        });
    }

    if (passwordInput && confirmPassword) {
        // Real-time password validation
        passwordInput.addEventListener('input', updateInputValidationState);
        confirmPassword.addEventListener('input', updateInputValidationState);

        function updateInputValidationState() {
            if (passwordInput.value && confirmPassword.value) {
                if (passwordInput.value === confirmPassword.value) {
                    confirmPassword.classList.add('valid-input');
                    confirmPassword.classList.remove('invalid-input');
                } else {
                    confirmPassword.classList.remove('valid-input');
                    confirmPassword.classList.add('invalid-input');
                }
            } else {
                confirmPassword.classList.remove('valid-input');
                confirmPassword.classList.remove('invalid-input');
            }
        }
    }

    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);

        function togglePasswordVisibility() {
            const passwordInput = document.getElementById('passwordSignIn');
            const toggleIcon = document.querySelector('.toggle-password i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        }
    }
    
        const currentPath = window.location.pathname;
        const accountActionLink = document.getElementById('accountAction');

        if (currentPath.includes('login.html')) {
            accountActionLink.classList.add('active');
        } else {
            accountActionLink.classList.remove('active');
        }
    ;
});
