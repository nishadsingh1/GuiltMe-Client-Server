$(document).ready(function() {
	$('#signup').show();
	// $('#message').fadeTo(0,0);
	var buttons = [
		$('#first_name'), $('#last_name'), $('#grad_year'), $('#grad_sem'), $('#email'), $('#majors')
	];

	var submit_button = $('#submit_button');

    update_submit = function() {
    	var curr_class = submit_button.attr('class');
    	submit_button.removeClass(curr_class);
    	if (all_valid()) {
			submit_button.addClass('btn')
    	} else {
    		submit_button.addClass('btn disabled')
    	}
    };

    all_valid = function(){
    	var valid = true;
    	var len = buttons.length;
    	console.log('hello');
    	for (i =0; i < len; i++) {
    		if (buttons[i].attr('class') != 'validate valid') {
    			valid = false;
    		}
    	}
    	return valid;
    }
    
    var len = buttons.length;
	for (i =0; i < len; i++) {	
		var button = buttons[i];
		$(document).on('change', button.id, function(){
    		update_submit();
		});
	}
  var url = "http://bc-sheets.herokuapp.com/mailing_list";
  $(submit_button).click(function() {
  	if (submit_button.attr('class') == 'btn disabled') {
  		return false;
  	}
  	var first = $("#first_name").val();
    data = {
      "first_name": first,
      "last_name": $('#last_name').val(),
      "email": $('#email').val(),
      "major": $('#majors').val(),
      "graduation_year": $('#grad_year').val(),
      "graduation_semester": $('#grad_sem').val(),
    };
    $.ajax({type: "POST", url: url, data: data, success: function (response) {}, dataType: "json"});

	$('#signup')[0].reset();
	$('#message').fadeTo(500,0);
	setTimeout(function(){
		$('#app_text').html("We'll be in contact, " + first);
    	$('#message').fadeTo(1000,1);
    }, 500);
    
    setTimeout(function(){
    	$('#message').fadeTo(1000,0);
    	Materialize.updateTextFields();
    	update_submit();
    	setTimeout(function(){
	    	$('#app_text').html("Let's keep in touch");
			$('#message').fadeTo(1000,1);
		}, 1000);
	}, 2000);

	

    return false;
  });

});

