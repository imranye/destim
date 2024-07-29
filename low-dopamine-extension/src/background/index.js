/**
 * Background Script for Low Dopamine Extension
 * 
 * This script runs in the background and manages communication between
 * the extension's popup and content scripts. It handles requests for
 * toggling grayscale modes and retrieving grayscale status.
 */

console.log('background is running');

/**
 * Message Listener for Extension Communication
 * 
 * This listener handles incoming messages from other parts of the extension,
 * specifically for grayscale-related actions.
 * 
 * @param {Object} request - The incoming message request object
 * @param {string} request.action - The action to perform ('toggleGrayscale', 'toggleHalfGrayscale', or 'getGrayscaleStatus')
 * @param {Object} sender - Details about the sender of the message
 * @param {function} sendResponse - Function to send a response back to the sender
 * @returns {boolean} - True to indicate that the response will be sent asynchronously
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the request is for a grayscale-related action
  if (request.action === 'toggleGrayscale' || request.action === 'toggleHalfGrayscale' || request.action === 'getGrayscaleStatus') {
    // Query for the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Send the request to the content script of the active tab
      chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
        if (chrome.runtime.lastError) {
          // If there's an error (e.g., content script not ready), send error response
          sendResponse({ error: chrome.runtime.lastError.message });
        } else {
          // Forward the response from the content script back to the original sender
          sendResponse(response);
        }
      });
    });
    
    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});