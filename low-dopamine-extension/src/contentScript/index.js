console.info('contentScript is running')

let isGrayscale = false

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
    document.documentElement.style.filter = value ? 'grayscale(100%)' : 'none'
}

function toggleGrayscale() {
    isGrayscale = !isGrayscale
    applyGrayscale(isGrayscale)
    chrome.storage.local.set({ isGrayscale: isGrayscale })
    return isGrayscale
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleGrayscale') {
        const newState = toggleGrayscale()
        sendResponse({ isGrayscale: newState })
    } else if (request.action === 'getGrayscaleStatus') {
        sendResponse({ isGrayscale: isGrayscale })
    }
    return true
})

chrome.storage.local.get(['isGrayscale'], (result) => {
    isGrayscale = result.isGrayscale || false
    applyGrayscale(isGrayscale)
})

injectCSS()