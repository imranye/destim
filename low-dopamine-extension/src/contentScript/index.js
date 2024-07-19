console.info('contentScript is running')

let isGrayscale = false
let grayscaleIntensity = 100

function injectCSS() {
  const style = document.createElement('style')
  style.textContent = `
    html {
      transition: filter 0.3s ease;
    }
  `
  document.head.appendChild(style)
}

function applyGrayscale(value) {
  document.documentElement.style.filter = value ? `grayscale(${grayscaleIntensity}%)` : 'none'
}

function toggleGrayscale() {
  isGrayscale = !isGrayscale
  grayscaleIntensity = isGrayscale ? 100 : 0
  applyGrayscale(isGrayscale)
  chrome.storage.local.set({ isGrayscale: isGrayscale, grayscaleIntensity: grayscaleIntensity })
  return isGrayscale
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message)
  if (message.action === 'toggleGrayscale') {
    sendResponse({ isGrayscale: toggleGrayscale() })
  } else if (message.action === 'setHalfGrayscale') {
    isGrayscale = true
    grayscaleIntensity = 50
    applyGrayscale(isGrayscale)
    chrome.storage.local.set({ isGrayscale: isGrayscale, grayscaleIntensity: grayscaleIntensity })
    sendResponse({ isGrayscale: true })
  } else if (message.action === 'getGrayscaleStatus') {
    sendResponse({ isGrayscale: isGrayscale })
  }
})

chrome.storage.local.get(['isGrayscale', 'grayscaleIntensity'], (result) => {
  isGrayscale = result.isGrayscale || false
  grayscaleIntensity = result.grayscaleIntensity || 100
  applyGrayscale(isGrayscale)
})

injectCSS()