const React = require('react');

const ClassificationsBox = require('./ClassificationsBox.react');

$( document ).ready(function() {
	chrome.runtime.sendMessage({message: INITIALIZE}, function(response) {
		ReactDOM.render(
					<ClassificationsBox urls={response}/>,
					document.getElementById(ATTACH_ELEMENT_ID)
				);
  	});
  	chrome.runtime.onMessage.addListener(function(request, sender, func) {
  		if (request.message == UPDATE) {
  			ReactDOM.render(
					<ClassificationsBox urls={request.data}/>,
					document.getElementById(ATTACH_ELEMENT_ID)
				);
  		}
  	});
});

