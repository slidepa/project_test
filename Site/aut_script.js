document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const login = document.getElementById('login').value;
        const pass = document.getElementById('pass').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, pass })
            });

            if (response.ok) {
                window.location.href = '/Catalog.html'; // Redirect to catalog if login is successful
            } else {
                const errorMessage = await response.text();
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка отправки запроса');
        }
    });
});