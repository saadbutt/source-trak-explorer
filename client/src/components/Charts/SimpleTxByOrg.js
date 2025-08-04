/**
 * Simple Transaction by Organization Component
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { chartSelectors, chartOperations } from '../../state/redux/charts';
import { transactionByOrgType } from '../types';

const { transactionByOrgSelector, currentChannelSelector } = chartSelectors;

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
		orgItem: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '15px',
			margin: '10px 0',
			backgroundColor: dark ? '#3c3558' : '#f8f9fa',
			borderRadius: '8px',
			border: `1px solid ${dark ? '#5a4f7a' : '#e9ecef'}`
		},
		orgName: {
			fontSize: '16px',
			fontWeight: 'bold',
			color: dark ? '#ffffff' : '#333'
		},
		transactionCount: {
			backgroundColor: '#FF9800',
			color: 'white',
			padding: '8px 16px',
			borderRadius: '20px',
			fontSize: '14px',
			fontWeight: 'bold'
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
			backgroundColor: '#FF9800',
			color: 'white',
			border: 'none',
			padding: '8px 16px',
			borderRadius: '4px',
			cursor: 'pointer',
			fontSize: '12px'
		},
		totalSection: {
			textAlign: 'center',
			padding: '15px',
			margin: '15px 0',
			backgroundColor: dark ? '#2c2438' : '#e3f2fd',
			borderRadius: '8px',
			border: `2px solid ${dark ? '#5a4f7a' : '#2196F3'}`
		},
		totalTitle: {
			fontSize: '14px',
			color: dark ? '#b0b0b0' : '#666',
			marginBottom: '5px'
		},
		totalCount: {
			fontSize: '24px',
			fontWeight: 'bold',
			color: '#2196F3'
		}
	};
};

export class SimpleTxByOrg extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		};
	}

	componentDidMount() {
		this.loadTransactionByOrg();
	}

	loadTransactionByOrg = () => {
		const { currentChannel, transactionByOrgOperation } = this.props;
		if (currentChannel) {
			this.setState({ loading: true });
			transactionByOrgOperation(currentChannel);
			setTimeout(() => this.setState({ loading: false }), 1000);
		}
	};

	render() {
		const { transactionByOrg, classes } = this.props;
		const { loading } = this.state;

		console.log('SimpleTxByOrg - Rendering with data:', transactionByOrg);

		// Calculate total transactions
		const totalTransactions =
			transactionByOrg && transactionByOrg.length > 0
				? transactionByOrg.reduce((sum, org) => sum + parseInt(org.count || 0), 0)
				: 0;

		return (
			<div className={classes.container}>
				<div className={classes.header}>
					<div className={classes.headerTitle}>Transactions by Organization</div>
					<button
						className={classes.refreshButton}
						onClick={this.loadTransactionByOrg}
						disabled={loading}
					>
						{loading ? 'Loading...' : 'Refresh'}
					</button>
				</div>

				{loading ? (
					<div className={classes.emptyMessage}>Loading transaction data...</div>
				) : transactionByOrg && transactionByOrg.length > 0 ? (
					<div>
						<div className={classes.totalSection}>
							<div className={classes.totalTitle}>Total Transactions</div>
							<div className={classes.totalCount}>{totalTransactions}</div>
						</div>

						{transactionByOrg.map((org, index) => (
							<div key={index} className={classes.orgItem}>
								<div className={classes.orgName}>
									{org.creator_msp_id || `Organization ${index + 1}`}
								</div>
								<div className={classes.transactionCount}>{org.count || 0} TX</div>
							</div>
						))}
					</div>
				) : (
					<div className={classes.emptyMessage}>
						No transaction data available by organization
					</div>
				)}
			</div>
		);
	}
}

SimpleTxByOrg.propTypes = {
	transactionByOrg: transactionByOrgType.isRequired
};

const mapStateToProps = state => ({
	transactionByOrg: transactionByOrgSelector(state),
	currentChannel: currentChannelSelector(state)
});

const mapDispatchToProps = {
	transactionByOrgOperation: chartOperations.transactionByOrg
};

const connectedComponent = connect(
	mapStateToProps,
	mapDispatchToProps
)(SimpleTxByOrg);
export default withStyles(styles)(connectedComponent);
