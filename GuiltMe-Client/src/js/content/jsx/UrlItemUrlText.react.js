const React = require('react');

const UrlItemUrlText = React.createClass({
	render: function() {
		return (
			<span className="urlItemUrlText">
				{this.props.url}
			</span>
		);
	}
});

module.exports = UrlItemUrlText;