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
import { Code, Storage, Update, Close } from '@mui/icons-material';
import { tableSelectors, tableOperations } from '../../state/redux/tables';
import SimpleDataTable from '../DataTable/SimpleDataTable';

const ChaincodeView = ({
	chaincodeList = [],
	loading = false,
	getChaincodeList,
	currentChannel = 'mychannel'
}) => {
	const [selectedChaincode, setSelectedChaincode] = useState(null);
	useEffect(() => {
		if (currentChannel) {
			getChaincodeList(currentChannel);
		}
	}, [getChaincodeList, currentChannel]);

	const chaincodeColumns = [
		{
			field: 'chaincodename',
			headerName: 'Chaincode Name',
			width: 200,
			type: 'chip',
			getChipColor: () => 'primary'
		},
		{
			field: 'version',
			headerName: 'Version',
			width: 120
		},
		{
			field: 'path',
			headerName: 'Path',
			width: 300,
			renderCell: ({ value }) => (
				<Typography
					variant="body2"
					sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
				>
					{value}
				</Typography>
			)
		},
		{
			field: 'txCount',
			headerName: 'Transaction Count',
			width: 150,
			type: 'number'
		},
		{
			field: 'status',
			headerName: 'Status',
			width: 120,
			renderCell: ({ value, row }) => {
				// Default to active if no status field, or use the actual status
				const status = value || 'active';
				const color =
					status === 'active'
						? 'success'
						: status === 'inactive'
						? 'error'
						: 'warning';
				return (
					<Chip label={status} size="small" color={color} variant="outlined" />
				);
			}
		}
	];

	const handleRowClick = row => {
		setSelectedChaincode(row);
	};

	const handleCloseModal = () => {
		setSelectedChaincode(null);
	};

	const handleRefresh = () => {
		if (currentChannel) {
			getChaincodeList(currentChannel);
		}
	};

	const stats = [
		{
			title: 'Total Chaincodes',
			value: chaincodeList.length || 0,
			icon: <Code />,
			color: '#3b82f6'
		},
		{
			title: 'Active Chaincodes',
			value: chaincodeList.filter(cc => cc.status === 'active').length || 0,
			icon: <Storage />,
			color: '#10b981'
		},
		{
			title: 'Latest Version',
			value: chaincodeList.length > 0 ? chaincodeList[0].version : 'N/A',
			icon: <Update />,
			color: '#f59e0b'
		}
	];

	return (
		<Box sx={{ height: '100%', overflow: 'auto' }}>
			{/* Header */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
					Chaincodes
				</Typography>
				<Typography variant="body1" color="text.secondary">
					View deployed chaincodes and their details
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

			{/* Chaincodes Table */}
			<Box sx={{ height: 'calc(100% - 200px)' }}>
				<SimpleDataTable
					title="Deployed Chaincodes"
					data={chaincodeList}
					columns={chaincodeColumns}
					loading={loading}
					onRefresh={handleRefresh}
					onRowClick={handleRowClick}
					getRowId={row => row.chaincodename}
					pageSize={25}
					pageSizeOptions={[10, 25, 50, 100]}
				/>
			</Box>

			{/* Chaincode Details Modal */}
			<Dialog
				open={!!selectedChaincode}
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
						<Typography variant="h6">Chaincode Details</Typography>
						<IconButton onClick={handleCloseModal}>
							<Close />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					{selectedChaincode && (
						<Box sx={{ mt: 2 }}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Chaincode Name
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedChaincode.chaincodename}
									</Typography>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Version
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedChaincode.version}
									</Typography>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Transaction Count
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedChaincode.txCount || 0}
									</Typography>
								</Grid>

								<Grid item xs={12} md={6}>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Status
									</Typography>
									<Chip
										label={selectedChaincode.status || 'active'}
										color={selectedChaincode.status === 'active' ? 'success' : 'error'}
										sx={{ mb: 2 }}
									/>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Path
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontFamily: 'monospace', mb: 2, wordBreak: 'break-all' }}
									>
										{selectedChaincode.path}
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

const { chaincodeListSelector } = tableSelectors;
const { chaincodeList } = tableOperations;

const mapStateToProps = state => ({
	chaincodeList: chaincodeListSelector(state),
	loading: false // Add proper loading selector
});

const mapDispatchToProps = {
	getChaincodeList: chaincodeList
};

export default connect(mapStateToProps, mapDispatchToProps)(ChaincodeView);
