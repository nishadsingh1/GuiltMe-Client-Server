const React = require('react');

const UrlItemTimeText = React.createClass({
	render: function() {
		return (
			<span className="urlItemTimeText">
				{this.props.time}
			</span>
		);
	}
});

module.exports = UrlItemTimeText;