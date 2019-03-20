function launchScript(){
	chrome.tabs.executeScript(null, {file: 'main.js'}, _=>chrome.runtime.lastError);
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === 'complete') {
		chrome.tabs.getSelected(null,function(tab){
			var tablink = tab.url;
			if (tablink.includes("https://www.carrefour.fr/")){
				launchScript();
				//To modify product wich are loaded with JS on the website
				if (!(tablink.includes("?noRedirect"))){
					setTimeout(function(){launchScript()}, 1000);
				}
			}
		});
	}
});	
