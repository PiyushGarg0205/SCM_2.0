// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const particlesJS = window.particlesJS;
    const THREE = window.THREE;

    console.log('DOM fully loaded');

    if (!gsap || !ScrollTrigger) {
        console.error('GSAP or ScrollTrigger not loaded');
    } else {
        gsap.registerPlugin(ScrollTrigger);
        console.log('GSAP and ScrollTrigger registered');
    }

    if (!particlesJS) {
        console.error('particlesJS not loaded');
    }

    if (!THREE) {
        console.error('Three.js not loaded');
    }

    initCursor();
    initParticles();
    init3DCoffeeCup();
    initScrollAnimations();
    initNavbar();
    initModals();
    initOrderSystem();
    initForms();
});

// Custom cursor
function initCursor() {
    console.log('Initializing cursor');
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (!cursor || !cursorFollower) {
        console.error('Cursor elements not found');
        return;
    }

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
        gsap.to(cursorFollower, { x: mouseX, y: mouseY, duration: 0.3 });
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    const hoverElements = document.querySelectorAll('a, button, .menu-item, .offer-card, .contact-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '24px';
            cursor.style.height = '24px';
            cursorFollower.style.width = '60px';
            cursorFollower.style.height = '60px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '12px';
            cursor.style.height = '12px';
            cursorFollower.style.width = '40px';
            cursorFollower.style.height = '40px';
        });
    });
}

// Particles
function initParticles() {
    console.log('Initializing particles');
    if (!particlesJS) return;

    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#d4a373' },
            shape: { type: 'circle' },
            opacity: { value: 0.5 },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#d4a373', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2 }
        },
        interactivity: {
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                grab: { distance: 160, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

// 3D Coffee Cup (Enhanced Appearance)
function init3DCoffeeCup() {
    console.log('Initializing 3D coffee cup');
    const container = document.getElementById('coffee-cup-container');
    if (!container || !THREE) {
        console.error('Container or Three.js not loaded');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Load Texture for Realism
    const textureLoader = new THREE.TextureLoader();
    const mugTexture = textureLoader.load('https://cdn.pixabay.com/photo/2016/11/29/03/53/coffee-cup-1866989_1280.jpg', () => {
        console.log('Texture loaded');
    }, undefined, () => {
        console.error('Texture failed to load');
    });
    mugTexture.wrapS = mugTexture.wrapT = THREE.RepeatWrapping;
    mugTexture.repeat.set(1, 1);

    // Appealing Mug Material
    const cupMaterial = new THREE.MeshPhongMaterial({
        color: 0xd2b48c, // Warm beige
        map: mugTexture,
        shininess: 80,
        specular: 0x666666,
        transparent: false
    });

    // Refined Mug Geometry
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.1, 3.2, 48, 20, true), cupMaterial); // More segments for smoothness
    cup.position.y = 1.6;

    // Coffee Inside with Gradient Effect
    const coffeeGeometry = new THREE.CylinderGeometry(1.1, 1, 0.8, 48);
    const coffeeMaterial = new THREE.MeshPhongMaterial({
        color: 0x5c4033, // Dark coffee brown
        shininess: 20,
        transparent: false
    });
    const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
    coffee.position.y = 0.4;

    // Improved Handle
    const handleShape = new THREE.Shape();
    handleShape.moveTo(0, 0);
    handleShape.absarc(0.2, 0, 0.8, 0, Math.PI * 2, false);
    handleShape.holes.push(new THREE.Path().absarc(0.2, 0, 0.6, 0, Math.PI * 2, true));
    const handleExtrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.1 };
    const handle = new THREE.Mesh(new THREE.ExtrudeGeometry(handleShape, handleExtrudeSettings), cupMaterial);
    handle.position.set(1.8, 0, 0);
    handle.rotation.y = Math.PI / 2;

    // Add to Scene
    scene.add(cup, coffee, handle);

    // Enhanced Lighting for Appeal
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(3, 4, 3);
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffd700, 1); // Warm spotlight
    spotLight.position.set(0, 6, 0);
    spotLight.angle = Math.PI / 8;
    spotLight.penumbra = 0.6;
    scene.add(spotLight);

    // Animation Control
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    function animate(currentTime) {
        const delta = currentTime - lastTime;
        if (delta > interval) {
            lastTime = currentTime - (delta % interval);

            cup.rotation.y += 0.01;
            coffee.rotation.y += 0.01;
            handle.rotation.y += 0.01;

            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);
    }

    // Throttled Mouse Interaction
    let lastMouseMove = 0;
    const mouseThrottle = 16;
    document.addEventListener('mousemove', e => {
        const now = performance.now();
        if (now - lastMouseMove > mouseThrottle) {
            lastMouseMove = now;
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            gsap.to(cup.rotation, { x: mouseY * 0.3, y: mouseX * 0.4, duration: 1 });
            gsap.to(handle.rotation, { x: mouseY * 0.3, y: Math.PI / 2 + mouseX * 0.4, duration: 1 });
            gsap.to(coffee.rotation, { x: mouseY * 0.3, y: mouseX * 0.4, duration: 1 });
        }
    });

    animate(performance.now());
}

// Scroll animations
function initScrollAnimations() {
    console.log('Initializing scroll animations');
    const revealFrom = (selector, x = 0, y = 0) => {
        gsap.utils.toArray(selector).forEach(el => {
            gsap.fromTo(el, { x, y, opacity: 0 }, {
                x: 0, y: 0, opacity: 1, duration: 1.2,
                scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' }
            });
        });
    };
    revealFrom('.reveal-left', -150);
    revealFrom('.reveal-right', 150);
    revealFrom('.reveal-up', 0, 150);
    revealFrom('.reveal-scale', 0, 0);

    gsap.to('.hero', {
        backgroundPosition: '50% 0%',
        scrollTrigger: {
            trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true
        }
    });
}

// Navbar
function initNavbar() {
    console.log('Initializing navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (!menuToggle || !navbarMenu) {
        console.error('Navbar elements not found');
        return;
    }

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
        });
    });
}

// Modals (Fixed Close Button)
function initModals() {
    console.log('Initializing modals');
    const orderModal = document.getElementById('orderModal');
    const successModal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close-modal'); // Target the cross button

    if (!orderModal || !successModal || !closeModal) {
        console.error('Modal elements not found');
        return;
    }

    const closeAll = [
        ['orderNowBtn', orderModal],
        ['heroOrderBtn', orderModal],
        ['closeOrderBtn', orderModal],
        ['closeSuccessBtn', successModal]
    ];

    closeAll.forEach(([id, modal]) => {
        const element = document.getElementById(id);
        if (element && modal) {
            element.addEventListener('click', () => {
                modal.classList.toggle('show');
            });
        }
    });

    // Add click event for the close button
    closeModal.addEventListener('click', () => {
        orderModal.classList.remove('show');
    });

    window.addEventListener('click', e => {
        if (e.target === orderModal) orderModal.classList.remove('show');
        if (e.target === successModal) successModal.classList.remove('show');
    });
}

// Order System
function initOrderSystem() {
    console.log('Initializing order system');
    const cart = [];
    const orderItemsContainer = document.getElementById('orderItems');
    const orderTotalElement = document.getElementById('orderTotal');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const orderModal = document.getElementById('orderModal');
    const successModal = document.getElementById('successModal');

    if (!orderItemsContainer || !orderTotalElement || !placeOrderBtn || !orderModal || !successModal) {
        console.error('Order system elements not found');
        return;
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const itemElement = button.closest('.menu-item');
            const itemName = itemElement.dataset.item;
            const itemPrice = parseFloat(itemElement.dataset.price);

            const existingItem = cart.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: itemName, price: itemPrice, quantity: 1 });
            }

            updateCartDisplay();
        });
    });

    function updateCartDisplay() {
        orderItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.classList.add('order-item');
            itemElement.innerHTML = `
                <span class="order-item-name">${item.name}</span>
                <span class="order-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                <div class="order-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        orderTotalElement.textContent = `₹${total.toFixed(2)}`;

        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                if (btn.classList.contains('plus')) {
                    cart[index].quantity++;
                } else if (btn.classList.contains('minus')) {
                    cart[index].quantity--;
                    if (cart[index].quantity <= 0) {
                        cart.splice(index, 1);
                    }
                }
                updateCartDisplay();
            });
        });
    }

    placeOrderBtn.addEventListener('click', () => {
        const orderForm = document.getElementById('orderForm');
        if (orderForm.checkValidity() && cart.length > 0) {
            orderModal.classList.remove('show');
            successModal.classList.add('show');
            cart.length = 0;
            updateCartDisplay();
            orderForm.reset();
        } else {
            orderForm.reportValidity();
        }
    });
}

// Forms
function initForms() {
    console.log('Initializing forms');
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (reservationForm.checkValidity()) {
                alert('Reservation submitted successfully!');
                reservationForm.reset();
            } else {
                reservationForm.reportValidity();
            }
        });
    } else {
        console.error('Reservation form not found');
    }
}