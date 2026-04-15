console.log("AlgoIntel content script loaded");

let sidebar = null;
let pendingCode = null;
let sidebarReady = false;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "OPEN_SIDEBAR") {
    pendingCode = msg.code;

    if (!sidebar) {
      sidebarReady = false;
      sidebar = document.createElement("iframe");
      sidebar.src = chrome.runtime.getURL("dist/index.html");
      sidebar.style.position = "fixed";
      sidebar.style.right = "0";
      sidebar.style.top = "0";
      sidebar.style.width = "420px";
      sidebar.style.height = "100%";
      sidebar.style.zIndex = "2147483647"; // maximum z-index
      sidebar.style.border = "none";
      sidebar.style.boxShadow = "-4px 0 24px rgba(0,0,0,0.25)";
      document.body.appendChild(sidebar);
    } 
    
    // If it's already created and ready, just send it immediately
    if (sidebarReady && pendingCode && sidebar) {
        sidebar.contentWindow.postMessage({ type: "ANALYZE_CODE", code: pendingCode }, "*");
        pendingCode = null;
    }
  }
});

// Listen for messages from the iframe
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "ALGOINTEL_APP_READY") {
    sidebarReady = true;
    if (pendingCode && sidebar) {
      sidebar.contentWindow.postMessage({ type: "ANALYZE_CODE", code: pendingCode }, "*");
      pendingCode = null;
    }
  }
});
