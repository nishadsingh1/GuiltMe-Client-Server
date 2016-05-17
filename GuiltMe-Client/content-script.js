//guiltme.js

var ClassificationsBox = React.createClass({
	displayName: "ClassificationsBox",

	getInitialState: function () {
		return {
			work_urls: this.props.urls.work_urls,
			work_urls_confirmed: this.props.urls.work_urls_confirmed,
			procrastination_urls: this.props.urls.procrastination_urls,
			procrastination_urls_confirmed: this.props.urls.procrastination_urls_confirmed
		};
	},
	handleSwitch: function handleSwitch(url) {
		var work_urls = this.state.work_urls;
		var work_urls_confirmed = this.state.work_urls_confirmed;
		var procrastination_urls = this.state.procrastination_urls;
		var procrastination_urls_confirmed = this.state.procrastination_urls_confirmed;
		var get_classifications = function () {
			if (url in work_urls) {
				return [work_urls, procrastination_urls_confirmed];
			} else if (url in work_urls_confirmed) {
				return [work_urls_confirmed, procrastination_urls_confirmed];
			} else if (url in procrastination_urls) {
				return [procrastination_urls, work_urls_confirmed];
			} else if (url in procrastination_urls_confirmed) {
				return [procrastination_urls_confirmed, work_urls_confirmed];
			}
		};

		var classifications = get_classifications();
		var old_url_classification = classifications[0];
		var new_url_classification = classifications[1];
		var new_url_classification_name = "procrastination_urls_confirmed";
		if (new_url_classification == work_urls_confirmed) {
			new_url_classification_name = "work_urls_confirmed";
		}
		new_url_classification[url] = old_url_classification[url];
		delete old_url_classification[url];
		var new_state = {
			work_urls: work_urls,
			work_urls_confirmed: work_urls_confirmed,
			procrastination_urls: procrastination_urls,
			procrastination_urls_confirmed: procrastination_urls_confirmed
		};
		this.setState(new_state);
		this.updateBackground(new_state);
	},
	updateBackground: function updateBackground(new_state) {
		chrome.runtime.sendMessage({ message: 'update', data: new_state }, function (response) {});
	},
	handleConfirm: function handleConfirm(url) {
		var work_urls = this.state.work_urls;
		var work_urls_confirmed = this.state.work_urls_confirmed;
		var procrastination_urls = this.state.procrastination_urls;
		var procrastination_urls_confirmed = this.state.procrastination_urls_confirmed;
		var new_classification_name;
		if (url in work_urls) {
			work_urls_confirmed[url] = work_urls[url];
			delete work_urls[url];
			new_classification_name = "work_urls_confirmed";
		} else {
			procrastination_urls_confirmed[url] = procrastination_urls[url];
			delete procrastination_urls[url];
			new_classification_name = "procrastination_urls_confirmed";
		}
		var new_state = {
			work_urls: work_urls,
			work_urls_confirmed: work_urls_confirmed,
			procrastination_urls: procrastination_urls,
			procrastination_urls_confirmed: procrastination_urls_confirmed
		};
		this.setState(new_state);
		this.updateBackground(new_state);
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "classificationsBox row" },
			React.createElement(
				"div",
				{ className: "col s5 offset-s1" },
				React.createElement(ClassificationTable, {
					urls: this.state.work_urls,
					urls_confirmed: this.state.work_urls_confirmed,
					classification: "work",
					handleSwitch: this.handleSwitch,
					handleConfirm: this.handleConfirm
				})
			),
			React.createElement(
				"div",
				{ className: "col s5" },
				React.createElement(ClassificationTable, {
					urls: this.state.procrastination_urls,
					urls_confirmed: this.state.procrastination_urls_confirmed,
					classification: "procrastination",
					handleSwitch: this.handleSwitch,
					handleConfirm: this.handleConfirm
				})
			)
		);
	}
});

var ClassificationTable = React.createClass({
	displayName: "ClassificationTable",

	getInitialState: function () {
		return {
			urls: this.props.urls,
			urls_confirmed: this.props.urls_confirmed
		};
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "classificationTable" },
			React.createElement(
				"table",
				{ className: "highlight classificationTable" },
				React.createElement(
					"thead",
					null,
					React.createElement(ClassificationHeader, { classification: this.props.classification })
				),
				React.createElement(UrlList, {
					classification: this.props.classification,
					urls_confirmed: this.state.urls_confirmed,
					urls: this.state.urls,
					handleSwitch: this.props.handleSwitch,
					handleConfirm: this.props.handleConfirm
				})
			)
		);
	}
});

var ClassificationHeader = React.createClass({
	displayName: "ClassificationHeader",

	render: function () {
		return React.createElement(
			"tr",
			null,
			React.createElement(
				"h3",
				null,
				this.props.classification
			)
		);
	}
});

var UrlList = React.createClass({
	displayName: "UrlList",

	getInitialState: function () {
		return {
			urls: this.props.urls,
			urls_confirmed: this.props.urls_confirmed
		};
	},
	render: function () {
		var urls_items = [];
		for (var url in this.state.urls_confirmed) {
			urls_items.push(React.createElement(UrlItem, {
				key: url,
				url: url,
				time: this.state.urls_confirmed[url],
				classification: this.props.classification,
				confirmed: true,
				handleSwitch: this.props.handleSwitch
			}));
		}
		for (var url in this.state.urls) {
			urls_items.push(React.createElement(UrlItem, {
				key: url,
				url: url,
				time: this.state.urls[url],
				classification: this.props.classification,
				confirmed: false,
				handleSwitch: this.props.handleSwitch,
				handleConfirm: this.props.handleConfirm
			}));
		}
		return React.createElement(
			"tbody",
			{ className: "urlList" },
			urls_items
		);
	}
});

var UrlItem = React.createClass({
	displayName: "UrlItem",

	render: function () {
		return React.createElement(
			"tr",
			null,
			React.createElement(UrlItemText, {
				url: this.props.url,
				time: this.props.time
			}),
			React.createElement(UrlItemButtons, {
				confirmed: this.props.confirmed,
				handleSwitch: this.props.handleSwitch,
				handleConfirm: this.props.handleConfirm,
				url: this.props.url
			})
		);
	}
});

var UrlItemButtons = React.createClass({
	displayName: "UrlItemButtons",

	render: function () {
		var buttons = [React.createElement(
			"button",
			{
				onClick: this.props.handleSwitch.bind(null, this.props.url),
				className: "btn-floating btn-small waves-effect waves-light red"
			},
			React.createElement(
				"i",
				{ className: "material-icons" },
				"shuffle"
			)
		)];
		if (!this.props.confirmed) {
			buttons.push(React.createElement(
				"button",
				{
					onClick: this.props.handleConfirm.bind(null, this.props.url),
					className: "btn-floating btn-small waves-effect waves-light green"
				},
				React.createElement(
					"i",
					{ className: "material-icons" },
					"done"
				)
			));
		}
		return React.createElement(
			"td",
			{ className: "urlItemButtons" },
			buttons
		);
	}
});

var UrlItemText = React.createClass({
	displayName: "UrlItemText",

	render: function () {
		return React.createElement(
			"td",
			{ className: "urlItemText" },
			this.props.url,
			": ",
			this.props.time
		);
	}
});

$(document).ready(function () {
	chrome.runtime.sendMessage({ message: "initialize" }, function (response) {
		ReactDOM.render(React.createElement(ClassificationsBox, { urls: response }), document.getElementById('content'));
	});
	chrome.runtime.onMessage.addListener(function (request, sender, func) {
		if (request.message == 'update') {
			ReactDOM.render(React.createElement(ClassificationsBox, { urls: request.data }), document.getElementById('content'));
		}
	});
});

