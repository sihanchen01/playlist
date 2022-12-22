console.log("this is background.js");

function handleRemoved(tabId, removeInfo) {
	console.log(`Tab: ${tabId} is closing`);
	console.log(`Window ID: ${removeInfo.windowId}`);
	console.log(`Window is closing: ${removeInfo.isWindowClosing}`);

	ids = localStorage.getItem("tab_ids").split(",");
	new_ids = ids.filter((id) => id != tabId);
	localStorage.setItem("tab_ids", new_ids);
}

browser.tabs.onRemoved.addListener(handleRemoved);
