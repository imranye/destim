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

injectCSS()