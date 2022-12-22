const MAX_TABS = 5;
const TAB_NAME_MAX_LENGTH = 55;

function getAudibleTabs() {
	// return a Promise
	return browser.tabs.query({}).then((tabs) => {
		let result = [];
		tabs.forEach((tab) => {
			if (tab.audible) {
				result.push(tab);
			}
		});
		return result;
	});
}

function noNewTabCheck(arr1, arr2) {
	// since tab id could not be duplicate, if all elements in arr1 are in arr2, no changes
	// ! does not mean arr1, arr2 have SAME length
	return arr1.filter((el) => arr2.includes(el)).length == arr1.length;
}

/**
 * @param tab_ids Array<String>
 * @return void
 */
async function generateControlTabs(tab_ids) {
	let tabsList = document.getElementById("tabs-list");
	let currentTabs = document.createDocumentFragment();
	tabsList.textContent = "";

	// use an array of audible tab_ids to generate control panels
	if (tab_ids.length == 0) {
		let noTab = document.createElement("div");
		noTab.innerHTML = `<p class="no-tab">There is no audible tab</p>`;
		currentTabs.appendChild(noTab);
	} else {
		for (let id of tab_ids) {
			id = parseInt(id);
			tab = await browser.tabs.get(id);

			let tabLink = document.createElement("div");
			website = new URL(tab.url).hostname;
			tabName = tab.title || tab.id;
			// use ... at end if tab name is too long
			tabName.length > TAB_NAME_MAX_LENGTH
				? (tabName = tabName.slice(0, TAB_NAME_MAX_LENGTH) + "...")
				: tabName;

			tabLink.innerHTML = `<div class="tab">
				<div class="video-info">
					<div class="source">
						<img class="website-icon" src="${tab.favIconUrl}" />
						<p>${website}</p>
					</div>
					<a class="switch-tabs" href="${tab.id}" data-window-id="${tab.windowId}">${tabName}</a>
				</div>
				<div class="control-button mute-tab" data-id="${tab.id}">M</div>
				<div class="control-button play-pause" data-id="${tab.id}">P</div>
			</div>`;

			currentTabs.appendChild(tabLink);
		}
	}
	tabsList.appendChild(currentTabs);
}

function loadTabIds() {
	// load tab ids from local storage
	ids = localStorage.getItem("tab_ids");
	if (ids) {
		ids = ids.split(",");
	}
	return ids;
}

function showTabs() {
	ids = loadTabIds();
	// make ids empty array if it does not exist in localstorage
	if (!ids) {
		ids = [];
	}

	getAudibleTabs().then((audibleTabs) => {
		if (audibleTabs) {
			for (let tab of audibleTabs) {
				ids.includes(tab.id.toString()) ? null : ids.push(tab.id);
			}
			// only save to localstorage when there are audible tabs
			localStorage.setItem("tab_ids", ids);
		}
	});

	generateControlTabs(ids);
}

document.addEventListener("click", (e) => {
	e.preventDefault();
	if (e.target.classList.contains("mute-tab")) {
		let tabId = +e.target.dataset.id;
		browser.tabs.executeScript(tabId, {
			file: "/mute-tab.js",
		});
	}

	if (e.target.classList.contains("play-pause")) {
		let tabId = +e.target.dataset.id;
		const executing = browser.tabs.get(tabId).then((t) => {
			console.log("play/pause");
			browser.tabs.executeScript(tabId, {
				file: "/play-pause.js",
			});
		});

		function onExecuted(result) {
			console.log(`Executing script on tab ${tabId}`);
		}

		function onError(e) {
			console.log(`Error: ${e}`);
		}

		executing.then(onExecuted, onError);
	}

	if (e.target.classList.contains("switch-tabs")) {
		let tabId = +e.target.getAttribute("href");
		let windowId = +e.target.dataset.windowId;
		browser.windows.update(windowId, { focused: true });
		browser.tabs.update(tabId, { active: true });
		// TODO: BRING UP TARGETED BROWSER WINDOW, FOCUS ON TARGETED TAB
	}
});

document.addEventListener("DOMContentLoaded", showTabs);
