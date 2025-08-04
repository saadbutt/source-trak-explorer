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
	Tooltip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination
} from '@mui/material';
import {
	Search,
	FilterList,
	Refresh,
	Visibility,
	ContentCopy,
	Download
} from '@mui/icons-material';

const SimpleDataTable = ({
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
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(pageSize);

	const filteredData = useMemo(() => {
		if (!searchTerm) return data;

		return data.filter(row =>
			Object.values(row).some(value =>
				String(value)
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			)
		);
	}, [data, searchTerm]);

	const paginatedData = useMemo(() => {
		const startIndex = page * rowsPerPage;
		return filteredData.slice(startIndex, startIndex + rowsPerPage);
	}, [filteredData, page, rowsPerPage]);

	const handleExport = () => {
		// Implementation for export functionality
		console.log('Export data');
	};

	const handleCopyRow = row => {
		navigator.clipboard.writeText(JSON.stringify(row, null, 2));
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const renderCell = (row, column) => {
		const value = row[column.field];

		if (column.type === 'chip') {
			return (
				<Chip
					label={value}
					size="small"
					color={column.getChipColor ? column.getChipColor(value) : 'default'}
					variant="outlined"
				/>
			);
		}

		if (column.renderCell) {
			return column.renderCell({ value, row });
		}

		return value;
	};

	return (
		<div className="simple-data-table">
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

					{/* Table */}
					<Box sx={{ height: 'calc(100% - 140px)', overflow: 'auto' }}>
						<TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
							<Table stickyHeader>
								<TableHead>
									<TableRow>
										{columns.map(column => (
											<TableCell
												key={column.field}
												sx={{
													fontWeight: 600,
													backgroundColor: 'background.paper',
													borderBottom: '2px solid',
													borderColor: 'divider'
												}}
											>
												{column.headerName || column.field}
											</TableCell>
										))}
										<TableCell
											sx={{
												fontWeight: 600,
												backgroundColor: 'background.paper',
												borderBottom: '2px solid',
												borderColor: 'divider',
												width: 120
											}}
										>
											Actions
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{paginatedData.map(row => (
										<TableRow
											key={getRowId(row)}
											hover
											onClick={() => onRowClick?.(row)}
											sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
										>
											{columns.map(column => (
												<TableCell key={column.field}>{renderCell(row, column)}</TableCell>
											))}
											<TableCell>
												<Box sx={{ display: 'flex', gap: 1 }}>
													<Tooltip title="View Details">
														<IconButton
															size="small"
															onClick={e => {
																e.stopPropagation();
																onRowClick?.(row);
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
																handleCopyRow(row);
															}}
														>
															<ContentCopy fontSize="small" />
														</IconButton>
													</Tooltip>
												</Box>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>

					{/* Pagination */}
					<TablePagination
						component="div"
						count={filteredData.length}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						rowsPerPageOptions={pageSizeOptions}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

export default SimpleDataTable;
