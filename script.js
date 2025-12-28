// Datos de productos
const products = [
    {
        id: 1,
        name: "Taladro Percutor 750W",
        description: "Taladro percutor profesional con potencia de 750W, ideal para trabajos en concreto y metal.",
        price: 89.99,
        category: "Herramientas Eléctricas",
        icon: "fas fa-bolt"
    },
    {
        id: 2,
        name: "Juego de Destornilladores",
        description: "Set de 25 destornilladores profesionales con puntas intercambiables y mangos ergonómicos.",
        price: 34.50,
        category: "Herramientas Manuales",
        icon: "fas fa-screwdriver"
    },
    {
        id: 3,
        name: "Pintura Látex Interior",
        description: "Pintura látex de alta calidad para interiores, disponible en todos los colores, cubre 15m² por litro.",
        price: 28.75,
        category: "Pinturas y Accesorios",
        icon: "fas fa-paint-roller"
    },
    {
        id: 4,
        name: "Casco de Seguridad",
        description: "Casco de seguridad industrial con ajuste regulable y banda reflectante para mayor visibilidad.",
        price: 18.90,
        category: "Equipo de Seguridad",
        icon: "fas fa-hard-hat"
    },
    {
        id: 5,
        name: "Juego de Llaves Mixtas",
        description: "Set de 10 llaves mixtas de acero cromo vanadio, tamaños de 8mm a 19mm.",
        price: 42.30,
        category: "Herramientas Manuales",
        icon: "fas fa-wrench"
    },
    {
        id: 6,
        name: "Sierra Circular 1800W",
        description: "Sierra circular profesional con potencia de 1800W, corte máximo a 90°: 66mm, incluye guía paralela.",
        price: 129.99,
        category: "Herramientas Eléctricas",
        icon: "fas fa-cut"
    },
    {
        id: 7,
        name: "Tubería PVC 1/2\"",
        description: "Tubería de PVC para agua potable, diámetro 1/2\", longitud 6 metros, presión máxima 10 bar.",
        price: 8.75,
        category: "Fontanería",
        icon: "fas fa-tint"
    },
    {
        id: 8,
        name: "Guantes de Trabajo",
        description: "Guantes de cuero para trabajo pesado, resistentes a cortes y abrasiones, talla L.",
        price: 12.50,
        category: "Equipo de Seguridad",
        icon: "fas fa-hand-paper"
    }
];

// Carrito de compras
let cart = [];
let cartTotal = 0;

// Elementos del DOM
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');
const subscribeBtn = document.getElementById('subscribeBtn');

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos
    loadProducts();
    
    // Cargar carrito desde localStorage si existe
    loadCartFromStorage();
    
    // Actualizar contador del carrito
    updateCartCount();
    
    // Configurar event listeners
    setupEventListeners();
});

// Cargar productos en la página
function loadProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <i class="${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Agregar al Carrito
                    </button>
                    <button class="btn btn-secondary view-details" data-id="${product.id}">
                        <i class="fas fa-info-circle"></i> Detalles
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Agregar event listeners a los botones de los productos
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            viewProductDetails(productId);
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Carrito
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // Búsqueda
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Finalizar compra
    checkoutBtn.addEventListener('click', checkout);
    
    // Menú móvil
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Formulario de contacto
    contactForm.addEventListener('submit', submitContactForm);
    
    // Suscripción al newsletter
    subscribeBtn.addEventListener('click', subscribeNewsletter);
    
    // Cerrar carrito al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (!cartSidebar.contains(event.target) && !cartIcon.contains(event.target)) {
            cartSidebar.classList.remove('active');
        }
    });
}

// Funciones del carrito
function toggleCart() {
    cartSidebar.classList.toggle('active');
    updateCartDisplay();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });
    }
    
    // Actualizar carrito
    updateCartCount();
    updateCartTotal();
    saveCartToStorage();
    
    // Mostrar notificación
    showNotification(`${product.name} agregado al carrito`, 'success');
    
    // Actualizar visualización si el carrito está abierto
    if (cartSidebar.classList.contains('active')) {
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        updateCartCount();
        updateCartTotal();
        saveCartToStorage();
        updateCartDisplay();
        
        showNotification('Producto eliminado del carrito', 'info');
    }
}

function updateCartDisplay() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-icon">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Agregar event listeners a los botones del carrito
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartTotal();
            saveCartToStorage();
            updateCartDisplay();
        }
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }
    
    // Simular proceso de compra
    showNotification('Procesando compra...', 'info');
    
    setTimeout(() => {
        // Limpiar carrito
        cart = [];
        updateCartCount();
        updateCartTotal();
        updateCartDisplay();
        saveCartToStorage();
        
        // Cerrar carrito
        cartSidebar.classList.remove('active');
        
        // Mostrar confirmación
        showNotification('¡Compra realizada con éxito! Gracias por tu pedido.', 'success');
    }, 1500);
}

// Funciones de búsqueda
function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        loadProducts(); // Cargar todos los productos
        return;
    }
    
    // Filtrar productos
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    // Mostrar resultados
    displaySearchResults(filteredProducts);
}

function displaySearchResults(results) {
    productsGrid.innerHTML = '';
    
    if (results.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    results.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <i class="${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Agregar event listeners a los botones de los productos filtrados
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Funciones de detalles del producto
function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Crear modal de detalles
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${product.name}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="product-detail-img">
                    <i class="${product.icon}"></i>
                </div>
                <div class="product-detail-info">
                    <p><strong>Categoría:</strong> ${product.category}</p>
                    <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
                    <p><strong>Descripción:</strong> ${product.description}</p>
                    <div class="product-detail-actions">
                        <button class="btn btn-primary add-to-cart-modal" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Agregar al Carrito
                        </button>
                        <button class="btn btn-secondary close-modal-btn">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Estilos para el modal
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h2 {
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--gray);
        }
        
        .modal-body {
            padding: 20px;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 20px;
        }
        
        .product-detail-img {
            background-color: var(--light);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            color: var(--primary);
        }
        
        .product-detail-actions {
            margin-top: 20px;
            display: flex;
            gap: 10px;
        }
        
        @media (max-width: 768px) {
            .modal-body {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Event listeners del modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    modal.querySelector('.close-modal-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    modal.querySelector('.add-to-cart-modal').addEventListener('click', () => {
        addToCart(productId);
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    });
}

// Menú móvil
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
}

// Formulario de contacto
function submitContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validación básica
    if (!name || !email || !subject || !message) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Simular envío del formulario
    showNotification('Enviando mensaje...', 'info');
    
    setTimeout(() => {
        // Resetear formulario
        contactForm.reset();
        
        // Mostrar confirmación
        showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
        
        // En un caso real, aquí enviarías los datos a un servidor
        console.log('Formulario de contacto enviado:', { name, email, phone, subject, message });
    }, 1500);
}

// Suscripción al newsletter
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    
    if (!email) {
        showNotification('Por favor ingresa tu correo electrónico', 'error');
        return;
    }
    
    // Validación simple de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor ingresa un correo electrónico válido', 'error');
        return;
    }
    
    // Simular suscripción
    showNotification('Procesando suscripción...', 'info');
    
    setTimeout(() => {
        // Limpiar campo
        document.getElementById('newsletterEmail').value = '';
        
        // Mostrar confirmación
        showNotification('¡Suscripción exitosa! Gracias por suscribirte.', 'success');
        
        // En un caso real, aquí enviarías el email a tu servidor
        console.log('Email suscrito al newsletter:', email);
    }, 1000);
}

// Funciones de utilidad
function showNotification(message, type) {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos para la notificación
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .notification.success {
            background-color: var(--success);
        }
        
        .notification.error {
            background-color: var(--primary);
        }
        
        .notification.info {
            background-color: var(--secondary);
            color: var(--dark);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Remover notificación después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        
        // Agregar animación de salida
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(slideOutStyle);
        
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(slideOutStyle);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// Almacenamiento local
function saveCartToStorage() {
    localStorage.setItem('ferreteriaCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('ferreteriaCart');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartTotal();
    }
}