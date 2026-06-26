/* CloudCommerce storefront — vanilla JS, no build step. */
(function () {
  "use strict";

  // Fallback catalog so the page works even on file:// (where fetch is blocked).
  // In Lab 1 the real data/products.json is served from S3 and used instead.
  var FALLBACK = [
    { id: "p1", name: "Everyday Tote", category: "Bags", price: 68, glyph: "👜", c1: "#E8DCC8", c2: "#C9B79C", blurb: "Waxed canvas, leather handles, one honest pocket." },
    { id: "p2", name: "Field Notebook", category: "Paper", price: 14, glyph: "📓", c1: "#D8E2DC", c2: "#A9C0B4", blurb: "Lay-flat binding, 90gsm, dot grid." },
    { id: "p3", name: "Ceramic Mug", category: "Home", price: 22, glyph: "☕", c1: "#E6D5CE", c2: "#C9A99B", blurb: "Hand-thrown, holds a generous pour." },
    { id: "p4", name: "Merino Beanie", category: "Apparel", price: 38, glyph: "🧶", c1: "#DCD6E2", c2: "#B3A6C7", blurb: "Soft, warm, not itchy. Three colors." },
    { id: "p5", name: "Brass Pen", category: "Desk", price: 29, glyph: "🖊️", c1: "#EDE3C8", c2: "#D2BE85", blurb: "Ages beautifully. Refillable forever." },
    { id: "p6", name: "Linen Apron", category: "Home", price: 44, glyph: "🥢", c1: "#DDE3E6", c2: "#A9BBC4", blurb: "Stonewashed European linen, adjustable." },
    { id: "p7", name: "Trail Bottle", category: "Outdoors", price: 32, glyph: "🍶", c1: "#D6E2D9", c2: "#9FBCAA", blurb: "Insulated steel, keeps cold 24h." },
    { id: "p8", name: "Card Wallet", category: "Bags", price: 48, glyph: "💳", c1: "#E5D9D2", c2: "#BFA295", blurb: "Vegetable-tanned leather, four slots." }
  ];

  var cart = {}; // id -> { product, qty }
  var products = [];
  var activeFilter = "All";

  var $ = function (s) { return document.querySelector(s); };
  var grid = $("#grid"), filtersEl = $("#filters");

  // ---------- load catalog ----------
  function loadProducts() {
    var base = (window.API_BASE || "").trim();
    var url = base ? base.replace(/\/$/, "") + "/products" : "data/products.json";

    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        products = Array.isArray(data) ? data : (data.products || []);
        if (!products.length) throw new Error("empty");
        if (base) markLive();
        render();
      })
      .catch(function () {
        // file:// or no backend yet — use embedded fallback
        products = FALLBACK;
        render();
      });
  }

  function markLive() {
    var pill = $("#statusPill"), txt = $("#statusText");
    if (pill) { pill.textContent = "● Live API"; pill.classList.add("live"); }
    if (txt) txt.innerHTML = "Connected to <b>" + window.API_BASE + "</b> — products are served by your Catalog service on ECS Fargate.";
  }

  // ---------- render ----------
  function categories() {
    var set = {}; products.forEach(function (p) { set[p.category] = 1; });
    return ["All"].concat(Object.keys(set));
  }

  function renderFilters() {
    filtersEl.innerHTML = "";
    categories().forEach(function (c) {
      var b = document.createElement("button");
      b.textContent = c;
      if (c === activeFilter) b.className = "active";
      b.onclick = function () { activeFilter = c; render(); };
      filtersEl.appendChild(b);
    });
  }

  function render() {
    renderFilters();
    var list = products.filter(function (p) { return activeFilter === "All" || p.category === activeFilter; });
    grid.innerHTML = "";
    list.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        '<div class="swatch" style="background:linear-gradient(135deg,' + p.c1 + ',' + p.c2 + ')">' +
          '<span class="cat">' + p.category + '</span>' +
          '<span class="glyph">' + (p.glyph || "🛍️") + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<h3>' + p.name + '</h3>' +
          '<p class="blurb">' + (p.blurb || "") + '</p>' +
          '<div class="card-foot">' +
            '<span class="price">$' + Number(p.price).toFixed(2) + '</span>' +
            '<button class="add" data-id="' + p.id + '">Add</button>' +
          '</div>' +
        '</div>';
      card.querySelector(".add").onclick = function () { addToCart(p.id); };
      grid.appendChild(card);
    });
  }

  // ---------- cart ----------
  function addToCart(id) {
    var p = products.find(function (x) { return x.id === id; });
    if (!p) return;
    if (cart[id]) cart[id].qty++; else cart[id] = { product: p, qty: 1 };
    renderCart(); openCart();
  }
  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    renderCart();
  }
  function removeItem(id) { delete cart[id]; renderCart(); }

  function renderCart() {
    var items = Object.keys(cart), box = $("#cartItems");
    var count = items.reduce(function (n, id) { return n + cart[id].qty; }, 0);
    var total = items.reduce(function (s, id) { return s + cart[id].qty * cart[id].product.price; }, 0);

    $("#cartCount").textContent = count;
    $("#subtotal").textContent = "$" + total.toFixed(2);
    $("#checkoutBtn").disabled = count === 0;

    if (!count) { box.innerHTML = '<p class="empty">Your cart is empty.</p>'; return; }

    box.innerHTML = "";
    items.forEach(function (id) {
      var it = cart[id], p = it.product;
      var row = document.createElement("div");
      row.className = "line-item";
      row.innerHTML =
        '<div class="sw" style="background:linear-gradient(135deg,' + p.c1 + ',' + p.c2 + ')">' + (p.glyph || "🛍️") + '</div>' +
        '<div class="li-main">' +
          '<h4>' + p.name + '</h4>' +
          '<div class="li-price">$' + p.price.toFixed(2) + ' each</div>' +
          '<div class="qty"><button data-d="-1">−</button><span>' + it.qty + '</span><button data-d="1">+</button></div>' +
          '<br><button class="li-remove">Remove</button>' +
        '</div>';
      row.querySelectorAll(".qty button").forEach(function (btn) {
        btn.onclick = function () { changeQty(id, parseInt(btn.getAttribute("data-d"), 10)); };
      });
      row.querySelector(".li-remove").onclick = function () { removeItem(id); };
      box.appendChild(row);
    });
  }

  // ---------- checkout (stub → real API in later labs) ----------
  function checkout() {
    var note = $("#checkoutNote");
    var base = (window.API_BASE || "").trim();
    if (!base) {
      note.className = "checkout-note ok";
      note.textContent = "✓ Order simulated. Wire API_BASE + the Orders service to make this real (Labs 3–5).";
      cart = {}; renderCart(); $("#checkoutBtn").disabled = true;
      return;
    }
    note.className = "checkout-note";
    note.textContent = "Placing order…";
    fetch(base.replace(/\/$/, "") + "/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: Object.keys(cart).map(function (id) { return { id: id, qty: cart[id].qty }; }) })
    })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (res) {
        note.className = "checkout-note ok";
        note.textContent = "✓ Order " + (res.orderId || "placed") + " accepted — queued for fulfillment.";
        cart = {}; renderCart(); $("#checkoutBtn").disabled = true;
      })
      .catch(function () {
        note.className = "checkout-note";
        note.textContent = "Could not reach the Orders service. Check the ALB URL and security groups.";
      });
  }

  // ---------- drawer ----------
  function openCart() { $("#drawer").classList.add("open"); $("#overlay").classList.add("open"); }
  function closeCart() { $("#drawer").classList.remove("open"); $("#overlay").classList.remove("open"); }

  // ---------- wire up ----------
  document.addEventListener("DOMContentLoaded", function () {
    $("#yr").textContent = new Date().getFullYear();
    $("#cartBtn").onclick = openCart;
    $("#closeCart").onclick = closeCart;
    $("#overlay").onclick = closeCart;
    $("#checkoutBtn").onclick = checkout;
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });
    loadProducts();
  });
})();
