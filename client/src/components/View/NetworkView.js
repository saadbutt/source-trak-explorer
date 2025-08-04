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
import {
	Hub,
	SignalCellular4Bar,
	SignalCellularConnectedNoInternet4Bar,
	Close
} from '@mui/icons-material';
import { tableSelectors, tableOperations } from '../../state/redux/tables';
import SimpleDataTable from '../DataTable/SimpleDataTable';

const NetworkView = ({
	peerList = [],
	loading = false,
	getPeerList,
	currentChannel = 'mychannel'
}) => {
	const [selectedPeer, setSelectedPeer] = useState(null);
	useEffect(() => {
		if (currentChannel) {
			getPeerList(currentChannel);
		}
	}, [getPeerList, currentChannel]);

	const peerColumns = [
		{
			field: 'server_hostname',
			headerName: 'Hostname',
			width: 200
		},
		{
			field: 'requests',
			headerName: 'Request URL',
			width: 300
		},
		{
			field: 'peer_type',
			headerName: 'Peer Type',
			width: 150,
			type: 'chip',
			getChipColor: value => {
				if (value === 'endorser') return 'primary';
				if (value === 'committer') return 'secondary';
				return 'default';
			}
		},
		{
			field: 'mspid',
			headerName: 'MSP ID',
			width: 150
		},
		{
			field: 'ledger_height_high',
			headerName: 'Ledger Height',
			width: 150,
			renderCell: ({ row }) => (
				<Typography variant="body2">{row.ledger_height_high || 0}</Typography>
			)
		},
		{
			field: 'status',
			headerName: 'Status',
			width: 120,
			type: 'chip',
			getChipColor: value => {
				if (value === 'UP') return 'success';
				if (value === 'DOWN') return 'error';
				return 'warning';
			}
		}
	];

	const handleRowClick = row => {
		setSelectedPeer(row);
	};

	const handleCloseModal = () => {
		setSelectedPeer(null);
	};

	const handleRefresh = () => {
		if (currentChannel) {
			getPeerList(currentChannel);
		}
	};

	const stats = [
		{
			title: 'Total Peers',
			value: peerList.length || 0,
			icon: <Hub />,
			color: '#3b82f6'
		},
		{
			title: 'Online Peers',
			value: peerList.filter(peer => peer.status === 'UP').length || 0,
			icon: <SignalCellular4Bar />,
			color: '#10b981'
		},
		{
			title: 'Offline Peers',
			value: peerList.filter(peer => peer.status === 'DOWN').length || 0,
			icon: <SignalCellularConnectedNoInternet4Bar />,
			color: '#ef4444'
		}
	];

	return (
		<Box sx={{ height: '100%', overflow: 'auto' }}>
			{/* Header */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
					Network
				</Typography>
				<Typography variant="body1" color="text.secondary">
					View network peers and their status
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
												{stat.value.toLocaleString()}
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

			{/* Peers Table */}
			<Box sx={{ height: 'calc(100% - 200px)' }}>
				<SimpleDataTable
					title="Network Peers"
					data={peerList}
					columns={peerColumns}
					loading={loading}
					onRefresh={handleRefresh}
					onRowClick={handleRowClick}
					getRowId={row => row.server_hostname}
					pageSize={25}
					pageSizeOptions={[10, 25, 50, 100]}
				/>
			</Box>

			{/* Peer Details Modal */}
			<Dialog
				open={!!selectedPeer}
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
						<Typography variant="h6">Peer Details</Typography>
						<IconButton onClick={handleCloseModal}>
							<Close />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					{selectedPeer && (
						<Box sx={{ mt: 2 }}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Hostname
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedPeer.server_hostname}
									</Typography>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Request URL
									</Typography>
									<Typography variant="body2" sx={{ mb: 2, wordBreak: 'break-all' }}>
										{selectedPeer.requests}
									</Typography>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										MSP ID
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedPeer.mspid}
									</Typography>
								</Grid>

								<Grid item xs={12} md={6}>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Status
									</Typography>
									<Chip
										label={selectedPeer.status || 'UNKNOWN'}
										color={selectedPeer.status === 'UP' ? 'success' : 'error'}
										sx={{ mb: 2 }}
									/>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Peer Type
									</Typography>
									<Chip
										label={selectedPeer.peer_type || 'UNKNOWN'}
										color={
											selectedPeer.peer_type === 'endorser' ? 'primary' : 'secondary'
										}
										sx={{ mb: 2 }}
									/>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Ledger Height
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedPeer.ledger_height_high || 0}
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

const { peerListSelector } = tableSelectors;
const { peerList } = tableOperations;

const mapStateToProps = state => ({
	peerList: peerListSelector(state),
	loading: false // Add proper loading selector
});

const mapDispatchToProps = {
	getPeerList: peerList
};

export default connect(mapStateToProps, mapDispatchToProps)(NetworkView);
