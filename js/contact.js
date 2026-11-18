export function initContactForm() {
  const contactForm = document.querySelector(".contact-form");
  const contactStatus = document.getElementById("contact-status");
  if (!contactForm || !contactStatus) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showStatus = (message, isError) => {
    contactStatus.textContent = message;
    contactStatus.classList.toggle("is-error", isError);
  };

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("contact-email").value.trim();

    if (!emailPattern.test(email)) {
      showStatus("Please enter a valid email address.", true);
      return;
    }

    showStatus("Thanks! Your message has been sent successfully.", false);
    contactForm.reset();
  });
}
