/ =============================================
//  WARKOP TSKUY — script.js (FINAL)
// =============================================

// ---- State ----
let currentPorsi = 1;
let currentItem = null; // { name, price, imgSrc }
let cartItems = []; // { id, name, price, imgSrc, qty, level, note }
let nextId = 1;

// ---- Helpers ----
function formatRp(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function formatRpDot(num) {
  // e.g. Rp. 15.000
  return 'Rp. ' + Number(num).toLocaleString('id-ID');
}

// ---- Category Filter ----
function filterCategory(cat, tabEl) {
  document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  document.querySelectorAll('.menu-card').forEach(card => {
    card.classList.toggle('hidden', card.dataset.category !== cat);
  });
}

// ---- Detail Modal ----
function openDetail(name, priceRaw, desc, imgSrc) {
  currentPorsi = 1;
  currentItem = { name, price: parseInt(priceRaw), imgSrc };

  document.getElementById('detailName').textContent = name;
  document.getElementById('detailPrice').textContent = formatRp(priceRaw) + ',-';
  document.getElementById('detailDesc').textContent = desc;
  document.getElementById('detailImg').src = imgSrc;
  document.getElementById('detailImg').alt = name;
  document.getElementById('porsiNum').textContent = 1;
  document.getElementById('specialNote').value = '';
  document.querySelectorAll('input[name="spicyLevel"]').forEach(r => r.checked = false);

  document.getElementById('detailModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  document.getElementById('detailModal').classList.remove('active');
  document.body.style.overflow = '';
}

function closeDetailIfOverlay(e) {
  if (e.target === document.getElementById('detailModal')) closeDetail();
}

function changePorsi(delta) {
  currentPorsi = Math.max(1, currentPorsi + delta);
  document.getElementById('porsiNum').textContent = currentPorsi;
}

// ---- Add to Cart ----
function addToCart() {
  if (!currentItem) return;

  const levelEl = document.querySelector('input[name="spicyLevel"]:checked');
  const level = levelEl ? parseInt(levelEl.value) : null;
  const note = document.getElementById('specialNote').value.trim();

  // Check if same item+level already in cart → increment qty
  const existing = cartItems.find(i => i.name === currentItem.name && i.level === level);
  if (existing) {
    existing.qty += currentPorsi;
  } else {
    cartItems.push({
      id: nextId++,
      name: currentItem.name,
      price: currentItem.price,
      imgSrc: currentItem.imgSrc,
      qty: currentPorsi,
      level: level,
      note: note
    });
  }

  renderCart();
  closeDetail();
  showToast('🛒 ' + currentItem.name + ' ditambahkan!');
}

// ---- Render Cart ----
function renderCart() {
  const container = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');

  if (cartItems.length === 0) {
    container.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'flex';
    else {
      container.innerHTML = `<div class="cart-empty" id="cartEmpty">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M18 6L12 12H6v30h36V12h-6L30 6H18z" stroke="#DDD" stroke-width="2" stroke-linejoin="round"/><line x1="6" y1="12" x2="42" y2="12" stroke="#DDD" stroke-width="2"/><path d="M24 20v12M18 26h12" stroke="#DDD" stroke-width="2" stroke-linecap="round"/></svg>
        <p>Belum ada pesanan.<br/>Yuk pilih menu dulu! 😊</p>
      </div>`;
    }
    updateCartSummary();
    return;
  }

  // Hide empty state
  if (emptyEl) emptyEl.style.display = 'none';

  // Build items
  container.innerHTML = cartItems.map(item => {
    const levelTag = item.level !== null
      ? `<div class="cart-item__tag"><span class="cart-item__tag-icon">🌶</span> Pedas Level ${item.level}</div>`
      : '';

    return `<div class="cart-item" data-id="${item.id}">
      <img src="${item.imgSrc.replace('310/400','85/85')}" alt="${item.name}" class="cart-item__img" onerror="this.src='https://picsum.photos/seed/${item.name}/85/85'"/>
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__desc">${item.note || '&nbsp;'}</div>
        ${levelTag}
        <div class="cart-item__bottom">
          <span class="cart-item__price">${formatRpDot(item.price * item.qty)}</span>
          <div class="cart-item__qty">
            <button class="qty-btn qty-minus" onclick="changeItemQty(${item.id}, -1)" type="button">
              <svg width="16" height="16" viewBox="0 0 25 24" fill="none"><path d="M15.9883 0C22.3022 0 25 2.55888 25 8.54785V15.165C25 21.154 22.3022 23.7129 15.9883 23.7129H9.01172C2.69777 23.7129 0 21.154 0 15.165V8.54785C0 2.55888 2.69777 0 9.01172 0H15.9883ZM9.01172 1.6543C3.65125 1.6543 1.74414 3.46329 1.74414 8.54785V15.165C1.74414 20.2496 3.65125 22.0586 9.01172 22.0586H15.9883C21.3487 22.0586 23.2559 20.2496 23.2559 15.165V8.54785C23.2559 3.46329 21.3487 1.6543 15.9883 1.6543H9.01172ZM17.1514 11.0293H7.84863C7.3719 11.0293 6.97656 11.4044 6.97656 11.8564C6.97667 12.3085 7.37196 12.6836 7.84863 12.6836H17.1514C17.6279 12.6836 18.0233 12.3085 18.0234 11.8564C18.0234 11.4043 17.6279 11.0293 17.1514 11.0293Z" fill="#E53935"/></svg>
            </button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn qty-plus" onclick="changeItemQty(${item.id}, 1)" type="button">
              <svg width="16" height="16" viewBox="0 0 25 24" fill="none"><path d="M15.9883 0C22.3022 0 25 2.55888 25 8.54785V15.165C25 21.154 22.3022 23.7129 15.9883 23.7129H9.01172C2.69777 23.7129 0 21.154 0 15.165V8.54785C0 2.55888 2.69777 0 9.01172 0H15.9883ZM9.01172 1.6543C3.65125 1.6543 1.74414 3.46329 1.74414 8.54785V15.165C1.74414 20.2496 3.65125 22.0586 9.01172 22.0586H15.9883C21.3487 22.0586 23.2559 20.2496 23.2559 15.165V8.54785C23.2559 3.46329 21.3487 1.6543 15.9883 1.6543H9.01172ZM12.501 6.61816C12.9777 6.61816 13.373 6.99311 13.373 7.44531V11.0293H17.1514C17.6279 11.0295 18.0233 11.4044 18.0234 11.8564C18.0234 12.3085 17.6279 12.6834 17.1514 12.6836H13.373V16.2686C13.373 16.7207 12.9777 17.0957 12.501 17.0957C12.0243 17.0957 11.629 16.7207 11.6289 16.2686V12.6836H7.84863C7.3719 12.6836 6.97656 12.3086 6.97656 11.8564C6.97667 11.4043 7.37196 11.0293 7.84863 11.0293H11.6289V7.44531C11.6289 6.99311 12.0242 6.61818 12.501 6.61816Z" fill="#EFB100"/></svg>
            </button>
          </div>
        </div>
      </div>
      <button class="cart-item__delete" onclick="removeItem(${item.id})" type="button" title="Hapus item">
        <svg width="14" height="16" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="#E53935" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#E53935" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="#E53935" stroke-width="2" stroke-linecap="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="#E53935" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>`;
  }).join('');

  updateCartSummary();
}

// ---- Qty change ----
function changeItemQty(id, delta) {
  const idx = cartItems.findIndex(i => i.id === id);
  if (idx === -1) return;
  cartItems[idx].qty += delta;
  if (cartItems[idx].qty <= 0) {
    cartItems.splice(idx, 1);
  }
  renderCart();
}

function removeItem(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  renderCart();
}

// ---- Update Summary ----
function updateCartSummary() {
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  document.getElementById('subtotalVal').textContent = formatRp(subtotal);
  document.getElementById('taxVal').textContent = formatRp(tax);
  document.getElementById('totalVal').textContent = formatRp(total);

  const payAmtEl = document.getElementById('payTotalAmount');
  const qrisAmtEl = document.getElementById('qrisTotalAmount');
  if (payAmtEl) payAmtEl.textContent = formatRp(total);
  if (qrisAmtEl) qrisAmtEl.textContent = formatRp(total);
}

function clearCart() {
  if (cartItems.length === 0) return;
  if (confirm('Hapus semua pesanan?')) {
    cartItems = [];
    renderCart();
  }
}

// ---- Payment Flow ----
function openPaymentModal() {
  if (cartItems.length === 0) {
    showToast('Keranjang masih kosong! Pilih menu dulu 😊');
    return;
  }
  updateCartSummary();
  document.getElementById('payModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePayModal() {
  document.getElementById('payModal').classList.remove('active');
  document.body.style.overflow = '';
}

function closePayIfOverlay(e) {
  if (e.target === document.getElementById('payModal')) closePayModal();
}

function selectPayment(method) {
  closePayModal();
  if (method === 'qris') {
    document.getElementById('qrisConfirmModal').classList.add('active');
  } else {
    document.getElementById('successModal').classList.add('active');
  }
}

function closeQrisConfirm() {
  document.getElementById('qrisConfirmModal').classList.remove('active');
  document.body.style.overflow = '';
}

function closeQrisConfirmIfOverlay(e) {
  if (e.target === document.getElementById('qrisConfirmModal')) closeQrisConfirm();
}

function openQrisPayment() {
  document.getElementById('qrisConfirmModal').classList.remove('active');
  updateCartSummary();
  document.getElementById('qrisPayModal').classList.add('active');
}

function closeQrisPay() {
  document.getElementById('qrisPayModal').classList.remove('active');
  document.body.style.overflow = '';
}

function closeQrisPayIfOverlay(e) {
  if (e.target === document.getElementById('qrisPayModal')) closeQrisPay();
}

function finishPayment() {
  document.getElementById('qrisPayModal').classList.remove('active');
  document.getElementById('successModal').classList.add('active');
}

function closeSuccess() {
  document.getElementById('successModal').classList.remove('active');
  document.body.style.overflow = '';
  // Reset cart after success
  cartItems = [];
  renderCart();
  document.getElementById('customerName').value = '';
}

// ---- Toast ----
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:#1A1A1A;color:white;padding:12px 24px;border-radius:30px;font-size:14px;font-weight:500;font-family:Poppins,sans-serif;opacity:0;transition:all .3s;z-index:9999;white-space:nowrap;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  clearTimeout(toast._timeout);
  setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
  toast._timeout = setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(20px)'; }, 2500);
}

// ---- Mood buttons ----
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Init
renderCart();