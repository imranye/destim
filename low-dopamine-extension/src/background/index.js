console.log('background is running')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleGrayscale' || request.action === 'toggleHalfGrayscale' || request.action === 'getGrayscaleStatus') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ error: chrome.runtime.lastError.message });
        } else {
          sendResponse(response);
        }
      });
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});