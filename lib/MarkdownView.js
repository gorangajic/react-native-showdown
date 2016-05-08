
import React, { Component, View, WebView, LinkingIOS } from 'react-native';
import showdown from 'showdown';

import defaultHTML from './defaultHTML';

class MarkdownView extends Component {
	constructor() {
		super();
		this.converter = new showdown.Converter({
			simplifiedAutoLink: true,
			strikethrough: true,
			tables: true,
		});

		// We use this flag to handle link clicks within the webview
		// and append the counter to the webview content.
		// Otherwise the webview content do NOT reload the html.
		// And reloading the html will CANCEL the externel web request!
		this.state = { navigationStateChange: 0 };
	}

	onNavigationStateChange(navState) {
		// Check if user pressed on a link
		if (navState.url !== 'about:blank' &&
			navState.navigationType !== WebView.NavigationType.other) {
			LinkingIOS.openURL(navState.url);
			this.setState({
				navigationStateChange: this.state.navigationStateChange + 1,
			});
		}
	}

	render() {
		const { children, pureCSS, automaticallyAdjustContentInsets, style } = this.props;

		const html = defaultHTML
				.replace('$title', '')
				.replace('$body', this.converter.makeHtml(children))
				.replace('$pureCSS', pureCSS);

		return (<WebView
			source={{ html }}
			automaticallyAdjustContentInsets={ automaticallyAdjustContentInsets }
			onNavigationStateChange={ this.onNavigationStateChange.bind(this) }
			style={ style }
			scalesPageToFit
		/>);
	}

}

MarkdownView.propTypes = {
	children: React.PropTypes.string.isRequired,
	pureCSS: React.PropTypes.string,
	automaticallyAdjustContentInsets: React.PropTypes.bool,
	style: View.propTypes.style,
};

MarkdownView.defaultProps = {
	title: '',
	pureCSS: '',
	style: {
		flex: 1,
	},
	automaticallyAdjustContentInsets: true,
};

module.exports = MarkdownView;
