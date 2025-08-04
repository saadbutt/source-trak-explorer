/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	TextField,
	InputAdornment,
	IconButton,
	Chip,
	Tooltip
} from '@mui/material';
import {
	Search,
	FilterList,
	Refresh,
	Visibility,
	ContentCopy,
	Download
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const DataTable = ({
	title,
	data = [],
	columns = [],
	loading = false,
	searchable = true,
	filterable = true,
	exportable = true,
	onRefresh,
	onRowClick,
	getRowId = row => row.id,
	pageSize = 10,
	pageSizeOptions = [10, 25, 50, 100]
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [filterAnchor, setFilterAnchor] = useState(null);

	const processedColumns = useMemo(() => {
		return columns.map(col => ({
			...col,
			renderCell: params => {
				if (col.type === 'chip') {
					return (
						<Chip
							label={params.value}
							size="small"
							color={col.getChipColor ? col.getChipColor(params.value) : 'default'}
							variant="outlined"
						/>
					);
				}

				if (col.renderCell) {
					return col.renderCell(params);
				}

				return params.value;
			}
		}));
	}, [columns]);

	const processedData = useMemo(() => {
		if (!searchTerm) return data;

		return data.filter(row =>
			Object.values(row).some(value =>
				String(value)
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			)
		);
	}, [data, searchTerm]);

	const handleExport = () => {
		// Implementation for export functionality
		console.log('Export data');
	};

	const handleCopyRow = row => {
		navigator.clipboard.writeText(JSON.stringify(row, null, 2));
	};

	const actionColumn = {
		field: 'actions',
		headerName: 'Actions',
		width: 120,
		sortable: false,
		filterable: false,
		renderCell: params => (
			<Box sx={{ display: 'flex', gap: 1 }}>
				<Tooltip title="View Details">
					<IconButton
						size="small"
						onClick={e => {
							e.stopPropagation();
							onRowClick?.(params.row);
						}}
					>
						<Visibility fontSize="small" />
					</IconButton>
				</Tooltip>
				<Tooltip title="Copy Data">
					<IconButton
						size="small"
						onClick={e => {
							e.stopPropagation();
							handleCopyRow(params.row);
						}}
					>
						<ContentCopy fontSize="small" />
					</IconButton>
				</Tooltip>
			</Box>
		)
	};

	const allColumns = [...processedColumns, actionColumn];

	return (
		<div className="data-table">
			<Card sx={{ height: '100%' }}>
				<CardContent sx={{ height: '100%', p: 0 }}>
					{/* Header */}
					<Box
						sx={{
							p: 3,
							borderBottom: '1px solid',
							borderColor: 'divider',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>
						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							{title}
						</Typography>

						<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
							{searchable && (
								<TextField
									size="small"
									placeholder="Search..."
									value={searchTerm}
									onChange={e => setSearchTerm(e.target.value)}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Search fontSize="small" />
											</InputAdornment>
										)
									}}
									sx={{ minWidth: 200 }}
								/>
							)}

							{filterable && (
								<Tooltip title="Filters">
									<IconButton
										onClick={e => setFilterAnchor(e.currentTarget)}
										color="primary"
									>
										<FilterList />
									</IconButton>
								</Tooltip>
							)}

							{onRefresh && (
								<Tooltip title="Refresh">
									<IconButton onClick={onRefresh} color="primary">
										<Refresh />
									</IconButton>
								</Tooltip>
							)}

							{exportable && (
								<Tooltip title="Export">
									<IconButton onClick={handleExport} color="primary">
										<Download />
									</IconButton>
								</Tooltip>
							)}
						</Box>
					</Box>

					{/* DataGrid */}
					<Box sx={{ height: 'calc(100% - 80px)' }}>
						<DataGrid
							rows={processedData}
							columns={allColumns}
							getRowId={getRowId}
							loading={loading}
							pageSize={pageSize}
							rowsPerPageOptions={pageSizeOptions}
							disableSelectionOnClick
							onRowClick={params => onRowClick?.(params.row)}
							components={{
								Toolbar: GridToolbar
							}}
							componentsProps={{
								toolbar: {
									showQuickFilter: true,
									quickFilterProps: { debounceMs: 500 }
								}
							}}
							sx={{
								border: 'none',
								'& .MuiDataGrid-cell': {
									borderBottom: '1px solid',
									borderColor: 'divider'
								},
								'& .MuiDataGrid-columnHeaders': {
									backgroundColor: 'background.paper',
									borderBottom: '2px solid',
									borderColor: 'divider'
								},
								'& .MuiDataGrid-row:hover': {
									backgroundColor: 'action.hover'
								}
							}}
						/>
					</Box>
				</CardContent>
			</Card>
		</div>
	);
};

export default DataTable;
