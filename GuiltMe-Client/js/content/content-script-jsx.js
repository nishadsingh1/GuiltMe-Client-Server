//guiltme.js
var ClassificationsBox = React.createClass({
	getInitialState: function() {
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
		var get_classifications = function() {
			if (url in work_urls) {
				return [work_urls, procrastination_urls_confirmed];
			} else if (url in work_urls_confirmed) {
				return [work_urls_confirmed, procrastination_urls_confirmed];
			} else if (url in procrastination_urls) {
				return [procrastination_urls, work_urls_confirmed];
			} else if (url in procrastination_urls_confirmed) {
				return [procrastination_urls_confirmed, work_urls_confirmed];
			}
		}

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
		chrome.runtime.sendMessage({message: 'update', data: new_state}, function(response) {});
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
	onUrlItemSelect: function onUrlItemSelect(url) {
		console.log(url + " was clicked!");
	},
	render: function() {
		return (
			<div className="classificationsBox row">
					<div className="col s5 offset-s1">
						<ClassificationTable
							onUrlItemSelect={this.onUrlItemSelect}
							urls={this.state.work_urls}
							urls_confirmed={this.state.work_urls_confirmed}
							classification="work"
							handleSwitch={this.handleSwitch}
							handleConfirm={this.handleConfirm}
						/>
					</div>
					<div className="col s5">
						<ClassificationTable
							onUrlItemSelect={this.onUrlItemSelect}
							urls={this.state.procrastination_urls}
							urls_confirmed={this.state.procrastination_urls_confirmed}
							classification="procrastination"
							handleSwitch={this.handleSwitch}
							handleConfirm={this.handleConfirm}
						/>
					</div>
			</div>
		);
	}
});

var ClassificationTable = React.createClass({
	getInitialState: function() {
		return {
			urls: this.props.urls,
			urls_confirmed: this.props.urls_confirmed,
		};
	},
	render: function() {
		return (
			<div className="classificationTable">
				<table className="highlight classificationTable">
					<thead>
							<ClassificationHeader classification={this.props.classification} />
					</thead>
					<UrlList
						onUrlItemSelect={this.props.onUrlItemSelect}
						classification={this.props.classification}
						urls_confirmed={this.state.urls_confirmed}
						urls={this.state.urls}
						handleSwitch={this.props.handleSwitch}
						handleConfirm={this.props.handleConfirm}
					/>
				</table>
			</div>
		);
	}
});

var ClassificationHeader = React.createClass({
	render: function() {
		return (
			<tr className="classificationHeaderText">
				{this.props.classification}
			</tr>
		);
	}
});

var UrlList = React.createClass({
	getInitialState: function() {
		return {
			urls: this.props.urls,
			urls_confirmed: this.props.urls_confirmed,
		};
	},
	render: function() {
		var urls_items = [];
		for(var url in this.state.urls_confirmed) {
			urls_items.push (
				<UrlItem
					key={url}
					url={url}
					time={this.state.urls_confirmed[url]}
					classification={this.props.classification}
					confirmed={true}
					onClick={this.props.onUrlItemSelect.bind(null, url)}
					handleSwitch={this.props.handleSwitch}
				/>
			);
		}
		for(var url in this.state.urls) {
			urls_items.push (
					<UrlItem
						key={url}
						url={url}
						time={this.state.urls[url]}
						classification={this.props.classification}
						confirmed={false}
						onClick={this.props.onUrlItemSelect.bind(null, url)}
						handleSwitch={this.props.handleSwitch}
						handleConfirm={this.props.handleConfirm}
					/>
			);
		}
		return (
			<tbody className="urlList">
				{urls_items}
			</tbody>
		);
	}
});

var UrlItem = React.createClass({
	render: function() {
		return (
			<tr onClick={this.props.onClick}>
				<UrlItemText
					url={this.props.url}
					time={this.props.time}
				/>
				<br />
				<UrlItemButtons
					confirmed={this.props.confirmed}
					handleSwitch={this.props.handleSwitch}
					handleConfirm={this.props.handleConfirm}
					url={this.props.url}
				/>
			</tr>
		);
	}
});

var UrlItemButtons = React.createClass({
	render: function() {
		var buttons = [
			<button
				onClick={this.props.handleSwitch.bind(null, this.props.url)}
				className="btn-floating btn-small waves-effect waves-light"
			>
				<i className="material-icons">repeat</i>
			</button>
		];
		if (!this.props.confirmed) {
			buttons.push (
				<button
						onClick={this.props.handleConfirm.bind(null, this.props.url)}
						className="btn-floating btn-small waves-effect waves-light green"
					>
						<i className="material-icons">done</i>
					</button>
			);
		}
		return (
			<td className="urlItemButtons">
				{buttons}
			</td>
		);
	}
});

var UrlItemText = React.createClass({
	render: function() {
		return (
			<td className="urlItemText">
				<UrlItemUrlText url={this.props.url} />
				<br />
				<UrlItemTimeText time={this.props.time} />
			</td>
		);
	}
});

var UrlItemUrlText = React.createClass({
	render: function() {
		return (
			<span className="urlItemUrlText">
				{this.props.url}
			</span>
		)
	}
});

var UrlItemTimeText = React.createClass({
	render: function() {
		return (
			<span className="urlItemTimeText">
				{this.props.time}
			</span>
		)
	}
});


$( document ).ready(function() {
	chrome.runtime.sendMessage({message: "initialize"}, function(response) {
		ReactDOM.render(
					<ClassificationsBox urls={response}/>,
					document.getElementById('content')
				);
  	});
  	chrome.runtime.onMessage.addListener(function(request, sender, func) {
  		if (request.message == 'update') {
  			ReactDOM.render(
					<ClassificationsBox urls={request.data}/>,
					document.getElementById('content')
				);
  		}
  	});
});
// ../../node_modules/.bin/babel content-script-jsx.js > content-script.js

