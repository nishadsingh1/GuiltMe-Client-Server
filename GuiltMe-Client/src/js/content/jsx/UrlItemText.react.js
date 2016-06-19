const React = require('react');

const UrlItemUrlText = require('./UrlItemUrlText.react');
const UrlItemTimeText = require('./UrlItemTimeText.react');

const UrlItemText = React.createClass({
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

module.exports = UrlItemText;