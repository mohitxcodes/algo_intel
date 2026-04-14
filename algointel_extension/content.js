console.log("AlgoIntel is working fine");

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "OPEN_SIDEBAR") {
    openSidebar(msg.code);
  }
});

function openSidebar(code) {
  const iframe = document.createElement("iframe");

  iframe.src = chrome.runtime.getURL("dist/index.html");

  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.top = "0";
  iframe.style.width = "400px";
  iframe.style.height = "100%";
  iframe.style.zIndex = "9999";

  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow.postMessage({ code }, "*");
  };
}
