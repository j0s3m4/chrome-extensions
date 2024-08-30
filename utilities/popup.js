// document.addEventListener('DOMContentLoaded', () => {

//   const wordcount = document.getElementById('wordcount');
//   const removeFixedWidth = document.getElementById('removeFixedWidth');
//   const fontSizeSelect = document.getElementById('fontSizeSelect');

//   // Load settings from storage and update the UI
//   chrome.storage.sync.get(['wordcount', 'removeFixedWidth', 'fontSizeSelect'], (data) => {

//     console.log('data');
//     console.log(data);


//     wordcount.checked = data.wordcount || false;
//     removeFixedWidth.checked = data.removeFixedWidth || false;
//     fontSizeSelect.value = data.fontSize || '16px';
//   });

//   // Apply settings immediately when toggled
//   wordcount.addEventListener('change', (event) => {
//     const enabled = event.target.checked;
//     chrome.storage.sync.set({ wordcount: enabled });
//     chrome.runtime.getBackgroundPage((backgroundPage) => {
//       backgroundPage.toggleWordCount(enabled);
//     });
//   });

//   removeFixedWidth.addEventListener('change', (event) => {
//     const enabled = event.target.checked;
//     chrome.storage.sync.set({ removeFixedWidth: enabled });
//     chrome.runtime.getBackgroundPage((backgroundPage) => {
//       backgroundPage.toggleFixedWidth(enabled);
//     });
//   });

//   // Apply font size change
//   fontSizeSelect.addEventListener('change', (event) => {
//     const fontSize = event.target.value;
//     chrome.storage.sync.set({ fontSize: fontSize });
//     chrome.runtime.getBackgroundPage((backgroundPage) => {
//       backgroundPage.applyFontSize(fontSize);
//     });
//   });
// });



document.addEventListener('DOMContentLoaded', () => {

  const wordcount = document.getElementById('wordcount');
  const removeFixedWidth = document.getElementById('removeFixedWidth');
  const fontSizeSelect = document.getElementById('fontSizeSelect');

  // Load settings from storage and update the UI
  chrome.storage.sync.get(['wordcount', 'removeFixedWidth', 'fontSize'], (data) => {
    wordcount.checked = data.wordcount || false;
    removeFixedWidth.checked = data.removeFixedWidth || false;
    fontSizeSelect.value = data.fontSize || '16px';
  });

  // Apply settings immediately when toggled
  wordcount.addEventListener('change', (event) => {
    const enabled = event.target.checked;
    chrome.storage.sync.set({ wordcount: enabled });
    chrome.runtime.sendMessage({ type: 'toggleWordCount', enabled: enabled });
  });

  removeFixedWidth.addEventListener('change', (event) => {
    const enabled = event.target.checked;
    chrome.storage.sync.set({ removeFixedWidth: enabled });
    chrome.runtime.sendMessage({ type: 'toggleFixedWidth', enabled: enabled });
  });

  // Apply font size change
  fontSizeSelect.addEventListener('change', (event) => {
    const fontSize = event.target.value;
    chrome.storage.sync.set({ fontSize: fontSize });
    chrome.runtime.sendMessage({ type: 'applyFontSize', fontSize: fontSize });
  });
});