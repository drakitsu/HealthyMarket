function launchScript(){
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
		if (changeInfo.status === 'complete') {
			chrome.tabs.executeScript(null, {file: 'hello.js'}, _=>chrome.runtime.lastError);
		}
	});
}

//Check if the website is Carrefour
chrome.tabs.query({url: "https://www.carrefour.fr/*"}, launchScript );



