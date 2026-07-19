/*
 * Anfrage-Formulare -> Web3Forms -> E-Mail an info@sv-hart-mauer.de
 *
 * EINRICHTUNG: Sobald der Access Key von https://web3forms.com vorliegt
 * (E-Mail-Adresse dort eintragen, Key kommt automatisch per Mail),
 * hier unten eintragen. Das ist die EINZIGE Stelle im ganzen Projekt,
 * die dafür geändert werden muss.
 */
(function () {
  "use strict";

  var ACCESS_KEY = "b357c93d-4814-4902-ad42-978995dd5eb6";

  document.querySelectorAll("form.lead-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var button = form.querySelector("button[type=submit]");
      var feedback = form.querySelector(".form-feedback");
      var originalLabel = button ? button.textContent : "";

      if (ACCESS_KEY === "DEIN_WEB3FORMS_ACCESS_KEY") {
        showFeedback(feedback, "error", "Formular ist noch nicht final eingerichtet. Bitte rufen Sie uns direkt an oder schreiben Sie per WhatsApp.");
        return;
      }

      if (button) {
        button.disabled = true;
        button.textContent = "Wird gesendet …";
      }
      showFeedback(feedback, null, "");

      var data = new FormData(form);
      data.append("access_key", ACCESS_KEY);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.success) {
            form.reset();
            showFeedback(feedback, "ok", "Danke! Ihre Anfrage wurde versendet – wir melden uns schnellstmöglich.");
          } else {
            throw new Error(result.message || "Unbekannter Fehler");
          }
        })
        .catch(function () {
          showFeedback(feedback, "error", "Das hat leider nicht geklappt. Rufen Sie uns gerne direkt an oder schreiben Sie per WhatsApp.");
        })
        .finally(function () {
          if (button) {
            button.disabled = false;
            button.textContent = originalLabel;
          }
        });
    });
  });

  function showFeedback(el, type, text) {
    if (!el) return;
    el.textContent = text;
    el.className = "form-feedback" + (type ? " is-visible form-feedback-" + type : "");
  }
})();
