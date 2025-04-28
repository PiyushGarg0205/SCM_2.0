document.addEventListener("DOMContentLoaded", () => {
    // Set today's date
    const todayDateElement = document.getElementById("todayDate")
    if (todayDateElement) {
      const today = new Date()
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      todayDateElement.textContent = today.toLocaleDateString("en-US", options)
    }
  
    // Calendar Navigation
    const calendarTitle = document.getElementById("calendarTitle")
    const prevBtn = document.querySelector(".calendar-nav-btn.prev")
    const nextBtn = document.querySelector(".calendar-nav-btn.next")
    let currentWeekOffset = 0
  
    function updateCalendarTitle(offset) {
      if (!calendarTitle) return
  
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay() + 1 + offset * 7) // Monday
  
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday
  
      const startMonth = startOfWeek.toLocaleString("default", { month: "long" })
      const endMonth = endOfWeek.toLocaleString("default", { month: "long" })
  
      const startDay = startOfWeek.getDate()
      const endDay = endOfWeek.getDate()
  
      const startYear = startOfWeek.getFullYear()
      const endYear = endOfWeek.getFullYear()
  
      if (startMonth === endMonth && startYear === endYear) {
        calendarTitle.textContent = `${startMonth} ${startDay} - ${endDay}, ${startYear}`
      } else if (startYear === endYear) {
        calendarTitle.textContent = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`
      } else {
        calendarTitle.textContent = `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
      }
    }
  
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentWeekOffset--
        updateCalendarTitle(currentWeekOffset)
        updateCalendarDays(currentWeekOffset)
      })
    }
  
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentWeekOffset++
        updateCalendarTitle(currentWeekOffset)
        updateCalendarDays(currentWeekOffset)
      })
    }
  
    function updateCalendarDays(offset) {
      const days = document.querySelectorAll(".calendar-day")
      if (!days.length) return
  
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay() + 1 + offset * 7) // Monday
  
      days.forEach((day, index) => {
        const currentDate = new Date(startOfWeek)
        currentDate.setDate(startOfWeek.getDate() + index)
  
        const dayName = currentDate.toLocaleString("default", { weekday: "long" })
        const dayDate = currentDate.getDate()
  
        day.querySelector(".day-name").textContent = dayName
        day.querySelector(".day-date").textContent = dayDate
  
        // Reset classes
        day.classList.remove("today", "weekend")
  
        // Add today class if it's today
        if (currentDate.toDateString() === today.toDateString()) {
          day.classList.add("today")
        }
  
        // Add weekend class if it's weekend
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          day.classList.add("weekend")
        }
  
        // Update content based on the day
        updateDayContent(day, dayName)
      })
    }
  
    function updateDayContent(dayElement, dayName) {
      const beanElement = dayElement.querySelector(".day-bean")
      const specialElement = dayElement.querySelector(".day-special")
  
      if (!beanElement || !specialElement) return
  
      // Sample data - in a real app, this would come from a database
      const dailySpecials = {
        Monday: { bean: "Ethiopian Yirgacheffe", special: "Iced Caramel Macchiato" },
        Tuesday: { bean: "Colombian Supremo", special: "Cinnamon Roll" },
        Wednesday: { bean: "Sumatra Mandheling", special: "Avocado Toast" },
        Thursday: { bean: "Costa Rican Tarrazu", special: "Chocolate Croissant" },
        Friday: { bean: "Kenyan AA", special: "Fruit Parfait" },
        Saturday: { bean: "Guatemala Antigua", special: "Weekend Brunch Set" },
        Sunday: { bean: "Hawaiian Kona", special: "Family Breakfast Bundle" },
      }
  
      const dayData = dailySpecials[dayName] || { bean: "House Blend", special: "Daily Special" }
  
      beanElement.textContent = dayData.bean
      specialElement.textContent = dayData.special
    }
  
    // Initialize calendar
    updateCalendarTitle(currentWeekOffset)
  
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
    const orderItems = document.getElementById("orderItems")
    const orderTotal = document.getElementById("orderTotal")
    let cartItems = []
  
    function updateCart() {
      if (!orderItems || !orderTotal) return
  
      // Clear current items
      orderItems.innerHTML = ""
  
      let total = 0
  
      cartItems.forEach((item) => {
        const itemTotal = item.price * item.quantity
        total += itemTotal
  
        const itemElement = document.createElement("div")
        itemElement.className = "order-item"
        itemElement.innerHTML = `
                  <span class="order-item-name">${item.name}</span>
                  <div class="order-item-quantity">
                      <button class="quantity-btn minus" data-name="${item.name}">-</button>
                      <span>${item.quantity}</span>
                      <button class="quantity-btn plus" data-name="${item.name}">+</button>
                  </div>
                  <span class="order-item-price">₹${itemTotal.toFixed(2)}</span>
              `
  
        orderItems.appendChild(itemElement)
      })
  
      orderTotal.textContent = `₹${total.toFixed(2)}`
  
      // Add event listeners to quantity buttons
      document.querySelectorAll(".quantity-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const itemName = this.getAttribute("data-name")
          const item = cartItems.find((i) => i.name === itemName)
  
          if (this.classList.contains("plus")) {
            item.quantity++
          } else {
            item.quantity--
            if (item.quantity <= 0) {
              cartItems = cartItems.filter((i) => i.name !== itemName)
            }
          }
  
          updateCart()
        })
      })
    }
  
    if (addToCartButtons.length > 0) {
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const itemName = this.getAttribute("data-item")
          const itemPrice = Number.parseFloat(this.getAttribute("data-price"))
  
          // Check if item already in cart
          const existingItem = cartItems.find((item) => item.name === itemName)
  
          if (existingItem) {
            existingItem.quantity++
          } else {
            cartItems.push({
              name: itemName,
              price: itemPrice,
              quantity: 1,
            })
          }
  
          updateCart()
  
          // Show a small animation
          const element = document.createElement("div")
          element.className = "add-animation"
          element.textContent = "+1"
          this.parentNode.appendChild(element)
  
          setTimeout(() => {
            element.remove()
          }, 1000)
  
          // Open order modal
          const orderModal = document.getElementById("orderModal")
          if (orderModal) {
            orderModal.classList.add("show")
          }
        })
      })
    }
  
    // Order Modal
    const orderNowBtn = document.getElementById("orderNowBtn")
    const orderModal = document.getElementById("orderModal")
    const closeOrderBtn = document.getElementById("closeOrderBtn")
    const placeOrderBtn = document.getElementById("placeOrderBtn")
    const successModal = document.getElementById("successModal")
    const closeSuccessBtn = document.getElementById("closeSuccessBtn")
  
    function openOrderModal() {
      if (orderModal) orderModal.classList.add("show")
    }
  
    function closeOrderModal() {
      if (orderModal) orderModal.classList.remove("show")
    }
  
    function openSuccessModal() {
      if (orderModal) orderModal.classList.remove("show")
      if (successModal) successModal.classList.add("show")
    }
  
    function closeSuccessModal() {
      if (successModal) successModal.classList.remove("show")
    }
  
    if (orderNowBtn) orderNowBtn.addEventListener("click", openOrderModal)
    if (closeOrderBtn) closeOrderBtn.addEventListener("click", closeOrderModal)
    if (placeOrderBtn) placeOrderBtn.addEventListener("click", openSuccessModal)
    if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", closeSuccessModal)
  
    // Close modals when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === orderModal) {
        closeOrderModal()
      }
      if (event.target === successModal) {
        closeSuccessModal()
      }
    })
  
    // Notification form
    const notificationForm = document.getElementById("notificationForm")
    const notificationSuccessModal = document.getElementById("notificationSuccessModal")
    const closeNotificationSuccessBtn = document.getElementById("closeNotificationSuccessBtn")
  
    if (notificationForm) {
      notificationForm.addEventListener("submit", function (e) {
        e.preventDefault()
  
        // Show success modal
        if (notificationSuccessModal) {
          notificationSuccessModal.classList.add("show")
        }
  
        // Reset form
        this.reset()
      })
    }
  
    if (closeNotificationSuccessBtn) {
      closeNotificationSuccessBtn.addEventListener("click", () => {
        if (notificationSuccessModal) {
          notificationSuccessModal.classList.remove("show")
        }
      })
    }
  
    // Close notification modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === notificationSuccessModal) {
        notificationSuccessModal.classList.remove("show")
      }
    })
  })
  