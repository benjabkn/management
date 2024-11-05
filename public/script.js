// URL base de la API
const apiURL = 'http://localhost:3000/api/menu';

// Función para cargar los productos desde la API
async function loadProducts() {
    try {
        const response = await fetch(apiURL);
        const products = await response.json();
        displayProducts(products); // Mostrar los productos en la tabla
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Función para mostrar los productos en la tabla
function displayProducts(products) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = ''; // Limpiar el contenido anterior

    products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${product.code || '-'}</td>
            <td>${product.name}</td>
            <td>${product.cost ? `$${product.cost.toFixed(2)}` : '-'}</td>
            <td>${product.marginDollar ? `$${product.marginDollar.toFixed(2)}` : '-'}</td>
            <td>${product.marginPercent ? `${product.marginPercent.toFixed(2)} %` : '-'}</td>
            <td>${product.markupPercent ? `${product.markupPercent.toFixed(2)} %` : '-'}</td>
            <td>${product.price ? `$${product.price.toFixed(2)}` : '-'}</td>
            <td>
                <button onclick="editProduct('${product._id}')">Edit</button>
                <button onclick="deleteProduct('${product._id}')">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Manejar el formulario para agregar un nuevo producto
document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página

    const newProduct = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value,
        stock: parseInt(document.getElementById('stock').value),
    };

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });

        if (response.ok) {
            loadProducts(); // Recargar la lista de productos
            document.getElementById('productForm').reset(); // Limpiar el formulario
        } else {
            console.error('Failed to add product');
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
});


// Función para eliminar un producto por ID
async function deleteProduct(id) {
    try {
        const response = await fetch(`${apiURL}/${id}`, {
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
    fetch(`${apiURL}/${id}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('editProductId').value = product._id;
            document.getElementById('editName').value = product.name;
            document.getElementById('editPrice').value = product.price;
            document.getElementById('editCategory').value = product.category;
            document.getElementById('editStock').value = product.stock;
            document.getElementById('editProductForm').style.display = 'block';
        })
        .catch(error => console.error('Error fetching product:', error));
}

// Manejar el formulario de edición de producto
document.getElementById('editProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('editProductId').value;
    const updatedProduct = {
        name: document.getElementById('editName').value,
        price: parseFloat(document.getElementById('editPrice').value),
        category: document.getElementById('editCategory').value,
        stock: parseInt(document.getElementById('editStock').value),
    };

    try {
        const response = await fetch(`${apiURL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
        });

        if (response.ok) {
            loadProducts(); // Recargar la lista de productos
            document.getElementById('editProductForm').reset(); // Limpiar el formulario
            document.getElementById('editProductForm').style.display = 'none'; // Ocultar el formulario de edición
        } else {
            console.error('Failed to update product');
        }
    } catch (error) {
        console.error('Error updating product:', error);
    }
});

// Cargar productos al inicio
loadProducts();

// Función para mostrar el formulario de creación de productos en el modal
function showProductForm() {
    document.getElementById('productFormModal').style.display = 'flex';
}

// Función para ocultar el formulario de creación de productos
function hideProductForm() {
    document.getElementById('productFormModal').style.display = 'none';
}
// Función para mostrar el formulario de creación de productos en el modal
function showProductForm() {
    document.getElementById('productFormModal').style.display = 'flex';
}

// Función para ocultar el formulario de creación de productos
function hideProductForm() {
    document.getElementById('productFormModal').style.display = 'none';
}

// Evento para manejar el envío del formulario
document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página

    const newProduct = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value,
        stock: parseInt(document.getElementById('stock').value),
    };

    try {
        const response = await fetch('http://localhost:3000/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });

        if (response.ok) {
            loadProducts(); // Recargar la lista de productos
            document.getElementById('productForm').reset(); // Limpiar el formulario
            hideProductForm(); // Ocultar el modal después de agregar el producto
        } else {
            console.error('Failed to add product');
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
});