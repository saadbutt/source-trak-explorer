/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
	Box,
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Breadcrumbs,
	Link
} from '@mui/material';
import { Menu as MenuIcon, Home } from '@mui/icons-material';
import { withRouter } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const Layout = ({ children, sidebarProps = {}, location }) => {
	const getPageTitle = () => {
		const path = location.pathname;
		if (path === '/') return 'Dashboard';
		if (path === '/blocks') return 'Blocks';
		if (path === '/transactions') return 'Transactions';
		if (path === '/network') return 'Network';
		if (path === '/chaincodes') return 'Chaincodes';
		if (path === '/channels') return 'Channels';
		return 'Page';
	};

	const getBreadcrumbs = () => {
		const path = location.pathname;
		const breadcrumbs = [
			{ label: 'Home', path: '/', icon: <Home fontSize="small" /> }
		];

		if (path !== '/') {
			breadcrumbs.push({
				label: getPageTitle(),
				path: path
			});
		}

		return breadcrumbs;
	};

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			<Sidebar {...sidebarProps} />

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden'
				}}
			>
				{/* Top App Bar */}
				<AppBar
					position="static"
					elevation={0}
					sx={{
						backgroundColor: 'background.paper',
						color: 'text.primary',
						borderBottom: '1px solid',
						borderColor: 'divider'
					}}
				>
					<Toolbar sx={{ minHeight: 64 }}>
						<Box sx={{ flexGrow: 1 }}>
							<Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
								{getPageTitle()}
							</Typography>
							<Breadcrumbs
								aria-label="breadcrumb"
								sx={{ mt: 0.5 }}
								separator={<Typography color="text.secondary">/</Typography>}
							>
								{getBreadcrumbs().map((breadcrumb, index) => (
									<Link
										key={index}
										color={
											index === getBreadcrumbs().length - 1
												? 'text.primary'
												: 'text.secondary'
										}
										href={breadcrumb.path}
										underline="hover"
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 0.5,
											fontSize: '0.875rem',
											fontWeight: index === getBreadcrumbs().length - 1 ? 600 : 400
										}}
									>
										{breadcrumb.icon}
										{breadcrumb.label}
									</Link>
								))}
							</Breadcrumbs>
						</Box>
					</Toolbar>
				</AppBar>

				{/* Main Content */}
				<Box
					className="main-content"
					sx={{
						flexGrow: 1,
						overflow: 'auto',
						backgroundColor: 'background.default',
						p: 3
					}}
				>
					{children}
				</Box>
			</Box>
		</Box>
	);
};

export default withRouter(Layout);
