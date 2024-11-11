// URL base de la API
const apiMenu = 'http://localhost:3003/api/menu';
const apiCategory = 'http://localhost:3003/api/categories';

// Función para cargar los productos desde la API
async function loadProducts() {
    try {
        const response = await fetch(apiMenu);
        const products = await response.json();
        displayProducts(products); // Mostrar los productos en la tabla
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Cargar productos al inicio
loadProducts();

// filter products
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Obtener el valor de búsqueda en minúsculas
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchInput) // Filtrar productos por nombre
    );

    // Muestra solo los productos filtrados
    displayProducts(filteredProducts);
}

// Función para mostrar los productos en la tabla
function displayProducts(products) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = ''; // Limpiar el contenido anterior

    products.forEach(product => {
        const row = document.createElement('tr');
        const stockDisplay = product.stock ? product.stock : 'Sin stock'; // O el mensaje que prefieras
        const categoryDisplay = product.category ? product.category : 'Sin categoria'; //

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${categoryDisplay}</td>

            <td>${product.price ? `$${product.price}` : '-'}</td>
            <td>
                <button onclick="updateStock('${product._id}', 1)">+</button>
                <span id="stock-${product._id}">${product.stock > 0 ? product.stock : 'Sin stock'}</span>
                <button onclick="updateStock('${product._id}', -1)">-</button>
            </td>

            <td>
                <button onclick="editProduct('${product._id}')">Edit</button>
                <button onclick="deleteProduct('${product._id}')">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

async function updateStock(productId, change) {
    try {
        // Obtener el producto actual de la base de datos
        const response = await fetch(`${apiMenu}/${productId}`);
        if (!response.ok) {
            console.error('Error fetching product:', response.statusText);
            return;
        }
        const product = await response.json();

        // Calcular el nuevo stock
        const newStock = Math.max(0, product.stock + change);

        // Enviar la actualización a la base de datos
        const updateResponse = await fetch(`${apiMenu}/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: newStock })
        });


        if (updateResponse.ok) {
            // Actualizar el stock en la interfaz sin recargar toda la tabla
            const stockElement = document.getElementById(`stock-${productId}`);
            stockElement.innerText = newStock > 0 ? newStock : 'Sin stock';
        } else {
            console.error('Failed to update stock');
        }
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}
function updateButtonVisibility(productId, stock) {
    const minusButton = document.getElementById(`minus-${productId}`);
    if (minusButton) {
        minusButton.style.display = stock > 0 ? 'inline-block' : 'none';
    }
}

// Función para eliminar un producto por ID
async function deleteProduct(id) {
    try {
        const response = await fetch(`${apiMenu}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Product deleted successfully');
            loadProducts(); // Recargar la lista de productos después de eliminar
        } else {
            console.error('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Función para cargar los datos de un producto en el formulario de edición
function editProduct(id) {
    fetch(`${apiMenu}/${id}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('editProductId').value = product._id;
            document.getElementById('editName').value = product.name;
            document.getElementById('editCategory').value = product.category;
            document.getElementById('editPrice').value = product.price;
            document.getElementById('editStock').value = product.stock;
            showEditProductForm(); // Muestra el modal de edición
        })
        .catch(error => console.error('Error fetching product:', error));
}

// Función para mostrar el modal de edición
function showEditProductForm() {
    document.getElementById("editProductModal").style.display = "flex";
}

// Función para ocultar el modal de edición
function hideEditProductForm() {
    document.getElementById("editProductModal").style.display = "none";
}

// Función para mostrar el formulario de creación de productos en el modal
function showProductForm() {
    document.getElementById('productFormModal').style.display = 'flex';
}

// Función para ocultar el formulario de creación de productos
function hideProductForm() {
    document.getElementById('productFormModal').style.display = 'none';
}


// Cerrar el modal si el usuario hace clic fuera del contenido del modal
window.onclick = function(event) {
    const productModal = document.getElementById('productFormModal');
    const categoryModal = document.getElementById('categoryFormModal');
    const editProductModal = document.getElementById('editProductModal');

    if (event.target == productModal) {
        hideProductForm();
    }

    if (event.target == categoryModal) {
        hideCategoryForm();
    }

    if (event.target == editProductModal) {
        hideEditProductForm();
    }
}

// Evento para manejar el envío del formulario de creación de productos
document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página

    const newProduct = {
        name: document.getElementById('name').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value, // Ahora es un dropdown
        stock: parseInt(document.getElementById('stock').value),
    };

    try {
        const response = await fetch(apiMenu, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });

        if (response.ok) {
            loadProducts(); // Recargar la lista de productos
            document.getElementById('productForm').reset(); // Limpiar el formulario
            hideProductForm(); // Ocultar el modal después de agregar el producto
        } else {
            const errorData = await response.json();
            console.error('Failed to add product:', errorData.message);
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Ocurrió un error al agregar el producto.');
    }
});

// Evento para manejar el envío del formulario de edición de producto
document.getElementById('editProductForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página

    // Obtén los valores de los campos del formulario
    const id = document.getElementById('editProductId').value;
    const updatedProduct = {
        name: document.getElementById('editName').value.trim(),
        price: parseFloat(document.getElementById('editPrice').value),
        category: document.getElementById('editCategory').value, // Ahora es un dropdown
        stock: parseInt(document.getElementById('editStock').value),
    };

    try {
        // Realiza la solicitud PUT para actualizar el producto
        const response = await fetch(`${apiMenu}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct) // Envía los datos actualizados como JSON
        });

        if (response.ok) {
            // Si la actualización es exitosa, recarga la lista de productos
            console.log('Producto actualizado con éxito');
            loadProducts(); // Recargar la lista de productos para reflejar los cambios
            document.getElementById('editProductForm').reset(); // Limpia el formulario
            hideEditProductForm(); // Oculta el modal de edición después de actualizar
        } else {
            const errorData = await response.json();
            console.error('Error al actualizar el producto:', errorData.message);
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud de actualización:', error);
        alert('Ocurrió un error al actualizar el producto.');
    }
});

let allProducts = []; // Variable global para almacenar todos los productos

// Función para cargar los productos desde la API
async function loadProducts() {
    try {
        const response = await fetch(apiMenu);
        const products = await response.json();
        allProducts = products; // Guarda todos los productos
        displayProducts(allProducts); // Mostrar los productos en la tabla
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// filter products
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Obtener el valor de búsqueda en minúsculas
    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchInput) // Filtrar productos por nombre
    );

    // Muestra solo los productos filtrados
    displayProducts(filteredProducts);
}


document.getElementById('usersButton').addEventListener('click', function() {
    window.location.href = '/users.html'; // Cambia '/users' a la ruta deseada
});
