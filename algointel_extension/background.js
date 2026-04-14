chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze",
    title: "Analyze Code with AlgoIntel",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.sendMessage(tab.id, {
    type: "OPEN_SIDEBAR",
    code: info.selectionText,
  });
});
