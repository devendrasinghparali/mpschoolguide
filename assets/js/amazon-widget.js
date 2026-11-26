/* MP School Guide Amazon widget - renders a product section on pages where included. */
(function () {
  "use strict";
  const products = Array.isArray(window.MPSG_AMAZON_PRODUCTS) ? window.MPSG_AMAZON_PRODUCTS : [];
  if (!products.length) return;

  const host = document.createElement("section");
  host.className = "mpsg-amazon-section";
  host.setAttribute("aria-label", "Recommended products");

  const heading = document.createElement("h2");
  heading.className = "mpsg-amazon-heading";
  heading.textContent = "उपयोगी उत्पाद";
  host.appendChild(heading);

  const note = document.createElement("p");
  note.className = "mpsg-amazon-disclosure";
  note.textContent = "इस पेज पर Amazon के affiliate links हो सकते हैं। पात्र खरीद पर हमें कमीशन मिल सकता है, आपको अतिरिक्त शुल्क नहीं देना होगा।";
  host.appendChild(note);

  const grid = document.createElement("div");
  grid.className = "mpsg-amazon-grid";

  products.forEach((product) => {
    if (!product || !product.name || !product.url) return;
    const card = document.createElement("article");
    card.className = "mpsg-amazon-card";

    if (product.image) {
      const image = document.createElement("img");
      image.className = "mpsg-amazon-image";
      image.src = product.image;
      image.alt = product.name;
      image.loading = "lazy";
      image.referrerPolicy = "no-referrer";
      card.appendChild(image);
    }

    const content = document.createElement("div");
    content.className = "mpsg-amazon-content";
    const title = document.createElement("h3");
    title.className = "mpsg-amazon-title";
    title.textContent = product.name;
    content.appendChild(title);

    if (product.description) {
      const description = document.createElement("p");
      description.className = "mpsg-amazon-description";
      description.textContent = product.description;
      content.appendChild(description);
    }
    if (product.price) {
      const price = document.createElement("p");
      price.className = "mpsg-amazon-price";
      price.textContent = product.price;
      content.appendChild(price);
    }

    const link = document.createElement("a");
    link.className = "mpsg-amazon-link";
    link.href = product.url;
    link.target = "_blank";
    link.rel = "nofollow sponsored noopener";
    link.textContent = "Amazon पर देखें";
    content.appendChild(link);
    card.appendChild(content);
    grid.appendChild(card);
  });


  if (!grid.children.length) return;
  host.appendChild(grid);

  const mount = document.querySelector("[data-mpsg-amazon-products]") || document.querySelector("main") || document.querySelector(".page-content") || document.body;
  mount.appendChild(host);
})();
