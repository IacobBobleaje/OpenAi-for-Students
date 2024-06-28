document.addEventListener('DOMContentLoaded', () => {
    const accountAction = document.getElementById('accountAction');

    function updateAccountLink() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            accountAction.textContent = 'My Account';
            accountAction.href = 'login.html'; 
        } else {
            accountAction.textContent = 'Enter your account';
            accountAction.href = 'login.html';
        }
    }

    updateAccountLink();
});
