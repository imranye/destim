console.info('contentScript is running')

function applyLowDopamineMode() {
  document.body.style.filter = 'grayscale(100%)';
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
    el.style.opacity = '0.5';
  });
  document.querySelectorAll('video').forEach(el => {
    el.playbackRate = 0.75;
  });
}

function removeLowDopamineMode() {
  document.body.style.filter = 'none';
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
    el.style.opacity = '1';
  });
  document.querySelectorAll('video').forEach(el => {
    el.playbackRate = 1;
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applyLowDopamineMode') {
    applyLowDopamineMode();
  } else if (request.action === 'removeLowDopamineMode') {
    removeLowDopamineMode();
  }
});

// Check initial state
chrome.storage.sync.get('lowDopamineMode', function(data) {
  if (data.lowDopamineMode) {
    applyLowDopamineMode();
  }
});
