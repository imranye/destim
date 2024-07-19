console.info('contentScript is running')

let isGrayscale = false

function toggleGrayscale() {
  isGrayscale = !isGrayscale
  if (isGrayscale) {
    document.documentElement.style.filter = 'grayscale(100%)'
  } else {
    document.documentElement.style.filter = 'none'
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleGrayscale') {
    toggleGrayscale()
  } else if (request.action === 'getGrayscaleStatus') {
    sendResponse({ isGrayscale })
  }
  return true
})