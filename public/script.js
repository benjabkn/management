// URLs base de la API
const apiMenu = 'http://localhost:3003/api/menu';
const apiCategory = 'http://localhost:3003/api/categories';

let allProducts = []; // Variable global para almacenar todos los productos

// Función para deshabilitar botones con texto personalizado
function disableButton(button, loadingText) {
    button.disabled = true;
    button.textContent = loadingText;
}

// Función para habilitar botones con texto original
function enableButton(button, originalText) {
    button.disabled = false;
    button.textContent = originalText;
}

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

// Mostrar los productos en la tabla
function displayProducts(products) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = ''; // Limpiar contenido previo

    products.forEach(product => {
        const row = document.createElement('tr');
        const stockDisplay = product.stock > 0 ? product.stock : 'Sin stock';
        const categoryDisplay = product.category || 'Sin categoría';

        row.innerHTML = `
            <td>${product.name}</td>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
            <td>${categoryDisplay}</td>
            <td>${product.price ? `$${product.price}` : '-'}</td>
            <td>
                <button onclick="updateStock('${product._id}', 1)">+</button>
                <span id="stock-${product._id}">${stockDisplay}</span>
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

// Filtrar productos// Filtrar productos por cualquier coincidencia parcial
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Convertir la entrada a minúsculas
    const filteredProducts = allProducts.filter(product => {
        // Verifica si el término de búsqueda está presente en cualquier campo relevante
        return (
            product.name.toLowerCase().includes(searchInput) ||
            product.category.toLowerCase().includes(searchInput) ||
            String(product.price).toLowerCase().includes(searchInput) ||
            String(product.stock).toLowerCase().includes(searchInput)
        );
    });

    // Mostrar solo los productos filtrados
    displayProducts(filteredProducts);
}

// Actualizar el stock de un producto
async function updateStock(productId, change) {
    try {
        const response = await fetch(`${apiMenu}/${productId}`);
        if (!response.ok) throw new Error('Error fetching product');

        const product = await response.json();
        const newStock = Math.max(0, product.stock + change);

        const updateResponse = await fetch(`${apiMenu}/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: newStock })
        });

        if (updateResponse.ok) {
            const stockElement = document.getElementById(`stock-${productId}`);
            stockElement.innerText = newStock > 0 ? newStock : 'Sin stock';
        } else {
            console.error('Failed to update stock');
        }
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}

// Eliminar un producto
async function deleteProduct(id) {
    try {
        const response = await fetch(`${apiMenu}/${id}`, { method: 'DELETE' });

        if (response.ok) {
            loadProducts(); // Recargar productos
        } else {
            console.error('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Cargar datos de un producto para editar
function editProduct(id) {
    fetch(`${apiMenu}/${id}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('editProductId').value = product._id;
            document.getElementById('editName').value = product.name;
            document.getElementById('editCategory').value = product.category;
            document.getElementById('editPrice').value = product.price;
            document.getElementById('editStock').value = product.stock;
            showEditProductForm();
        })
        .catch(error => console.error('Error fetching product:', error));
}

// Formulario de creación de productos
document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    disableButton(submitButton, 'Creando...');

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value.trim());
    formData.append('price', parseFloat(document.getElementById('price').value));
    formData.append('category', document.getElementById('category').value);
    formData.append('stock', parseInt(document.getElementById('stock').value));
    formData.append('image', document.getElementById('image').files[0]);

    try {
        const response = await fetch(apiMenu, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            await loadProducts(); // Recargar productos
            document.getElementById('productForm').reset();
            hideProductForm();
            alert('Producto creado con éxito.');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Ocurrió un error al agregar el producto.');
    } finally {
        enableButton(submitButton, 'Crear Producto');
    }
});

// Formulario de edición de productos
document.getElementById('editProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    disableButton(submitButton, 'Actualizando...');

    const id = document.getElementById('editProductId').value;
    const updatedProduct = {
        name: document.getElementById('editName').value.trim(),
        price: parseFloat(document.getElementById('editPrice').value),
        category: document.getElementById('editCategory').value,
        stock: parseInt(document.getElementById('editStock').value),
    };

    try {
        const response = await fetch(`${apiMenu}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
        });

        if (response.ok) {
            await loadProducts();
            document.getElementById('editProductForm').reset();
            hideEditProductForm();
            alert('Producto actualizado con éxito.');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Ocurrió un error al actualizar el producto.');
    } finally {
        enableButton(submitButton, 'Actualizar Producto');
    }
});

// Mostrar y ocultar formularios/modales
function showProductForm() {
    document.getElementById('productFormModal').style.display = 'flex';
}

function hideProductForm() {
    document.getElementById('productFormModal').style.display = 'none';
}

function showEditProductForm() {
    document.getElementById("editProductModal").style.display = "flex";
}

function hideEditProductForm() {
    document.getElementById("editProductModal").style.display = "none";
}

// Cerrar modales al hacer clic fuera del contenido
window.onclick = function(event) {
    if (event.target === document.getElementById('productFormModal')) hideProductForm();
    if (event.target === document.getElementById('editProductModal')) hideEditProductForm();
};

// Cargar productos al inicio
loadProducts();
