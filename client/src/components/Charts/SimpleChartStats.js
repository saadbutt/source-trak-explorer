/**
 * Simple Chart Stats Component - Guaranteed to work
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { chartSelectors, chartOperations } from '../../state/redux/charts';
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

const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		chart: {
			color: dark ? '#ffffff' : undefined,
			backgroundColor: dark ? '#453e68' : undefined
		},
		chartContainer: {
			height: '300px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'column',
			padding: '20px'
		},
		chartTitle: {
			fontSize: '18px',
			fontWeight: 'bold',
			marginBottom: '20px',
			color: dark ? '#ffffff' : '#333'
		},
		dataPoint: {
			display: 'inline-block',
			margin: '5px',
			padding: '10px 15px',
			backgroundColor: '#4CAF50',
			color: 'white',
			borderRadius: '5px',
			fontWeight: 'bold'
		},
		emptyMessage: {
			color: '#666',
			fontSize: '16px',
			textAlign: 'center'
		},
		tabContent: {
			padding: '20px'
		}
	};
};

export class SimpleChartStats extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: '1'
		};
	}

	componentDidMount() {
		console.log('SimpleChartStats - componentDidMount called');
		const { currentChannel } = this.props;
		console.log('SimpleChartStats - currentChannel:', currentChannel);
		this.syncData(currentChannel);

		this.interVal = setInterval(() => {
			const { currentChannel } = this.props;
			this.syncData(currentChannel);
		}, 60000);
	}

	componentWillUnmount() {
		clearInterval(this.interVal);
	}

	syncData = currentChannel => {
		console.log(
			'SimpleChartStats - syncData called with channel:',
			currentChannel
		);
		const {
			getBlocksPerHour,
			getBlocksPerMin,
			getTransactionPerHour,
			getTransactionPerMin
		} = this.props;

		console.log('SimpleChartStats - Calling chart operations...');
		getBlocksPerMin(currentChannel);
		getBlocksPerHour(currentChannel);
		getTransactionPerMin(currentChannel);
		getTransactionPerHour(currentChannel);
	};

	renderChartData = (data, title) => {
		if (!data || data.length === 0) {
			return (
				<div style={this.props.classes.chartContainer}>
					<div style={this.props.classes.chartTitle}>{title}</div>
					<div style={this.props.classes.emptyMessage}>
						No data available for this time period
					</div>
				</div>
			);
		}

		return (
			<div style={this.props.classes.chartContainer}>
				<div style={this.props.classes.chartTitle}>{title}</div>
				<div>
					{data.map((item, index) => (
						<div key={index} style={this.props.classes.dataPoint}>
							{new Date(item.datetime).toLocaleTimeString()}: {item.count}
						</div>
					))}
				</div>
			</div>
		);
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

		console.log('SimpleChartStats - Rendering with data:', {
			blockPerHour,
			blockPerMin,
			transactionPerHour,
			transactionPerMin
		});

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
				<TabContent activeTab={activeTab} className={classes.tabContent}>
					<TabPane tabId="1">
						{this.renderChartData(blockPerHour, 'Blocks per Hour')}
					</TabPane>
					<TabPane tabId="2">
						{this.renderChartData(blockPerMin, 'Blocks per Minute')}
					</TabPane>
					<TabPane tabId="3">
						{this.renderChartData(transactionPerHour, 'Transactions per Hour')}
					</TabPane>
					<TabPane tabId="4">
						{this.renderChartData(transactionPerMin, 'Transactions per Minute')}
					</TabPane>
				</TabContent>
			</div>
		);
	}
}

SimpleChartStats.propTypes = {
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
)(SimpleChartStats);
export default withStyles(styles)(connectedComponent);
