// URL base de la API de usuarios
const apiUrl = 'http://localhost:3003/api/users/login';

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
      const response = await fetch('http://localhost:3003/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });

      if (response.ok) {
          const data = await response.json();
          alert('Inicio de sesión exitoso');
          console.log('Datos del usuario:', data.user);
          window.location.href = 'index.html'; // Redirigir al usuario
      } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
      }
  } catch (error) {
      console.error('Error en el inicio de sesión:', error);
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