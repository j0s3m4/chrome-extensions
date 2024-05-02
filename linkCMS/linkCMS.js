function linkToCMS() {
  const data = __NEXT_DATA__;
  if (data) {
    const json = JSON.parse(data.childNodes[0]['textContent']);
    const { articleID } = json.props.pageProps.articleStats;
    if (articleID) {
      const { hostname} = window.location;

      const glideMode = hostname === 'qa.hellomagazine.com' || hostname === 'qa.hola.com' ? 'qa' :
                        (hostname === 'www.hellomagazine.com' || hostname === 'staging.hellomagazine.com'|| hostname === 'www.hola.com' || hostname === 'staging.hola.com') ? 'prod' :
                        'dev';

      const url = glideMode === 'prod'
        ? `https://hello.pub.hello.gcpp.io/articles/${articleID}`
        : `https://pub.sandbox-hello.gcpp.io/articles/${articleID}`;      
      
      window.open(url, "_blank");
    } else {
      console.log(':HZN Extension: This is not an article');
    }
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
