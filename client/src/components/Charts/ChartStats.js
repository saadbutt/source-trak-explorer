/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { chartSelectors, chartOperations } from '../../state/redux/charts';
import TimeChart from './TimeChart';
import {
	blockPerHourType,
	blockPerMinType,
	currentChannelType,
	getBlocksPerHourType,
	getBlocksPerMinType,
	getTransactionPerHourType,
	getTransactionPerMinType,
	transactionPerHourType,
	transactionPerMinType
} from '../types';

const {
	blockPerHourSelector,
	blockPerMinSelector,
	currentChannelSelector,
	transactionPerHourSelector,
	transactionPerMinSelector
} = chartSelectors;

/* istanbul ignore next */
const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		chart: {
			color: dark ? '#ffffff' : undefined,
			backgroundColor: dark ? '#453e68' : undefined
		}
	};
};

export class ChartStats extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: '1'
		};
	}

	componentDidMount() {
		console.log('ChartStats - componentDidMount called');
		const { currentChannel } = this.props;
		console.log('ChartStats - currentChannel:', currentChannel);
		this.syncData(currentChannel);

		this.interVal = setInterval(() => {
			const { currentChannel } = this.props;
			console.log(
				'ChartStats - Interval syncData with currentChannel:',
				currentChannel
			);
			this.syncData(currentChannel);
		}, 60000);
	}

	componentWillUnmount() {
		clearInterval(this.interVal);
	}

	syncData = currentChannel => {
		console.log('ChartStats - syncData called with channel:', currentChannel);
		const {
			getBlocksPerHour,
			getBlocksPerMin,
			getTransactionPerHour,
			getTransactionPerMin
		} = this.props;

		console.log('ChartStats - Calling chart operations...');

		// Use the correct channel_genesis_hash as fallback
		const channelToUse =
			currentChannel && currentChannel !== 'undefined'
				? currentChannel
				: 'c8b8fd3ed6e387b5600596a5e2c2c1a6243fea2db161627b3a57d3ca729155ac';

		console.log('ChartStats - Using channel:', channelToUse);
		getBlocksPerHour(channelToUse);
		getBlocksPerMin(channelToUse);
		getTransactionPerMin(channelToUse);
		getTransactionPerHour(channelToUse);
	};

	timeDataSetup = (chartData = []) => {
		console.log('ChartStats - timeDataSetup called with:', chartData);

		let dataMax = 0;

		// Handle empty or null data
		if (!chartData || chartData.length === 0) {
			console.log('ChartStats - No data available, returning empty chart');
			return {
				displayData: [],
				dataMax: 10
			};
		}

		const displayData = chartData.map(data => {
			const count = parseInt(data.count, 10) || 0;
			if (count > dataMax) {
				dataMax = count;
			}

			return {
				datetime: moment(data.datetime)
					.tz(moment.tz.guess())
					.format('h:mm A'),
				count: count
			};
		});

		// Ensure we have a minimum range for empty charts
		dataMax = Math.max(dataMax + 2, 10);

		console.log('ChartStats - Processed chart data:', { displayData, dataMax });
		return {
			displayData,
			dataMax
		};
	};

	toggle = tab => {
		this.setState({
			activeTab: tab
		});
	};

	render() {
		const { activeTab } = this.state;
		const {
			blockPerHour,
			blockPerMin,
			transactionPerHour,
			transactionPerMin,
			classes
		} = this.props;

		return (
			<div className={classes.chart}>
				<Nav tabs>
					<NavItem>
						<NavLink
							className={classnames({
								active: activeTab === '1'
							})}
							onClick={() => {
								this.toggle('1');
							}}
						>
							BLOCKS / HOUR
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({
								active: activeTab === '2'
							})}
							onClick={() => {
								this.toggle('2');
							}}
						>
							BLOCKS / MIN
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({
								active: activeTab === '3'
							})}
							onClick={() => {
								this.toggle('3');
							}}
						>
							TX / HOUR
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classnames({
								active: activeTab === '4'
							})}
							onClick={() => {
								this.toggle('4');
							}}
						>
							TX / MIN
						</NavLink>
					</NavItem>
				</Nav>
				<TabContent activeTab={activeTab}>
					<TabPane tabId="1">
						<TimeChart chartData={this.timeDataSetup(blockPerHour)} />
					</TabPane>
					<TabPane tabId="2">
						<TimeChart chartData={this.timeDataSetup(blockPerMin)} />
					</TabPane>
					<TabPane tabId="3">
						<TimeChart chartData={this.timeDataSetup(transactionPerHour)} />
					</TabPane>
					<TabPane tabId="4">
						<TimeChart chartData={this.timeDataSetup(transactionPerMin)} />
					</TabPane>
				</TabContent>
			</div>
		);
	}
}

ChartStats.propTypes = {
	blockPerHour: blockPerHourType.isRequired,
	blockPerMin: blockPerMinType.isRequired,
	currentChannel: currentChannelType.isRequired,
	getBlocksPerHour: getBlocksPerHourType.isRequired,
	getBlocksPerMin: getBlocksPerMinType.isRequired,
	getTransactionPerHour: getTransactionPerHourType.isRequired,
	getTransactionPerMin: getTransactionPerMinType.isRequired,
	transactionPerHour: transactionPerHourType.isRequired,
	transactionPerMin: transactionPerMinType.isRequired
};

const mapStateToProps = state => {
	return {
		blockPerHour: blockPerHourSelector(state),
		blockPerMin: blockPerMinSelector(state),
		transactionPerHour: transactionPerHourSelector(state),
		transactionPerMin: transactionPerMinSelector(state),
		currentChannel: currentChannelSelector(state)
	};
};

const mapDispatchToProps = {
	getBlocksPerHour: chartOperations.blockPerHour,
	getBlocksPerMin: chartOperations.blockPerMin,
	getTransactionPerHour: chartOperations.transactionPerHour,
	getTransactionPerMin: chartOperations.transactionPerMin
};

const connectedComponent = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChartStats);
export default withStyles(styles)(connectedComponent);
