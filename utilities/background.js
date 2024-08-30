chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['wordcount', 'removeFixedWidth', 'fontSize'], (data) => {
    // Default settings
    if (Object.keys(data).length === 0) {
      chrome.storage.sync.set({
        wordcount: false,
        removeFixedWidth: false,
        fontSize: '16px'
      });
    }
  });
});

chrome.storage.onChanged.addListener((changes) => {
  for (let [key, { newValue }] of Object.entries(changes)) {
    if (key === 'wordcount') {
      toggleWordCount(newValue);
    } else if (key === 'removeFixedWidth') {
      toggleFixedWidth(newValue);
    } else if (key === 'fontSize') {
      applyFontSize(newValue);
    }
  }
});

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case 'toggleWordCount':
      toggleWordCount(message.enabled);
      break;
    case 'toggleFixedWidth':
      toggleFixedWidth(message.enabled);
      break;
    case 'applyFontSize':
      applyFontSize(message.fontSize);
      break;
  }
});

function injectCSS(tabId, cssText) {
  chrome.scripting.insertCSS({
    target: { tabId: tabId, allFrames: true },
    css: cssText
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("CSS injection failed:", chrome.runtime.lastError);
    }
  });
}

function removeCSS(tabId, cssText) {
  chrome.scripting.removeCSS({
    target: { tabId: tabId, allFrames: true },
    css: cssText
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("CSS removal failed:", chrome.runtime.lastError);
    }
  });
}

function toggleWordCount(enabled) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let tab = tabs[0];
    if (tab.url && !tab.url.startsWith('chrome://')) {
      let tabId = tab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: true },
        func: enabled ? applyWordCount : removeWordCount,
      });
    }
  });
}

function applyWordCount() {
  var totalWordCount = 0;
  document.querySelectorAll(
    'div[class*="articleBody_"] > [data-wc]' +
    ', div[class*="articleBody_"] > .fr-embedded > [data-wc]' +
    ', div[class*="articleBody_"] > div[data-type="embed instagram"] > .fr-embedded > [data-wc]' +
    ', div[class*="articleBody_"] .hm-affiliate-product-list__item > [data-wc]' +
    ', div[class*="articleBody_"] div[data-type*="youtube"] > .fr-embedded > [data-wc]' +
    ', div[class*="articleBody_"] > .interview [data-wc]' +
    ', div.hm-grid__content--article > [data-wc]'
  ).forEach((elem) => {
    var canvas = document.createElement("canvas");
    canvas.setAttribute('height', 15);
    canvas.setAttribute('width', 200);
    var context = canvas.getContext('2d');
    context.fillStyle = 'rgba(255,0,0)';
    context.font = '14px sans-serif';
    totalWordCount += parseInt(elem.getAttribute("data-wc"));
    context.fillText(elem.getAttribute("data-wc") + " words - accum " + totalWordCount + " words", 0, 14);
    elem.style.border = "1px dotted rgba(0,0,0,0.5)";
    elem.style.paddingBottom = "20px";
    elem.style.backgroundColor = "rgba(0,0,0,0.1)";
    elem.style.backgroundRepeat = "no-repeat";
    elem.style.backgroundPosition = "bottom right";
    elem.style.backgroundImage = "url(" + canvas.toDataURL("image/png") + ")";
  });
}

function removeWordCount() {
  document.querySelectorAll(
    'div[class*="articleBody_"] > [data-wc]' +
    ', div[class*="articleBody_"] > .fr-embedded > [data-wc]' +
    ', div[class*="articleBody_"] > div[data-type="embed instagram"] > .fr-embedded > [data-wc]' +
    ', div[class*="articleBody_"] .hm-affiliate-product-list__item > [data-wc]' +
    ', div[class*="articleBody_"] div[data-type*="youtube"] > .fr-embedded > [data-wc]' +
    ', div[class*="articleBody_"] > .interview [data-wc]' +
    ', div.hm-grid__content--article > [data-wc]'
  ).forEach((elem) => {
    elem.style.border = "";
    elem.style.paddingBottom = "";
    elem.style.backgroundColor = "";
    elem.style.backgroundRepeat = "";
    elem.style.backgroundPosition = "";
    elem.style.backgroundImage = "";
  });
}

function toggleFixedWidth(enabled) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let tab = tabs[0];
    if (tab.url && !tab.url.startsWith('chrome://')) {
      let tabId = tab.id;
      let cssText = '.cdk-global-overlay-wrapper .cdk-overlay-pane { width: 100% !important; }';
      enabled ? injectCSS(tabId, cssText) : removeCSS(tabId, cssText);
    }
  });
}

function applyFontSize(fontSize) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let tab = tabs[0];
    if (tab.url && !tab.url.startsWith('chrome://')) {
      let tabId = tab.id;
      let cssText = `textarea { font-size: ${fontSize} !important; }`;
      
      // Inject the updated CSS to apply the new font size
      injectCSS(tabId, cssText);
    }
  });
}

// function applyFontSize(fontSize) {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     let tab = tabs[0];
//     if (tab.url && !tab.url.startsWith('chrome://')) {
//       let tabId = tab.id;
//       let cssText = `.mat-card-subtitle, .mat-card-content { font-size: ${fontSize} !important; }`;
//       enabled ? injectCSS(tabId, cssText) : removeCSS(tabId, cssText);
//     }
//   });
// }

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    chrome.storage.sync.get(['wordcount', 'removeFixedWidth', 'fontSize'], (data) => {

      console.log('... onCompleted ...');
      console.log(data);

      if (data.wordcount) {
        chrome.scripting.executeScript({
          target: { tabId: details.tabId, allFrames: true },
          func: applyWordCount,
        });
      }
      if (data.removeFixedWidth) {
        chrome.scripting.executeScript({
          target: { tabId: details.tabId, allFrames: true },
          func: () => toggleFixedWidth(data.removeFixedWidth),
        });
      }
      if (data.fontSize) {
        chrome.scripting.executeScript({
          target: { tabId: details.tabId, allFrames: true },
          func: applyFontSize(data.fontSize),
        });
      }
    });
  },
  { url: [{ hostContains: 'hola.com' }, { hostContains: 'hellomagazine.com' }, { hostContains: 'sandbox-hello.gcpp.io' }, { hostContains: 'pub.hello.gcpp.io' }] }
);












