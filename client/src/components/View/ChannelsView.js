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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	IconButton
} from '@mui/material';
import { Hub, Storage, Group, Close } from '@mui/icons-material';
import { tableSelectors, tableOperations } from '../../state/redux/tables';
import SimpleDataTable from '../DataTable/SimpleDataTable';

const ChannelsView = ({ channels = [], loading = false, getChannels }) => {
	const [selectedChannel, setSelectedChannel] = useState(null);
	useEffect(() => {
		getChannels();
	}, [getChannels]);

	const channelColumns = [
		{
			field: 'channelname',
			headerName: 'Channel Name',
			width: 200,
			type: 'chip',
			getChipColor: () => 'primary'
		},
		{
			field: 'blocks',
			headerName: 'Blocks',
			width: 120,
			type: 'number'
		},
		{
			field: 'transactions',
			headerName: 'Transactions',
			width: 150,
			type: 'number'
		},
		{
			field: 'createdat',
			headerName: 'Created',
			width: 200,
			renderCell: ({ value }) => (
				<Typography variant="body2" color="text.secondary">
					{new Date(value).toLocaleString()}
				</Typography>
			)
		},
		{
			field: 'channel_genesis_hash',
			headerName: 'Genesis Hash',
			width: 300,
			renderCell: ({ value }) => (
				<Typography
					variant="body2"
					sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
				>
					{value?.substring(0, 20)}...
				</Typography>
			)
		}
	];

	const handleRowClick = row => {
		setSelectedChannel(row);
	};

	const handleCloseModal = () => {
		setSelectedChannel(null);
	};

	const handleRefresh = () => {
		getChannels();
	};

	const stats = [
		{
			title: 'Total Channels',
			value: channels.length || 0,
			icon: <Hub />,
			color: '#3b82f6'
		},
		{
			title: 'Total Blocks',
			value: channels.reduce((sum, channel) => sum + (channel.blocks || 0), 0),
			icon: <Storage />,
			color: '#10b981'
		},
		{
			title: 'Total Transactions',
			value: channels.reduce(
				(sum, channel) => sum + (channel.transactions || 0),
				0
			),
			icon: <Group />,
			color: '#f59e0b'
		}
	];

	return (
		<Box sx={{ height: '100%', overflow: 'auto' }}>
			{/* Header */}
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
					Channels
				</Typography>
				<Typography variant="body1" color="text.secondary">
					View blockchain channels and their details
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

			{/* Channels Table */}
			<Box sx={{ height: 'calc(100% - 200px)' }}>
				<SimpleDataTable
					title="Blockchain Channels"
					data={channels}
					columns={channelColumns}
					loading={loading}
					onRefresh={handleRefresh}
					onRowClick={handleRowClick}
					getRowId={row => row.channelname}
					pageSize={25}
					pageSizeOptions={[10, 25, 50, 100]}
				/>
			</Box>

			{/* Channel Details Modal */}
			<Dialog
				open={!!selectedChannel}
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
						<Typography variant="h6">Channel Details</Typography>
						<IconButton onClick={handleCloseModal}>
							<Close />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					{selectedChannel && (
						<Box sx={{ mt: 2 }}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Channel Name
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedChannel.channelname}
									</Typography>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Blocks
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedChannel.blocks || 0}
									</Typography>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Transactions
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{selectedChannel.transactions || 0}
									</Typography>
								</Grid>

								<Grid item xs={12} md={6}>
									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Created
									</Typography>
									<Typography variant="body1" sx={{ mb: 2 }}>
										{new Date(selectedChannel.createdat).toLocaleString()}
									</Typography>

									<Typography variant="subtitle2" color="text.secondary" gutterBottom>
										Genesis Hash
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontFamily: 'monospace', mb: 2, wordBreak: 'break-all' }}
									>
										{selectedChannel.channel_genesis_hash}
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

const { channelsSelector } = tableSelectors;
const { channels } = tableOperations;

const mapStateToProps = state => ({
	channels: channelsSelector(state),
	loading: false // Add proper loading selector
});

const mapDispatchToProps = {
	getChannels: channels
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelsView);
