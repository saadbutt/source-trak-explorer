/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
	Grid,
	Card,
	CardContent,
	Typography,
	Box,
	Chip,
	LinearProgress,
	IconButton,
	Tooltip
} from '@mui/material';
import {
	Receipt,
	Hub,
	Code,
	Refresh,
	Visibility,
	VisibilityOff,
	AccountTree
} from '@mui/icons-material';
import { chartSelectors } from '../../state/redux/charts';
import { chartOperations } from '../../state/redux/charts';
import ChartStats from '../Charts/ChartStats';

const StatCard = ({ title, value, icon, color, loading = false }) => {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		if (!loading) {
			const timer = setTimeout(() => {
				setDisplayValue(value);
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [value, loading]);

	return (
		<div className="stat-card">
			<Card
				sx={{
					height: '100%',
					background: theme =>
						`linear-gradient(135deg, ${
							theme.palette[color.split('.')[0]][color.split('.')[1]]
						}15 0%, ${
							theme.palette[color.split('.')[0]][color.split('.')[1]]
						}05 100%)`,
					border: theme =>
						`1px solid ${theme.palette[color.split('.')[0]][color.split('.')[1]]}20`,
					'&:hover': {
						transform: 'translateY(-2px)',
						boxShadow: theme =>
							`0 8px 25px ${theme.palette[color.split('.')[0]][color.split('.')[1]]}20`
					},
					transition: 'all 0.3s ease'
				}}
			>
				<CardContent>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: 2
						}}
					>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: 2,
								backgroundColor: theme =>
									`${theme.palette[color.split('.')[0]][color.split('.')[1]]}20`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: theme => theme.palette[color.split('.')[0]][color.split('.')[1]]
							}}
						>
							{icon}
						</Box>
					</Box>

					<Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
						{loading ? (
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<LinearProgress sx={{ flexGrow: 1, mr: 1 }} />
								<Typography variant="body2" color="text.secondary">
									Loading...
								</Typography>
							</Box>
						) : (
							displayValue.toLocaleString()
						)}
					</Typography>

					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ fontWeight: 500 }}
					>
						{title}
					</Typography>
				</CardContent>
			</Card>
		</div>
	);
};

const ChartCard = ({ title, children, height = 300 }) => (
	<div className="chart-card">
		<Card sx={{ height: '100%' }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					{title}
				</Typography>
				<Box sx={{ height }}>{children}</Box>
			</CardContent>
		</Card>
	</div>
);

const Dashboard = ({
	dashStats = {},
	blockActivity = [],
	transactionByOrg = [],
	currentChannel = 'mychannel',
	loading = false,
	dashStatsOperation,
	blockActivityOperation,
	transactionByOrgOperation,
	getBlocksPerHour,
	getBlocksPerMin,
	getTransactionPerHour,
	getTransactionPerMin,
	getCurrentChannel,
	blockPerHour = [],
	blockPerMin = [],
	transactionPerHour = [],
	transactionPerMin = []
}) => {
	const [showDetails, setShowDetails] = useState(true);

	// Fetch current channel on mount
	useEffect(() => {
		console.log('Dashboard - Calling getCurrentChannel()');
		getCurrentChannel();
	}, [getCurrentChannel]);

	// Fetch data when component mounts or channel changes
	useEffect(() => {
		console.log('Dashboard - currentChannel changed to:', currentChannel);
		if (currentChannel) {
			console.log('Dashboard - Calling operations with channel:', currentChannel);
			dashStatsOperation(currentChannel);
			blockActivityOperation(currentChannel);
			transactionByOrgOperation(currentChannel);
		} else {
			console.log('Dashboard - currentChannel is falsy:', currentChannel);
		}
	}, [
		currentChannel,
		dashStatsOperation,
		blockActivityOperation,
		transactionByOrgOperation
	]);

	const handleRefresh = () => {
		if (currentChannel) {
			dashStatsOperation(currentChannel);
			blockActivityOperation(currentChannel);
			transactionByOrgOperation(currentChannel);
		}
	};

	const statCards = [
		{
			title: 'Total Blocks',
			value: dashStats.latestBlock || dashStats.blockCount || 0,
			icon: <AccountTree />,
			color: 'primary.main'
		},
		{
			title: 'Total Transactions',
			value: dashStats.txCount || 0,
			icon: <Receipt />,
			color: 'success.main'
		},
		{
			title: 'Active Peers',
			value: dashStats.peerCount || 0,
			icon: <Hub />,
			color: 'warning.main'
		},
		{
			title: 'Chaincodes',
			value: dashStats.chaincodeCount || 0,
			icon: <Code />,
			color: 'secondary.main'
		}
	];

	return (
		<Box sx={{ height: '100%', overflow: 'auto' }}>
			{/* Header */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mb: 3
				}}
			>
				<Box>
					<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
						Dashboard
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Overview of blockchain network activity
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Tooltip title="Toggle Details">
						<IconButton onClick={() => setShowDetails(!showDetails)} color="primary">
							{showDetails ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</Tooltip>
					<Tooltip title="Refresh Data">
						<IconButton color="primary" onClick={handleRefresh}>
							<Refresh />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>

			{/* Stats Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				{statCards.map((card, index) => (
					<Grid item xs={12} sm={6} md={3} key={index}>
						<StatCard {...card} loading={loading} />
					</Grid>
				))}
			</Grid>

			{/* Charts Grid */}
			<Grid container spacing={3}>
				{/* Block Activity Chart */}
				<Grid item xs={12} lg={8}>
					<ChartCard title="Block Activity Charts" height={400}>
						<ChartStats
							currentChannel={currentChannel}
							blockPerHour={blockPerHour}
							blockPerMin={blockPerMin}
							transactionPerHour={transactionPerHour}
							transactionPerMin={transactionPerMin}
							getBlocksPerHour={getBlocksPerHour}
							getBlocksPerMin={getBlocksPerMin}
							getTransactionPerHour={getTransactionPerHour}
							getTransactionPerMin={getTransactionPerMin}
						/>
					</ChartCard>
				</Grid>

				{/* Transaction by Organization */}
				<Grid item xs={12} lg={4}>
					<ChartCard title="Transactions by Organization" height={400}>
						<Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
							{transactionByOrg && transactionByOrg.length > 0 ? (
								<div>
									{/* Total Transactions */}
									<Box
										sx={{
											textAlign: 'center',
											padding: '15px',
											margin: '15px 0',
											backgroundColor: 'primary.50',
											borderRadius: '8px',
											border: '2px solid',
											borderColor: 'primary.main'
										}}
									>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ marginBottom: '5px' }}
										>
											Total Transactions
										</Typography>
										<Typography
											variant="h4"
											sx={{ fontWeight: 'bold', color: 'primary.main' }}
										>
											{dashStats.txCount || 0}
										</Typography>
									</Box>

									{/* Organization List */}
									{transactionByOrg.map((org, index) => (
										<Box
											key={index}
											sx={{
												backgroundColor: 'background.paper',
												padding: '15px',
												margin: '10px 0',
												borderRadius: '8px',
												border: '1px solid',
												borderColor: 'divider',
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center'
											}}
										>
											<Typography
												variant="body1"
												sx={{ fontWeight: 'bold', color: 'text.primary' }}
											>
												{org.creator_msp_id || `Organization ${index + 1}`}
											</Typography>
											<Chip
												label={`${org.count || 0} TX`}
												color="warning"
												sx={{
													padding: '8px 16px',
													fontSize: '14px',
													fontWeight: 'bold'
												}}
											/>
										</Box>
									))}
								</div>
							) : (
								<Box
									sx={{ textAlign: 'center', padding: '40px', color: 'text.secondary' }}
								>
									No transaction data available by organization
								</Box>
							)}
						</Box>
					</ChartCard>
				</Grid>

				{/* Network Status */}
				{showDetails && (
					<Grid item xs={12}>
						<ChartCard title="Network Status & Health" height={300}>
							<Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
								<Grid container spacing={2}>
									{/* Peer Status */}
									<Grid item xs={12} md={6}>
										<Card sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
												<Box
													sx={{
														width: 40,
														height: 40,
														borderRadius: '50%',
														backgroundColor: 'success.main',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														color: 'white'
													}}
												>
													<Hub fontSize="small" />
												</Box>
												<Typography variant="h6" fontWeight="bold">
													Peers Online
												</Typography>
											</Box>
											<Typography variant="h4" color="success.main" fontWeight="bold">
												{dashStats.peerCount || 0}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Active network peers
											</Typography>
										</Card>
									</Grid>

									{/* Chaincode Status */}
									<Grid item xs={12} md={6}>
										<Card sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
												<Box
													sx={{
														width: 40,
														height: 40,
														borderRadius: '50%',
														backgroundColor: 'info.main',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														color: 'white'
													}}
												>
													<Code fontSize="small" />
												</Box>
												<Typography variant="h6" fontWeight="bold">
													Chaincodes
												</Typography>
											</Box>
											<Typography variant="h4" color="info.main" fontWeight="bold">
												{dashStats.chaincodeCount || 0}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Deployed smart contracts
											</Typography>
										</Card>
									</Grid>

									{/* Channel Status */}
									<Grid item xs={12}>
										<Card sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
												<Box
													sx={{
														width: 40,
														height: 40,
														borderRadius: '50%',
														backgroundColor: 'warning.main',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														color: 'white'
													}}
												>
													<Receipt fontSize="small" />
												</Box>
												<Typography variant="h6" fontWeight="bold">
													Current Channel
												</Typography>
											</Box>
											<Typography variant="h5" color="warning.main" fontWeight="bold">
												mychannel
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Active blockchain channel
											</Typography>
										</Card>
									</Grid>
								</Grid>
							</Box>
						</ChartCard>
					</Grid>
				)}
			</Grid>
		</Box>
	);
};

const {
	dashStatsSelector,
	blockActivitySelector,
	transactionByOrgSelector,
	currentChannelSelector,
	blockPerHourSelector,
	blockPerMinSelector,
	transactionPerHourSelector,
	transactionPerMinSelector
} = chartSelectors;
const { dashStats, blockActivity, transactionByOrg } = chartOperations;

const mapStateToProps = state => ({
	dashStats: dashStatsSelector(state),
	blockActivity: blockActivitySelector(state),
	transactionByOrg: transactionByOrgSelector(state),
	currentChannel: currentChannelSelector(state) || 'mychannel',
	blockPerHour: blockPerHourSelector(state),
	blockPerMin: blockPerMinSelector(state),
	transactionPerHour: transactionPerHourSelector(state),
	transactionPerMin: transactionPerMinSelector(state)
});

const mapDispatchToProps = dispatch => ({
	dashStatsOperation: channelName => dispatch(dashStats(channelName)),
	blockActivityOperation: channelName => dispatch(blockActivity(channelName)),
	transactionByOrgOperation: channelName =>
		dispatch(transactionByOrg(channelName)),
	getBlocksPerHour: channelName =>
		dispatch(chartOperations.blockPerHour(channelName)),
	getBlocksPerMin: channelName =>
		dispatch(chartOperations.blockPerMin(channelName)),
	getTransactionPerHour: channelName =>
		dispatch(chartOperations.transactionPerHour(channelName)),
	getTransactionPerMin: channelName =>
		dispatch(chartOperations.transactionPerMin(channelName)),
	getCurrentChannel: () => dispatch(chartOperations.channel())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
