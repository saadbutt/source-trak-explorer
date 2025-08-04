/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
	Box,
	Grid,
	Card,
	CardContent,
	Typography,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	IconButton
} from '@mui/material';
import { Receipt, TrendingUp, Timer, Close } from '@mui/icons-material';
import { tableSelectors, tableOperations } from '../../state/redux/tables';
import SimpleDataTable from '../DataTable/SimpleDataTable';

const TransactionsView = ({
	transactionList = [],
	loading = false,
	getTransactionList,
	currentChannel = 'mychannel'
}) => {
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	useEffect(() => {
		if (currentChannel) {
			getTransactionList(currentChannel, { page: 1, size: 100 });
		}
	}, [getTransactionList, currentChannel]);

	const transactionColumns = [
		{
			field: 'txhash',
			headerName: 'Transaction Hash',
			width: 300,
			renderCell: ({ value }) => (
				<Typography
					variant="body2"
					sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
				>
					{value?.substring(0, 20)}...
				</Typography>
			)
		},
		{
			field: 'blockid',
			headerName: 'Block ID',
			width: 120,
			type: 'number'
		},
		{
			field: 'txcount',
			headerName: 'Transaction Count',
			width: 150,
			type: 'number'
		},
		{
			field: 'createdt',
			headerName: 'Created',
			width: 200,
			renderCell: ({ value }) => (
				<Typography variant="body2" color="text.secondary">
					{new Date(value).toLocaleString()}
				</Typography>
			)
		},
		{
			field: 'status',
			headerName: 'Status',
			width: 120,
			renderCell: ({ value, row }) => {
				// Default to VALID if no status field, or use the actual status
				const status = value || 'VALID';
				const color =
					status === 'VALID'
						? 'success'
						: status === 'INVALID'
						? 'error'
						: 'warning';
				return (
					<Chip label={status} size="small" color={color} variant="outlined" />
				);
			}
		}
	];

	const handleRowClick = row => {
		setSelectedTransaction(row);
	};

	const handleCloseModal = () => {
		setSelectedTransaction(null);
	};

	const handleRefresh = () => {
		if (currentChannel) {
			getTransactionList(currentChannel, { page: 1, size: 100 });
		}
	};

	const stats = [
		{
			title: 'Total Transactions',
			value: transactionList.length || 0,
			icon: <Receipt />,
			color: '#3b82f6'
		},
		{
			title: 'Valid Transactions',
			value: transactionList.filter(tx => tx.status === 'VALID').length || 0,
			icon: <TrendingUp />,
			color: '#10b981'
		},
		{
			title: 'Latest Transaction',
			value:
				transactionList.length > 0
					? transactionList[0].txhash?.substring(0, 8)
					: 'N/A',
			icon: <Timer />,
			color: '#f59e0b'
		}
	];

	return (
		<Box sx={{ height: '100%', overflow: 'auto' }}>
			{/* Header */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
					Transactions
				</Typography>
				<Typography variant="body1" color="text.secondary">
					View blockchain transactions and their details
				</Typography>
			</Box>

			{/* Stats Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				{stats.map((stat, index) => (
					<Grid item xs={12} sm={4} key={index}>
						<div className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
							<Card
								sx={{
									background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
									border: `1px solid ${stat.color}20`,
									'&:hover': {
										transform: 'translateY(-2px)',
										boxShadow: `0 8px 25px ${stat.color}20`
									},
									transition: 'all 0.3s ease'
								}}
							>
								<CardContent>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
										<Box
											sx={{
												width: 48,
												height: 48,
												borderRadius: 2,
												backgroundColor: `${stat.color}20`,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												color: stat.color
											}}
										>
											{stat.icon}
										</Box>
										<Box>
											<Typography variant="h4" sx={{ fontWeight: 700 }}>
												{stat.value}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{ fontWeight: 500 }}
											>
												{stat.title}
											</Typography>
										</Box>
									</Box>
								</CardContent>
							</Card>
						</div>
					</Grid>
				))}
			</Grid>

			{/* Transactions Table */}
			<Box sx={{ height: 'calc(100% - 200px)' }}>
				<SimpleDataTable
					title="Blockchain Transactions"
					data={transactionList}
					columns={transactionColumns}
					loading={loading}
					onRefresh={handleRefresh}
					onRowClick={handleRowClick}
					getRowId={row => row.txhash}
					pageSize={25}
					pageSizeOptions={[10, 25, 50, 100]}
				/>
			</Box>

			{/* Transaction Details Modal */}
			<Dialog
				open={!!selectedTransaction}
				onClose={handleCloseModal}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>
						<Typography variant="h6">Transaction Details</Typography>
						<IconButton onClick={handleCloseModal}>
							<Close />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					{selectedTransaction && (
						<Box sx={{ mt: 2 }}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Transaction Hash
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontFamily: 'monospace', mb: 2, wordBreak: 'break-all' }}
									>
										{selectedTransaction.txhash}
									</Typography>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Block ID
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedTransaction.blockid}
									</Typography>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Created
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{new Date(selectedTransaction.createdt).toLocaleString()}
									</Typography>
								</Grid>

								<Grid item xs={12} md={6}>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Status
									</Typography>
									<Chip
										label={selectedTransaction.status || 'VALID'}
										color={selectedTransaction.status === 'VALID' ? 'success' : 'error'}
										sx={{ mb: 2 }}
									/>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Transaction Count
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedTransaction.txcount}
									</Typography>
								</Grid>
							</Grid>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal}>Close</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

const { transactionListSelector } = tableSelectors;
const { transactionList } = tableOperations;

const mapStateToProps = state => ({
	transactionList: transactionListSelector(state),
	loading: false // Add proper loading selector
});

const mapDispatchToProps = {
	getTransactionList: transactionList
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsView);
