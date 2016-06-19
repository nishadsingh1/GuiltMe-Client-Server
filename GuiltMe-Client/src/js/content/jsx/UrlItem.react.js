const React = require('react');

const UrlItemButtons = require('./UrlItemButtons.react');
const UrlItemText = require('./UrlItemText.react');

const UrlItem = React.createClass({
	render: function() {
		return (
			<tr onClick={this.props.onClick}>
				<UrlItemText
					url={this.props.url}
					time={this.props.time}
				/>
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

module.exports = UrlItem;
