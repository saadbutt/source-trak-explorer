/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from '../Layout/Layout';
import Dashboard from '../Dashboard/Dashboard';
import BlocksView from '../View/BlocksView';
import NetworkView from '../View/NetworkView';
import TransactionsView from '../View/TransactionsView';
import ChannelView from '../View/ChannelView';
import ChaincodeView from '../View/ChaincodeView';
import ChannelsView from '../View/ChannelsView';
import LandingPage from '../View/LandingPage';
import ErrorMessage from '../ErrorMessage';
import Login from '../Login';
import Private from '../Route';
import { chartSelectors } from '../../state/redux/charts';
import { themeSelectors } from '../../state/redux/theme';
import { authSelectors } from '../../state/redux/auth';

const styles = {
	app: {
		backgroundColor: 'background.default',
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		overflow: 'hidden',
		'& ol, & ul': {
			listStyle: 'none'
		}
	}
};

export class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}

	updateLoadStatus = () => {
		this.setState({ loading: false });
	};

	render() {
		const { auth, mode, error } = this.props;
		const { loading } = this.state;

		if (auth && loading) {
			return <LandingPage updateLoadStatus={this.updateLoadStatus} />;
		}

		return (
			<Box sx={styles.app}>
				{error && <ErrorMessage message={error} />}

				<Router>
					<Switch>
						<Route exact path="/login" component={Login} />
						<Private
							path="/"
							component={() => (
								<Layout>
									<Switch>
										<Route exact path="/" component={Dashboard} />
										<Route path="/blocks" component={BlocksView} />
										<Route path="/transactions" component={TransactionsView} />
										<Route path="/network" component={NetworkView} />
										<Route path="/chaincodes" component={ChaincodeView} />
										<Route path="/channels" component={ChannelsView} />
										<Route path="/channel" component={ChannelView} />
									</Switch>
								</Layout>
							)}
						/>
					</Switch>
				</Router>
			</Box>
		);
	}
}

const { modeSelector } = themeSelectors;
const { errorMessageSelector } = chartSelectors;
const { authSelector } = authSelectors;

const mapStateToProps = state => {
	return {
		error: errorMessageSelector(state),
		mode: modeSelector(state),
		auth: authSelector(state)
	};
};

export default connect(mapStateToProps)(App);
