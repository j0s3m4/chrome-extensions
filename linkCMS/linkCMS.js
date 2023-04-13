function linkToCMS() {
  const data = __NEXT_DATA__;
  if (data) {
    const json = JSON.parse(data.childNodes[0]['textContent']);
    const { articleID } = json.props.pageProps.articleStats;
    if (articleID) {
      const url = `https://pub.sandbox-hello.gcpp.io/articles/${articleID}`;
      const { hostname} = window.location;

      const glideMode = hostname === 'qa.hellomagazine.com' ? 'qa' :
                        hostname === 'www.hellomagazine.com' ? 'prod' :
                        'dev';

      const text = `Before you go to edit this article in the CMS make sure you are on ${glideMode} in Glide. Press OK if you are already in the right glide mode.`;
      if (confirm(text) === true) {
        window.open(url, "_blank");
      }
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
