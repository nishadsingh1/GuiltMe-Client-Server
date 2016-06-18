const React = require('react');
const UrlItem = require('./UrlItem.react');

const UrlList = React.createClass({
	render: function() {
		const urls_items = [];
		let url;
		for(url in this.props.urls_confirmed) {
			urls_items.push (
				<UrlItem
					key={url}
					url={url}
					time={this.props.urls_confirmed[url]}
					classification={this.props.classification}
					confirmed={true}
					onClick={this.props.onUrlItemSelect.bind(null, url)}
					handleSwitch={this.props.handleSwitch}
				/>
			);
		}
		for(url in this.props.urls) {
			urls_items.push (
					<UrlItem
						key={url}
						url={url}
						time={this.props.urls[url]}
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

module.exports = UrlList;