const React = require('react');

const ClassificationHeader = require('./ClassificationHeader.react');
const UrlList = require('./UrlList.react');

const ClassificationTable = React.createClass({
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
						urls_confirmed={this.props.urls_confirmed}
						urls={this.props.urls}
						handleSwitch={this.props.handleSwitch}
						handleConfirm={this.props.handleConfirm}
					/>
				</table>
			</div>
		);
	}
});

module.exports = ClassificationTable;