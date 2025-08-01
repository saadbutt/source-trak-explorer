/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import classnames from 'classnames';
import Main from '../Main';
import Header from '../Header';
import Footer from '../Footer';
import LandingPage from '../View/LandingPage';
import ErrorMessage from '../ErrorMessage';
import { chartSelectors } from '../../state/redux/charts';
import { themeSelectors, themeActions } from '../../state/redux/theme';
import { authSelectors } from '../../state/redux/auth';

// Removed Login import since we're bypassing authentication

import Private from '../Route';

/* istanbul ignore next */
const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		app: {
			backgroundColor: dark ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)' : 'linear-gradient(135deg, #0ea5e9 0%, #0891b2 50%, #0d9488 100%)',
			background: dark ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)' : 'linear-gradient(135deg, #0ea5e9 0%, #0891b2 50%, #0d9488 100%)',
			position: 'absolute',
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			overflow: 'auto',
			minHeight: '100vh',
			fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
			'& ol, & ul': {
				listStyle: 'none'
			}
		}
	};
};

export class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false // Set loading to false to skip the loading screen
		};
	}

	/* istanbul ignore next */
	updateLoadStatus = () => {
		this.setState({ loading: false });
	};

	/* istanbul ignore next */
	refreshComponent = mode => {
		this.props.changeTheme(mode);
	};

	/* istanbul ignore next */
	render() {
		const { auth } = this.props;
		const { loading } = this.state;
		// Skip loading screen since authentication is bypassed
		if (auth && loading) {
			return <LandingPage updateLoadStatus={this.updateLoadStatus} />;
		}
		const { classes, mode, error } = this.props;
		const className = classnames(mode === 'dark' && 'dark-theme', classes.app);
		return (
			<div className={className}>
				<Header refresh={this.refreshComponent} />
				{error && <ErrorMessage message={error} />}
				<Router>
					<Switch>
						<Route path="/" render={routeprops => <Main {...routeprops} />} />
					</Switch>
				</Router>
				<Footer />
			</div>
		);
	}
}

const { modeSelector } = themeSelectors;
const { changeTheme } = themeActions;
const { errorMessageSelector } = chartSelectors;
const { authSelector } = authSelectors;

const mapStateToProps = state => {
	return {
		error: errorMessageSelector(state),
		mode: modeSelector(state),
		auth: authSelector(state)
	};
};

const mapDispatchToProps = {
	changeTheme
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(App));
