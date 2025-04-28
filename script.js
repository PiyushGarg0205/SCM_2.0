// Reveal animations for elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js if available
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#d4a373" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#d4a373", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
    
    // Initialize 3D coffee cup if applicable
    if (typeof init3DCoffeeCup === 'function') {
        try {
            init3DCoffeeCup();
        } catch (error) {
            console.log('Coffee cup initialization failed:', error);
        }
    }
    
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', function(e) {
        // Update cursor position immediately with no delay
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Use requestAnimationFrame for smoother animation of the follower
        requestAnimationFrame(function() {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });
    });

    // Add cursor effects for links and buttons
    document.querySelectorAll('a, button, .menu-toggle').forEach(item => {
        item.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('follower-hover');
        });
        
        item.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('follower-hover');
        });
    });
        
    // Reveal animations
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .reveal-scale');
    
    // Initial check for elements in viewport
    checkReveal();
    
    // Add scroll event listener for reveal animations
    window.addEventListener('scroll', checkReveal);
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                // Apply different animations based on class
                if (element.classList.contains('reveal-left')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                } else if (element.classList.contains('reveal-right')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                } else if (element.classList.contains('reveal-up')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                } else if (element.classList.contains('reveal-scale')) {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                }
                
                // Apply delay if specified
                const delay = element.getAttribute('data-delay');
                if (delay) {
                    element.style.transitionDelay = delay + 's';
                }
            }
        });
    }
    
    // Navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }
    
    // Modal functionality
    const orderNowBtn = document.getElementById('orderNowBtn');
    const heroOrderBtn = document.getElementById('heroOrderBtn');
    const orderModal = document.getElementById('orderModal');
    const closeOrderBtn = document.getElementById('closeOrderBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const successModal = document.getElementById('successModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    
    // Get all close modal buttons (including the × button)
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    function openOrderModal() {
        orderModal.classList.add('show');
    }
    
    function closeOrderModal() {
        orderModal.classList.remove('show');
    }
    
    function openSuccessModal() {
        orderModal.classList.remove('show');
        successModal.classList.add('show');
    }
    
    function closeSuccessModal() {
        successModal.classList.remove('show');
    }
    
    // Set up event listeners for buttons
    if (orderNowBtn) orderNowBtn.addEventListener('click', openOrderModal);
    if (heroOrderBtn) heroOrderBtn.addEventListener('click', openOrderModal);
    if (closeOrderBtn) closeOrderBtn.addEventListener('click', closeOrderModal);
    if (placeOrderBtn) placeOrderBtn.addEventListener('click', openSuccessModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccessModal);
    
    // Add event listeners to all close modal buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Determine which modal to close based on closest parent modal
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    let cartItems = [];
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.getAttribute('data-item');
            const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
            
            // Check if item already in cart
            const existingItem = cartItems.find(item => item.name === itemName);
            
            if (existingItem) {
                existingItem.quantity++;
                updateCart();
            } else {
                cartItems.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: 1
                });
                updateCart();
            }
            
            // Show a small animation
            const element = document.createElement('div');
            element.className = 'add-animation';
            element.textContent = '+1';
            menuItem.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 1000);
            
            // Open order modal
            openOrderModal();
        });
    });
    
    function updateCart() {
        if (!orderItems || !orderTotal) return;
        
        // Clear current items
        orderItems.innerHTML = '';
        
        let total = 0;
        
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <span class="order-item-name">${item.name}</span>
                <div class="order-item-quantity">
                    <button class="quantity-btn minus" data-name="${item.name}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-name="${item.name}">+</button>
                </div>
                <span class="order-item-price">₹${itemTotal.toFixed(2)}</span>
            `;
            
            orderItems.appendChild(itemElement);
        });
        
        orderTotal.textContent = `₹${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                const item = cartItems.find(i => i.name === itemName);
                
                if (this.classList.contains('plus')) {
                    item.quantity++;
                } else {
                    item.quantity--;
                    if (item.quantity <= 0) {
                        cartItems = cartItems.filter(i => i.name !== itemName);
                    }
                }
                
                updateCart();
            });
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close modals when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            closeOrderModal();
        }
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });
});