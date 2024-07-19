console.info('contentScript is running')

let isGrayscale = false
let isHalfGrayscale = false

function injectCSS() {
  const style = document.createElement('style')
  style.textContent = `
    html {
      transition: filter 0.3s ease;
    }
  `
  document.head.appendChild(style)
}

function applyGrayscale() {
  if (isGrayscale) {
    document.documentElement.style.filter = 'grayscale(100%)'
  } else if (isHalfGrayscale) {
    document.documentElement.style.filter = 'grayscale(50%)'
  } else {
    document.documentElement.style.filter = 'none'
  }
}

function toggleGrayscale() {
  isGrayscale = !isGrayscale
  isHalfGrayscale = false
  applyGrayscale()
  chrome.storage.local.set({ isGrayscale, isHalfGrayscale })
  return isGrayscale
}

function toggleHalfGrayscale() {
  isHalfGrayscale = !isHalfGrayscale
  isGrayscale = false
  applyGrayscale()
  chrome.storage.local.set({ isGrayscale, isHalfGrayscale })
  return isHalfGrayscale
}

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

chrome.storage.local.get(['isGrayscale', 'isHalfGrayscale'], (result) => {
  isGrayscale = result.isGrayscale || false
  isHalfGrayscale = result.isHalfGrayscale || false
  applyGrayscale()
})

injectCSS()