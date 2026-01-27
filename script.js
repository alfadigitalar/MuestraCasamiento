/* --- Global Helpers --- */
const d = document;

/* --- Loader Logic --- */
window.addEventListener("load", () => {
  // Loader is handled via CSS animation (fadeOutLoad)
  // We just ensure scroll is enabled after load if needed,
  // but CSS pointer-events:none handles it well.
  setTimeout(() => {
    window.scrollTo(0, 0); // Reset scroll
  }, 100);

  // Generate floating hearts
  generateFloatingHearts();
});

/* --- Floating Hearts Generator --- */
function generateFloatingHearts() {
  const container = d.getElementById("floatingHearts");
  if (!container) return;

  const hearts = ["❤", "💕", "💖", "✨", "💗"];
  const numHearts = 15;

  for (let i = 0; i < numHearts; i++) {
    const heart = d.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${8 + Math.random() * 12}s`;
    heart.style.animationDelay = `${Math.random() * 5}s`;
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    heart.style.opacity = `${0.3 + Math.random() * 0.5}`;
    container.appendChild(heart);
  }
}

/* --- Parallax Effect on Scroll --- */
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const heroImg = d.querySelector(".hero_background img");
  const heroContent = d.querySelector(".hero_content");

  if (heroImg && scrolled < window.innerHeight) {
    heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
  }

  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.6);
    heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
  }
});

/* --- Scroll Animation (Reveal) --- */
const revealElements = d.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Optional: Unobserve after revealing if you want it to happen only once
        // revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  },
);

revealElements.forEach((el) => revealObserver.observe(el));

/* --- Navbar Scroll Effect --- */
const navbar = d.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
    navbar.style.padding = "0.5rem 0";
    navbar.style.background = "rgba(253, 251, 247, 0.98)";
    navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
  } else {
    navbar.classList.remove("scrolled");
    navbar.style.padding = "1rem 0";
    navbar.style.background = "rgba(253, 251, 247, 0.95)";
    navbar.style.boxShadow = "none"; // Or keep soft shadow
  }
});

/* --- Countdown Timer --- */
const weddingDate = new Date("June 15, 2026 17:00:00").getTime();

const updateCountdown = () => {
  const now = new Date().getTime();
  const gap = weddingDate - now;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const dDisplay = Math.floor(gap / day);
  const hDisplay = Math.floor((gap % day) / hour);
  const mDisplay = Math.floor((gap % hour) / minute);
  const sDisplay = Math.floor((gap % minute) / second);

  if (d.getElementById("days")) {
    d.getElementById("days").innerText =
      dDisplay < 10 ? "0" + dDisplay : dDisplay;
    d.getElementById("hours").innerText =
      hDisplay < 10 ? "0" + hDisplay : hDisplay;
    d.getElementById("minutes").innerText =
      mDisplay < 10 ? "0" + mDisplay : mDisplay;
    d.getElementById("seconds").innerText =
      sDisplay < 10 ? "0" + sDisplay : sDisplay;
  }
};

setInterval(updateCountdown, 1000);

/* --- Gifts Accordion --- */
function toggleGiftAccordion(id) {
  const section = d.getElementById(id);
  const allSections = d.querySelectorAll(".gifts_accordion");

  // Close others
  allSections.forEach((sec) => {
    if (sec.id !== id) {
      sec.classList.remove("open");
    }
  });

  // Toggle current
  section.classList.toggle("open");
}

/* --- FAQ Accordion --- */
const faqQuestions = d.querySelectorAll(".faq__question");

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.parentNode;
    const isActive = item.classList.contains("active");

    // Close all FAQs
    d.querySelectorAll(".faq__item").forEach((i) =>
      i.classList.remove("active"),
    );

    // If it wasn't active, open it
    if (!isActive) {
      item.classList.add("active");
    }
  });
});

/* --- Copy to Clipboard --- */
function copyToClipboard(elementId) {
  // Copy logic
  const textToCopy = d.getElementById(elementId).innerText;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      showNotification("¡Alias copiado al portapapeles!");
    })
    .catch((err) => {
      console.error("Error al copiar: ", err);
      showNotification("Error al copiar el alias");
    });
}

/* --- RSVP Form Logic --- */
let attendingStatus = null;

function toggleAttendance(status) {
  attendingStatus = status;
  const mainGuestData = d.getElementById("mainGuestData");
  const companionSection = d.getElementById("companionSection");
  const submitBtn = d.getElementById("submitBtn");

  // Show main guest data for BOTH yes and no
  mainGuestData.classList.remove("hidden");
  mainGuestData.style.opacity = "0";
  setTimeout(() => {
    mainGuestData.style.opacity = "1";
  }, 50);

  // Show submit button
  submitBtn.style.display = "block";

  // Show companion section ONLY for yes
  if (status === "yes") {
    companionSection.classList.remove("hidden");
    companionSection.style.opacity = "0";
    setTimeout(() => {
      companionSection.style.opacity = "1";
    }, 100);
  } else {
    companionSection.classList.add("hidden");
    // Reset companion fields when switching to "no"
    d.getElementById("quantitySection").classList.add("hidden");
    d.getElementById("guestFieldsContainer").innerHTML = "";
    const guestCount = d.getElementById("guestCount");
    if (guestCount) guestCount.value = "";
  }
}

function toggleCompany(isAccompanied) {
  const quantitySection = d.getElementById("quantitySection");
  const guestFields = d.getElementById("guestFieldsContainer");

  if (isAccompanied) {
    quantitySection.classList.remove("hidden");
  } else {
    quantitySection.classList.add("hidden");
    d.getElementById("guestCount").value = "";
    guestFields.innerHTML = "";
  }
}

function generateGuestFields() {
  const count = parseInt(d.getElementById("guestCount").value) || 0;
  const container = d.getElementById("guestFieldsContainer");

  container.innerHTML = "";

  if (count > 10) {
    showNotification("Por favor contáctanos si son más de 10 personas.");
    return;
  }

  for (let i = 1; i <= count; i++) {
    const guestCard = d.createElement("div");
    guestCard.className = "guest-card";
    guestCard.innerHTML = `
            <h4>Acompañante #${i}</h4>
            <div class="form-group">
                <input type="text" name="guest_${i}_name" class="form-input" placeholder="Nombre" required>
            </div>
            <div class="form-group">
                <input type="text" name="guest_${i}_lastname" class="form-input" placeholder="Apellido" required>
            </div>
            <div class="form-group">
                <input type="text" name="guest_${i}_dni" class="form-input" placeholder="DNI" required pattern="[0-9]{7,8}" title="Ingresa un DNI válido">
            </div>
        `;
    container.appendChild(guestCard);
  }
}

d.getElementById("rsvpForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = this;

  // Custom Validation
  if (!form.checkValidity()) {
    const invalidInputs = form.querySelectorAll(":invalid");
    const firstInvalid = invalidInputs[0];
    let msg = "Por favor completa este campo.";

    if (firstInvalid.validity.patternMismatch) {
      if (
        firstInvalid.name.includes("dni") ||
        firstInvalid.name.includes("DNI")
      ) {
        msg = "Ingresa un DNI válido (7 u 8 números).";
      } else {
        msg = "El formato no es válido.";
      }
    } else if (firstInvalid.validity.valueMissing) {
      if (firstInvalid.type === "radio") {
        msg = "Por favor selecciona una opción.";
      } else {
        msg = "Este campo es requerido.";
      }
    }

    showNotification(msg);
    firstInvalid.focus();
    return;
  }
  const btn = form.querySelector('button[type="submit"]');
  const confirmationMsg = d.getElementById("confirmationMessage");
  const confirmTitle = d.getElementById("confirmTitle");
  const confirmText = d.getElementById("confirmText");

  btn.innerText = "Enviando...";
  btn.disabled = true;

  setTimeout(() => {
    // Hide form elements
    d.getElementById("mainGuestData").style.display = "none";
    d.getElementById("companionSection").style.display = "none";
    form.querySelectorAll(".form-group").forEach((el) => {
      el.style.display = "none";
    });
    btn.style.display = "none";

    // Set appropriate confirmation message
    if (attendingStatus === "yes") {
      confirmTitle.textContent = "¡Gracias por confirmar!";
      confirmText.textContent =
        "Nos vemos en la boda. Tu confirmación ha sido registrada.";
    } else {
      confirmTitle.textContent = "Lamentamos que no puedas asistir";
      confirmText.textContent =
        "Gracias por avisarnos. ¡Te tendremos presente!";
    }

    // Show custom confirmation message
    confirmationMsg.classList.remove("hidden");
    confirmationMsg.style.display = "block";

    // Scroll to confirmation message
    confirmationMsg.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 1500);
});

// Make functions global for inline onclick handlers in HTML
window.toggleGiftAccordion = toggleGiftAccordion;
window.copyToClipboard = copyToClipboard;
window.toggleAttendance = toggleAttendance;
window.toggleCompany = toggleCompany;
window.generateGuestFields = generateGuestFields;

/* --- Custom Notification Logic --- */
function showNotification(message) {
  // Remove existing notification if any
  const existing = d.querySelector(".notification-toast");
  if (existing) existing.remove();

  // Create new notification
  const notification = d.createElement("div");
  notification.className = "notification-toast";
  notification.innerHTML = `
        <span class="notification-icon">✨</span>
        <span>${message}</span>
    `;

  d.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => notification.classList.add("show"), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}
