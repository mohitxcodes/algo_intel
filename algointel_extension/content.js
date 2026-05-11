console.log("AlgoIntel content script loaded");

let overlay = null;
let modal = null;
let pendingCode = null;
let sidebarReady = false;

function closeModal() {
  if (overlay) {
    modal.style.transform = "scale(0.96)";
    modal.style.opacity = "0";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
      overlay = null;
      modal = null;
      sidebarReady = false;
    }, 250);
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "OPEN_SIDEBAR") {
    pendingCode = msg.code;

    if (!overlay) {
      sidebarReady = false;

      // Backdrop
      overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 2147483646;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.25s ease;
      `;
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
      });

      // Modal
      modal = document.createElement("iframe");
      modal.src = chrome.runtime.getURL("dist/index.html");
      modal.style.cssText = `
        width: 480px;
        height: 80vh;
        max-height: 680px;
        border: none;
        border-radius: 16px;
        box-shadow: 0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
        transform: scale(0.96);
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.opacity = "1";
          modal.style.transform = "scale(1)";
          modal.style.opacity = "1";
        });
      });
    }

    if (sidebarReady && pendingCode && modal) {
      modal.contentWindow.postMessage({ type: "ANALYZE_CODE", code: pendingCode }, "*");
      pendingCode = null;
    }
  }
});

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "ALGOINTEL_APP_READY") {
    sidebarReady = true;
    if (pendingCode && modal) {
      modal.contentWindow.postMessage({ type: "ANALYZE_CODE", code: pendingCode }, "*");
      pendingCode = null;
    }
  }
  if (event.data && event.data.type === "CLOSE_SIDEBAR") {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay) closeModal();
});
