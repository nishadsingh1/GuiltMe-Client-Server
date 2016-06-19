const React = require('react');

const ClassificationsBox = require('./ClassificationsBox.react');

$( document ).ready(function() {
	const attachElement = document.getElementById(ATTACH_ELEMENT_ID);
	chrome.runtime.sendMessage({message: INITIALIZE}, function(response) {
		ReactDOM.render(
			<ClassificationsBox urls={response}/>,
			attachElement
		);
  });
	chrome.runtime.onMessage.addListener(function(request, sender, func) {
		if (request.message == UPDATE) {
			ReactDOM.render(
				<ClassificationsBox urls={request.data}/>,
				attachElement
			);
		}
	});
});
