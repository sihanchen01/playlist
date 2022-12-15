const MAX_TABS = 5;

function getAudibleTabs() {
	let audibleTabs;
	browser.tabs.query
		.then((tabs) => tabs.filter((tab) => tab.audible == true))
		.then((result) => (audibleTabs = result));
	return audibleTabs;
}

function showTabs() {
	getAudibleTabs().then((tabs) => {
		let tabsList = document.getElementById("tabs-list");
		let currentTabs = document.createDocumentFragment();
		let counter = 0;

		tabsList.textContent = "";

		for (let tab of tabs) {
			if (counter < MAX_TABS) {
				let tabLink = document.createElement("a");

				tabLink.textContent = tab.title || tab.id;
				tabLink.setAttribute("href", tab.id);

				currentTabs.appendChild(tabLink);
			}

			counter += 1;
		}

		tabsList.appendChild(currentTabs);
	});
}
