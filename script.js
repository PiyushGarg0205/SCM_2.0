// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Declare GSAP, ScrollTrigger, particlesJS, and THREE
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    var particlesJS = window.particlesJS;
    var THREE = window.THREE;

    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize custom cursor
    initCursor();
    
    // Initialize particles background
    initParticles();
    
    // Initialize 3D coffee cup
    init3DCoffeeCup();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navbar
    initNavbar();
    
    // Initialize modal functionality
    initModals();
    
    // Initialize order system
    initOrderSystem();
    
    // Initialize form submissions
    initForms();
});

// Custom cursor
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', function(e) {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        
        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3
        });
    });
    
    // Change cursor on hover over buttons and links
    const hoverElements = document.querySelectorAll('a, button, .menu-item, .offer-card, .contact-card');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = '#f9a826';
            cursorFollower.style.width = '50px';
            cursorFollower.style.height = '50px';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            cursor.style.backgroundColor = '#f9a826';
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
        });
    });
}

// Particles background
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#c7a17a'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#c7a17a',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// 3D Coffee Cup
function init3DCoffeeCup() {
    const container = document.getElementById('coffee-cup-container');
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create coffee cup
    const cupGeometry = new THREE.CylinderGeometry(1, 0.8, 2, 32);
    const cupMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc7a17a,
        shininess: 100,
        specular: 0x111111
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    scene.add(cup);
    
    // Create coffee liquid
    const coffeeGeometry = new THREE.CylinderGeometry(0.9, 0.7, 0.4, 32);
    const coffeeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4a3520,
        shininess: 30
    });
    const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
    coffee.position.y = 0.8;
    scene.add(coffee);
    
    // Create handle
    const handleShape = new THREE.Shape();
    handleShape.absarc(0, 0, 0.5, 0, Math.PI * 2, false);
    handleShape.holes.push(new THREE.Path().absarc(0, 0, 0.3, 0, Math.PI * 2, true));
    
    const extrudeSettings = {
        steps: 1,
        depth: 0.2,
        bevelEnabled: false
    };
    
    const handleGeometry = new THREE.ExtrudeGeometry(handleShape, extrudeSettings);
    const handle = new THREE.Mesh(handleGeometry, cupMaterial);
    handle.position.set(1.2, 0, 0);
    handle.rotation.y = Math.PI / 2;
    scene.add(handle);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        cup.rotation.y += 0.01;
        handle.rotation.y += 0.01;
        coffee.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Make cup follow mouse
    document.addEventListener('mousemove', function(e) {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        gsap.to(cup.rotation, {
            x: mouseY * 0.3,
            y: mouseX * 0.5,
            duration: 1
        });
        
        gsap.to(handle.rotation, {
            x: mouseY * 0.3,
            y: Math.PI / 2 + mouseX * 0.5,
            duration: 1
        });
        
        gsap.to(coffee.rotation, {
            x: mouseY * 0.3,
            y: mouseX * 0.5,
            duration: 1
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Reveal animations
    gsap.utils.toArray('.reveal-left').forEach(element => {
        gsap.fromTo(element, 
            { x: -100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    gsap.utils.toArray('.reveal-right').forEach(element => {
        gsap.fromTo(element, 
            { x: 100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    gsap.utils.toArray('.reveal-up').forEach((element, i) => {
        const delay = element.dataset.delay ? parseFloat(element.dataset.delay) : 0;
        
        gsap.fromTo(element, 
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: delay,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    gsap.utils.toArray('.reveal-scale').forEach(element => {
        gsap.fromTo(element, 
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Parallax effect for hero section
    gsap.to('.hero', {
        backgroundPosition: '50% 0%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

// Navbar functionality
function initNavbar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Modal functionality
function initModals() {
    const orderModal = document.getElementById('orderModal');
    const successModal = document.getElementById('successModal');
    const orderNowBtn = document.getElementById('orderNowBtn');
    const heroOrderBtn = document.getElementById('heroOrderBtn');
    const closeOrderBtn = document.getElementById('closeOrderBtn');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Open order modal
    orderNowBtn.addEventListener('click', function() {
        openModal(orderModal);
    });
    
    heroOrderBtn.addEventListener('click', function() {
        openModal(orderModal);
    });
    
    // Close order modal
    closeOrderBtn.addEventListener('click', function() {
        closeModal(orderModal);
    });
    
    closeModalBtn.addEventListener('click', function() {
        closeModal(orderModal);
    });
    
    // Close success modal
    closeSuccessBtn.addEventListener('click', function() {
        closeModal(successModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === orderModal) {
            closeModal(orderModal);
        }
        if (e.target === successModal) {
            closeModal(successModal);
        }
    });
    
    // Place order
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    placeOrderBtn.addEventListener('click', function() {
        const orderForm = document.getElementById('orderForm');
        const orderItems = document.getElementById('orderItems');
        
        if (orderItems.children.length === 0) {
            alert('Please add items to your order.');
            return;
        }
        
        if (orderForm.checkValidity()) {
            closeModal(orderModal);
            openModal(successModal);
            
            // Reset order
            orderItems.innerHTML = '';
            updateOrderTotal();
            orderForm.reset();
        } else {
            orderForm.reportValidity();
        }
    });
    
    function openModal(modal) {
        modal.classList.add('show');
    }
    
    function closeModal(modal) {
        modal.classList.remove('show');
    }
}

// Order system
function initOrderSystem() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const orderItems = document.getElementById('orderItems');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.dataset.item;
            const itemPrice = parseFloat(menuItem.dataset.price);
            
            addItemToOrder(itemName, itemPrice);
        });
    });
    
    function addItemToOrder(name, price) {
        // Check if item already exists in order
        const existingItem = document.querySelector(.order-item[data-item="${name}"]);
        
        if (existingItem) {
            // Increase quantity
            const quantityElement = existingItem.querySelector('.quantity-value');
            let quantity = parseInt(quantityElement.textContent);
            quantity++;
            quantityElement.textContent = quantity;
            
            // Update price
            const priceElement = existingItem.querySelector('.order-item-price');
            priceElement.textContent = ₹${(price * quantity).toFixed(2)};
        } else {
            // Create new order item
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.dataset.item = name;
            orderItem.dataset.price = price;
            
            orderItem.innerHTML = `
                <div class="order-item-name">${name}</div>
                <div class="order-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity-value">1</span>
                    <button class="quantity-btn increase">+</button>
                </div>
                <div class="order-item-price">₹${price.toFixed(2)}</div>
                <button class="remove-item">×</button>
            `;
            
            orderItems.appendChild(orderItem);
            
            // Add event listeners for quantity buttons
            const decreaseBtn = orderItem.querySelector('.decrease');
            const increaseBtn = orderItem.querySelector('.increase');
            const removeBtn = orderItem.querySelector('.remove-item');
            
            decreaseBtn.addEventListener('click', function() {
                updateItemQuantity(orderItem, -1);
            });
            
            increaseBtn.addEventListener('click', function() {
                updateItemQuantity(orderItem, 1);
            });
            
            removeBtn.addEventListener('click', function() {
                orderItem.remove();
                updateOrderTotal();
            });
        }
        
        updateOrderTotal();
        
        // Show animation for added item
        const orderModal = document.getElementById('orderModal');
        if (!orderModal.classList.contains('show')) {
            showAddedToCartNotification(name);
        }
    }
    
    function updateItemQuantity(orderItem, change) {
        const quantityElement = orderItem.querySelector('.quantity-value');
        let quantity = parseInt(quantityElement.textContent);
        quantity += change;
        
        if (quantity <= 0) {
            orderItem.remove();
        } else {
            quantityElement.textContent = quantity;
            
            // Update price
            const price = parseFloat(orderItem.dataset.price);
            const priceElement = orderItem.querySelector('.order-item-price');
            priceElement.textContent = ₹${(price * quantity).toFixed(2)};
        }
        
        updateOrderTotal();
    }
    
    function updateOrderTotal() {
        const orderItems = document.querySelectorAll('.order-item');
        const orderTotal = document.getElementById('orderTotal');
        
        let total = 0;
        
        orderItems.forEach(item => {
            const price = parseFloat(item.dataset.price);
            const quantity = parseInt(item.querySelector('.quantity-value').textContent);
            total += price * quantity;
        });
        
        orderTotal.textContent = ₹${total.toFixed(2)};
    }
    
    function showAddedToCartNotification(itemName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.classList.add('cart-notification');
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <span>${itemName} added to cart</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles
        notification.style.position = 'fixed';
        notification.style.bottom = '-100px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--accent-color)';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '10px';
        notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'all 0.3s ease';
        
        // Show notification
        setTimeout(() => {
            notification.style.bottom = '20px';
        }, 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.style.bottom = '-100px';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Form submissions
function initForms() {
    const reservationForm = document.getElementById('reservationForm');
    
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('success-message');
        successMessage.innerHTML = `
            <div class="success-icon">✓</div>
            <h3>Reservation Confirmed!</h3>
            <p>We look forward to serving you.</p>
        `;
        
        successMessage.style.position = 'absolute';
        successMessage.style.top = '50%';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translate(-50%, -50%)';
        successMessage.style.backgroundColor = 'white';
        successMessage.style.padding = '30px';
        successMessage.style.borderRadius = 'var(--border-radius)';
        successMessage.style.boxShadow = 'var(--shadow)';
        successMessage.style.textAlign = 'center';
        successMessage.style.zIndex = '10';
        
        const successIcon = successMessage.querySelector('.success-icon');
        successIcon.style.width = '60px';
        successIcon.style.height = '60px';
        successIcon.style.backgroundColor = '#4CAF50';
        successIcon.style.color = 'white';
        successIcon.style.borderRadius = '50%';
        successIcon.style.display = 'flex';
        successIcon.style.alignItems = 'center';
        successIcon.style.justifyContent = 'center';
        successIcon.style.margin = '0 auto 20px';
        successIcon.style.fontSize = '1.5rem';
        
        const reservationContainer = document.querySelector('.reservation-container');
        reservationContainer.style.position = 'relative';
        reservationContainer.appendChild(successMessage);
        
        // Reset form
        this.reset();
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translate(-50%, -50%) scale(0.8)';
            successMessage.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 3000);
    });
}