export function initFaq() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
        faqItem
          .querySelector(".faq-trigger")
          .setAttribute("aria-expanded", "false");
        faqItem.querySelector(".faq-body").hidden = true;
      });

      if (!isOpen) {
        item.classList.add("active");
        trigger.setAttribute("aria-expanded", "true");
        item.querySelector(".faq-body").hidden = false;
      }
    });
  });
}
