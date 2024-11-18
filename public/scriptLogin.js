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

var working = false;
$('.login').on('submit', function(e) {
  e.preventDefault();
  if (working) return;
  working = true;
  var $this = $(this),
    $state = $this.find('button > .state');
  $this.addClass('loading');
  $state.html('Authenticating');
  setTimeout(function() {
    $this.addClass('ok');
    $state.html('Welcome back!');
    setTimeout(function() {
      $state.html('Log in');
      $this.removeClass('ok loading');
      working = false;
    }, 4000);
  }, 3000);
});