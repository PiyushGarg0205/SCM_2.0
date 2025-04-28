document.addEventListener("DOMContentLoaded", () => {
    // Loader
    const loader = document.querySelector(".loader");
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 2000);
  
    // Custom cursor
    const cursor = document.querySelector(".custom-cursor");
    const cursorFollower = document.querySelector(".cursor-follower");
  
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      
      cursorFollower.style.left = e.clientX + "px";
      cursorFollower.style.top = e.clientY + "px";
    });
  
    document.addEventListener("mousedown", () => {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      cursorFollower.style.width = "30px";
      cursorFollower.style.height = "30px";
    });
  
    document.addEventListener("mouseup", () => {
      cursor.style.width = "8px";
      cursor.style.height = "8px";
      cursorFollower.style.width = "40px";
      cursorFollower.style.height = "40px";
    });
  
    // Links and buttons cursor effect
    const links = document.querySelectorAll("a, button");
    links.forEach(link => {
      link.addEventListener("mouseenter", () => {
        cursor.style.width = "12px";
        cursor.style.height = "12px";
        cursorFollower.style.width = "30px";
        cursorFollower.style.height = "30px";
      });
      
      link.addEventListener("mouseleave", () => {
        cursor.style.width = "8px";
        cursor.style.height = "8px";
        cursorFollower.style.width = "40px";
        cursorFollower.style.height = "40px";
      });
    });
  
    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");
  
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navbarMenu = document.querySelector(".navbar-menu");
  
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navbarMenu.classList.toggle("active");
    });
  
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navbarMenu.classList.remove("active");
      });
    });
  
    // Reveal text on scroll
    const revealElements = document.querySelectorAll(".reveal-text");
    
    const revealOnScroll = () => {
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          element.classList.add("active");
        }
      });
    };
    
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Initial check
  
    // Menu tabs functionality
    const menuTabs = document.querySelectorAll(".menu-tab");
    const menuCategories = document.querySelectorAll(".menu-category");
  
    menuTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        menuTabs.forEach((t) => t.classList.remove("active"));
  
        // Add active class to clicked tab
        this.classList.add("active");
  
        // Hide all menu categories
        menuCategories.forEach((category) => {
          category.classList.remove("active-tab");
        });
  
        // Show the corresponding menu category
        const tabContent = document.querySelector(`[data-tab-content="${this.dataset.tab}"]`);
        if (tabContent) {
          tabContent.classList.add("active-tab");
        }
      });
    });
  
    // Initialize Vanilla Tilt for 3D card effect
    if (typeof VanillaTilt !== 'undefined') {
      try {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
          max: 15,
          speed: 400,
          glare: true,
          "max-glare": 0.2,
        });
      } catch (error) {
        console.error("VanillaTilt is not defined. Make sure the library is included.", error);
      }
    }
  
    // Back to top button
    const backToTopBtn = document.getElementById("backToTop");
  
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });
  
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  
    // Modal functionality
    const orderModal = document.getElementById("orderModal");
    const orderNowBtn = document.getElementById("orderNowBtn");
    const heroOrderBtn = document.getElementById("heroOrderBtn");
    const closeOrderBtn = document.getElementById("closeOrderBtn");
    const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
    const orderItems = document.getElementById("orderItems");
    const orderTotal = document.getElementById("orderTotal");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const successModal = document.getElementById("successModal");
    const closeSuccessBtn = document.getElementById("closeSuccessBtn");
    
    // Sign up modal
    const signupModal = document.getElementById("signupModal");
    const signupLinks = document.querySelectorAll('a[href="#signup"]');
    const closeSignupModalBtn = document.getElementById("closeSignupModal"); // Renamed to avoid redeclaration
    const closeSignupBtn = document.getElementById("closeSignupBtn");
    const createAccountBtn = document.getElementById("createAccountBtn");
  
    let cartItems = [];
  
    function openOrderModal() {
      orderModal.classList.add("show");
    }
  
    function closeOrderModal() {
      orderModal.classList.remove("show");
    }
  
    function openSuccessModal() {
      orderModal.classList.remove("show");
      successModal.classList.add("show");
    }
  
    function closeSuccessModal() {
      successModal.classList.remove("show");
      cartItems = [];
      updateCart();
    }
  
    function openSignupModal() {
      signupModal.classList.add("show");
    }
  
    function closeSignupModal() {
      signupModal.classList.remove("show");
    }
  
    function updateCart() {
      if (!orderItems || !orderTotal) return;
  
      // Clear current items
      orderItems.innerHTML = "";
  
      let total = 0;
  
      cartItems.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
  
        const itemElement = document.createElement("div");
        itemElement.className = "order-item";
        itemElement.innerHTML = `
                  <div class="order-item-details">
                      <span class="order-item-name">${item.name}</span>
                      <span class="order-item-price">₹${itemTotal.toFixed(2)}</span>
                  </div>
                  <div class="order-item-quantity">
                      <button class="quantity-btn minus" data-name="${item.name}">-</button>
                      <span>${item.quantity}</span>
                      <button class="quantity-btn plus" data-name="${item.name}">+</button>
                  </div>
              `;
  
        orderItems.appendChild(itemElement);
      });
  
      orderTotal.textContent = `₹${total.toFixed(2)}`;
  
      // Add event listeners to quantity buttons
      document.querySelectorAll(".quantity-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const itemName = this.getAttribute("data-name");
          const item = cartItems.find((i) => i.name === itemName);
  
          if (this.classList.contains("plus")) {
            item.quantity++;
          } else {
            item.quantity--;
            if (item.quantity <= 0) {
              cartItems = cartItems.filter((i) => i.name !== itemName);
            }
          }
  
          updateCart();
        });
      });
    }
  
    if (orderNowBtn) orderNowBtn.addEventListener("click", openOrderModal);
    if (heroOrderBtn) heroOrderBtn.addEventListener("click", openOrderModal);
    if (closeOrderBtn) closeOrderBtn.addEventListener("click", closeOrderModal);
    if (placeOrderBtn) placeOrderBtn.addEventListener("click", openSuccessModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", closeSuccessModal);
    
    // Sign up modal event listeners
    if (signupLinks) {
      signupLinks.forEach(link => {
        link.addEventListener("click", openSignupModal);
      });
    }
    if (closeSignupModalBtn) closeSignupModalBtn.addEventListener("click", closeSignupModal);
    if (closeSignupBtn) closeSignupBtn.addEventListener("click", closeSignupModal);
    if (createAccountBtn) {
      createAccountBtn.addEventListener("click", () => {
        closeSignupModal();
        // Show success message or redirect
        alert("Account created successfully!");
      });
    }
  
    // Close modals when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === orderModal) {
        closeOrderModal();
      }
      if (event.target === successModal) {
        closeSuccessModal();
      }
      if (event.target === signupModal) {
        closeSignupModal();
      }
    });
  
    // Add to cart functionality
    addToCartBtns.forEach((button) => {
      button.addEventListener("click", function () {
        const menuItem = this.closest(".menu-item");
        const itemName = menuItem.getAttribute("data-item");
        const itemPrice = Number.parseFloat(menuItem.getAttribute("data-price"));
  
        // Check if item already in cart
        const existingItem = cartItems.find((item) => item.name === itemName);
  
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cartItems.push({
            name: itemName,
            price: itemPrice,
            quantity: 1,
          });
        }
  
        updateCart();
        openOrderModal();
  
        // Add animation to button
        this.classList.add("added");
        setTimeout(() => {
          this.classList.remove("added");
        }, 1000);
      });
    });
  
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
  
        const targetId = this.getAttribute("href");
        if (targetId === "#signup") return; // Skip for signup modal
  
        const targetElement = document.querySelector(targetId);
  
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          });
        }
      });
    });
  
    // Form input animations
    const formInputs = document.querySelectorAll(".form-input");
    formInputs.forEach(input => {
      input.addEventListener("focus", function() {
        this.parentElement.classList.add("focused");
      });
      
      input.addEventListener("blur", function() {
        this.parentElement.classList.remove("focused");
        if (this.value) {
          this.parentElement.classList.add("has-value");
        } else {
          this.parentElement.classList.remove("has-value");
        }
      });
    });
  
    // Parallax effect for quote section
    const parallaxBg = document.querySelector(".parallax-bg");
    if (parallaxBg) {
      window.addEventListener("scroll", () => {
        const scrollPosition = window.pageYOffset;
        parallaxBg.style.transform = `translateY(${scrollPosition * 0.5}px)`;
      });
    }
  
    // Reservation form submission
    const reservationForm = document.getElementById("reservationForm");
    if (reservationForm) {
      reservationForm.addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Reservation submitted successfully!");
        this.reset();
      });
    }
  
    // Newsletter form submission
    const newsletterForm = document.querySelector(".newsletter-form form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Thank you for subscribing to our newsletter!");
        this.reset();
      });
    }
  });