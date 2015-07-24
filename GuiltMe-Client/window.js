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
var domain_to_url;
var domain_to_time;
var domain_to_productivity;

var send_request = function(){
  var data = {"history": urls};
  $.ajax({type: "POST", url: server_classify_url, data: data, success: success, dataType: "json"});
  sort_by_domain();
};

var sort_by_domain = function(){
  domain_to_url = {};
  domain_to_time = {};
  domains = [];
  for (var i = 0; i < urls.length; i++){
    var url = urls[i];
    var domain = get_domain(url);
    if (domain_to_url[domain] == undefined) {
      domains.push(domain);
      domain_to_url[domain] = [];
      domain_to_time[domain] = 0;
    }
    domain_to_url[domain].push(url);
    domain_to_time[domain] += url_to_time[url];
  }
};

var person =  function (first, last, age, eye) {
  this.firstName = first;
  this.lastName = last;
  this.age = age;
  this.eyeColor = eye;
};

var myFather = new person("John", "Doe", 50, "blue");

var get_domain = function(url){
  return new URL(url).hostname
};

var set_domain_productivity = function() {
  domain_to_productivity = {};
  for (var i = 0; i < domains.length; i++){
    var domain = domains[i];
    var counts = {work: 0, procrastination: 0};
    var urls = domain_to_url[domain];
    for (var j = 0; j < urls.length; j++){
      var url = urls[j];
      var classification = result[url];
      counts[classification] += 1;
    }
    domain_to_productivity[domain] = counts;
  }
};

var success = function(response) {
  result = response;
  set_domain_productivity();
  var rowId = 0;
  for (var i = domains.length - 1; i >= 0; i--) {
    var domain = domains[i];
    add_domain_row(domain, format_time(domain),i);
    var urls = domain_to_url[domain];
    for (var j = 0; j < urls.length; j++) {
      var url = urls[j];
      var timeSpent = format_time(url);
      var productivity = result[url];
      add_url_row(url, timeSpent, productivity, rowId, i);
      rowId++;
    }
  }
};

var get_probability =  function(domain) {
  var counts = domain_to_productivity[domain];
  return (100 * counts.work / (counts.work + counts.procrastination)).toFixed(0)
};

var format_productivity = function(domain) {
  return get_probability(domain) + "%";
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

var add_domain_row =  function(name, timeSpent, domain_id) {
  var productivity = get_probability(name);
  var row_class = productivity > 50 ? "info" : "success";
  $("#myTable").find('tbody').append(
    $('<tr class=' + row_class + ' id=domain' + domain_id + '><td>' +
      name + '</td><td>' +
      timeSpent + '</td><td>' +
      format_productivity(name) + '</td></tr>'
  ));
};

var add_url_row =  function(url, timeSpent, productivity, rowId, domain_id) {
  var work_button_class = productivity == "work" ? "btn btn-primary" : "btn btn-default";
  var procrastination_button_class = productivity == "procrastination" ? "btn btn-success" : "btn btn-default";
  var work_button = $('<button type="button" class="'+work_button_class+'">Work</button>');
  var procrastination_button = $('<button type="button" class="'+procrastination_button_class+'">Procrastination</button>');
  var success_function = reclassify_success(work_button, procrastination_button, domain_id);
  work_button.click(function() {
    $.ajax({type: "POST", url: server_datapoint_url, data: {url: url, classification: "work"}, success: success_function, dataType: "json"});

  });
  procrastination_button.click(function() {
    $.ajax({type: "POST", url: server_datapoint_url, data: {url: url, classification: "procrastination"}, success: success_function, dataType: "json"});
  });
  var truncated_url = url.length > 100 ? url.substring(0, 100) + "..." : url
  $("#myTable").find('tbody').append(
    $('<tr><td>' +'<a href="' +
      url + '">' + truncated_url + '</a></td><td>' +
      timeSpent + '</td><td id =' + rowId + '></td></tr>'
  ));

  work_button.appendTo($("#"+rowId));
  procrastination_button.appendTo($("#"+rowId));
};

var reclassify_success =  function(work_button, procrastination_button, domain_id) {
  return function(result){
    result[result.url] = result.classification;
    var domain_row = $('#domain' + domain_id);
    var domain = domain_row.children()[0].textContent;
    var productivity = domain_row.children()[2].textContent;
    var counts = domain_to_productivity[domain];
    if (result.classification == "work") {
      if (work_button.attr('class') == "btn btn-default") {
        work_button.removeClass('btn btn-default').addClass('btn btn-primary');
        procrastination_button.removeClass('btn btn-success').addClass('btn btn-default');
        counts.work ++;
        counts.procrastination --;
      }
    } else {
      if (work_button.attr('class') == "btn btn-primary") {
        work_button.removeClass('btn btn-primary').addClass('btn btn-default');
        procrastination_button.removeClass('btn btn-default').addClass('btn btn-success');
        counts.work --;
        counts.procrastination ++;
      }
    }
    var probability = get_probability(domain);
    var row_class = domain_row.attr('class');
    if (probability < 50){
      domain_row.removeClass(row_class).addClass('success');
    } else {
      domain_row.removeClass(row_class).addClass('info');
    }
    $(domain_row.children()[2]).html(format_productivity(domain));
  }
};
