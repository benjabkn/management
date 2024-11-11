// URL base de la API de usuarios
const apiUrl = 'http://localhost:3003/api/users';

// Función para cargar y mostrar los usuarios en la tabla
async function loadUsers() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Cargar los usuarios al cargar la página
document.addEventListener('DOMContentLoaded', loadUsers);


// Función para mostrar los usuarios en el HTML
function displayUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = ''; // Limpiar el contenido anterior
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser('${user._id}')">Editar</button>
                <button onclick="deleteUser('${user._id}')">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para abrir el modal de creación de usuario
function openCreateUserModal() {
    document.getElementById('createUserModal').style.display = 'block';
}

// Función para cerrar el modal de creación de usuario
function closeCreateUserModal() {
    document.getElementById('createUserModal').style.display = 'none';
}

// Función para crear un nuevo usuario
document.getElementById('createUserForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío del formulario y recarga de la página

    // Recoger los valores de los campos del formulario
    const newUser = {
        name: document.getElementById('createUsername').value,
        email: document.getElementById('createEmail').value,
        password: document.getElementById('createPassword').value // Nuevo campo para la contraseña
    };

    try {
        // Realizar la solicitud POST a la API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la creación del usuario');
        }

        // Si la solicitud es exitosa
        alert('Usuario creado con éxito');
        loadUsers(); // Recargar la lista de usuarios

    } catch (error) {
        console.error('Error al crear usuario:', error);
        alert(error.message || 'Ocurrió un error al crear el usuario.');
    }
});

// Función para abrir el modal de edición de usuario
function openEditUserModal() {
    document.getElementById('editUserModal').style.display = 'block';
}

// Función para cerrar el modal de edición de usuario
function closeEditUserModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

// Función para cargar datos del usuario en el modal de edición
async function editUser(userId) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`);
        if (response.ok) {
            const user = await response.json();
            document.getElementById('editUserId').value = user._id;
            document.getElementById('editUsername').value = user.name;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editPassword').value = user.password;

            openEditUserModal();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        alert('Ocurrió un error al obtener los datos del usuario.');
    }
}

// Función para actualizar usuario
document.getElementById('editUserForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = document.getElementById('editUserId').value;
    const updatedUser = {
        name: document.getElementById('editUsername').value,
        email: document.getElementById('editEmail').value
    };
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });
        if (response.ok) {
            alert('Usuario actualizado con éxito');
            closeEditUserModal();
            loadUsers(); // Recargar la lista de usuarios
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        alert('Ocurrió un error al actualizar el usuario.');
    }
});

// Función para eliminar usuario
async function deleteUser(userId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        try {
            const response = await fetch(`${apiUrl}/${userId}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Usuario eliminado con éxito');
                loadUsers(); // Recargar la lista de usuarios
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert('Ocurrió un error al eliminar el usuario.');
        }
    }
}
