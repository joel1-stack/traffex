// Mobile Menu
var mobileMenu = document.querySelector('.mobile-menu');
var navLinks = document.querySelector('.nav-links');
if (mobileMenu) {
  mobileMenu.addEventListener('click', function() {
    navLinks.classList.toggle('open');
  });
}

// Package Prices
var PRICES = {
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

// Show Alert
function showAlert(container, message, type) {
  type = type || 'success';
  var existing = container.querySelector('.alert');
  if (existing) existing.remove();
  var div = document.createElement('div');
  div.className = 'alert alert-' + type;
  div.innerHTML = message;
  container.prepend(div);
  setTimeout(function() { if (div.parentNode) div.remove(); }, 6000);
}

// Booking Form
function initBookingForm() {
  var form = document.getElementById('bookingForm');
  if (!form) return;

  var packageSelect = document.getElementById('package');
  var peopleInput = document.getElementById('people');
  var totalDisplay = document.getElementById('totalPrice');

  // Pre-select from URL
  var urlParams = new URLSearchParams(window.location.search);
  var preSelected = urlParams.get('package');
  if (preSelected && packageSelect) {
    packageSelect.value = preSelected;
    updateTotal();
  }

  function updateTotal() {
    var pkg = packageSelect ? packageSelect.value : '';
    var people = parseInt(peopleInput ? peopleInput.value : 1) || 1;
    var price = PRICES[pkg] || 0;
    var total = price * people;
    if (totalDisplay) {
      totalDisplay.querySelector('.amount').textContent = 'KSh ' + total.toLocaleString();
    }
  }

  if (packageSelect) packageSelect.addEventListener('change', updateTotal);
  if (peopleInput) peopleInput.addEventListener('input', updateTotal);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = form.querySelector('[name="firstname"]').value;
    var pkg = packageSelect ? packageSelect.options[packageSelect.selectedIndex].text : '';
    showAlert(form.parentElement,
      '<strong>Booking Received!</strong><br>Thank you <strong>' + name + '</strong>! Your enquiry for <strong>' + pkg + '</strong> has been received. We will confirm via WhatsApp within 15 minutes.',
      'success'
    );
    form.reset();
    if (totalDisplay) totalDisplay.querySelector('.amount').textContent = 'KSh 0';
  });
}

// M-Pesa
function initMpesa() {
  var btn = document.getElementById('mpesaBtn');
  if (!btn) return;

  btn.addEventListener('click', function() {
    var phoneInput = document.getElementById('mpesaPhone');
    var phone = phoneInput ? phoneInput.value.trim() : '';
    if (!phone || phone.replace(/\s/g, '').length < 9) {
      alert('Please enter a valid M-Pesa number (e.g. 0700723928)');
      return;
    }
    var original = btn.textContent;
    btn.textContent = 'Sending STK Push...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(function() {
      btn.textContent = 'STK Push Sent!';
      btn.style.background = '#27AE60';
      btn.style.opacity = '1';
      var section = btn.closest('.mpesa-section') || btn.parentElement;
      showAlert(section,
        '<strong>M-Pesa prompt sent to ' + phone + '</strong><br>Please check your phone and enter your M-Pesa PIN to complete the KSh 5,000 deposit.',
        'success'
      );
      setTimeout(function() {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
      }, 5000);
    }, 2000);
  });
}

// Contact Form
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = form.querySelector('[name="name"]').value;
    showAlert(form.parentElement,
      '<strong>Message Sent!</strong><br>Thank you <strong>' + name + '</strong>! We received your message and will reply within 15 minutes via WhatsApp or Email.',
      'success'
    );
    form.reset();
  });
}

// Package Filter
function filterPackages(category) {
  var items = document.querySelectorAll('.package-item');
  var btns = document.querySelectorAll('.filter-btn');

  btns.forEach(function(b) {
    b.classList.remove('btn-primary');
    b.classList.add('btn-outline');
  });

  var active = document.querySelector('[data-filter="' + category + '"]');
  if (active) {
    active.classList.add('btn-primary');
    active.classList.remove('btn-outline');
  }

  items.forEach(function(item) {
    if (category === 'all' || item.dataset.category === category) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Admin Mock Data
var mockBookings = [
  { id: 'TRX001', name: 'John Kamau',   package: 'Masai Mara 3-Day',  date: '2025-06-15', people: 2, amount: 70000,  status: 'paid' },
  { id: 'TRX002', name: 'Sarah Ochieng',package: 'USA Visa Assist',   date: '2025-06-18', people: 1, amount: 8000,   status: 'pending' },
  { id: 'TRX003', name: 'Peter Mwangi', package: 'Diani 4-Day',       date: '2025-07-01', people: 4, amount: 180000, status: 'new' },
  { id: 'TRX004', name: 'Grace Wanjiku',package: 'Dubai City Tour',   date: '2025-07-10', people: 2, amount: 240000, status: 'paid' },
  { id: 'TRX005', name: 'David Otieno', package: 'Amboseli & Tsavo',  date: '2025-07-20', people: 3, amount: 126000, status: 'pending' }
];

function loadAdminData() {
  var tbody = document.getElementById('bookingsTable');
  if (!tbody) return;
  tbody.innerHTML = mockBookings.map(function(b) {
    return '<tr>' +
      '<td><strong>' + b.id + '</strong></td>' +
      '<td>' + b.name + '</td>' +
      '<td>' + b.package + '</td>' +
      '<td>' + b.date + '</td>' +
      '<td><strong>KSh ' + b.amount.toLocaleString() + '</strong></td>' +
      '<td><span class="status status-' + b.status + '">' + b.status.charAt(0).toUpperCase() + b.status.slice(1) + '</span></td>' +
      '<td><button class="btn btn-primary btn-sm" onclick="viewBooking(\'' + b.id + '\')">View</button></td>' +
      '</tr>';
  }).join('');
}

function viewBooking(id) {
  var b = mockBookings.find(function(x) { return x.id === id; });
  if (b) alert('Booking ' + b.id + '\nClient: ' + b.name + '\nPackage: ' + b.package + '\nDate: ' + b.date + '\nPeople: ' + b.people + '\nAmount: KSh ' + b.amount.toLocaleString() + '\nStatus: ' + b.status);
}

// Admin Add Package Form
function initAddPackageForm() {
  var form = document.getElementById('addPackageForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = form.querySelector('[name="pkg_name"]').value;
    showAlert(form.parentElement, '<strong>Package "' + name + '" added successfully!</strong>', 'success');
    form.reset();
  });
}

// Admin Tab Switching
function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.sidebar a').forEach(function(a) { a.classList.remove('active'); });
  var tab = document.getElementById('tab-' + name);
  if (tab) tab.classList.add('active');
  if (event && event.target) event.target.classList.add('active');
}

// Init
document.addEventListener('DOMContentLoaded', function() {
  initBookingForm();
  initMpesa();
  initContactForm();
  initAddPackageForm();
  loadAdminData();
});
