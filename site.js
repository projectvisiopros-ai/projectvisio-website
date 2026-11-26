// Fills the links from config.js and runs the product tour.
// A link whose address is not set yet is shown as "available soon" (main buttons) or hidden
// (navigation, footer, contact and legal links), so visitors never reach a broken page.
(function () {
  var c = window.PV_SITE || {};
  var app = (c.appUrl || "").replace(/\/+$/, "");
  var urls = {
    app: app,
    signup: app ? app + "/signup" : "",
    login: app ? app + "/login" : "",
    windows: c.windowsDownload,
    android: c.androidDownload,
    contact: c.contactEmail ? "mailto:" + c.contactEmail : "",
    privacy: app && c.privacyPath ? app + c.privacyPath : "",
    terms: app && c.termsPath ? app + c.termsPath : "",
  };
  var hideWhenMissing = { contact: true, privacy: true, terms: true, login: true };

  document.querySelectorAll("[data-link]").forEach(function (a) {
    var key = a.getAttribute("data-link");
    var url = urls[key];
    if (url) {
      a.href = url;
      if (key === "windows" || key === "android") a.setAttribute("download", "");
      return;
    }
    if (hideWhenMissing[key] || a.closest(".masthead") || a.closest(".footer")) {
      (a.closest("li") || a).hidden = true;
      return;
    }
    a.removeAttribute("href");
    a.setAttribute("aria-disabled", "true");
    a.classList.add("is-soon");
    a.textContent = a.textContent + " (available soon)";
  });

  var price = document.querySelector("[data-pro-price]");
  if (price && c.proPrice) price.textContent = c.proPrice;

  if (!c.windowsSigned) {
    document.querySelectorAll("[data-show-if-unsigned]").forEach(function (el) {
      el.hidden = false;
    });
  }

  // Product tour: an accessible tab list (click, or arrow keys, Home and End).
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tour__tab"));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      select(tab, false);
    });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  });
})();
