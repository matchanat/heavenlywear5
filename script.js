// 1. DATA PRODUK (Single Source of Truth)
const products = {
    'sport': {
        name: 'Hijab Sport',
        price: 40000,
        img: 'image/hijab-sport.jpeg',
        desc: 'Hijab instan dengan bahan spandek jersey yang menyerap keringat, cocok untuk aktivitas lari, gym, atau bersepeda.',
        colors: ['Hitam', 'Navy', 'Abu Muda', 'Maroon', 'Dusty Pink'],
        stock: 150
    },
    'voal': {
        name: 'Hijab Segi Empat Voal',
        price: 35000,
        img: 'image/segiempat-voal.jpeg',
        desc: 'Bahan Voal Premium yang tegak di dahi, tidak terawang, dan sangat mudah dibentuk untuk acara formal maupun harian.',
        colors: ['Broken White', 'Nude', 'Olive', 'Denim', 'Lilac'],
        stock: 85
    },
    'viscose': {
        name: 'Hijab Pashmina Viscose',
        price: 45000,
        img: 'image/pashmina-viscose.jpeg',
        desc: 'Serat alami Viscose yang memberikan kesan jatuh (flowy) dan mewah. Dingin di kulit dan sangat elegan.',
        colors: ['Sage', 'Terracotta', 'Beige', 'Black'],
        stock: 60
    },
    'ceruty': {
        name: 'Hijab Pashmina Ceruty',
        price: 42000,
        img: 'image/pashmina-ceruty.jpeg',
        desc: 'Bahan Ceruty Babydoll bertekstur pasir lembut. Memberikan volume yang cantik saat digunakan sebagai pashmina.',
        colors: ['Milo', 'Sand', 'Rose', 'Silver'],
        stock: 120
    }
};

// 2. LOGIKA KERANJANG (Cart System)
let cart = JSON.parse(localStorage.getItem('heavenlyCart')) || [];

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) countElement.innerText = cart.length;
}

function addToCart(productId, selectedColor, quantity) {
    const item = {
        id: productId,
        name: products[productId].name,
        price: products[productId].price,
        color: selectedColor,
        qty: parseInt(quantity),
        img: products[productId].img
    };
    
    cart.push(item);
    localStorage.setItem('heavenlyCart', JSON.stringify(cart));
    updateCartCount();
    alert("Produk berhasil masuk keranjang!");
}

// 3. HALAMAN DETAIL PRODUK DINAMIS
function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const product = products[id];

    if (product) {
        document.getElementById('detail-title').innerText = product.name;
        document.getElementById('detail-price').innerText = `Rp ${product.price.toLocaleString()}`;
        document.getElementById('detail-desc').innerText = product.desc;
        document.getElementById('detail-img').src = product.img;
        document.getElementById('stok-num').innerText = product.stock;

        const colorContainer = document.getElementById('color-options');
        product.colors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = "px-4 py-2 border rounded-full hover:bg-rose-200 focus:bg-rose-300 transition text-sm";
            btn.innerText = color;
            btn.onclick = () => window.selectedColor = color;
            colorContainer.appendChild(btn);
        });
    }
}

// 4. ANALISIS WAJAH & UNDERTONE (Simulasi Konsisten)
function analyzeFace() {
    const results = [
        { shape: "Oval", undertone: "Cool", recommendation: "Pashmina Ceruty - Dusty Blue" },
        { shape: "Kotak", undertone: "Warm", recommendation: "Segi Empat Voal - Terracotta" },
        { shape: "Bulat", undertone: "Neutral", recommendation: "Pashmina Viscose - Beige" }
    ];
    
    // Hasil dibuat konsisten (misal berdasarkan jam) agar tidak berubah-ubah saat refresh singkat
    const index = new Date().getHours() % results.length;
    const res = results[index];

    const display = document.getElementById('analysis-result');
    display.classList.remove('hidden');
    display.innerHTML = `
        <div class="p-4 bg-white/30 rounded-xl mt-4 border border-white">
            <p><strong>Bentuk Wajah:</strong> ${res.shape}</p>
            <p><strong>Undertone:</strong> ${res.undertone}</p>
            <p class="text-blue-800">✨ Rekomendasi: ${res.recommendation}</p>
        </div>
    `;
}

// 5. SISTEM PEMBAYARAN & ONGKIR
function calculateTotal() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const shipping = parseInt(document.getElementById('shipping-option')?.value || 0);
    const total = subtotal + shipping;

    if(document.getElementById('total-bayar')) {
        document.getElementById('total-bayar').innerText = `Rp ${total.toLocaleString()}`;
    }
}

// 6. INTEGRASI DATA KE OWNER (Spreadsheet Trigger)
async function processPayment() {
    const confirmBuy = confirm("Apakah Anda yakin ingin melakukan pembelian?");
    if (!confirmBuy) return;

    // Data yang dikirim ke database owner
    const orderData = {
        customer: localStorage.getItem('userLogin') || 'Guest',
        items: cart,
        total: document.getElementById('total-bayar').innerText,
        date: new Date().toLocaleString()
    };

    console.log("Mengirim data ke Database Owner...", orderData);
    
    // Simulasi pengosongan keranjang setelah beli
    alert("Pesanan Berhasil! Anda akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.");
    cart = [];
    localStorage.removeItem('heavenlyCart');
    window.location.href = "https://wa.me/628123456789?text=Halo%20Heavenly%20Wear,%20saya%20ingin%20konfirmasi%20pesanan%20saya.";
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (window.location.pathname.includes('product-detail.html')) loadProductDetail();
    if (window.location.pathname.includes('cart.html')) calculateTotal();
});
