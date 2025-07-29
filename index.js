// Ana elementleri seç
const shoppingForm = document.querySelector('.shopping-form');
const itemInput = document.querySelector('#item');
const shoppingList = document.querySelector('.shopping-list');
const searchInput = document.querySelector('#search-input');
const categoryFilter = document.querySelector('#category-filter');
const productsContainer = document.querySelector('#products-container');
const cartBtn = document.querySelector('#cart-btn');
const cartCount = document.querySelector('#cart-count');
const themeToggle = document.querySelector('#theme-toggle');

// Global değişkenler
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let shoppingItems = JSON.parse(localStorage.getItem('shoppingItems')) || [];

// Örnek ürün verisi
const products = [
    {
        id: 1,
        name: "MacBook Pro M3",
        price: 35000,
        oldPrice: 38000,
        category: "laptop",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop", // Düzgün link
        description: "En yeni M3 işlemci ile güçlü performans"
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        price: 45000,
        oldPrice: 48000,
        category: "telefon",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop", // Unsplash'dan
        description: "Titanium tasarım ve Pro kamera sistemi"
    },
    {
        id: 3,
        name: "iPad Air",
        price: 18000,
        oldPrice: 20000,
        category: "tablet",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop", // Unsplash iPad
        description: "M2 çip ile hafif ve güçlü tablet deneyimi"
    },
    {
        id: 4,
        name: "AirPods Pro",
        price: 8500,
        oldPrice: 9500,
        category: "aksesuvar",
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=200&fit=crop", // Unsplash AirPods Pro
        description: "Aktif gürültü önleme özelliği"
    },
    {
        id: 5,
        name: "Dell XPS 13",
        price: 28000,
        oldPrice: 32000,
        category: "laptop",
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300&h=200&fit=crop", // Unsplash'dan
        description: "Intel i7 işlemci, 16GB RAM"
    },
    {
        id: 6,
        name: "Samsung Galaxy S24",
        price: 32000,
        oldPrice: 35000,
        category: "telefon",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=200&fit=crop", // Unsplash Samsung Galaxy
        description: "AI özellikli kamera ve 200MP çözünürlük"
    }
];

// Ürünleri göster
function displayProducts(productsToShow = products) {
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsContainer.innerHTML = '<div class="col-12 text-center"><p class="lead">Ürün bulunamadı.</p></div>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card product-card h-100">
                    <div class="position-relative">
                        <span class="category-badge">${getCategoryName(product.category)}</span>
                        <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted">${product.description}</p>
                        <div class="price-container mt-auto">
                            <span class="product-price">${product.price.toLocaleString('tr-TR')} TL</span>
                            ${product.oldPrice ? `<span class="product-old-price">${product.oldPrice.toLocaleString('tr-TR')} TL</span>` : ''}
                        </div>
                        <button class="btn btn-primary mt-2" onclick="addToCart(${product.id})">
                            <i class="bi bi-cart-plus"></i> Sepete Ekle
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });
}

// Kategori isimlerini Türkçe'ye çevir
function getCategoryName(category) {
    const categories = {
        'laptop': 'Laptop',
        'telefon': 'Telefon',
        'tablet': 'Tablet',
        'aksesuvar': 'Aksesuvar'
    };
    return categories[category] || category;
}

// Sepete ürün ekle
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCart();
    showNotification(`${product.name} sepete eklendi!`, 'success');
}

// Sepet UI'ını güncelle
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
}

// Sepeti kaydet
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Alışveriş listesi fonksiyonları (mevcut)
function addShoppingItem() {
    const itemName = itemInput?.value.trim();
    if (!itemName) return;
    
    const newItem = {
        id: Date.now(),
        name: itemName,
        completed: false
    };
    
    shoppingItems.push(newItem);
    displayShoppingItems();
    saveShoppingItems();
    itemInput.value = '';
    showNotification('Ürün listeye eklendi!', 'success');
}

// Yeni ürün ekleme fonksiyonu (Fotoğraf ile)
function addNewProduct() {
    const name = prompt('Ürün adı:');
    const price = prompt('Ürün fiyatı (TL):');
    const category = prompt('Kategori (laptop/telefon/tablet/aksesuvar):');
    const description = prompt('Ürün açıklaması:');
    const imageUrl = prompt('Fotoğraf URL\'si (opsiyonel):');
    
    if (name && price && category) {
        const newProduct = {
            id: Date.now(),
            name: name,
            price: parseInt(price),
            category: category,
            description: description || 'Açıklama eklenmemiş',
            image: imageUrl || 'https://via.placeholder.com/300x200/007bff/ffffff?text=' + encodeURIComponent(name)
        };
        
        products.push(newProduct);
        displayProducts();
        showNotification('Yeni ürün eklendi!', 'success');
    }
}

// Fotoğraf yükleme fonksiyonu
function handleImageUpload(event, productId) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Dosya okuyucu oluştur
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Base64 formatında resmi al
        const imageDataUrl = e.target.result;
        
        // Ürünü bul ve resmini güncelle
        const product = products.find(p => p.id === productId);
        if (product) {
            product.image = imageDataUrl;
            displayProducts();
            showNotification('Fotoğraf güncellendi!', 'success');
        }
    };
    
    reader.readAsDataURL(file);
}

// Alışveriş öğelerini göster
function displayShoppingItems() {
    if (!shoppingList) return;
    
    // Sadece dinamik eklenen öğeleri temizle, mevcut HTML'i koru
    const dynamicItems = shoppingList.querySelectorAll('[data-dynamic="true"]');
    dynamicItems.forEach(item => item.remove());
    
    shoppingItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'border rounded p-3 mb-1';
        li.setAttribute('data-dynamic', 'true');
        li.innerHTML = `
            <input type="checkbox" class="form-check-input" ${item.completed ? 'checked' : ''} 
                   onchange="toggleShoppingItem(${item.id})">
            <div class="item-name ${item.completed ? 'text-decoration-line-through' : ''}">${item.name}</div>
            <i class="fs-3 bi bi-x text-danger delete-icon" style="cursor: pointer;" 
               onclick="deleteShoppingItem(${item.id})"></i>
        `;
        shoppingList.appendChild(li);
    });
}

// Alışveriş öğesi durumunu değiştir
function toggleShoppingItem(id) {
    const item = shoppingItems.find(item => item.id === id);
    if (item) {
        item.completed = !item.completed;
        displayShoppingItems();
        saveShoppingItems();
    }
}

// Alışveriş öğesi sil
function deleteShoppingItem(id) {
    if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
        shoppingItems = shoppingItems.filter(item => item.id !== id);
        displayShoppingItems();
        saveShoppingItems();
        showNotification('Öğe silindi!', 'warning');
    }
}

// Alışveriş listesini kaydet
function saveShoppingItems() {
    localStorage.setItem('shoppingItems', JSON.stringify(shoppingItems));
}

// Ürün arama
function searchProducts() {
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const selectedCategory = categoryFilter?.value || '';
    
    let filteredProducts = products;
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === selectedCategory
        );
    }
    
    displayProducts(filteredProducts);
}

// Bildirim göster
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Tema değiştir
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
    }
    
    localStorage.setItem('darkMode', isDark);
}

// Bölüme kaydır
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Sepet modalını göster
function showCartModal() {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    updateCartModal();
    cartModal.show();
}

// Sepet modalını güncelle
function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">Sepetiniz boş</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item d-flex justify-content-between align-items-center';
        cartItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.image}" width="60" height="60" class="me-3 rounded">
                <div>
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">${item.price.toLocaleString('tr-TR')} TL</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toLocaleString('tr-TR');
}

// Sepet miktarını güncelle
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            updateCartModal();
            saveCart();
        }
    }
}

// Sepetten ürün kaldır
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    updateCartModal();
    saveCart();
    showNotification('Ürün sepetten kaldırıldı!', 'warning');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Verileri yükle
    displayProducts();
    displayShoppingItems();
    updateCartUI();
    
    // Tema durumunu yükle
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        }
    }
    
    // Event listeners ekle
    shoppingForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        addShoppingItem();
    });
    
    searchInput?.addEventListener('input', searchProducts);
    categoryFilter?.addEventListener('change', searchProducts);
    
    document.getElementById('search-btn')?.addEventListener('click', searchProducts);
    
    cartBtn?.addEventListener('click', showCartModal);
    themeToggle?.addEventListener('click', toggleTheme);
    
    // İletişim formu
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Mesajınız gönderildi! En kısa sürede dönüş yapacağız.', 'success');
        e.target.reset();
    });
    
    // Checkout buton
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Sepetiniz boş!', 'warning');
            return;
        }
        showNotification('Siparişiniz alındı! Teşekkür ederiz.', 'success');
        cart = [];
        updateCartUI();
        updateCartModal();
        saveCart();
    });
    
    console.log('🛒 TechStore E-Ticaret Sitesi Hazır!');
});

// Global fonksiyonlar (HTML'den çağrılabilir)
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.toggleShoppingItem = toggleShoppingItem;
window.deleteShoppingItem = deleteShoppingItem;
window.scrollToSection = scrollToSection;