// ─── Mobile Menu ───────────────────────────────────────────────
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
if (mobileMenu) {
  mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ─── WhatsApp Helper ────────────────────────────────────────────
function whatsappEnquiry(message) {
  const phone = '254700723928';
  const text = encodeURIComponent(message || 'Hi Traffex, I want to enquire about your travel packages.');
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

// ─── Show Alert ─────────────────────────────────────────────────
function showAlert(container, message, type = 'success') {
  const existing = container.querySelector('.alert');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.className = `alert alert-${type}`;
  div.innerHTML = message;
  container.prepend(div);
  setTimeout(() => div.remove(), 6000);
}

// ─── Package Prices ─────────────────────────────────────────────
const PRICES = {
  'mara-3day': 35000,
  'amboseli-3day': 28000,
  'amboseli-tsavo': 42000,
  'diani-4day': 45000,
  'international-dubai': 120000,
  'visa-usa': 8000,
  'visa-uk': 8000,
  'visa-schengen': 8000,
  'custom': 0
};

// ─── Booking Form ───────────────────────────────────────────────
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const packageSelect = document.getElementById('package');
  const peopleInput = document.getElementById('people');
  const totalDisplay = document.getElementById('totalPrice');

  // Pre-select package from URL param
  const urlParams = new URLSearchParams(window.location.search);
  const preSelected = urlParams.get('package');
  if (preSelected && packageSelect) {
    packageSelect.value = preSelected;
    updateTotal();
  }

  function updateTotal() {
    const pkg = packageSelect ? packageSelect.value : '';
    const people = parseInt(peopleInput ? peopleInput.value : 1) || 1;
    const price = PRICES[pkg] || 0;
    const total = price * people;
    if (totalDisplay) {
      totalDisplay.querySelector('.amount').textContent = 'KSh ' + total.toLocaleString();
    }
  }

  if (packageSelect) packageSelect.addEventListener('change', updateTotal);
  if (peopleInput) peopleInput.addEventListener('input', updateTotal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="firstname"]').value;
    const pkg = packageSelect ? packageSelect.options[packageSelect.selectedIndex].text : '';
    showAlert(form.parentElement,
      `<strong>✅ Booking Received!</strong><br>
      Thank you <strong>${name}</strong>! Your enquiry for <strong>${pkg}</strong> has been received.
      We will confirm via WhatsApp/Email within 15 minutes.`,
      'success'
    );
    // Trigger WhatsApp notification
    const phone = form.querySelector('[name="phone"]').value;
    const date = form.querySelector('[name="travel_date"]').value;
    const people = form.querySelector('[name="people"]').value;
    const msg = `Hi Traffex! I just submitted a booking:\nPackage: ${pkg}\nDate: ${date}\nPeople: ${people}\nPhone: ${phone}`;
    setTimeout(() => whatsappEnquiry(msg), 1000);
    form.reset();
    if (totalDisplay) totalDisplay.querySelector('.amount').textContent = 'KSh 0';
  });
}

// ─── M-Pesa STK Push Simulation ─────────────────────────────────
function initMpesa() {
  const btn = document.getElementById('mpesaBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const phoneInput = document.getElementById('mpesaPhone');
    const phone = phoneInput ? phoneInput.value.trim() : '';
    if (!phone || phone.replace(/\s/g, '').length < 9) {
      alert('Please enter a valid M-Pesa number (e.g. 0700723928)');
      return;
    }
    const original = btn.textContent;
    btn.textContent = '⏳ Sending STK Push...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.textContent = '✅ STK Push Sent!';
      btn.style.background = '#27AE60';
      btn.style.opacity = '1';
      showAlert(btn.closest('.mpesa-section') || btn.parentElement,
        `<strong>📱 M-Pesa prompt sent to ${phone}</strong><br>
        Please check your phone and enter your M-Pesa PIN to complete the KSh 5,000 deposit.`,
        'success'
      );
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
      }, 5000);
    }, 2000);
  });
}

// ─── Contact Form ────────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    showAlert(form.parentElement,
      `<strong>✅ Message Sent!</strong><br>
      Thank you <strong>${name}</strong>! We received your message and will reply within 15 minutes via WhatsApp or Email.`,
      'success'
    );
    form.reset();
  });
}

// ─── Package Filter ──────────────────────────────────────────────
function filterPackages(category) {
  const items = document.querySelectorAll('.package-item');
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(b => b.classList.remove('btn-primary'));
  btns.forEach(b => b.classList.add('btn-outline'));
  const active = document.querySelector(`[data-filter="${category}"]`);
  if (active) { active.classList.add('btn-primary'); active.classList.remove('btn-outline'); }

  items.forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
      item.style.display = '';
      item.style.animation = 'fadeInUp 0.4s ease';
    } else {
      item.style.display = 'none';
    }
  });
}

// ─── Admin: Load Mock Data ───────────────────────────────────────
const mockBookings = [
  { id: 'TRX001', name: 'John Kamau', package: 'Masai Mara 3-Day', date: '2025-06-15', people: 2, amount: 70000, status: 'paid' },
  { id: 'TRX002', name: 'Sarah Ochieng', package: 'USA Visa Assist', date: '2025-06-18', people: 1, amount: 8000, status: 'pending' },
  { id: 'TRX003', name: 'Peter Mwangi', package: 'Diani 4-Day', date: '2025-07-01', people: 4, amount: 180000, status: 'new' },
  { id: 'TRX004', name: 'Grace Wanjiku', package: 'Dubai City Tour', date: '2025-07-10', people: 2, amount: 240000, status: 'paid' },
  { id: 'TRX005', name: 'David Otieno', package: 'Amboseli & Tsavo', date: '2025-07-20', people: 3, amount: 126000, status: 'pending' },
];

function loadAdminData() {
  const tbody = document.getElementById('bookingsTable');
  if (!tbody) return;
  tbody.innerHTML = mockBookings.map(b => `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>${b.name}</td>
      <td>${b.package}</td>
      <td>${b.date}</td>
      <td><strong>KSh ${b.amount.toLocaleString()}</strong></td>
      <td><span class="status status-${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
      <td>
        <button class="btn btn-primary" style="padding:0.3rem 0.8rem; font-size:0.8rem;" onclick="viewBooking('${b.id}')">View</button>
      </td>
    </tr>
  `).join('');
}

function viewBooking(id) {
  const b = mockBookings.find(x => x.id === id);
  if (b) alert(`Booking ${b.id}\nClient: ${b.name}\nPackage: ${b.package}\nDate: ${b.date}\nPeople: ${b.people}\nAmount: KSh ${b.amount.toLocaleString()}\nStatus: ${b.status}`);
}

// ─── Admin: Add Package Form ─────────────────────────────────────
function initAddPackageForm() {
  const form = document.getElementById('addPackageForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="pkg_name"]').value;
    showAlert(form.parentElement, `<strong>✅ Package "${name}" added successfully!</strong>`, 'success');
    form.reset();
  });
}

// ─── Scroll Animations ───────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .testimonial').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ─── Init ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  initMpesa();
  initContactForm();
  initAddPackageForm();
  loadAdminData();
  initScrollAnimations();
});
