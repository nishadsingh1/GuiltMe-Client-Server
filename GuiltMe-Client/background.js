var last_time = new Date().getTime() / 1000;
var last_url =  "chrome://newtab/";
var url_to_time = {};
var classification_to_url = { work: [], procrastination: [] };
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
    if (request.message == 'initializing') {
      url_to_time["chrome://newtab/"] = undefined;
      sendResponse(
        {
          url_to_time: url_to_time,
          classification_to_url: classification_to_url,
        }
      );
    } else if (request.message == 'server_classification') {
      new_classification_to_url = {
        work: $.unique(request['data']['work'].concat(classification_to_url['work'])),
        procrastination: $.unique(request['data']['procrastination'].concat(classification_to_url['procrastination'])),
      };
      classification_to_url = new_classification_to_url;
    } else {
      var url = request.url;
      var classification = request.classification;
      if (!(url in classification_to_url[classification])) {
        var other_classification = classification == 'work' ? 'procrastination' : 'work';
        var other_class_urls = classification_to_url[other_classification];
        if (url in cother_class_urls) {
          other_class_urls.splice(other_class_urls.indexOf(url), 1);
        }
        classification_to_url[classification].push(url);
      }
    }
  }
);

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
