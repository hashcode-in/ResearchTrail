let visitedSites: string[] = [];
let isTracking = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTracking') {
    isTracking = true;
    visitedSites = [];
    chrome.storage.local.set({ isTracking, visitedSites });
  } else if (request.action === 'stopTracking') {
    isTracking = false;
    chrome.storage.local.set({ isTracking });
  } else if (request.action === 'generateReport') {
    generatePDF();
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isTracking && changeInfo.status === 'complete' && tab.url) {
    visitedSites.push(tab.url);
    chrome.storage.local.set({ visitedSites });
  }
});

function generatePDF() {
  chrome.tabs.create({ url: 'report.html' });
}