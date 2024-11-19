async function fetchMenuItems() {
    try {
        const response = await fetch('http://localhost:3003/api/menu');
        if (!response.ok) throw new Error('Error fetching menu items');
        const items = await response.json();

        const gallery = document.getElementById('gallery');
        items.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';

            productDiv.innerHTML = `
                <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
                <p>Category: ${item.category || 'Uncategorized'}</p>
            `;

            gallery.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

fetchMenuItems();
