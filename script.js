function init3DCoffeeCup() {
    console.log('Initializing 3D coffee cup');
    const container = document.getElementById('coffee-cup-container');
    if (!container || !THREE) {
        console.error('Container or Three.js not loaded');
        return;
    }

    // Scene setup with improved configuration
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f4f0); // Warm off-white background

    // Responsive sizing
    const width = Math.min(400, window.innerWidth * 0.9);
    const height = width;
    
    // Enhanced camera
    const camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 1000);
    camera.position.set(0, 0.5, 7);
    
    // Renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        shadowMap: true
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    
    // Create a group for the cup and its components
    const cupGroup = new THREE.Group();
    scene.add(cupGroup);
    
    // Load texture with promises
    const textureLoader = new THREE.TextureLoader();
    
    // Load multiple textures for realism
    const loadTexture = (url) => {
        return new Promise((resolve, reject) => {
            textureLoader.load(url, resolve, undefined, reject);
        });
    };
    
    // Create a subtle environment
    const createEnvironment = () => {
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.8,
            metalness: 0.2,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -1.5;
        plane.receiveShadow = true;
        scene.add(plane);
        
        // Subtle ambient occlusion for the cup
        const aoTexture = new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/ao_map.jpg');
        return aoTexture;
    };
    
    const aoTexture = createEnvironment();
    
    // Create realistic cup materials
    const createMaterials = () => {
        // Ceramic material with subtle details
        const cupMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xede4d8,
            roughness: 0.35,
            metalness: 0.05,
            reflectivity: 0.15,
            clearcoat: 0.3,
            clearcoatRoughness: 0.3,
            aoMap: aoTexture,
            aoMapIntensity: 0.8
        });
        
        // Coffee liquid - rich dark brown with subtle shine
        const coffeeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x3a2618,
            roughness: 0.15,
            metalness: 0,
            transmission: 0.05,
            ior: 1.4,
            thickness: 0.5,
            envMapIntensity: 1.5,
            clearcoat: 1,
            clearcoatRoughness: 0.3
        });
        
        // Steam particles material
        const steamMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
        });
        
        return { cupMaterial, coffeeMaterial, steamMaterial };
    };
    
    const { cupMaterial, coffeeMaterial, steamMaterial } = createMaterials();

    // Create detailed cup geometry
    const createCup = () => {
        // Main cup body with better proportions
        const cupHeight = 3;
        const topRadius = 1.4;
        const bottomRadius = 1.0;
        const cupGeometry = new THREE.CylinderGeometry(
            topRadius, bottomRadius, cupHeight, 32, 16, true
        );
        
        const cup = new THREE.Mesh(cupGeometry, cupMaterial);
        cup.castShadow = true;
        cup.receiveShadow = true;
        
        // Bottom of the cup
        const bottomGeometry = new THREE.CircleGeometry(bottomRadius, 32);
        const bottom = new THREE.Mesh(bottomGeometry, cupMaterial);
        bottom.rotation.x = Math.PI / 2;
        bottom.position.y = -cupHeight/2;
        cup.add(bottom);
        
        // Handle with more detail
        const handleCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(topRadius, cupHeight/4, 0),
            new THREE.Vector3(topRadius + 1.2, cupHeight/4, 0),
            new THREE.Vector3(topRadius + 1.2, -cupHeight/4, 0),
            new THREE.Vector3(topRadius, -cupHeight/4, 0)
        );
        
        const handlePoints = handleCurve.getPoints(20);
        const handleShape = new THREE.Shape();
        handleShape.absarc(0, 0, 0.15, 0, Math.PI * 2, false);
        
        const handleGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(handlePoints),
            64,
            0.15,
            16,
            false
        );
        
        const handle = new THREE.Mesh(handleGeometry, cupMaterial);
        handle.castShadow = true;
        cup.add(handle);
        
        return { cup, topRadius, bottomRadius, cupHeight };
    };
    
    const { cup, topRadius, bottomRadius, cupHeight } = createCup();
    cupGroup.add(cup);
    cup.position.y = 0;
    
    // Add coffee liquid with surface detail
    const createCoffee = () => {
        // Coffee surface with slight depression in center
        const coffeeRadius = topRadius - 0.1;
        const coffeeGeometry = new THREE.CircleGeometry(coffeeRadius, 32);
        const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
        coffee.rotation.x = -Math.PI / 2;
        coffee.position.y = cupHeight/2 - 0.3;
        
        // Coffee surface displacement for realism
        const vertices = coffee.geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            const distFromCenter = Math.sqrt(x * x + z * z);
            const normalizedDist = distFromCenter / coffeeRadius;
            
            // Create a slight depression toward the center
            vertices[i + 1] = -0.1 * Math.pow(1 - normalizedDist, 2);
        }
        coffee.geometry.attributes.position.needsUpdate = true;
        coffee.geometry.computeVertexNormals();
        
        return coffee;
    };
    
    const coffee = createCoffee();
    cup.add(coffee);
    
    // Create steam particles
    const createSteam = () => {
        const steamGroup = new THREE.Group();
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const size = 0.05 + Math.random() * 0.15;
            const steamGeometry = new THREE.SphereGeometry(size, 8, 8);
            const steamParticle = new THREE.Mesh(steamGeometry, steamMaterial);
            
            // Random position above coffee
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * (topRadius - 0.3);
            steamParticle.position.set(
                Math.cos(angle) * radius,
                cupHeight/2 - 0.2 + Math.random() * 0.5,
                Math.sin(angle) * radius
            );
            
            // Store initial position and movement parameters
            steamParticle.userData = {
                speed: 0.01 + Math.random() * 0.02,
                oscillation: {
                    x: Math.random() * 0.02,
                    z: Math.random() * 0.02
                },
                initialY: steamParticle.position.y
            };
            
            steamGroup.add(steamParticle);
        }
        
        return steamGroup;
    };
    
    const steam = createSteam();
    cup.add(steam);
    
    // Advanced lighting setup
    const setupLighting = () => {
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        // Main key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(3, 5, 4);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 20;
        keyLight.shadow.bias = -0.001;
        scene.add(keyLight);
        
        // Fill light for softer shadows
        const fillLight = new THREE.DirectionalLight(0xe8f5ff, 0.6);
        fillLight.position.set(-5, 2, -2);
        scene.add(fillLight);
        
        // Rim light for edge definition
        const rimLight = new THREE.DirectionalLight(0xfff5e8, 0.4);
        rimLight.position.set(0, 1, -5);
        scene.add(rimLight);
        
        // Soft spotlight on the coffee
        const spotLight = new THREE.SpotLight(0xffffee, 0.8);
        spotLight.position.set(0, 8, 0);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.5;
        spotLight.decay = 2;
        spotLight.distance = 15;
        spotLight.castShadow = true;
        scene.add(spotLight);
        
        // Target the spotlight at the coffee
        spotLight.target = cup;
    };
    
    setupLighting();
    
    // Enhanced animation with steam movement
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Gently rotate the cup
        cupGroup.rotation.y += 0.003;
        
        // Animate steam particles
        steam.children.forEach(particle => {
            const data = particle.userData;
            
            // Move upward
            particle.position.y += data.speed;
            
            // Oscillate slightly
            particle.position.x += Math.sin(Date.now() * 0.001) * data.oscillation.x;
            particle.position.z += Math.cos(Date.now() * 0.002) * data.oscillation.z;
            
            // Fade out as it rises
            const distance = particle.position.y - data.initialY;
            particle.material.opacity = Math.max(0, 0.4 - distance * 0.2);
            
            // Reset particles that have risen too high or faded out
            if (particle.position.y > data.initialY + 2 || particle.material.opacity <= 0) {
                particle.position.y = data.initialY;
                particle.material.opacity = 0.4;
                
                // Randomize horizontal position
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * (topRadius - 0.3);
                particle.position.x = Math.cos(angle) * radius;
                particle.position.z = Math.sin(angle) * radius;
            }
        });
        
        renderer.render(scene, camera);
    };
    
    // Improved interactive mouse controls
    const setupInteraction = () => {
        let isMouseDown = false;
        let previousMousePosition = { x: 0, y: 0 };
        let rotationSpeed = { x: 0, y: 0 };
        let autoRotate = true;
        
        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
            autoRotate = false;
        });
        
        document.addEventListener('mouseup', () => {
            isMouseDown = false;
            // Gradually return to auto-rotation after 3 seconds
            setTimeout(() => {
                autoRotate = true;
            }, 3000);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            
            rotationSpeed.x = deltaMove.y * 0.005;
            rotationSpeed.y = deltaMove.x * 0.005;
            
            cupGroup.rotation.x += rotationSpeed.x;
            cupGroup.rotation.y += rotationSpeed.y;
            
            // Limit vertical rotation to prevent flipping
            cupGroup.rotation.x = Math.max(-Math.PI/4, Math.min(Math.PI/4, cupGroup.rotation.x));
            
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        });
        
        // Momentum and damping for smooth rotation
        const updateRotation = () => {
            if (!isMouseDown) {
                // Apply damping to rotation speed
                rotationSpeed.x *= 0.95;
                rotationSpeed.y *= 0.95;
                
                if (Math.abs(rotationSpeed.x) > 0.001 || Math.abs(rotationSpeed.y) > 0.001) {
                    cupGroup.rotation.x += rotationSpeed.x;
                    cupGroup.rotation.y += rotationSpeed.y;
                    
                    // Limit vertical rotation
                    cupGroup.rotation.x = Math.max(-Math.PI/4, Math.min(Math.PI/4, cupGroup.rotation.x));
                }
            }
            
            // Auto-rotation when enabled
            if (autoRotate) {
                cupGroup.rotation.y += 0.003;
                
                // Gently return to horizontal position
                cupGroup.rotation.x *= 0.98;
            }
            
            requestAnimationFrame(updateRotation);
        };
        
        updateRotation();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const newWidth = Math.min(400, window.innerWidth * 0.9);
            const newHeight = newWidth;
            
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            
            renderer.setSize(newWidth, newHeight);
        });
    };
    
    setupInteraction();
