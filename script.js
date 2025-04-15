// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const particlesJS = window.particlesJS;
    const THREE = window.THREE;

    if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

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
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', e => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorFollower, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });

    const hoverElements = document.querySelectorAll('a, button, .menu-item, .offer-card, .contact-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursorFollower.style.width = '50px';
            cursorFollower.style.height = '50px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
        });
    });
}

// Particles
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#c7a17a' },
            shape: { type: 'circle' },
            opacity: { value: 0.5 },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#c7a17a', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2 }
        },
        interactivity: {
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

// 3D Coffee Cup
function init3DCoffeeCup() {
    const container = document.getElementById('coffee-cup-container');
    if (!container || !THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const cupMaterial = new THREE.MeshPhongMaterial({ color: 0xc7a17a, shininess: 100 });
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.8, 2, 32), cupMaterial);
    const coffee = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.7, 0.4, 32), new THREE.MeshPhongMaterial({ color: 0x4a3520 }));
    coffee.position.y = 0.8;
    
    const handleShape = new THREE.Shape();
    handleShape.absarc(0, 0, 0.5, 0, Math.PI * 2);
    handleShape.holes.push(new THREE.Path().absarc(0, 0, 0.3, 0, Math.PI * 2));
    const handle = new THREE.Mesh(new THREE.ExtrudeGeometry(handleShape, { depth: 0.2, bevelEnabled: false }), cupMaterial);
    handle.position.set(1.2, 0, 0);
    handle.rotation.y = Math.PI / 2;

    scene.add(cup, coffee, handle);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(1, 1, 1);
    scene.add(light);

    function animate() {
        requestAnimationFrame(animate);
        cup.rotation.y += 0.01;
        coffee.rotation.y += 0.01;
        handle.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    document.addEventListener('mousemove', e => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        gsap.to(cup.rotation, { x: mouseY * 0.3, y: mouseX * 0.5, duration: 1 });
        gsap.to(handle.rotation, { x: mouseY * 0.3, y: Math.PI / 2 + mouseX * 0.5, duration: 1 });
        gsap.to(coffee.rotation, { x: mouseY * 0.3, y: mouseX * 0.5, duration: 1 });
    });

    animate();
}

// Scroll animations
function initScrollAnimations() {
    const revealFrom = (selector, x = 0, y = 0) => {
        gsap.utils.toArray(selector).forEach(el => {
            gsap.fromTo(el, { x, y, opacity: 0 }, {
                x: 0, y: 0, opacity: 1, duration: 1,
                scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
            });
        });
    };
    revealFrom('.reveal-left', -100);
    revealFrom('.reveal-right', 100);
    revealFrom('.reveal-up', 0, 100);
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
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navbarMenu?.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navbarMenu?.classList.remove('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });
}

// Modals
function initModals() {
    const orderModal = document.getElementById('orderModal');
    const successModal = document.getElementById('successModal');
    const closeAll = [
        ['orderNowBtn', orderModal],
        ['heroOrderBtn', orderModal],
        ['closeOrderBtn', orderModal],
        ['closeModalBtn', orderModal],
        ['closeSuccessBtn', successModal]
    ];

    closeAll.forEach(([id, modal]) => {
        document.getElementById(id)?.addEventListener('click', () => {
            modal?.classList.toggle('show');
        });
    });

    window.addEventListener('click', e => {
        if (e.target === orderModal) orderModal.classList.remove('show');
        if (e.target === successModal) successModal.classList.remove('show');
    });
}

// Dummy implementation
function initOrderSystem() { console.log('Order system initialized.'); }
function initForms() { console.log('Forms initialized.'); }
