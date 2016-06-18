const React = require('react');

const ClassificationHeader = React.createClass({
	render: function() {
		return (
			<tr className="classificationHeaderText">
				{this.props.classification}
			</tr>
		);
	}
});

module.exports = ClassificationHeader;