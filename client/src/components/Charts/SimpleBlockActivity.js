/**
 * Simple Block Activity Component - Shows 1 month of data
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { chartSelectors, chartOperations } from '../../state/redux/charts';
import { blockActivityType } from '../types';

const { blockActivitySelector, currentChannelSelector } = chartSelectors;

const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		container: {
			padding: '20px',
			backgroundColor: dark ? '#453e68' : '#ffffff',
			borderRadius: '8px',
			boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
		},
		title: {
			fontSize: '20px',
			fontWeight: 'bold',
			marginBottom: '20px',
			color: dark ? '#ffffff' : '#333',
			textAlign: 'center'
		},
		activityItem: {
			display: 'flex',
			alignItems: 'center',
			padding: '15px',
			margin: '10px 0',
			backgroundColor: dark ? '#3c3558' : '#f8f9fa',
			borderRadius: '8px',
			border: `1px solid ${dark ? '#5a4f7a' : '#e9ecef'}`
		},
		blockNumber: {
			fontSize: '18px',
			fontWeight: 'bold',
			color: '#4CAF50',
			marginRight: '15px',
			minWidth: '60px'
		},
		blockInfo: {
			flex: 1
		},
		blockHash: {
			fontSize: '12px',
			color: dark ? '#b0b0b0' : '#666',
			fontFamily: 'monospace',
			wordBreak: 'break-all'
		},
		transactionCount: {
			backgroundColor: '#2196F3',
			color: 'white',
			padding: '5px 10px',
			borderRadius: '15px',
			fontSize: '12px',
			fontWeight: 'bold'
		},
		timestamp: {
			fontSize: '12px',
			color: dark ? '#b0b0b0' : '#666',
			marginTop: '5px'
		},
		emptyMessage: {
			textAlign: 'center',
			color: dark ? '#b0b0b0' : '#666',
			fontSize: '16px',
			padding: '40px 20px'
		},
		header: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: '15px',
			padding: '10px',
			backgroundColor: dark ? '#3c3558' : '#f8f9fa',
			borderRadius: '5px'
		},
		headerTitle: {
			fontWeight: 'bold',
			color: dark ? '#ffffff' : '#333'
		},
		refreshButton: {
			backgroundColor: '#4CAF50',
			color: 'white',
			border: 'none',
			padding: '8px 16px',
			borderRadius: '4px',
			cursor: 'pointer',
			fontSize: '12px'
		}
	};
};

export class SimpleBlockActivity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		};
	}

	componentDidMount() {
		this.loadBlockActivity();
	}

	loadBlockActivity = () => {
		const { currentChannel, blockActivityOperation } = this.props;
		if (currentChannel) {
			this.setState({ loading: true });
			blockActivityOperation(currentChannel);
			setTimeout(() => this.setState({ loading: false }), 1000);
		}
	};

	render() {
		const { blockActivity, classes } = this.props;
		const { loading } = this.state;

		console.log('SimpleBlockActivity - Rendering with data:', blockActivity);

		return (
			<div className={classes.container}>
				<div className={classes.header}>
					<div className={classes.headerTitle}>Block Activity (Last 30 Days)</div>
					<button
						className={classes.refreshButton}
						onClick={this.loadBlockActivity}
						disabled={loading}
					>
						{loading ? 'Loading...' : 'Refresh'}
					</button>
				</div>

				{loading ? (
					<div className={classes.emptyMessage}>Loading block activity...</div>
				) : blockActivity && blockActivity.length > 0 ? (
					<div>
						{blockActivity.slice(0, 10).map((block, index) => (
							<div key={index} className={classes.activityItem}>
								<div className={classes.blockNumber}>
									#{block.blocknum || block.blockid || 1000 + index}
								</div>
								<div className={classes.blockInfo}>
									<div className={classes.blockHash}>
										Hash: {block.blockhash || block.datahash || 'N/A'}
									</div>
									<div className={classes.timestamp}>
										{block.createdt
											? new Date(block.createdt).toLocaleString()
											: 'Recent'}
									</div>
								</div>
								<div className={classes.transactionCount}>{block.txcount || 0} TX</div>
							</div>
						))}
					</div>
				) : (
					<div className={classes.emptyMessage}>
						No block activity available for the last 30 days
					</div>
				)}
			</div>
		);
	}
}

SimpleBlockActivity.propTypes = {
	blockActivity: blockActivityType.isRequired
};

const mapStateToProps = state => ({
	blockActivity: blockActivitySelector(state),
	currentChannel: currentChannelSelector(state)
});

const mapDispatchToProps = {
	blockActivityOperation: chartOperations.blockActivity
};

const connectedComponent = connect(
	mapStateToProps,
	mapDispatchToProps
)(SimpleBlockActivity);
export default withStyles(styles)(connectedComponent);
