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

  // Walkthrough video: starts muted as soon as the page loads (browsers only allow silent
  // autoplay), with a button to turn the narration on. Visitors who ask their device to reduce
  // motion get the cover image and the player controls instead, and press play themselves.
  var video = document.getElementById("walkthrough");
  var sound = document.getElementById("walkthrough-sound");
  if (video) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var showSound = function () {
      if (sound) sound.hidden = !video.muted || video.paused;
    };
    if (sound) {
      sound.addEventListener("click", function () {
        video.muted = false;
        if (video.paused) video.play();
        sound.hidden = true;
      });
    }
    video.addEventListener("play", showSound);
    video.addEventListener("pause", showSound);
    video.addEventListener("volumechange", showSound);
    if (!reduce) {
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked: the controls remain */ });
    }
  }
})();
