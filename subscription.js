document.addEventListener("DOMContentLoaded", () => {
    // Testimonial Slider
    const testimonials = document.querySelectorAll(".testimonial-card")
    const dots = document.querySelectorAll(".dot")
    const prevBtn = document.querySelector(".testimonial-btn.prev")
    const nextBtn = document.querySelector(".testimonial-btn.next")
    let currentIndex = 0
  
    function showTestimonial(index) {
      testimonials.forEach((testimonial) => testimonial.classList.remove("active"))
      dots.forEach((dot) => dot.classList.remove("active"))
  
      testimonials[index].classList.add("active")
      dots[index].classList.add("active")
      currentIndex = index
    }
  
    if (dots.length > 0) {
      dots.forEach((dot) => {
        dot.addEventListener("click", function () {
          const index = Number.parseInt(this.getAttribute("data-index"))
          showTestimonial(index)
        })
      })
    }
  
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        let newIndex = currentIndex - 1
        if (newIndex < 0) newIndex = testimonials.length - 1
        showTestimonial(newIndex)
      })
    }
  
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        let newIndex = currentIndex + 1
        if (newIndex >= testimonials.length) newIndex = 0
        showTestimonial(newIndex)
      })
    }
  
    // Auto rotate testimonials
    setInterval(() => {
      let newIndex = currentIndex + 1
      if (newIndex >= testimonials.length) newIndex = 0
      showTestimonial(newIndex)
    }, 5000)
  
    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item")
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
  
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active")
  
        // Close all FAQ items
        faqItems.forEach((faqItem) => {
          faqItem.classList.remove("active")
          const answer = faqItem.querySelector(".faq-answer")
          answer.style.maxHeight = "0"
        })
  
        // If the clicked item wasn't active, open it
        if (!isActive) {
          item.classList.add("active")
          const answer = item.querySelector(".faq-answer")
          answer.style.maxHeight = answer.scrollHeight + "px"
        }
      })
    })
  
    // Subscription Modal
    const subscribeButtons = document.querySelectorAll(".subscribe-btn")
    const subscriptionModal = document.getElementById("subscriptionModal")
    const closeSubscriptionBtn = document.getElementById("closeSubscriptionBtn")
    const confirmSubscriptionBtn = document.getElementById("confirmSubscriptionBtn")
    const successModal = document.getElementById("successModal")
    const closeSuccessBtn = document.getElementById("closeSuccessBtn")
    const planNameElement = document.getElementById("planName")
  
    function openSubscriptionModal(planName) {
      if (planNameElement) {
        planNameElement.textContent = planName
      }
      subscriptionModal.classList.add("show")
    }
  
    function closeSubscriptionModal() {
      subscriptionModal.classList.remove("show")
    }
  
    function openSuccessModal() {
      subscriptionModal.classList.remove("show")
      successModal.classList.add("show")
    }
  
    function closeSuccessModal() {
      successModal.classList.remove("show")
    }
  
    if (subscribeButtons.length > 0) {
      subscribeButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const planType = this.getAttribute("data-plan")
          let planName = "Coffee Subscription"
  
          if (planType === "weekly") {
            planName = "Weekly Essentials"
          } else if (planType === "biweekly") {
            planName = "Bi-Weekly Delight"
          } else if (planType === "monthly") {
            planName = "Monthly Explorer"
          }
  
          openSubscriptionModal(planName)
        })
      })
    }
  
    if (closeSubscriptionBtn) {
      closeSubscriptionBtn.addEventListener("click", closeSubscriptionModal)
    }
  
    if (confirmSubscriptionBtn) {
      confirmSubscriptionBtn.addEventListener("click", () => {
        // Here you would normally validate the form and process the subscription
        openSuccessModal()
      })
    }
  
    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener("click", closeSuccessModal)
    }
  
    // Close modals when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === subscriptionModal) {
        closeSubscriptionModal()
      }
      if (event.target === successModal) {
        closeSuccessModal()
      }
    })
  
    // Form submission
    const subscriptionForm = document.getElementById("subscriptionForm")
  
    if (subscriptionForm) {
      subscriptionForm.addEventListener("submit", (e) => {
        e.preventDefault()
        openSuccessModal()
      })
    }
  })
  