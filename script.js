// Database Produk
const products = [
    { id: 1, name: "Hijab Sport", price: 40000, img: "image/hijab-sport.jpeg" },
    { id: 2, name: "Segi Empat Voal", price: 35000, img: "image/segiempat-voal.jpeg" },
    { id: 3, name: "Pashmina Silk", price: 45000, img: "image/pashmina-viscose.jpeg" },
    { id: 4, name: "Ceruty Premium", price: 42000, img: "image/pashmina-ceruty.jpeg" }
];

document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    updateCartCount();
    setupAIPreview();
});

// Hamburger Toggle
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Render Katalog
function renderCatalog() {
    const grid = document.getElementById('productGrid');
    if(!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="location.href='product-detail.html?id=${p.id}'">
            <img src="${p.img}" alt="${p.name}">
            <h3 style="margin-top:10px">${p.name}</h3>
            <p style="color:var(--dark-pink); font-weight:600">Rp ${p.price.toLocaleString()}</p>
        </div>
    `).join('');
}

// AI Analysis Logic
function setupAIPreview() {
    const input = document.getElementById('faceInput');
    if(input) {
        input.onchange = (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById('photoPreview').innerHTML = `<img src="${event.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
                };
                reader.readAsDataURL(file);
            }
        };
    }
}

function startAIAnalysis() {
    const input = document.getElementById('faceInput');
    if(!input.files[0]) return alert("Silakan unggah foto dulu ya Sis!");

    document.getElementById('aiLoader').style.display = "block";
    document.getElementById('aiResult').style.display = "none";

    setTimeout(() => {
        // Konsistensi: Berdasarkan panjang nama file agar hasil tidak berubah-ubah untuk foto yang sama
        const isPatternA = input.files[0].name.length % 2 === 0;

        document.getElementById('faceShape').innerText = isPatternA ? "Oval / Panjang" : "Bulat / Kotak";
        document.getElementById('skinUndertone').innerText = isPatternA ? "Cool Tone" : "Warm Tone";
        document.getElementById('aiSuggestion').innerText = isPatternA ? 
            "Wajah Anda sangat cocok dengan Pashmina Ceruty gaya lilit. Warna Lilac atau Pink akan membuat wajah tampak segar." : 
            "Gunakan Segi Empat Voal dengan lipatan dahi tegak agar wajah tampak proporsional. Pilih warna Earth Tone.";

        document.getElementById('aiLoader').style.display = "none";
        document.getElementById('aiResult').style.display = "block";
    }, 2000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('heavenlyCart')) || [];
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = cart.length;
}
