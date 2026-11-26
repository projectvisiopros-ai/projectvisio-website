// Demo page: builds the access-request email, and opens the encrypted demo with an access code.
// The demo (demo/demo.bin) is encrypted with AES-256-GCM; the key comes from the access code
// through PBKDF2-SHA256 (600,000 iterations), matching tools/encrypt-demo.mjs. Without the
// right code the file cannot be read, even though it is publicly downloadable.
(function () {
  var c = window.PV_SITE || {};

  // Request access by email.
  var req = document.getElementById("request-form");
  var reqErr = document.getElementById("request-error");
  var fallback = document.getElementById("request-fallback");
  if (req) {
    if (!c.contactEmail) {
      var btn = document.getElementById("request-submit");
      btn.disabled = true;
      btn.textContent = "Requests open soon";
    }
    req.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!c.contactEmail) return;
      var f = req.elements;
      var missing = [];
      [["name", "your full name"], ["position", "your position"], ["organisation", "your organisation"], ["email", "your work email"]].forEach(function (pair) {
        var input = f[pair[0]];
        var bad = !input.value.trim() || (pair[0] === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        input.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad) missing.push(pair[1]);
      });
      if (missing.length) {
        reqErr.textContent = "Please enter " + missing.join(", ") + ".";
        reqErr.hidden = false;
        req.querySelector('[aria-invalid="true"]').focus();
        return;
      }
      reqErr.hidden = true;
      var body =
        "Good day,\n\nI would like access to the ProjectVisio interactive demo.\n\n" +
        "Name: " + f.name.value.trim() + "\n" +
        "Position: " + f.position.value.trim() + "\n" +
        "Organisation: " + f.organisation.value.trim() + "\n" +
        "Email: " + f.email.value.trim() + "\n" +
        (f.phone.value.trim() ? "Contact number: " + f.phone.value.trim() + "\n" : "") +
        (f.notes.value.trim() ? "\nWhat I would like to see:\n" + f.notes.value.trim() + "\n" : "") +
        "\nRegards,\n" + f.name.value.trim();
      var href = "mailto:" + c.contactEmail + "?subject=" + encodeURIComponent("ProjectVisio demo access request: " + f.organisation.value.trim()) + "&body=" + encodeURIComponent(body);
      window.location.href = href;
      fallback.innerHTML = "";
      fallback.append("If your email app did not open, send your details to ");
      var a = document.createElement("a");
      a.href = "mailto:" + c.contactEmail;
      a.textContent = c.contactEmail;
      fallback.append(a, ".");
      fallback.hidden = false;
    });
  }

  // Open the demo with an access code.
  var form = document.getElementById("open");
  if (!form) return;
  var err = document.getElementById("open-error");
  var status = document.getElementById("open-status");
  var submit = document.getElementById("open-submit");
  var input = document.getElementById("code");

  function fail(msg) {
    err.textContent = msg;
    err.hidden = false;
    status.textContent = "";
    submit.disabled = false;
    input.setAttribute("aria-invalid", "true");
    input.focus();
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    err.hidden = true;
    input.setAttribute("aria-invalid", "false");
    var code = input.value.toUpperCase().replace(/\s+/g, "");
    if (!code) return fail("Enter the access code from our email.");
    if (!window.crypto || !window.crypto.subtle) return fail("This browser cannot open the demo. Use a current version of Chrome, Edge, Firefox or Safari.");
    submit.disabled = true;
    status.textContent = "Checking your code and opening the demo…";
    var data;
    try {
      var res = await fetch("demo/demo.bin", { cache: "no-cache" });
      if (!res.ok) throw new Error(String(res.status));
      data = new Uint8Array(await res.arrayBuffer());
    } catch (x) {
      return fail("The demo could not be downloaded. Check your connection and try again.");
    }
    if (String.fromCharCode(data[0], data[1], data[2], data[3]) !== "PVD1") return fail("The demo file is damaged. Please contact us.");
    try {
      var base = await crypto.subtle.importKey("raw", new TextEncoder().encode(code), "PBKDF2", false, ["deriveKey"]);
      var key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", hash: "SHA-256", salt: data.slice(4, 20), iterations: 600000 },
        base,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );
      var plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: data.slice(20, 32) }, key, data.slice(32));
    } catch (x) {
      return fail("That access code did not work. Check it against our email, or request a new one.");
    }
    status.textContent = "Opening the demo…";
    var url = URL.createObjectURL(new Blob([plain], { type: "text/html" }));
    window.location.assign(url);
  });

  if (location.hash === "#open") input.focus();
})();
