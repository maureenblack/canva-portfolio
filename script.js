(function () {
  const triggers = Array.from(document.querySelectorAll(".frame, .page-thumb"));
  if (!triggers.length) return;

  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightbox-image");
  const caption = document.getElementById("lightbox-caption");
  const btnClose = lightbox.querySelector(".lb-close");
  const btnPrev = lightbox.querySelector(".lb-prev");
  const btnNext = lightbox.querySelector(".lb-next");

  const items = [];
  const indexOf = new Map();

  triggers.forEach(function (el) {
    var jpg = el.getAttribute("data-full-jpg");
    if (!indexOf.has(jpg)) {
      indexOf.set(jpg, items.length);
      items.push({
        webp: el.getAttribute("data-full-webp"),
        jpg: jpg,
        caption: el.getAttribute("data-caption") || "",
      });
    }
  });

  let index = 0;
  let lastFocus = null;

  function supportsWebp() {
    var canvas = document.createElement("canvas");
    if (!canvas.getContext) return false;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }

  const useWebp = supportsWebp();

  function show(i) {
    index = (i + items.length) % items.length;
    var item = items[index];
    image.src = useWebp && item.webp ? item.webp : item.jpg;
    image.alt = item.caption;
    caption.textContent = item.caption;
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lightbox.hidden = false;
    document.body.classList.add("lb-open");
    btnClose.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.classList.remove("lb-open");
    image.removeAttribute("src");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  triggers.forEach(function (el) {
    el.addEventListener("click", function () {
      open(indexOf.get(el.getAttribute("data-full-jpg")));
    });
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", function () { show(index - 1); });
  btnNext.addEventListener("click", function () { show(index + 1); });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
})();
