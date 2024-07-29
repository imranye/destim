/**
 * @fileoverview Content script for the Low Dopamine Extension.
 * This script manages the grayscale functionality of the extension,
 * including toggling full and half grayscale modes, applying CSS filters,
 * and handling message passing with the extension's background script.
 */

console.info('contentScript is running')

/** @type {boolean} Flag indicating if full grayscale is active */
let isGrayscale = false

/** @type {boolean} Flag indicating if half grayscale is active */
let isHalfGrayscale = false

/**
 * Injects CSS into the page to enable smooth transitions for the grayscale effect.
 */
function injectCSS() {
  const style = document.createElement('style')
  style.textContent = `
    html {
      transition: filter 0.3s ease;
    }
  `
  document.head.appendChild(style)
}

/**
 * Applies the appropriate grayscale filter based on the current state.
 */
function applyGrayscale() {
  if (isGrayscale) {
    document.documentElement.style.filter = 'grayscale(100%)'
  } else if (isHalfGrayscale) {
    document.documentElement.style.filter = 'grayscale(50%)'
  } else {
    document.documentElement.style.filter = 'none'
  }
}

/**
 * Toggles the full grayscale mode on and off.
 * @returns {boolean} The new state of isGrayscale.
 */
function toggleGrayscale() {
  isGrayscale = !isGrayscale
  isHalfGrayscale = false
  applyGrayscale()
  chrome.storage.local.set({ isGrayscale, isHalfGrayscale })
  return isGrayscale
}

/**
 * Toggles the half grayscale mode on and off.
 * @returns {boolean} The new state of isHalfGrayscale.
 */
function toggleHalfGrayscale() {
  isHalfGrayscale = !isHalfGrayscale
  isGrayscale = false
  applyGrayscale()
  chrome.storage.local.set({ isGrayscale, isHalfGrayscale })
  return isHalfGrayscale
}

/**
 * Listens for messages from the extension's background script.
 * @param {Object} message - The message object.
 * @param {Object} sender - Details about the sender of the message.
 * @param {function} sendResponse - Function to send a response back to the sender.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message)
  if (message.action === 'toggleGrayscale') {
    sendResponse({ isGrayscale: toggleGrayscale() })
  } else if (message.action === 'toggleHalfGrayscale') {
    sendResponse({ isHalfGrayscale: toggleHalfGrayscale() })
  } else if (message.action === 'getGrayscaleStatus') {
    sendResponse({ isGrayscale, isHalfGrayscale })
  }
})

/**
 * Retrieves the saved grayscale state from chrome.storage and applies it.
 */
chrome.storage.local.get(['isGrayscale', 'isHalfGrayscale'], (result) => {
  isGrayscale = result.isGrayscale || false
  isHalfGrayscale = result.isHalfGrayscale || false
  applyGrayscale()
})

// Initialize the content script by injecting the required CSS
injectCSS()