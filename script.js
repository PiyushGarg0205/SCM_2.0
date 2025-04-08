document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Order management
    let orderItems = {};
    const orderItemsContainer = document.getElementById('orderItems');
    const orderTotalElement = document.getElementById('orderTotal');
    const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));

    // Add to order
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.dataset.item;
            const price = parseFloat(this.dataset.price);
            
            if (orderItems[item]) {
                orderItems[item].quantity++;
            } else {
                orderItems[item] = {
                    price: price,
                    quantity: 1
                };
            }
            
            updateOrderModal();
            orderModal.show();
        });
    });

    function updateOrderModal() {
        orderItemsContainer.innerHTML = '';
        let total = 0;

        Object.entries(orderItems).forEach(([item, details]) => {
            const itemTotal = details.price * details.quantity;
            total += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div>
                    <h6 class="mb-0">${item}</h6>
                    <small class="text-muted">₹${details.price.toFixed(2)} each</small>
                </div>
                <div class="quantity-control">
                    <button class="btn btn-sm btn-outline-secondary" data-item="${item}" data-change="-1">-</button>
                    <span class="mx-2">${details.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" data-item="${item}" data-change="1">+</button>
                    <button class="btn btn-sm btn-link text-danger ms-2" data-item="${item}" data-action="remove">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        orderTotalElement.textContent = `₹${total.toFixed(2)}`;

        // Add event listeners to the newly created buttons
        orderItemsContainer.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                const item = this.dataset.item;
                if (this.dataset.action === 'remove') {
                    delete orderItems[item];
                } else {
                    const change = parseInt(this.dataset.change);
                    if (orderItems[item]) {
                        orderItems[item].quantity = Math.max(0, orderItems[item].quantity + change);
                        if (orderItems[item].quantity === 0) {
                            delete orderItems[item];
                        }
                    }
                }
                updateOrderModal();
            });
        });
    }

    // Place order
    document.getElementById('placeOrderBtn').addEventListener('click', function() {
        const form = document.getElementById('orderForm');
        if (form.checkValidity() && Object.keys(orderItems).length > 0) {
            alert('Order placed successfully! We will contact you shortly.');
            orderItems = {};
            updateOrderModal();
            orderModal.hide();
            form.reset();
        } else {
            alert('Please fill in all required fields and add items to your order.');
        }
    });

    // Form Validation for Reservation
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (!this.checkValidity()) {
                event.stopPropagation();
                this.classList.add('was-validated');
                return;
            }

            alert('Reservation submitted successfully!');
            this.reset();
            this.classList.remove('was-validated');
        });
    }
});