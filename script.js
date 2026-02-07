// Global State
let currentCurrency = currencies[0];
let selectedCategory = 'big';
let currentQty = 1;
let bargainedPrice = null;
let promoApplied = false;
let promoDiscount = 0;
let gstRate = 0.18;
let selectedPayment = 'cod';
let selectedDelivery = 'horse';
let cart = {};
let productQty = {};
let notificationTimer;
let countdownInterval;
let trunkCoins = parseInt(localStorage.getItem('trunkCoins')) || 0;
let soundEnabled = soundConfig.enabled;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSound();
    initScrollTop();
    initTrunkCoins();
    renderCurrencyList();
    renderCategories();
    renderProducts();
    updateElephantDetails();
    init3DElephant();
    attachEventListeners();
});

// Theme
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

// Sound System
function initSound() {
    const btn = document.getElementById('soundToggle');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    btn.classList.toggle('muted', !soundEnabled);
}

document.getElementById('soundToggle').addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    const btn = document.getElementById('soundToggle');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    btn.classList.toggle('muted', !soundEnabled);
    playSound('success');
});

function playSound(type) {
    if (!soundEnabled) return;
    const audio = new Audio(soundConfig.files[type] || soundConfig.files.success);
    audio.volume = 0.3;
    audio.play().catch(() => {});
}

// Trunk Coins System
function initTrunkCoins() {
    updateTrunkCoinsDisplay();
}

function updateTrunkCoinsDisplay() {
    document.getElementById('trunkCoinsDisplay').textContent = trunkCoins;
    document.getElementById('trunkCoinsBalance').textContent = trunkCoins;
    const rupees = (trunkCoins / trunkCoinsConfig.conversionRate).toFixed(2);
    document.getElementById('trunkCoinsRupees').textContent = `₹${rupees}`;
    if (document.getElementById('availableCoins')) {
        document.getElementById('availableCoins').textContent = trunkCoins;
        document.getElementById('availableValue').textContent = `₹${rupees}`;
    }
}

function addTrunkCoins(amount, reason) {
    trunkCoins += amount;
    localStorage.setItem('trunkCoins', trunkCoins);
    
    const transaction = {
        date: new Date().toLocaleString('en-IN'),
        coins: amount,
        reason: reason
    };
    transactions.unshift(transaction);
    if (transactions.length > 10) transactions = transactions.slice(0, 10);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateTrunkCoinsDisplay();
}

function useTrunkCoins(amount) {
    if (amount > trunkCoins) return false;
    trunkCoins -= amount;
    localStorage.setItem('trunkCoins', trunkCoins);
    updateTrunkCoinsDisplay();
    return true;
}

function calculateTrunkCoinsEarned(cartData) {
    let elephantTotal = 0;
    let accessoryTotal = 0;
    
    for (let key in cartData) {
        const item = cartData[key];
        const itemTotal = item.price * item.qty;
        
        if (item.type === 'elephant') {
            elephantTotal += itemTotal;
        } else {
            accessoryTotal += itemTotal;
        }
    }
    
    let coinsEarned = 0;
    
    // Elephants: 20% if total >= 10000
    if (elephantTotal >= trunkCoinsConfig.minElephantAmount) {
        coinsEarned += Math.floor(elephantTotal * trunkCoinsConfig.elephantReward);
    }
    
    // Accessories: 10% always
    coinsEarned += Math.floor(accessoryTotal * trunkCoinsConfig.accessoryReward);
    
    return coinsEarned;
}

// Trunk Coins Dashboard
document.getElementById('trunkCoinsBtn').addEventListener('click', () => {
    renderTransactions();
    document.getElementById('trunkCoinsModal').classList.add('active');
});

document.getElementById('closeTrunkCoins').addEventListener('click', () => {
    document.getElementById('trunkCoinsModal').classList.remove('active');
});

document.getElementById('howToEarnBtn').addEventListener('click', () => {
    const info = document.getElementById('howToEarnInfo');
    info.style.display = info.style.display === 'none' ? 'block' : 'none';
});

function renderTransactions() {
    const list = document.getElementById('transactionsList');
    if (transactions.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:var(--text-secondary)">No transactions yet</p>';
        return;
    }
    
    list.innerHTML = transactions.map(t => `
        <div class="transaction-item">
            <div>
                <div style="font-weight:600">${t.reason}</div>
                <div class="transaction-date">${t.date}</div>
            </div>
            <div class="transaction-coins">+${t.coins} 🪙</div>
        </div>
    `).join('');
}

// Scroll
function initScrollTop() {
    window.addEventListener('scroll', () => {
        const btn = document.getElementById('scrollTop');
        btn.classList.toggle('show', window.pageYOffset > 300);
    });
    
    document.getElementById('scrollTop').addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
}

// Currency
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
        item.style.display = item.textContent.toLowerCase().includes(search) ? 'flex' : 'none';
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

// Categories
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
    document.getElementById('elephantDetails').innerHTML = `
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
            <div class="product-warning">${!p.bargainable ? '⚠️ Fixed price' : ''}</div>
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
        playSound('error');
        return showNotification('Select Quantity ⚠️', 'Use +/- buttons', 'error');
    }
    
    if (!cart[id]) {
        cart[id] = {name: product.name, price: product.price, qty: 0, type: 'product'};
    }
    cart[id].qty += qty;
    
    productQty[id] = 0;
    document.getElementById(`qty-${id}`).textContent = 0;
    
    updateCartCount();
    playSound('addCart');
    showNotification('Added to Cart! 🛒', `${qty}x ${product.name}`);
}

// Bargain
document.getElementById('bargainBtn').addEventListener('click', () => {
    const input = document.getElementById('bargainInput');
    const value = parseFloat(input.value);
    const basePrice = elephantCategories[selectedCategory].price;
    
    if (!value || value <= 0) {
        playSound('error');
        return showNotification('Invalid Amount ❌', 'Enter valid amount', 'error');
    }
    
    const inINR = value / currentCurrency.rate;
    
    if (inINR >= basePrice * 0.7 && inINR <= basePrice) {
        bargainedPrice = inINR;
        promoApplied = false;
        updateAllPrices();
        playSound('success');
        showNotification('Bargain Accepted! 🎉', `New price: ${formatPrice(inINR)}`);
    } else if (inINR > basePrice) {
        playSound('error');
        showNotification('Too High! 😅', 'Higher than base price', 'error');
    } else {
        playSound('error');
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
    if (currentQty === 1) document.getElementById('qtyMinus').disabled = true;
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
    playSound('addCart');
    showNotification('Added to Cart! 🛒', `${currentQty}x ${elephantCategories[selectedCategory].title}`);
});

document.getElementById('buyNow').addEventListener('click', () => {
    document.getElementById('addCart').click();
    setTimeout(openCartModal, 500);
});

document.getElementById('cartBtn').addEventListener('click', openCartModal);

function openCartModal() {
    if (Object.keys(cart).length === 0) {
        playSound('error');
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
                playSound('success');
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
    document.getElementById('checkoutCurrency').textContent = `${currentCurrency.flag} ${currentCurrency.code}`;
    document.getElementById('checkoutModal').classList.add('active');
    
    gstRate = 0.18;
    promoApplied = false;
    promoDiscount = 0;
    
    document.querySelectorAll('.gst-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.gst-btn')[0].classList.add('selected');
    
    document.querySelectorAll('.promo-option').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('.promo-option')[0].classList.add('selected');
    
    updateTrunkCoinsDisplay();
    updateCheckoutSummary();
}

function attachEventListeners() {
    // Gift checkbox
    document.getElementById('isGift').addEventListener('change', (e) => {
        document.getElementById('giftDetails').style.display = e.target.checked ? 'block' : 'none';
    });
    
    // Use coins checkbox
    document.getElementById('useCoins').addEventListener('change', () => {
        updateCheckoutSummary();
    });
    
    // Promo
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
    
    // Payment
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.addEventListener('click', function() {
            selectedPayment = this.dataset.payment;
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // GST
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
        subtotal += cart[key].price * cart[key].qty;
    }
    
    let discount = 0;
    if (promoApplied) {
        discount = subtotal * (promoDiscount / 100);
    }
    
    const taxableAmount = subtotal - discount;
    const gst = taxableAmount * gstRate;
    let total = taxableAmount + gst;
    
    let coinsUsed = 0;
    let coinsValue = 0;
    
    if (document.getElementById('useCoins').checked && trunkCoins > 0) {
        coinsValue = trunkCoins / trunkCoinsConfig.conversionRate;
        const coinsValueInCurrency = coinsValue * currentCurrency.rate;
        
        if (coinsValue <= total) {
            coinsUsed = trunkCoins;
            total -= coinsValue;
        } else {
            const neededCoins = Math.floor(total * trunkCoinsConfig.conversionRate);
            coinsUsed = neededCoins;
            coinsValue = neededCoins / trunkCoinsConfig.conversionRate;
            total = 0;
        }
    }
    
    const summaryHTML = `
        <div class="cart-summary">
            <div class="summary-row"><span>Items Total:</span><span>${formatPrice(subtotal)}</span></div>
            ${discount > 0 ? `<div class="summary-row discount"><span>🎉 Discount (${promoDiscount}%):</span><span>-${formatPrice(discount)}</span></div>` : ''}
            <div class="summary-row"><span>Net Amount:</span><span>${formatPrice(taxableAmount)}</span></div>
            <div class="summary-row"><span>GST (${gstRate * 100}%):</span><span>${formatPrice(gst)}</span></div>
            ${coinsUsed > 0 ? `<div class="summary-row discount"><span>🪙 Trunk Coins (${coinsUsed}):</span><span>-${formatPrice(coinsValue)}</span></div>` : ''}
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
        playSound('error');
        return showNotification('Missing Details ❌', 'Fill required fields', 'error');
    }
    
    const isGift = document.getElementById('isGift').checked;
    const giftRecipient = isGift ? document.getElementById('giftRecipient').value.trim() : '';
    const giftMessage = isGift ? document.getElementById('giftMessage').value.trim() : '';
    
    const now = new Date();
    const orderTime = now.toLocaleString('en-IN');
    const orderDate = now.toLocaleDateString('en-IN');
    const trackingNumber = 'TDE' + Date.now();
    const paymentMethod = selectedPayment === 'cod' ? 'Cash on Delivery' : 'Buy Now Pay Later';
    const deliveryMethod = selectedDelivery === 'horse' ? '🐎 Horse Delivery' : '🚛 Truck Delivery';
    
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
    let total = taxableAmount + gst;
    
    let coinsUsed = 0;
    let coinsValue = 0;
    
    if (document.getElementById('useCoins').checked && trunkCoins > 0) {
        coinsValue = trunkCoins / trunkCoinsConfig.conversionRate;
        
        if (coinsValue <= total) {
            coinsUsed = trunkCoins;
            total -= coinsValue;
        } else {
            coinsUsed = Math.floor(total * trunkCoinsConfig.conversionRate);
            coinsValue = coinsUsed / trunkCoinsConfig.conversionRate;
            total = 0;
        }
    }
    
    const gstType = gstRate === 0.18 ? 'Sin Goods (18%)' : 'Non-Sin Goods (40%)';
    const promoCode = promoApplied ? `Applied (${promoDiscount}% OFF)` : 'No Coupon';
    
    const qrData = `Order: ${trackingNumber}|Total: ${formatPrice(total)}|Payment: ${paymentMethod}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    
    // Calculate Trunk Coins Earned
    const coinsEarned = calculateTrunkCoinsEarned(cart);
    
    const billHTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Invoice ${trackingNumber}</title>
<style>
body{font-family:Arial,sans-serif;padding:20px;max-width:900px;margin:0 auto;background:#f8f9fa}
.invoice{background:#fff;padding:40px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.1)}
.header{display:grid;grid-template-columns:2fr 1fr;gap:30px;border-bottom:3px solid #d4af37;padding-bottom:20px;margin-bottom:30px}
.company{font-size:32px;font-weight:700;color:#1a1f2e;margin-bottom:8px}
.company-details{font-size:13px;color:#718096;line-height:1.8}
.qr-section{text-align:center}
.qr-code{padding:12px;border:3px solid #d4af37;border-radius:12px;display:inline-block}
.qr-code img{width:150px;height:150px}
.title{text-align:center;font-size:28px;font-weight:700;color:#d4af37;margin:20px 0;padding:20px;background:linear-gradient(135deg,#fef5e7,#fff9e6);border-radius:12px;border:2px solid #d4af37}
.tracking{text-align:center;font-size:16px;margin:20px 0;padding:14px;background:linear-gradient(135deg,#e3f2fd,#e1f5fe);border-radius:8px;font-weight:700;color:#1976d2}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin:30px 0;background:#f8f9fa;padding:20px;border-radius:12px}
.info-section h3{font-size:14px;margin-bottom:12px;text-transform:uppercase;border-bottom:2px solid #d4af37;padding-bottom:6px}
table{width:100%;border-collapse:collapse;margin:30px 0}
th{background:linear-gradient(135deg,#1a1f2e,#2d3748);color:#fff;padding:14px;text-align:left}
td{padding:14px;border-bottom:1px solid #e2e8f0}
.totals{margin-top:30px;padding:20px;background:linear-gradient(135deg,#fef5e7,#fff9e6);border-radius:12px;border:2px solid #d4af37}
.totals-row{display:flex;justify-content:space-between;margin-bottom:12px;padding:8px 0}
.totals-row.total{font-size:20px;font-weight:900;border-top:3px solid #d4af37;padding-top:16px;margin-top:12px}
.coins-earned{background:linear-gradient(135deg,#ffd700,#ffed4e);padding:20px;border-radius:12px;margin:20px 0;text-align:center;border:2px solid #ffd700}
.coins-earned h3{font-size:24px;margin-bottom:8px}
.print-btn{background:linear-gradient(135deg,#d4af37,#f4e5c3);color:#1a1f2e;border:none;padding:14px 36px;border-radius:10px;font-weight:700;cursor:pointer;margin:20px 0}
@media print{.print-btn{display:none}}
@media (max-width:600px){.header,.info-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="invoice">
<button class="print-btn" onclick="window.print()">🖨️ Print Invoice</button>
<div class="header">
<div>
<div class="company">🐘 THE DISCARDED ELEPHANTS</div>
<div class="company-details"><strong>Broken Bone Pvt Ltd</strong><br>Principal Owner: Abhishek Sarda<br>Chandrapur, Maharashtra<br>GSTIN: 27ELEPH1234A2NT</div>
</div>
<div class="qr-section">
<div class="qr-code"><img src="${qrUrl}" alt="QR"></div>
</div>
</div>
<div class="title">TAX INVOICE</div>
<div class="tracking">📦 Tracking: ${trackingNumber}</div>
<div class="info-grid">
<div class="info-section">
<h3>📋 Bill To</h3>
<p><strong>${name}</strong><br>${city}<br>Phone: ${phone}${email ? '<br>Email: ' + email : ''}</p>
${isGift ? `<p style="margin-top:12px"><strong>🎁 Gift For: ${giftRecipient}</strong>${giftMessage ? '<br>Message: ' + giftMessage : ''}</p>` : ''}
</div>
<div class="info-section">
<h3>📅 Invoice Details</h3>
<p><strong>Date:</strong> ${orderDate}<br><strong>Time:</strong> ${orderTime}<br><strong>Currency:</strong> ${currentCurrency.code}<br><strong>Payment:</strong> ${paymentMethod}<br><strong>Delivery:</strong> ${deliveryMethod}<br><strong>GST:</strong> ${gstType}</p>
</div>
</div>
<table>
<thead><tr><th>Item</th><th style="width:80px;text-align:center">Qty</th><th style="width:120px;text-align:right">Price</th><th style="width:120px;text-align:right">Total</th></tr></thead>
<tbody>${itemsHTML}</tbody>
</table>
<div class="totals">
<div class="totals-row"><span>Items Total:</span><span>${formatPrice(subtotal)}</span></div>
${discount > 0 ? `<div class="totals-row"><span>Discount (${promoDiscount}%):</span><span>-${formatPrice(discount)}</span></div>` : ''}
<div class="totals-row"><span>Net Amount:</span><span>${formatPrice(taxableAmount)}</span></div>
<div class="totals-row"><span>GST (${gstRate * 100}%):</span><span>${formatPrice(gst)}</span></div>
${coinsUsed > 0 ? `<div class="totals-row"><span>Trunk Coins Used (${coinsUsed}):</span><span>-${formatPrice(coinsValue)}</span></div>` : ''}
<div class="totals-row total"><span>TOTAL PAID:</span><span>${formatPrice(total)}</span></div>
</div>
${coinsEarned > 0 ? `
<div class="coins-earned">
<h3>🎉 You Earned Trunk Coins!</h3>
<div style="font-size:48px;font-weight:900">+${coinsEarned} 🪙</div>
<p style="margin:8px 0 0">= ₹${(coinsEarned / trunkCoinsConfig.conversionRate).toFixed(2)} for next purchase!</p>
</div>
` : ''}
<div style="margin-top:40px;text-align:center;font-size:11px;color:#718096">
<strong>Thank you for choosing The Discarded Elephants!</strong><br>
© 2026 Broken Bone Pvt Ltd | GSTIN: 27ELEPH1234A2NT
</div>
</div>
</body>
</html>`;
    
    const blob = new Blob([billHTML], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${trackingNumber}.html`;
    a.click();
    
    // Process payment
    if (coinsUsed > 0) {
        useTrunkCoins(coinsUsed);
    }
    
    if (coinsEarned > 0) {
        addTrunkCoins(coinsEarned, `Purchase - Invoice ${trackingNumber}`);
    }
    
    playSound('success');
    showNotification('Order Complete! 🎉', `Invoice downloaded!<br>Tracking: ${trackingNumber}${coinsEarned > 0 ? '<br>🪙 +' + coinsEarned + ' Trunk Coins earned!' : ''}`);
    
    document.getElementById('checkoutModal').classList.remove('active');
    cart = {};
    gstRate = 0.18;
    promoApplied = false;
    promoDiscount = 0;
    updateCartCount();
}

// Notifications
function showNotification(title, message, type = 'success', confirmCallback = null) {
    const overlay = document.getElementById('notificationOverlay');
    const notification = overlay.querySelector('.notification');
    
    document.getElementById('notifTitle').textContent = title;
    document.getElementById('notifMessage').innerHTML = message;
    
    notification.classList.remove('error');
    if (type === 'error') {
        notification.style.borderLeftColor = 'var(--danger)';
    } else {
        notification.style.borderLeftColor = 'var(--success)';
    }
    
    const buttonsDiv = document.getElementById('notifButtons');
    
    if (confirmCallback) {
        buttonsDiv.innerHTML = '<button onclick="confirmYes()">Yes, Remove</button><button onclick="closeNotification()">Cancel</button>';
        window.confirmCallback = confirmCallback;
    } else {
        buttonsDiv.innerHTML = '<button onclick="closeNotification()">Got it!</button>';
        
        let countdown = 4;
        document.getElementById('notifTimer').textContent = `Auto-closing in ${countdown}s`;
        
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            countdown--;
            document.getElementById('notifTimer').textContent = `Auto-closing in ${countdown}s`;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                closeNotification();
            }
        }, 1000);
        
        if (notificationTimer) clearTimeout(notificationTimer);
        notificationTimer = setTimeout(() => closeNotification(), 4000);
    }
    
    overlay.classList.add('show');
}

function confirmYes() {
    if (window.confirmCallback) {
        window.confirmCallback();
        window.confirmCallback = null;
    }
    closeNotification();
}

function closeNotification() {
    document.getElementById('notificationOverlay').classList.remove('show');
    if (notificationTimer) clearTimeout(notificationTimer);
    if (countdownInterval) clearInterval(countdownInterval);
    window.confirmCallback = null;
}

document.getElementById('notificationOverlay').addEventListener('click', closeNotification);
document.querySelector('.notification').addEventListener('click', (e) => e.stopPropagation());

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
