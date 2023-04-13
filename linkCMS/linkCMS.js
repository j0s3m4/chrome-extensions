function linkToCMS() {
    const { pathname } = window.location;
    const articleID = pathname.replace(/[^0-9]+/g, "");
  
    if (articleID) {
      const url = 'https://pub.sandbox-hello.gcpp.io/articles/' + articleID;
      console.log(url);
      location.replace(url);
    } else {
      console.log(':HZN Extension: This is not an article');
    }
  }
  
  chrome.action.onClicked.addListener((tab) => {
    if (!tab.url.includes('chrome://')) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: linkToCMS
      });
    }
  });
  