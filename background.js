chrome.windows.onCreated.addListener(function (win) {
  initializeTabInfos();
});

chrome.tabs.onActivated.addListener(function (activatedInfo) {
  const currentTabId = activatedInfo.tabId;
  const currentWindowIdKey = String(activatedInfo.windowId);

  chrome.storage.sync.get("lastTabInfo", function (storageLastTabInfo) {
    const tempTabInfo = storageLastTabInfo.lastTabInfo;
    if (!tempTabInfo[currentWindowIdKey]) {
      tempTabInfo[currentWindowIdKey] = currentTabId;

      chrome.storage.sync.set({ lastTabInfo: tempTabInfo });
      chrome.storage.sync.set({ currentTabInfo: tempTabInfo });
    } else {
      chrome.storage.sync.get("currentTabInfo", function (storageCurrentTabInfo) {
        tempTabInfo[currentWindowIdKey] = currentTabId;
        chrome.storage.sync.set({
          currentTabInfo: tempTabInfo
        });
        tempTabInfo[currentWindowIdKey] = storageCurrentTabInfo.currentTabInfo[currentWindowIdKey];
        chrome.storage.sync.set({
          lastTabInfo: tempTabInfo
        });
      });
    }
  });
});

chrome.commands.onCommand.addListener(function (command) {
  console.log("Command:", command);
  if (command == "switch-recent-tab") {
    chrome.windows.getCurrent(function (win) {
      const currentWindowIdKey = String(win.id);
      chrome.storage.sync.get("lastTabInfo", function (storageLastTabInfo) {
        chrome.tabs.update(storageLastTabInfo.lastTabInfo[currentWindowIdKey], { active: true, highlighted: true });
      });
    });
  }
});

/**
 * Setup last and current tab infos
 */
function initializeTabInfos(winId) {
  chrome.storage.sync.set({ lastTabInfo: { windowId: winId } });
  chrome.storage.sync.set({ currentTabInfo: { windowId: winId } });
}
