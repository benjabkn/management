// URL base de la API de usuarios
const apiUrl = 'http://localhost:3003/api/users/login';

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            alert('Login exitoso');
            window.location.href = 'index.html';

        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error en el login:', error);
        alert('Ocurrió un error al iniciar sesión.');
    }
});