const new_tab_url = "chrome://newtab/";
const server_classify_url = "http://localhost:3000/classify_url"

let last_time = new Date().getTime() / 1000;
let last_url = new_tab_url;
let procrastination_urls = {}
let procrastination_urls_confirmed = {}
let work_urls = {}
let work_urls_confirmed = {}

function extractDomain(url) {
    let domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    return domain;
}

const current_classification = function(url) {
  if (url in work_urls) {
    return work_urls;
  } else if (url in work_urls_confirmed) {
    return work_urls_confirmed;
  } else if (url in procrastination_urls) {
    return procrastination_urls;
  } else if (url in procrastination_urls_confirmed) {
    return procrastination_urls_confirmed;
  } else {
    return null;
  }
}

const update = function(current_url) {
  current_url = extractDomain(current_url);
  const now = new Date().getTime() / 1000;
  const difference = now - last_time;
  url_classification = current_classification(last_url);
  if (url_classification == null) {
    const handle_classification_response = function(response) {
      classification = response["classification"];
      if (classification == "work") {
        work_urls[last_url] = difference;
      } else {
        procrastination_urls[last_url] = difference;;
      }
    }
    $.ajax({
      url: server_classify_url + '?url=' + last_url,
      success: handle_classification_response,
      dataType: "json"
    });
  } else {
    current_classification[last_url] = current_classification[last_url] + difference;
  }
  last_url = current_url;
  last_time = now;
};

chrome.runtime.onMessage.addListener( 
  function(request, sender, sendResponse) {
    if (request.message == INITIALIZE) {
      // delete current_classification("chrome://newtab/")["chrome://newtab/"];
      sendResponse(
        {
          work_urls: work_urls,
          work_urls_confirmed: work_urls_confirmed,
          procrastination_urls: procrastination_urls,
          procrastination_urls_confirmed: procrastination_urls_confirmed,
        }
      );
    } else if (request.message == UPDATE) {
      work_urls = request.data.work_urls;
      procrastination_urls = request.data.procrastination_urls;
      procrastination_urls_confirmed = request.data.procrastination_urls_confirmed;
      work_urls_confirmed = request.data.work_urls_confirmed;
    }
  }
);

chrome.tabs.onActivated.addListener(function(activeInfo){
  const tabId = activeInfo.tabId;
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
    let tab;
    for(i=0; i< window.tabs.length; i++){
      tab = window.tabs[i];
      if(tab.active){
        update(tab.url);
      }
    }
  });
});
