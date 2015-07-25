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
var urls;
var work_domains = {};
var procrastination_domains = {};

var switch_button_class = "btn btn-success";
var keep_button_class = "btn btn-primary";
var cemented_button_class = "btn btn-primary";
var row_class = 'default';
var domain_class = 'success';
var hash = function(string) {
    var hash = 0, i, chr, len;
    if (string.length == 0) return hash;
    for (i = 0, len = string.length; i < len; i++) {
      chr   = string.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var Domain = function(name, classification) {
  this.name = name,
  this.classification = classification,
  this.id = hash(this.name + this.classification),
  this.url_rows = [],
  this.table = $('#' + this.classification + '_table'),
  this.get_formatted_time = function() {
    var sum = 0;
    for(i = 0; i < this.url_rows.length; i++) {
      var row = this.url_rows[i];
      sum += row.time;
    }
    return format_time(sum);
  },

  this.dom_object = function() {
    return $('#'+this.id);
  },

  this.set_time = function() {
    $(this.dom_object().find('td').get(1)).html(this.get_formatted_time());
  },

  this.generate_html = function() {
    var row = $(
      '<tr class=' + domain_class + ' id=' + this.id + '><td>' +
      this.name + '</td><td name="time">' +
      this.get_formatted_time() + '</td></tr>'
    );

    var hide_button = $('<button type="button" class="btn btn-default">Hide</button>');
    var show_button = $('<button type="button" class="btn btn-default">Show</button>');

    var rows = this.url_rows;

    hide_button.click(function() {
      hide_button.hide();
      show_button.show();
      for(i = 0; i < rows.length; i++) {
        rows[i].dom_object().hide();
      }
    });

    show_button.click(function() {
      hide_button.show();
      show_button.hide();
      for(i = 0; i < rows.length; i++) {
        rows[i].dom_object().show();
      }
    });

    
    lastColumn = $('<td></td>');
    hide_button.appendTo(lastColumn);
    show_button.appendTo(lastColumn);
    lastColumn.appendTo(row);
    show_button.hide();

    this.table.find('tbody').append(row);
  }
};

var Row = function(url, domain) {
  this.url = url,
  this.get_formatted_url = function() {
    var cuttoff_index = this.url.indexOf(this.get_domain().name) + this.get_domain().name.length;
    var row_name = this.url.substring(cuttoff_index);
    if (row_name.length < 35) {
      return row_name;
    } else {
      return row_name.substring(0,35);
    }
  },
  this.time = url_to_time[url],
  this.id = hash(this.url),
  this.formatted_time = format_time(this.time),
  this.domain = domain,
  this.get_domain = function() {
    return this.domain;
  },
  this.get_classification = function() {
    return this.domain.classification;
  },
  this.get_table = function() {
    return this.domain.table;
  },
  this.dom_object = function() {
    return $('#'+this.id);
  },

  this.generate_html = function(fromSwitch) {
    var row_object = $(
      '<tr class=' + row_class + ' id=' + this.id + '><td>' +
      '<a href=""'+this.url+'">' + this.get_formatted_url() + '</a></td><td>' +
      this.formatted_time + '</td></tr>'
    );

    var keep_button = $('<button type="button" class="'+keep_button_class+'">Keep</button>');
    var switch_button = $('<button type="button" class="'+switch_button_class+'">Switch</button>');
    var cement_button = $('<button type="button" disabled="true" class="'+cemented_button_class+'">Keep</button>');

    var classification = this.get_classification();
    var other_classification = classification == 'work' ? 'procrastination' : 'work'
 
    var keep_success = function() {
      keep_button.hide();
      cement_button.show();
    }
    keep_button.click(function() {
      $.ajax({type: "POST", url: server_datapoint_url, data: {url: "http://www.google.com", classification: classification }, success: keep_success});
    });

    switch_button.click(function() {
      $.ajax({type: "POST", url: server_datapoint_url, data: {url: "http://www.google.com", classification: other_classification }, success: switch_success});
    });
    
    var me = this;

    var switch_success = function() {
      var old_domain = me.get_domain();
      var mapping = classification == 'work' ? work_domains : procrastination_domains;
      var other_mapping = classification == 'work' ? procrastination_domains : work_domains;
      old_domain.url_rows.splice(old_domain.url_rows.indexOf(this), 1);

      var domain_name = old_domain.name;
      if (old_domain.url_rows.length == 0) {
        old_domain.dom_object().remove();
        delete mapping[domain_name];
      }
      me.dom_object().remove();

      old_domain.set_time();

      var other_mapping = classification == 'work' ? procrastination_domains : work_domains;
      if (!(domain_name in other_mapping)) {
        other_mapping[domain_name] = (new Domain(domain_name, other_classification));
        other_mapping[domain_name].generate_html();
      }
      var domain = other_mapping[domain_name];
      me.domain = domain;
      domain.url_rows.push(me);
      me.generate_html(true);
      domain.set_time()
    };

    keep_button.appendTo(row_object);
    cement_button.appendTo(row_object);
    switch_button.appendTo(row_object);
    cement_button.hide();

    this.get_table().find('tbody').append(row_object);

    if (fromSwitch) {
      keep_success();
    }
  }
};

var send_request = function(){
  var data = {"history": urls};
  $.ajax({type: "POST", url: server_classify_url, data: data, success: success, dataType: "json"});
};

var get_domain_name = function(url){
  hostname = new URL(url).hostname;
  hostname = hostname.replace(/^www./,'');
  return hostname;
};

var success = function(response) {
  result = response;
  create_rows('work', work_domains);
  create_rows('procrastination', procrastination_domains);

  for(domain_name in work_domains) {
    var domain = work_domains[domain_name]
    domain.generate_html();
    for (i = 0; i < domain.url_rows.length; i ++) {
      domain.url_rows[i].generate_html(false);
    }
  }

  for(domain_name in procrastination_domains) {
    var domain = procrastination_domains[domain_name]
    domain.generate_html();
    for (i = 0; i < domain.url_rows.length; i ++) {
      domain.url_rows[i].generate_html(false);
    }
  }
};

var create_rows = function (classification, mapping) {
  url_list = result[classification];
  for(i = 0; i < url_list.length; i++) {
    var url = url_list[i];
    var domain_name = get_domain_name(url);
    if (!(domain_name in mapping)) {
      mapping[domain_name] = (new Domain(domain_name, classification));
    }
    var domain = mapping[domain_name];
    var row = new Row(url, domain);
    domain.url_rows.push(row);
  }
};

var format_time = function (secs) {
  var hours = Math.floor(secs / (60 * 60));
  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);
  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);
  var time = "";
  if (hours > 0){time += hours + "h ";}
  if (minutes > 0){time += minutes + "m ";}
  if (seconds > 0){time += seconds + "s";}
  return time;
};
