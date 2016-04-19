//guiltme.js

var ClassificationsBox = React.createClass({
	getInitialState: function() {
		return {
			work_urls: {"www.wikiepdia.org": "1 hour 3 minutes", "www.google.com": "27 minutes"},
			work_urls_confirmed: {"www.berkeley.edu": "1 hour 17 minutes", "www.hyperphysics.org": "12 minutes"},
			procrastination_urls: {"www.reddit.com": "7 hours 20 minutes", "na.lolesports.com": "45 minutes"},
			procrastination_urls_confirmed: {"www.facebook.com": "2 hours 3 minutes", "www.airbnb.com": "2 minutes"}
		};
	},
	handleSwitch: function (url) {
		var work_urls = this.state.work_urls;
		var work_urls_confirmed = this.state.work_urls_confirmed;
		var procrastination_urls = this.state.procrastination_urls;
		var procrastination_urls_confirmed = this.state.procrastination_urls_confirmed;
		if (url in work_urls) {
			procrastination_urls_confirmed[url] = work_urls[url];
			delete work_urls[url];
		} else if (url in work_urls_confirmed) {
			procrastination_urls_confirmed[url] = work_urls_confirmed[url];
			delete work_urls_confirmed[url];
		} else if (url in procrastination_urls) {
			work_urls_confirmed[url] = procrastination_urls[url];
			delete procrastination_urls[url];
		} else if (url in procrastination_urls_confirmed) {
			work_urls_confirmed[url] = procrastination_urls_confirmed[url];
			delete procrastination_urls_confirmed[url];
		}
		this.setState({
			work_urls: work_urls,
			work_urls_confirmed: work_urls_confirmed,
			procrastination_urls: procrastination_urls,
			procrastination_urls_confirmed: procrastination_urls_confirmed,
		});
	},
	handleConfirm: function(url) {
		var work_urls = this.state.work_urls;
		var work_urls_confirmed = this.state.work_urls_confirmed;
		var procrastination_urls = this.state.procrastination_urls;
		var procrastination_urls_confirmed = this.state.procrastination_urls_confirmed;
		if (url in work_urls) {
			work_urls_confirmed[url] = work_urls[url];
			delete work_urls[url];
		} else {
			procrastination_urls_confirmed[url] = procrastination_urls[url];
			delete procrastination_urls[url];
		}
		this.setState({
			work_urls: work_urls,
			work_urls_confirmed: work_urls_confirmed,
			procrastination_urls: procrastination_urls,
			procrastination_urls_confirmed: procrastination_urls_confirmed,
		});
	},
	render: function() {
		return (
			<div className="classificationsBox row">
					<div className="col s5 offset-s1">
						<ClassificationTable
							urls={this.state.work_urls}
							urls_confirmed={this.state.work_urls_confirmed}
							classification="work"
							handleSwitch={this.handleSwitch}
							handleConfirm={this.handleConfirm}
						/>
					</div>
					<div className="col s5">
						<ClassificationTable
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
				<table className="highlight">
					<thead>
							<ClassificationHeader classification={this.props.classification} />
					</thead>
					<UrlList
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
			<tr>
				<h3>
					{this.props.classification}
				</h3>
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
		var urls_confirmed_items = [];
		var urls_items = [];
		for(var url in this.state.urls_confirmed) {
			urls_confirmed_items.push (
				<tr>
					<UrlItemConfirmed
						key={url}
						url={url}
						time={this.state.urls_confirmed[url]}
						classification={this.props.classification}
						confirmed={true}
						handleSwitch={this.props.handleSwitch}
					/>
				</tr>
			);
		}
		for(var url in this.state.urls) {
			urls_items.push (
				<tr>
					<UrlItem
						key={url}
						url={url}
						time={this.state.urls[url]}
						classification={this.props.classification}
						confirmed={false}
						handleSwitch={this.props.handleSwitch}
						handleConfirm={this.props.handleConfirm}
					/>
				</tr>
			);
		}
		return (
			<tbody className="urlList">
				{urls_items}
				{urls_confirmed_items}
			</tbody>
		);
	}
});

var UrlItem = React.createClass({
	render: function() {
		return (
			<td className="urlItem">
				{this.props.url}: {this.props.time}
					<button
						onClick={this.props.handleSwitch.bind(null, this.props.url)}
						className="btn-floating btn-small waves-effect waves-light red"
					>
						<i className="material-icons">shuffle</i>
					</button>
					<button
						onClick={this.props.handleConfirm.bind(null, this.props.url)}
						className="btn-floating btn-small waves-effect waves-light green"
					>
						<i className="material-icons">done</i>
					</button>
			</td>
		);
	}
});

var UrlItemConfirmed = React.createClass({
	render: function() {
		return (
			<td className="urlItem">
				{this.props.url}: {this.props.time}
				<button
					onClick={this.props.handleSwitch.bind(null, this.props.url)}
					className="btn-floating btn-small waves-effect waves-light red right-align"
				>
					<i className="material-icons">shuffle</i>
				</button>
				
			</td>
		);	
	}
});

ReactDOM.render(
	<ClassificationsBox />,
	document.getElementById('content')
);
