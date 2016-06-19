const React = require('react');

const UrlItemButtons = React.createClass({
	render: function() {
		const buttons = [
			<button
				key="switch"
				onClick={this.props.handleSwitch.bind(null, this.props.url)}
				className="btn-floating btn-small waves-effect waves-light"
			>
				<i className="material-icons">repeat</i>
			</button>
		];
		if (!this.props.confirmed) {
			buttons.push (
				<button
					key="confirm"
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

module.exports = UrlItemButtons;