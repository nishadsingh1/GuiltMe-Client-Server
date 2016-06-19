const React = require('react');

const ClassificationTable = require('./ClassificationTable.react')

const ClassificationsBox = React.createClass({
	handleSwitch: function(url) {
		const work_urls = this.props.urls.work_urls;
		const work_urls_confirmed = this.props.urls.work_urls_confirmed;
		const procrastination_urls = this.props.urls.procrastination_urls;
		const procrastination_urls_confirmed = this.props.urls.procrastination_urls_confirmed;

		const get_old_and_new_url_classification = function() {
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

		const classifications = get_old_and_new_url_classification();
		const old_url_classification = classifications[0];
		const new_url_classification = classifications[1];

		new_url_classification[url] = old_url_classification[url];
		delete old_url_classification[url];

		this.update({
			work_urls,
			work_urls_confirmed,
			procrastination_urls,
			procrastination_urls_confirmed
		});
	},
	update: function(new_state) {
		chrome.runtime.sendMessage({message: UPDATE, data: new_state}, function(response) {});
	},
	handleConfirm: function(url) {
		const work_urls = this.props.urls.work_urls;
		const work_urls_confirmed = this.props.urls.work_urls_confirmed;
		const procrastination_urls = this.props.urls.procrastination_urls;
		const procrastination_urls_confirmed = this.props.urls.procrastination_urls_confirmed;
		let new_classification_name;
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
			work_urls,
			work_urls_confirmed,
			procrastination_urls,
			procrastination_urls_confirmed,
		});
	},
	onUrlItemSelect: function(url) {
		console.log(url + " was clicked!");
		/* TODO: update this to open up side panel */
	},
	render: function() {
		console.log(this.state);
		return (
			<div className="classificationsBox row">
					<div className="col s5 offset-s1">
						<ClassificationTable
							onUrlItemSelect={this.onUrlItemSelect}
							urls={this.props.urls.work_urls}
							urls_confirmed={this.props.urls.work_urls_confirmed}
							classification="work"
							handleSwitch={this.handleSwitch}
							handleConfirm={this.handleConfirm}
						/>
					</div>
					<div className="col s5">
						<ClassificationTable
							onUrlItemSelect={this.onUrlItemSelect}
							urls={this.props.urls.procrastination_urls}
							urls_confirmed={this.props.urls.procrastination_urls_confirmed}
							classification="procrastination"
							handleSwitch={this.handleSwitch}
							handleConfirm={this.handleConfirm}
						/>
					</div>
			</div>
		);
	}
});

module.exports = ClassificationsBox;