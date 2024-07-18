import './index.css'

document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('lowDopamineToggle');
  const status = document.getElementById('status');

  // Load initial state
  chrome.storage.sync.get('lowDopamineMode', function(data) {
    toggle.checked = data.lowDopamineMode || false;
    updateStatus(toggle.checked);
  });

  toggle.addEventListener('change', function() {
    const isEnabled = toggle.checked;
    chrome.storage.sync.set({ lowDopamineMode: isEnabled });
    updateStatus(isEnabled);

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: isEnabled ? 'applyLowDopamineMode' : 'removeLowDopamineMode' 
      });
    });
  });

  function updateStatus(isEnabled) {
    status.textContent = isEnabled ? 'Low Dopamine Mode is ON' : 'Low Dopamine Mode is OFF';
  }
});