console.log('background is running')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleGrayscale' || request.action === 'toggleHalfGrayscale') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, request, sendResponse);
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});