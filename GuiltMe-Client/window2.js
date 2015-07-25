$(document).ready(function() {
  chrome.runtime.sendMessage({message: "send_request"}, function(response) {
  	url_to_time = response;
    urls = Object.keys(url_to_time);
  	send_request();
  });
});

var server_classify_url =  "http://localhost:3000/classify";
var server_datapoint_url =  "http://localhost:3000/datapoint";
var result;
var url_to_time;
var work_domains;
var productivity_domains;

var Domain = function(domain_name, classification, ) {
  this.domain_name = domain_name,
  this.classification,
  this.url_rows = {},
};

var Row = function(url, domain) {
  this.url = url,
  this.time = url_to_time[url],
  this.domain = domain,
  this.classification = domain.classification,

  this.generate

};

var send_request = function(){
  var data = {"history": urls};
  $.ajax({type: "POST", url: server_classify_url, data: data, success: success, dataType: "json"});
};

var myFather = new person("John", "Doe", 50, "blue");

var get_domain_name = function(url){
  return new URL(url).hostname
};

var success = function(response) {
  result = response;
  
  work_domains = {};
  productivity_domains = {};
  create_rows(work_domain, 'work');
  create_rows(productivity_domains, 'productivity');

  for domain in work_domains {
    domain.generate_html();
  }
    
  for domain in productivity_domains {
    domain.generate_html();
  }
};

var create_rows = function (domain_list, classification) {
  url_list = result[classification];
  for(url in url_list) {
    if domain_list does not contain url:
      create a new domain with domain get_domain_name(url) and pass in classification
    domain = get_domain(url)
    row = create a new row with url url
    add row to domain
  }
};

var format_time = function (name) {
  var secs = domain_to_time[name] || url_to_time[name];
  var hours = Math.floor(secs / (60 * 60));
  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);
  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);
  var time = ""
  if (hours > 0){time += hours + "h ";}
  if (minutes > 0){time += minutes + "m ";}
  if (seconds > 0){time += seconds + "s";}
  return time;
};
