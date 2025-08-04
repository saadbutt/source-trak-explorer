/**
 * Direct Data Charts - Bypasses Redux and calls APIs directly
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		container: {
			padding: '20px',
			backgroundColor: dark ? '#453e68' : '#ffffff',
			borderRadius: '8px',
			boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
			marginBottom: '20px'
		},
		title: {
			fontSize: '20px',
			fontWeight: 'bold',
			marginBottom: '20px',
			color: dark ? '#ffffff' : '#333',
			textAlign: 'center'
		},
		dataItem: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '15px',
			margin: '10px 0',
			backgroundColor: dark ? '#3c3558' : '#f8f9fa',
			borderRadius: '8px',
			border: `1px solid ${dark ? '#5a4f7a' : '#e9ecef'}`
		},
		itemLabel: {
			fontSize: '16px',
			fontWeight: 'bold',
			color: dark ? '#ffffff' : '#333'
		},
		itemValue: {
			backgroundColor: '#4CAF50',
			color: 'white',
			padding: '8px 16px',
			borderRadius: '20px',
			fontSize: '14px',
			fontWeight: 'bold'
		},
		loadingMessage: {
			textAlign: 'center',
			color: dark ? '#b0b0b0' : '#666',
			fontSize: '16px',
			padding: '40px 20px'
		},
		errorMessage: {
			textAlign: 'center',
			color: '#f44336',
			fontSize: '16px',
			padding: '40px 20px'
		},
		refreshButton: {
			backgroundColor: '#2196F3',
			color: 'white',
			border: 'none',
			padding: '10px 20px',
			borderRadius: '4px',
			cursor: 'pointer',
			fontSize: '14px',
			marginBottom: '20px'
		}
	};
};

export class DirectDataCharts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blockActivity: [],
			transactionByOrg: [],
			loading: false,
			error: null
		};
	}

	componentDidMount() {
		this.loadData();
	}

	loadData = async () => {
		this.setState({ loading: true, error: null });

		try {
			// Load block activity
			const blockResponse = await fetch('/api/blockActivity/mychannel');
			const blockData = await blockResponse.json();

			// Load transaction by org
			const txResponse = await fetch('/api/txByOrg/mychannel');
			const txData = await txResponse.json();

			console.log('DirectDataCharts - Block Activity:', blockData);
			console.log('DirectDataCharts - Transaction by Org:', txData);

			this.setState({
				blockActivity: blockData.row || [],
				transactionByOrg: txData.rows || [],
				loading: false
			});
		} catch (error) {
			console.error('DirectDataCharts - Error loading data:', error);
			this.setState({
				error: 'Failed to load data',
				loading: false
			});
		}
	};

	render() {
		const { blockActivity, transactionByOrg, loading, error } = this.state;
		const { classes } = this.props;

		return (
			<div>
				{/* Block Activity */}
				<div className={classes.container}>
					<div className={classes.title}>Block Activity (Direct API)</div>
					<button
						className={classes.refreshButton}
						onClick={this.loadData}
						disabled={loading}
					>
						{loading ? 'Loading...' : 'Refresh Data'}
					</button>

					{loading ? (
						<div className={classes.loadingMessage}>Loading block activity...</div>
					) : error ? (
						<div className={classes.errorMessage}>{error}</div>
					) : blockActivity.length > 0 ? (
						<div>
							{blockActivity.slice(0, 5).map((block, index) => (
								<div key={index} className={classes.dataItem}>
									<div className={classes.itemLabel}>
										Block #{block.blocknum} - {new Date(block.createdt).toLocaleString()}
									</div>
									<div className={classes.itemValue}>{block.txcount} TX</div>
								</div>
							))}
						</div>
					) : (
						<div className={classes.loadingMessage}>No block activity available</div>
					)}
				</div>

				{/* Transaction by Organization */}
				<div className={classes.container}>
					<div className={classes.title}>
						Transactions by Organization (Direct API)
					</div>

					{loading ? (
						<div className={classes.loadingMessage}>Loading transaction data...</div>
					) : error ? (
						<div className={classes.errorMessage}>{error}</div>
					) : transactionByOrg.length > 0 ? (
						<div>
							{transactionByOrg.map((org, index) => (
								<div key={index} className={classes.dataItem}>
									<div className={classes.itemLabel}>{org.creator_msp_id}</div>
									<div className={classes.itemValue}>{org.count} TX</div>
								</div>
							))}
						</div>
					) : (
						<div className={classes.loadingMessage}>
							No transaction data available
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(DirectDataCharts);
