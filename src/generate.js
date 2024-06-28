document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const loginButton = document.getElementById('loginButton');
    const initialAiDiv = document.querySelector('.chat-ai');
    const inputGroup = document.getElementById('inputGroup');
    const loginContainer = document.getElementById('loginContainer');
    const chatBox = document.getElementById('chat-box');

    function checkLoginStatus() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            inputGroup.style.display = 'flex';
            loginContainer.classList.add('form-hidden');
        } else {
            inputGroup.style.display = 'none';
            loginContainer.classList.remove('form-hidden');
        }
    }

    function sendMessage() {
        const text = input.value.trim();
        if (text) {
            if (initialAiDiv && initialAiDiv.style.display !== 'none') {
                const initialAiText = initialAiDiv.querySelector('.help-today').textContent;
                displayMessage(initialAiText, 'ai');
                initialAiDiv.style.display = 'none'; // Hide after displaying initial message
            }
            displayMessage(text, 'user');
            fetchAnswer(text);
            input.value = ''; // Clear input after sending
        }
    }

    sendButton.addEventListener('click', sendMessage);
    loginButton.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    function displayMessage(message, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message ' + sender;

        const img = document.createElement('img');
        if (sender === 'ai') {
            img.src = 'Img/studentHat.png';
            img.className = 'ai-profile-pic';
        } else if (sender === 'user') {
            img.src = 'Img/user.png';
            img.className = 'user-profile-pic';
        }
        messageContainer.appendChild(img);

        const textElement = document.createElement('span');
        textElement.textContent = message;
        messageContainer.appendChild(textElement);

        document.getElementById('chatMessages').appendChild(messageContainer);
    }

    async function fetchAnswer(question) {
        try {
            const response = await fetch('http://localhost:3000/api/getResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: question })
            });
            if (response.ok) {
                const data = await response.json();
                displayMessage(data.answer, 'ai');
            } else {
                console.error('Failed to fetch response:', response.statusText);
            }
        } catch (error) {
            console.error('Error making fetch call:', error);
        }
    }

    checkLoginStatus();
});
