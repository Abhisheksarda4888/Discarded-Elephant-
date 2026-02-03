// Global State
let currentCurrency = currencies[0];
let selectedCategory = 'big';
let currentQty = 1;
let bargainedPrice = null;
let promoApplied = false;
let promoDiscount = 0;
let gstRate = 0.18;
let selectedPayment = 'cod';
let cart = {};
let productQty = {};
let notificationTimer;
let countdownInterval;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollTop();
    renderCurrencyList();
    renderCategories();
    renderProducts();
    updateElephantDetails();
    init3DElephant();
    attachEventListeners();
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('themeSlider').textContent = savedTheme === 'light' ? '☀️' : '🌙';
}

document.getElementById('themeToggle').addEventListener('click', () => {
    const body = document.body;
    const slider = document.getElementById('themeSlider');
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    slider.textContent = newTheme === 'light' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
});

// Scroll to Top
function initScrollTop() {
    window.addEventListener('scroll', () => {
        const btn = document.getElementById('scrollTop');
        if (window.pageYOffset > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
    
    document.getElementById('scrollTop').addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
}

// Currency Management
function renderCurrencyList() {
    const list = document.getElementById('currencyList');
    list.innerHTML = currencies.map(c => `
        <div class="currency-item ${c.code === currentCurrency.code ? 'selected' : ''}" onclick="selectCurrency('${c.code}')">
            <div>
                <span>${c.flag}</span>
                <span style="font-weight:600;margin-left:8px">${c.code}</span>
                <span style="color:var(--text-secondary);font-size:11px;margin-left:6px">${c.name}</span>
            </div>
            <span style="font-weight:600">${c.symbol}</span>
        </div>
    `).join('');
}

document.getElementById('currencyBtn').addEventListener('click', () => {
    document.getElementById('currencyDropdown').classList.toggle('active');
});

function selectCurrency(code) {
    currentCurrency = currencies.find(c => c.code === code);
    document.getElementById('currencyFlag').textContent = currentCurrency.flag;
    document.getElementById('currencyCode').textContent = currentCurrency.code;
    bargainedPrice = null;
    document.getElementById('bargainInput').value = '';
    updateAllPrices();
    renderCurrencyList();
    document.getElementById('currencyDropdown').classList.remove('active');
}

document.getElementById('currencySearch').addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('.currency-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(search) ? 'flex' : 'none';
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.currency-selector')) {
        document.getElementById('currencyDropdown').classList.remove('active');
    }
});

function formatPrice(amountINR) {
    const converted = amountINR * currentCurrency.rate;
    const formatted = converted.toFixed(currentCurrency.code === 'JPY' ? 0 : 2);
    return `${currentCurrency.symbol}${parseFloat(formatted).toLocaleString()}`;
}

function updateAllPrices() {
    const basePrice = bargainedPrice || elephantCategories[selectedCategory].price;
    document.getElementById('basePrice').textContent = formatPrice(basePrice);
    
    document.querySelectorAll('.product-price').forEach(el => {
        const base = parseFloat(el.dataset.basePrice);
        el.textContent = formatPrice(base);
    });
}

// Category Management
function renderCategories() {
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = Object.keys(elephantCategories).map((key, i) => {
        const cat = elephantCategories[key];
        return `
            <div class="category-card ${i === 0 ? 'active' : ''}" onclick="selectCategory('${key}', this)">
                <span class="category-icon">${cat.icon}</span>
                <div class="category-name">${cat.title.split(' ').slice(0, 2).join(' ')}</div>
            </div>
        `;
    }).join('');
}

function selectCategory(cat, el) {
    selectedCategory = cat;
    bargainedPrice = null;
    promoApplied = false;
    document.getElementById('bargainInput').value = '';
    
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    
    updateElephantDetails();
    updateAllPrices();
    updateElephantAppearance();
}

function updateElephantDetails() {
    const details = elephantCategories[selectedCategory];
    const html = `
        <h3>${details.icon} ${details.title}</h3>
        <p style="color:var(--text-secondary);margin-bottom:12px;line-height:1.6">${details.description}</p>
        <div>
            ${details.specs.map(s => `
                <div class="spec-item">
                    <span class="spec-icon">${s.icon}</span>
                    <span>${s.text}</span>
                </div>
            `).join('')}
        </div>
    `;
    document.getElementById('elephantDetails').innerHTML = html;
}

// Products
function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <span class="product-icon">${p.icon}</span>
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            ${p.breakdown ? `<div class="product-breakdown">${p.breakdown}</div>` : '<div class="product-breakdown"></div>'}
            <div class="product-price" data-base-price="${p.price}">${formatPrice(p.price)}</div>
            <div class="product-warning">${!p.bargainable ? '⚠️ Fixed price - No bargaining' : ''}</div>
            <div class="product-qty">
                <button onclick="changeProductQty('${p.id}', -1)">−</button>
                <span id="qty-${p.id}">0</span>
                <button onclick="changeProductQty('${p.id}', 1)">+</button>
            </div>
            <button class="btn btn-secondary" onclick="addProductToCart('${p.id}')">Add to Cart</button>
        </div>
    `).join('');
}

function changeProductQty(id, delta) {
    productQty[id] = (productQty[id] || 0) + delta;
    productQty[id] = Math.max(0, productQty[id]);
    document.getElementById(`qty-${id}`).textContent = productQty[id];
}

function addProductToCart(id) {
    const product = products.find(p => p.id === id);
    const qty = productQty[id] || 0;
    
    if (qty === 0) {
        return showNotification('Select Quantity ⚠️', 'Use +/- buttons', 'error');
    }
    
    if (!cart[id]) {
        cart[id] = {name: product.name, price: product.price, qty: 0, type: 'product'};
    }
    cart[id].qty += qty;
    
    productQty[id] = 0;
    document.getElementById(`qty-${id}`).textContent = 0;
    
    updateCartCount();
    showNotification('Added to Cart! 🛒', `${qty}x ${product.name}`);
}

// Bargaining
document.getElementById('bargainBtn').addEventListener('click', () => {
    const input = document.getElementById('bargainInput');
    const value = parseFloat(input.value);
    const basePrice = elephantCategories[selectedCategory].price;
    
    if (!value || value <= 0) {
        return showNotification('Invalid Amount ❌', 'Enter valid amount', 'error');
    }
    
    const inINR = value / currentCurrency.rate;
    
    if (inINR >= basePrice * 0.7 && inINR <= basePrice) {
        bargainedPrice = inINR;
        promoApplied = false;
        updateAllPrices();
        showNotification('Bargain Accepted! 🎉', `New price: ${formatPrice(inINR)}`);
    } else if (inINR > basePrice) {
        showNotification('Too High! 😅', 'Higher than base price', 'error');
    } else {
        showNotification('Bargain Rejected ❌', `Minimum: ${formatPrice(basePrice * 0.7)}`, 'error');
    }
});

// Quantity
document.getElementById('qtyPlus').addEventListener('click', () => {
    currentQty++;
    document.getElementById('qtyDisplay').textContent = currentQty;
    document.getElementById('qtyMinus').disabled = false;
});

document.getElementById('qtyMinus').addEventListener('click', () => {
    if (currentQty > 1) {
        currentQty--;
        document.getElementById('qtyDisplay').textContent = currentQty;
    }
    if (currentQty === 1) {
        document.getElementById('qtyMinus').disabled = true;
    }
});

// Cart
function updateCartCount() {
    const total = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartCount').textContent = total;
}

document.getElementById('addCart').addEventListener('click', () => {
    const price = bargainedPrice || elephantCategories[selectedCategory].price;
    const key = `elephant_${selectedCategory}`;
    
    if (!cart[key]) {
        cart[key] = {name: elephantCategories[selectedCategory].title, price: price, qty: 0, type: 'elephant'};
    }
    cart[key].qty += currentQty;
    cart[key].price = price;
    
    updateCartCount();
    showNotification('Added to Cart! 🛒', `${currentQty}x ${elephantCategories[selectedCategory].title}`);
});

document.getElementById('buyNow').addEventListener('click', () => {
    document.getElementById('addCart').click();
    setTimeout(() => openCartModal(), 500);
});

document.getElementById('cartBtn').addEventListener('click', openCartModal);

function openCartModal() {
    if (Object.keys(cart).length === 0) {
        return showNotification('Cart Empty 🛒', 'Add items first', 'error');
    }
    
    let subtotal = 0;
    let itemsHTML = '';
    
    for (let key in cart) {
        const item = cart[key];
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong><br>
                    <small style="color:var(--text-secondary)">${formatPrice(item.price)} each</small>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-qty-btn" onclick="changeCartQty('${key}', -1)">−</button>
                    <span class="cart-qty-display">${item.qty}</span>
                    <button class="cart-qty-btn" onclick="changeCartQty('${key}', 1)">+</button>
                    <div style="font-weight:700;min-width:80px;text-align:right">${formatPrice(itemTotal)}</div>
                </div>
            </div>
        `;
    }
    
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    
    const summaryHTML = `
        <div class="cart-summary">
            <div class="summary-row"><span>Subtotal:</span><span>${formatPrice(subtotal)}</span></div>
            <div class="summary-row"><span>GST (18%):</span><span>${formatPrice(gst)}</span></div>
            <div class="summary-row total"><span>Total:</span><span>${formatPrice(total)}</span></div>
        </div>
        <button class="btn btn-primary" style="width:100%;margin-top:20px" onclick="proceedToCheckout()">Proceed to Checkout</button>
    `;
    
    document.getElementById('cartBody').innerHTML = itemsHTML + summaryHTML;
    document.getElementById('cartModal').classList.add('active');
}

function changeCartQty(key, delta) {
    if (cart[key].qty + delta <= 0) {
        return showNotification(
            'Remove Item? 🗑️',
            'Sure to remove?',
            'confirm',
            () => {
                delete cart[key];
                updateCartCount();
                openCartModal();
                showNotification('Item Removed ✅', 'Removed from cart');
            }
        );
    }
    
    cart[key].qty += delta;
    updateCartCount();
    openCartModal();
}

document.getElementById('closeCart').addEventListener('click', () => {
    document.getElementById('cartModal').classList.remove('active');
});

// Checkout
function proceedToCheckout() {
    document.getElementById('cartModal').classList.remove('active');
    document.getElementById('checkoutCurrency').textContent = `${currentCurrency.flag} ${currentCurrency.code} (${currentCurrency.name})`;
    document.getElementById('checkoutModal').classList.add('active');
    
    gstRate = 0.18;
    promoApplied = false;
    promoDiscount = 0;
    
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.gst-btn')[0].classList.add('selected');
    
    document.querySelectorAll('.promo-option').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('.promo-option')[1].classList.add('selected');
    
    updateCheckoutSummary();
}

function attachEventListeners() {
    // Promo selection
    document.querySelectorAll('.promo-option').forEach(opt => {
        opt.addEventListener('click', function() {
            const code = this.dataset.code;
            const discount = parseInt(this.dataset.discount);
            
            document.querySelectorAll('.promo-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            
            if (discount > 0) {
                promoApplied = true;
                promoDiscount = discount;
            } else {
                promoApplied = false;
                promoDiscount = 0;
            }
            
            updateCheckoutSummary();
        });
    });
    
    // Payment selection
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.addEventListener('click', function() {
            selectedPayment = this.dataset.payment;
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // GST selection
    document.querySelectorAll('.gst-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            gstRate = this.dataset.gst === 'sin' ? 0.18 : 0.40;
            document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            updateCheckoutSummary();
        });
    });
}

function updateCheckoutSummary() {
    let subtotal = 0;
    
    for (let key in cart) {
        const item = cart[key];
        subtotal += item.price * item.qty;
    }
    
    let discount = 0;
    if (promoApplied) {
        discount = subtotal * (promoDiscount / 100);
    }
    
    const taxableAmount = subtotal - discount;
    const gst = taxableAmount * gstRate;
    const total = taxableAmount + gst;
    
    const summaryHTML = `
        <div class="cart-summary">
            <div class="summary-row"><span>Items Total (Taxable Value):</span><span>${formatPrice(subtotal)}</span></div>
            ${discount > 0 ? `<div class="summary-row discount"><span>🎉 Promo Discount (${promoDiscount}%):</span><span>-${formatPrice(discount)}</span></div>` : ''}
            <div class="summary-row"><span>Net Amount (After Discount):</span><span>${formatPrice(taxableAmount)}</span></div>
            <div class="summary-row"><span>GST (${gstRate * 100}% on Net Amount):</span><span>${formatPrice(gst)}</span></div>
            <div class="summary-row total"><span>Total Amount:</span><span>${formatPrice(total)}</span></div>
        </div>
    `;
    
    document.getElementById('checkoutSummary').innerHTML = summaryHTML;
}

document.getElementById('closeCheckout').addEventListener('click', () => {
    document.getElementById('checkoutModal').classList.remove('active');
});

document.getElementById('completeOrder').addEventListener('click', generateBill);

function generateBill() {
    const city = document.getElementById('deliveryCity').value.trim();
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    
    if (!city || !name || !phone) {
        return showNotification('Missing Details ❌', 'Fill required fields', 'error');
    }
    
    const now = new Date();
    const orderTime = now.toLocaleString('en-IN');
    const orderDate = now.toLocaleDateString('en-IN');
    const checkoutTime = now.toLocaleTimeString('en-IN');
    const trackingNumber = 'TDE' + Date.now();
    const paymentMethod = selectedPayment === 'cod' ? 'Cash on Delivery' : 'Buy Now Pay Later';
    
    let subtotal = 0;
    let itemsHTML = '';
    
    for (let key in cart) {
        const item = cart[key];
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        
        itemsHTML += `<tr><td>${item.name}</td><td style="text-align:center">${item.qty}</td><td style="text-align:right">${formatPrice(item.price)}</td><td style="text-align:right">${formatPrice(itemTotal)}</td></tr>`;
    }
    
    let discount = 0;
    if (promoApplied) {
        discount = subtotal * (promoDiscount / 100);
    }
    
    const taxableAmount = subtotal - discount;
    const gst = taxableAmount * gstRate;
    const total = taxableAmount + gst;
    
    const gstType = gstRate === 0.18 ? 'Sin Goods (Honest - 18% Benefit)' : 'Non-Sin Goods (Penalty - 40%)';
    const promoCode = promoApplied ? `HAULA ELEPHANT (${promoDiscount}% OFF)` : 'No Coupon Applied';
    
    const qrData = `Order: ${trackingNumber}|Total: ${formatPrice(total)}|Payment: ${paymentMethod}|Date: ${orderDate}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    
    const billHTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Invoice ${trackingNumber}</title>
<style>
body{font-family:Arial,sans-serif;padding:20px;max-width:900px;margin:0 auto;background:#f8f9fa;line-height:1.6}
.invoice{background:#fff;padding:40px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.1)}
.header{display:grid;grid-template-columns:2fr 1fr;gap:30px;border-bottom:3px solid #d4af37;padding-bottom:20px;margin-bottom:30px}
.company{font-size:32px;font-weight:700;color:#1a1f2e;margin-bottom:8px}
.company-details{font-size:13px;color:#718096;line-height:1.8}
.qr-section{text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}
.qr-code{background:#fff;padding:12px;border:3px solid #d4af37;border-radius:12px;display:inline-block;box-shadow:0 2px 8px rgba(212,175,55,.3)}
.qr-code img{display:block;width:150px;height:150px}
.qr-label{font-size:11px;color:#718096;margin-top:8px;font-weight:600}
.title{text-align:center;font-size:28px;font-weight:700;color:#d4af37;margin:20px 0;padding:20px;background:linear-gradient(135deg,#fef5e7,#fff9e6);border-radius:12px;border:2px solid #d4af37}
.tracking{text-align:center;font-size:16px;margin:20px 0;padding:14px;background:linear-gradient(135deg,#e3f2fd,#e1f5fe);border-radius:8px;font-weight:700;color:#1976d2;border:2px solid #2196f3}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin:30px 0;background:#f8f9fa;padding:20px;border-radius:12px}
.info-section h3{font-size:14px;color:#1a1f2e;margin-bottom:12px;text-transform:uppercase;border-bottom:2px solid #d4af37;padding-bottom:6px;font-weight:700}
.info-section p{font-size:13px;color:#718096;line-height:1.8;margin:0}
table{width:100%;border-collapse:collapse;margin:30px 0;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.05)}
th{background:linear-gradient(135deg,#1a1f2e,#2d3748);color:#fff;padding:14px;text-align:left;font-weight:700;font-size:13px}
td{padding:14px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#2d3748}
tbody tr:last-child td{border-bottom:none}
tbody tr:hover{background:#f8f9fa}
.totals{margin-top:30px;padding:20px;background:linear-gradient(135deg,#fef5e7,#fff9e6);border-radius:12px;border:2px solid #d4af37}
.totals-row{display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px;padding:8px 0}
.totals-row.subtotal{font-weight:600;color:#2d3748;border-bottom:1px dashed #d4af37;padding-bottom:12px}
.totals-row.discount{color:#38a169;font-weight:700;background:#f0fff4;padding:8px 12px;border-radius:6px;margin:8px 0}
.totals-row.taxable{font-weight:600;color:#2d3748;border-bottom:1px dashed #d4af37;padding-bottom:12px}
.totals-row.gst{font-weight:600;color:#2d3748}
.totals-row.total{font-size:20px;font-weight:900;color:#1a1f2e;border-top:3px solid #d4af37;padding-top:16px;margin-top:12px;background:linear-gradient(135deg,#fff3cd,#ffe5a3);padding:14px;border-radius:8px}
.highlight{background:#fef5e7;padding:18px;border-radius:12px;margin:24px 0;border-left:5px solid #d4af37;box-shadow:0 2px 8px rgba(212,175,55,.2)}
.print-btn{background:linear-gradient(135deg,#d4af37,#f4e5c3);color:#1a1f2e;border:none;padding:14px 36px;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px;margin:20px 0;box-shadow:0 4px 12px rgba(212,175,55,.4)}
.print-btn:hover{transform:translateY(-2px)}
.signature{margin-top:60px;text-align:right}
.signature-line{border-top:2px solid #1a1f2e;width:220px;margin-left:auto;margin-top:60px;padding-top:12px;text-align:center}
.footer{margin-top:50px;padding-top:24px;border-top:2px solid #e2e8f0;text-align:center;font-size:11px;color:#718096;line-height:1.8}
@media print{.print-btn{display:none}body{background:#fff}}
@media (max-width:600px){.header,.info-grid{grid-template-columns:1fr}.qr-section{margin-top:20px}}
</style>
</head>
<body>
<div class="invoice">
<button class="print-btn" onclick="window.print()">🖨️ Print Invoice</button>
<div class="header">
<div>
<div class="company">🐘 THE DISCARDED ELEPHANTS</div>
<div class="company-details">
<strong>Broken Bone Pvt Ltd</strong><br>
Principal Owner: Abhishek Sarda<br>
Chandrapur, Maharashtra, India<br>
Email: support@discardedelephants.com<br>
<strong>GSTIN: 27ELEPH1234A2NT</strong>
</div>
</div>
<div class="qr-section">
<div class="qr-code"><img src="${qrUrl}" alt="QR Code"></div>
<div class="qr-label">Scan to View/Track Order</div>
</div>
</div>
<div class="title">TAX INVOICE</div>
<div class="tracking">📦 Order Tracking Number: ${trackingNumber}</div>
<div class="info-grid">
<div class="info-section">
<h3>📋 Bill To</h3>
<p><strong style="font-size:15px;color:#1a1f2e">${name}</strong><br>${city}<br>Phone: ${phone}${email ? '<br>Email: ' + email : ''}</p>
</div>
<div class="info-section">
<h3>📅 Invoice Details</h3>
<p><strong>Invoice #:</strong> INV-${Date.now()}<br><strong>Order Date:</strong> ${orderDate}<br><strong>Order Time:</strong> ${orderTime}<br><strong>Checkout Time:</strong> ${checkoutTime}<br><strong>Currency:</strong> ${currentCurrency.code}<br><strong>Payment:</strong> ${paymentMethod}</p>
</div>
</div>
<div class="highlight"><strong>📋 GST:</strong> ${gstType}<br><strong>💳 Rate:</strong> ${gstRate * 100}%<br><strong>💰 Payment:</strong> ${paymentMethod}<br><strong>🎁 Promo:</strong> ${promoCode}</div>
<table>
<thead><tr><th>Description</th><th style="text-align:center;width:80px">Qty</th><th style="text-align:right;width:120px">Price</th><th style="text-align:right;width:120px">Amount</th></tr></thead>
<tbody>${itemsHTML}</tbody>
</table>
<div class="totals">
<div class="totals-row subtotal"><span><strong>Items Total (Taxable Value):</strong></span><span><strong>${formatPrice(subtotal)}</strong></span></div>
${discount > 0 ? `<div class="totals-row discount"><span><strong>🎉 Promo Discount (${promoDiscount}%):</strong></span><span><strong>-${formatPrice(discount)}</strong></span></div>` : ''}
<div class="totals-row taxable"><span><strong>Net Amount (After Discount):</strong></span><span><strong>${formatPrice(taxableAmount)}</strong></span></div>
<div class="totals-row gst"><span><strong>GST (${gstRate * 100}% on Net Amount) - ${gstType}:</strong></span><span><strong>${formatPrice(gst)}</strong></span></div>
<div class="totals-row total"><span><strong>TOTAL AMOUNT:</strong></span><span><strong>${formatPrice(total)}</strong></span></div>
</div>
<div class="highlight"><strong>📦 Payment & Delivery:</strong><br><small>• Payment: <strong>${paymentMethod}</strong><br>• GST: <strong>${gstRate * 100}% (${gstType})</strong><br>• Delivery: <strong>3-5 days</strong><br>• Tracking: <strong>${trackingNumber}</strong></small></div>
<div class="signature"><div class="signature-line"><strong>Authorized Signatory</strong><br><small>Broken Bone Pvt Ltd</small><br><small style="font-size:10px">Principal Owner: Abhishek Sarda</small></div></div>
<div class="footer"><strong>Thank you for choosing The Discarded Elephants!</strong><br>© 2026 Broken Bone Pvt Ltd | GSTIN: 27ELEPH1234A2NT | Ethical Elephant Rehoming</div>
</div>
</body>
</html>`;
    
    const blob = new Blob([billHTML], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${trackingNumber}.html`;
    a.click();
    
    showNotification('Order Complete! 🎉', `Invoice downloaded!<br>Tracking: ${trackingNumber}`);
    document.getElementById('checkoutModal').classList.remove('active');
    
    cart = {};
    gstRate = 0.18;
    promoApplied = false;
    promoDiscount = 0;
    updateCartCount();
}

// Notifications
let notificationTimer;
let countdownInterval;

function showNotification(title, message, type = 'success', confirmCallback = null) {
    const overlay = document.getElementById('notificationOverlay');
    const notification = overlay.querySelector('.notification');
    const buttonsDiv = document.getElementById('notifButtons');
    const timerText = document.getElementById('notifTimer');

    // clear any previous timers BEFORE creating new ones
    if (notificationTimer) clearTimeout(notificationTimer);
    if (countdownInterval) clearInterval(countdownInterval);

    // reset timer text
    timerText.textContent = '';

    // set content
    document.getElementById('notifTitle').textContent = title;
    document.getElementById('notifMessage').innerHTML = message;

    // styling
    if (type === 'error') {
        notification.style.borderLeftColor = 'var(--danger)';
    } else {
        notification.style.borderLeftColor = 'var(--success)';
    }

    // confirm or normal notification
    if (confirmCallback) {
        buttonsDiv.innerHTML =
            '<button onclick="confirmYes()">Yes, Remove</button>' +
            '<button onclick="closeNotification()">Cancel</button>';

        window.confirmCallback = confirmCallback;
    } else {
        buttonsDiv.innerHTML = '<button onclick="closeNotification()">Got it!</button>';

        let countdown = 4;
        timerText.textContent = `Auto-closing in ${countdown}s • Tap to close`;

        countdownInterval = setInterval(() => {
            countdown--;
            timerText.textContent = `Auto-closing in ${countdown}s • Tap to close`;

            if (countdown <= 0) clearInterval(countdownInterval);
        }, 1000);

        notificationTimer = setTimeout(() => closeNotification(), 4000);
    }

    overlay.classList.add('active');
}

function confirmYes() {
    if (window.confirmCallback) {
        window.confirmCallback();
        window.confirmCallback = null;
    }
    closeNotification();
}

function closeNotification() {
    document.getElementById('notificationOverlay').classList.remove('active');

    if (notificationTimer) clearTimeout(notificationTimer);
    if (countdownInterval) clearInterval(countdownInterval);

    window.confirmCallback = null;
}

document.getElementById('notificationOverlay').addEventListener('click', closeNotification);
document.querySelector('.notification').addEventListener('click', e => e.stopPropagation());


// Page Navigation
function showCorporatePage() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('corporatePage').style.display = 'block';
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function showMainPage() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('corporatePage').style.display = 'none';
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// 3D Elephant
function init3DElephant() {
    const canvas = document.getElementById('elephantCanvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true});
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0, 0);
    
    const elephantGroup = new THREE.Group();
    let elephantMaterial = new THREE.MeshPhongMaterial({color: 0x8b8b8b, shininess: 30});
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xd4af37, 1, 100);
    pointLight.position.set(-5, 3, 5);
    scene.add(pointLight);
    
    function buildElephant() {
        elephantGroup.clear();
        
        const body = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), elephantMaterial);
        body.scale.set(1, 0.8, 1.2);
        elephantGroup.add(body);
        
        const head = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), elephantMaterial);
        head.position.set(0, 0.3, 1.8);
        elephantGroup.add(head);
        
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.5, 16), elephantMaterial);
        trunk.position.set(0, -0.3, 2.5);
        trunk.rotation.x = Math.PI / 4;
        elephantGroup.add(trunk);
        
        const earGeo = new THREE.SphereGeometry(0.7, 16, 16);
        const leftEar = new THREE.Mesh(earGeo, elephantMaterial);
        leftEar.position.set(-0.9, 0.5, 1.5);
        leftEar.scale.set(0.3, 1, 1);
        elephantGroup.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeo, elephantMaterial);
        rightEar.position.set(0.9, 0.5, 1.5);
        rightEar.scale.set(0.3, 1, 1);
        elephantGroup.add(rightEar);
        
        const legGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.5, 16);
        [[-0.7, -1.5, 0.7], [0.7, -1.5, 0.7], [-0.7, -1.5, -0.7], [0.7, -1.5, -0.7]].forEach(pos => {
            const leg = new THREE.Mesh(legGeo, elephantMaterial);
            leg.position.set(...pos);
            elephantGroup.add(leg);
        });
        
        const tuskMat = new THREE.MeshPhongMaterial({color: 0xfffff0, shininess: 100});
        const tuskGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8);
        
        const leftTusk = new THREE.Mesh(tuskGeo, tuskMat);
        leftTusk.position.set(-0.3, 0, 2.3);
        leftTusk.rotation.z = -Math.PI / 6;
        leftTusk.rotation.x = Math.PI / 8;
        elephantGroup.add(leftTusk);
        
        const rightTusk = new THREE.Mesh(tuskGeo, tuskMat);
        rightTusk.position.set(0.3, 0, 2.3);
        rightTusk.rotation.z = Math.PI / 6;
        rightTusk.rotation.x = Math.PI / 8;
        elephantGroup.add(rightTusk);
        
        const eyeMat = new THREE.MeshPhongMaterial({color: 0x000000});
        const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
        
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.4, 0.5, 2.2);
        elephantGroup.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.4, 0.5, 2.2);
        elephantGroup.add(rightEye);
    }
    
    window.updateElephantAppearance = function() {
        const colors = {
            big: 0x8b8b8b,
            small: 0xa8a8a8,
            intelligent: 0x6a5acd,
            sad: 0x778899,
            guilty: 0x696969,
            dance: 0xff69b4
        };
        elephantMaterial.color.setHex(colors[selectedCategory]);
        buildElephant();
    };
    
    buildElephant();
    scene.add(elephantGroup);
    camera.position.set(0, 1, 6);
    
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;
        
        if (selectedCategory === 'dance') {
            elephantGroup.rotation.y = Math.sin(time * 2) * 0.5;
            elephantGroup.position.y = Math.abs(Math.sin(time * 3)) * 0.3;
        } else {
            elephantGroup.rotation.y = Math.sin(time * 0.5) * 0.3;
            elephantGroup.position.y = Math.sin(time) * 0.1;
        }
        
        renderer.render(scene, camera);
    }
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
}
