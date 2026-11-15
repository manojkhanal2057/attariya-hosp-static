"use strict";
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();
  const menu = document.getElementById("menuToggle"),
    mobile = document.getElementById("mobileNav");
  function closeMenu() {
    if (!menu || !mobile) return;
    mobile.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
  }
  if (menu && mobile) {
    menu.addEventListener("click", () => {
      const opened = mobile.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(opened));
      menu.setAttribute(
        "aria-label",
        opened ? "Close navigation" : "Open navigation",
      );
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !mobile.contains(e.target)) closeMenu();
    });
  }
  // A bilingual switch for the shared navigation and common CTA labels. Longer page content is English only until professionally translated.
  const translation = {
    Home: "गृहपृष्ठ",
    About: "हाम्रो बारेमा",
    Departments: "विभागहरू",
    Services: "सेवाहरू",
    Doctors: "चिकित्सकहरू",
    Facilities: "सुविधाहरू",
    News: "समाचार",
    Contact: "सम्पर्क",
    "Book Appointment": "अपोइन्टमेन्ट अनुरोध",
    "Request Appointment": "अपोइन्टमेन्ट अनुरोध",
  };
  const langBtn = document.getElementById("languageToggle");
  let nepali = false;
  langBtn?.addEventListener("click", () => {
    nepali = !nepali;
    document.documentElement.lang = nepali ? "ne" : "en";
    document.querySelectorAll(".nav-link").forEach((el) => {
      if (!el.dataset.original) el.dataset.original = el.textContent.trim();
      el.textContent = nepali
        ? translation[el.dataset.original] || el.dataset.original
        : el.dataset.original;
    });
    document
      .querySelectorAll("[data-en][data-ne]")
      .forEach(
        (el) => (el.textContent = nepali ? el.dataset.ne : el.dataset.en),
      );
    langBtn.textContent = nepali ? "नेपाली / EN" : "EN / नेपाली";
  });
  document.querySelectorAll("[data-filter-input]").forEach((input) => {
    const target = document.getElementById(input.dataset.filterInput),
      empty = document.querySelector(
        '[data-empty-for="' + input.dataset.filterInput + '"]',
      );
    if (!target) return;
    input.addEventListener("input", () => {
      const search = input.value.trim().toLocaleLowerCase();
      let found = 0;
      Array.from(target.children).forEach((card) => {
        const ok = card.textContent.toLocaleLowerCase().includes(search);
        card.hidden = !ok;
        if (ok) found++;
      });
      if (empty) empty.hidden = found > 0;
    });
  });
  const form = document.getElementById("appointmentForm");
  if (form) {
    const date = form.querySelector('[name="date"]');
    const today = new Date();
    const localToday = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 10);
    date.min = localToday;
    const doc = new URLSearchParams(location.search).get("doctor");
    if (doc) {
      let selected = Array.from(form.elements.doctor.options).find(
        (o) =>
          o.textContent
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") === doc,
      );
      if (selected) form.elements.doctor.value = selected.value;
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const err = document.getElementById("appointmentError");
      err.hidden = true;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const v = Object.fromEntries(new FormData(form).entries());
      if (v.date < localToday) {
        err.textContent = "Please select today or a future date.";
        err.hidden = false;
        return;
      }
      const subject = "Appointment request - Attariya Hospital";
      const body = `Appointment request (NOT CONFIRMED)\n\nPatient name: ${v.name}\nPhone: ${v.phone}\nEmail: ${v.email || "Not provided"}\nDepartment: ${v.department}\nPreferred doctor: ${v.doctor || "Any available"}\nPreferred date: ${v.date}\nAdditional message: ${v.message || "None"}\n\nPlease contact me to confirm availability.`;
      location.href =
        "mailto:attariyahospital@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }
  const contact = document.getElementById("contactForm");
  if (contact) {
    contact.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contact.reportValidity()) return;
      const v = Object.fromEntries(new FormData(contact).entries());
      location.href =
        "mailto:attariyahospital@gmail.com?subject=" +
        encodeURIComponent("Website inquiry from " + v.name) +
        "&body=" +
        encodeURIComponent(
          `Name: ${v.name}\nEmail: ${v.email}\n\n${v.message}`,
        );
    });
  }
});
