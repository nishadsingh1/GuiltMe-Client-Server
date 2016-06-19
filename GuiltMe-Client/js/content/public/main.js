/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	var ClassificationsBox = __webpack_require__(2);

	$(document).ready(function () {
		var attachElement = document.getElementById(ATTACH_ELEMENT_ID);
		chrome.runtime.sendMessage({ message: INITIALIZE }, function (response) {
			ReactDOM.render(React.createElement(ClassificationsBox, { urls: response }), attachElement);
		});
		chrome.runtime.onMessage.addListener(function (request, sender, func) {
			if (request.message == UPDATE) {
				ReactDOM.render(React.createElement(ClassificationsBox, { urls: request.data }), attachElement);
			}
		});
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	var ClassificationTable = __webpack_require__(3);

	var ClassificationsBox = React.createClass({
		displayName: 'ClassificationsBox',

		handleSwitch: function handleSwitch(url) {
			var work_urls = this.props.urls.work_urls;
			var work_urls_confirmed = this.props.urls.work_urls_confirmed;
			var procrastination_urls = this.props.urls.procrastination_urls;
			var procrastination_urls_confirmed = this.props.urls.procrastination_urls_confirmed;

			var get_old_and_new_url_classification = function get_old_and_new_url_classification() {
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

			var classifications = get_old_and_new_url_classification();
			var old_url_classification = classifications[0];
			var new_url_classification = classifications[1];

			new_url_classification[url] = old_url_classification[url];
			delete old_url_classification[url];

			this.update({
				work_urls: work_urls,
				work_urls_confirmed: work_urls_confirmed,
				procrastination_urls: procrastination_urls,
				procrastination_urls_confirmed: procrastination_urls_confirmed
			});
		},
		update: function update(new_state) {
			chrome.runtime.sendMessage({ message: UPDATE, data: new_state }, function (response) {});
		},
		handleConfirm: function handleConfirm(url) {
			var work_urls = this.props.urls.work_urls;
			var work_urls_confirmed = this.props.urls.work_urls_confirmed;
			var procrastination_urls = this.props.urls.procrastination_urls;
			var procrastination_urls_confirmed = this.props.urls.procrastination_urls_confirmed;
			var new_classification_name = undefined;
			if (url in work_urls) {
				work_urls_confirmed[url] = work_urls[url];
				delete work_urls[url];
				new_classification_name = "work_urls_confirmed";
			} else {
				procrastination_urls_confirmed[url] = procrastination_urls[url];
				delete procrastination_urls[url];
				new_classification_name = "procrastination_urls_confirmed";
			}
			this.update({
				work_urls: work_urls,
				work_urls_confirmed: work_urls_confirmed,
				procrastination_urls: procrastination_urls,
				procrastination_urls_confirmed: procrastination_urls_confirmed
			});
		},
		onUrlItemSelect: function onUrlItemSelect(url) {
			console.log(url + " was clicked!");
			/* TODO: update this to open up side panel */
		},
		render: function render() {
			console.log(this.state);
			return React.createElement(
				'div',
				{ className: 'classificationsBox row' },
				React.createElement(
					'div',
					{ className: 'col s5 offset-s1' },
					React.createElement(ClassificationTable, {
						onUrlItemSelect: this.onUrlItemSelect,
						urls: this.props.urls.work_urls,
						urls_confirmed: this.props.urls.work_urls_confirmed,
						classification: 'work',
						handleSwitch: this.handleSwitch,
						handleConfirm: this.handleConfirm
					})
				),
				React.createElement(
					'div',
					{ className: 'col s5' },
					React.createElement(ClassificationTable, {
						onUrlItemSelect: this.onUrlItemSelect,
						urls: this.props.urls.procrastination_urls,
						urls_confirmed: this.props.urls.procrastination_urls_confirmed,
						classification: 'procrastination',
						handleSwitch: this.handleSwitch,
						handleConfirm: this.handleConfirm
					})
				)
			);
		}
	});

	module.exports = ClassificationsBox;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	var ClassificationHeader = __webpack_require__(4);
	var UrlList = __webpack_require__(5);

	var ClassificationTable = React.createClass({
		displayName: 'ClassificationTable',

		render: function render() {
			return React.createElement(
				'div',
				{ className: 'classificationTable' },
				React.createElement(
					'table',
					{ className: 'highlight classificationTable' },
					React.createElement(
						'thead',
						null,
						React.createElement(ClassificationHeader, { classification: this.props.classification })
					),
					React.createElement(UrlList, {
						onUrlItemSelect: this.props.onUrlItemSelect,
						classification: this.props.classification,
						urls_confirmed: this.props.urls_confirmed,
						urls: this.props.urls,
						handleSwitch: this.props.handleSwitch,
						handleConfirm: this.props.handleConfirm
					})
				)
			);
		}
	});

	module.exports = ClassificationTable;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(1);

	var ClassificationHeader = React.createClass({
		displayName: "ClassificationHeader",

		render: function render() {
			return React.createElement(
				"tr",
				{ className: "classificationHeaderText" },
				this.props.classification
			);
		}
	});

	module.exports = ClassificationHeader;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var UrlItem = __webpack_require__(6);

	var UrlList = React.createClass({
		displayName: 'UrlList',

		render: function render() {
			var urls_items = [];
			var url = undefined;
			var i = 0;
			for (url in this.props.urls_confirmed) {
				urls_items.push(React.createElement(UrlItem, {
					key: i,
					url: url,
					time: this.props.urls_confirmed[url],
					classification: this.props.classification,
					confirmed: true,
					onClick: this.props.onUrlItemSelect.bind(null, url),
					handleSwitch: this.props.handleSwitch
				}));
				i += 1;
			}
			for (url in this.props.urls) {
				urls_items.push(React.createElement(UrlItem, {
					key: i,
					url: url,
					time: this.props.urls[url],
					classification: this.props.classification,
					confirmed: false,
					onClick: this.props.onUrlItemSelect.bind(null, url),
					handleSwitch: this.props.handleSwitch,
					handleConfirm: this.props.handleConfirm
				}));
				i += 1;
			}
			return React.createElement(
				'tbody',
				{ className: 'urlList' },
				urls_items
			);
		}
	});

	module.exports = UrlList;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	var UrlItemButtons = __webpack_require__(7);
	var UrlItemText = __webpack_require__(8);

	var UrlItem = React.createClass({
		displayName: 'UrlItem',

		render: function render() {
			return React.createElement(
				'tr',
				{ onClick: this.props.onClick },
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

	module.exports = UrlItem;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(1);

	var UrlItemButtons = React.createClass({
		displayName: "UrlItemButtons",

		render: function render() {
			var buttons = [React.createElement(
				"button",
				{
					key: "switch",
					onClick: this.props.handleSwitch.bind(null, this.props.url),
					className: "btn-floating btn-small waves-effect waves-light"
				},
				React.createElement(
					"i",
					{ className: "material-icons" },
					"repeat"
				)
			)];
			if (!this.props.confirmed) {
				buttons.push(React.createElement(
					"button",
					{
						key: "confirm",
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

	module.exports = UrlItemButtons;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	var UrlItemUrlText = __webpack_require__(9);
	var UrlItemTimeText = __webpack_require__(10);

	var UrlItemText = React.createClass({
		displayName: 'UrlItemText',

		render: function render() {
			return React.createElement(
				'td',
				{ className: 'urlItemText' },
				React.createElement(UrlItemUrlText, { url: this.props.url }),
				React.createElement('br', null),
				React.createElement(UrlItemTimeText, { time: this.props.time })
			);
		}
	});

	module.exports = UrlItemText;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(1);

	var UrlItemUrlText = React.createClass({
		displayName: "UrlItemUrlText",

		render: function render() {
			return React.createElement(
				"span",
				{ className: "urlItemUrlText" },
				this.props.url
			);
		}
	});

	module.exports = UrlItemUrlText;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(1);

	var UrlItemTimeText = React.createClass({
		displayName: "UrlItemTimeText",

		render: function render() {
			return React.createElement(
				"span",
				{ className: "urlItemTimeText" },
				this.props.time
			);
		}
	});

	module.exports = UrlItemTimeText;

/***/ }
/******/ ]);