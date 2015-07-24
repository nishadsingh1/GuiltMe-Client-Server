var last_time = new Date().getTime() / 1000;
var last_url =  "chrome://newtab/";
var url_to_time = {};
var update =  function(current_url){
  var now = new Date().getTime() / 1000;
  var difference = now - last_time;
  if(url_to_time[last_url] == undefined){
    url_to_time[last_url] = difference;
  } else {
    url_to_time[last_url] += difference;
  }
  last_url = current_url;
  last_time = now;
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      url_to_time["chrome://newtab/"] = undefined;
      sendResponse(url_to_time);
  });

chrome.tabs.onActivated.addListener(function(activeInfo){
  var tabId = activeInfo.tabId;
  chrome.tabs.get(tabId, function(tab){
    update(tab.url);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  chrome.tabs.get(tabId, function(tab){
    if(tab.active){
      update(tab.url);
    }  
  });
});

chrome.windows.onFocusChanged.addListener(function(windowId){
  chrome.windows.get(windowId,function(window){
    for(i=0; i< window.tabs.length; i++){
      var tab = window.tabs[i];
      if(tab.active){
        update(tab.url);
      }
    }
  });
});
