document.addEventListener("DOMContentLoaded", () => {
    // Loyalty Card Flip Animation
    const loyaltyCard = document.querySelector(".loyalty-card")
  
    if (loyaltyCard) {
      loyaltyCard.addEventListener("click", function () {
        this.querySelector(".loyalty-card-inner").style.transform =
          this.querySelector(".loyalty-card-inner").style.transform === "rotateY(180deg)"
            ? "rotateY(0deg)"
            : "rotateY(180deg)"
      })
    }
  
    // Join Loyalty Program Button
    const joinLoyaltyBtn = document.getElementById("joinLoyaltyBtn")
    const loyaltyForm = document.getElementById("loyaltyForm")
  
    if (joinLoyaltyBtn) {
      joinLoyaltyBtn.addEventListener("click", () => {
        // Scroll to the form
        const formContainer = document.querySelector(".join-form-container")
        if (formContainer) {
          formContainer.scrollIntoView({ behavior: "smooth" })
  
          // Add a highlight effect
          formContainer.classList.add("highlight-form")
          setTimeout(() => {
            formContainer.classList.remove("highlight-form")
          }, 1500)
        }
      })
    }
  
    // Loyalty Form Submission
    if (loyaltyForm) {
      loyaltyForm.addEventListener("submit", function (e) {
        e.preventDefault()
  
        // Show success modal
        const successModal = document.getElementById("loyaltySuccessModal")
        if (successModal) {
          successModal.classList.add("show")
        }
  
        // Reset form
        this.reset()
      })
    }
  
    // Close Success Modal
    const closeSuccessBtn = document.getElementById("closeLoyaltySuccessBtn")
  
    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener("click", () => {
        const successModal = document.getElementById("loyaltySuccessModal")
        if (successModal) {
          successModal.classList.remove("show")
        }
      })
    }
  
    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      const successModal = document.getElementById("loyaltySuccessModal")
      if (event.target === successModal) {
        successModal.classList.remove("show")
      }
    })
  
    // Badge hover effects
    const badgeCards = document.querySelectorAll(".badge-card")
  
    badgeCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        const badgeIcon = this.querySelector(".badge-icon")
        if (badgeIcon) {
          badgeIcon.style.transform = "scale(1.1)"
        }
      })
  
      card.addEventListener("mouseleave", function () {
        const badgeIcon = this.querySelector(".badge-icon")
        if (badgeIcon) {
          badgeIcon.style.transform = "scale(1)"
        }
      })
    })
  
    // Simulate points accumulation animation
    function animatePoints() {
      const pointsElements = document.querySelectorAll(".badge-status")
  
      pointsElements.forEach((element) => {
        const text = element.textContent
  
        // Only animate elements that show progress
        if (text.includes("/") || text.includes("₹")) {
          let start, end
  
          if (text.includes("/")) {
            // Format: "2/5 Completed"
            const parts = text.split("/")
            start = Number.parseInt(parts[0])
            end = Number.parseInt(parts[1].split(" ")[0])
          } else if (text.includes("₹")) {
            // Format: "₹3,450/₹10,000"
            const parts = text.split("/")
            start = Number.parseInt(parts[0].replace("₹", "").replace(",", ""))
            end = Number.parseInt(parts[1].replace("₹", "").replace(",", ""))
          }
  
          if (start && end) {
            // Add a small random increment to simulate activity
            if (Math.random() > 0.7 && start < end) {
              start += 1
  
              if (text.includes("/")) {
                element.textContent = `${start}/${end} Completed`
              } else if (text.includes("₹")) {
                element.textContent = `₹${start.toLocaleString()}/₹${end.toLocaleString()}`
              }
  
              // Add a highlight effect
              element.classList.add("points-updated")
              setTimeout(() => {
                element.classList.remove("points-updated")
              }, 1000)
            }
          }
        }
      })
    }
  
    // Simulate points accumulation every 10 seconds
    setInterval(animatePoints, 10000)
  
    // Add CSS for the highlight effect
    const style = document.createElement("style")
    style.textContent = `
          .highlight-form {
              animation: pulse 1.5s;
          }
          
          .points-updated {
              animation: highlight 1s;
          }
          
          @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(255, 190, 11, 0.7); }
              70% { box-shadow: 0 0 0 20px rgba(255, 190, 11, 0); }
              100% { box-shadow: 0 0 0 0 rgba(255, 190, 11, 0); }
          }
          
          @keyframes highlight {
              0% { background-color: rgba(255, 190, 11, 0.3); }
              100% { background-color: transparent; }
          }
      `
    document.head.appendChild(style)
  })
  