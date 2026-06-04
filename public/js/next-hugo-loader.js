(() => {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }

      const el = document.createElement("script");
      el.src = src;
      el.async = false;
      el.onload = () => resolve();
      el.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(el);
    });
  }

  async function initHome() {
    await loadScript("/js/itype.min.js");
    await loadScript("/js/github-button.js");
    await loadScript("/js/jquery.filterizr.min.js");
    await loadScript("/js/home.js");
  }

  async function initList() {
    await loadScript("/js/list.js");
  }

  async function initSingle() {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/highlight.min.js");
    await loadScript("/js/single.js");
    if (window.hljs && typeof window.hljs.initHighlightingOnLoad === "function") {
      window.hljs.initHighlightingOnLoad();
    }

    const editLink = document.getElementById("editLink");
    if (editLink && editLink.href) {
      editLink.href = editLink.href.replaceAll("%5c", "/");
    }

    document
      .querySelectorAll("a[href^='http']:not([href*='github.io'])")
      .forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          window.open(a.href);
        });
        a.setAttribute("title", "Opens in a new window");
      });
  }

  async function main() {
    const isHome = document.getElementById("home") != null;
    const isList = document.getElementById("post-card-holder") != null;
    const isSingle =
      document.getElementById("post-content") != null ||
      document.getElementById("TableOfContents") != null;

    try {
      if (isHome) await initHome();
      if (isList) await initList();
      if (isSingle) await initSingle();
    } catch {
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      void main();
    });
  } else {
    void main();
  }
})();

