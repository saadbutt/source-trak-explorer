/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	Box,
	Typography,
	IconButton,
	Tooltip,
	Badge,
	Avatar,
	Menu,
	MenuItem,
	Switch,
	FormControlLabel
} from '@mui/material';
import {
	Dashboard,
	AccountTree,
	Receipt,
	Hub,
	Code,
	Settings,
	Notifications,
	Search,
	Menu as MenuIcon,
	Close,
	Brightness4,
	Brightness7,
	Person,
	Logout,
	ChevronLeft,
	ChevronRight
} from '@mui/icons-material';
import { themeSelectors, themeActions } from '../../state/redux/theme';
import { authOperations } from '../../state/redux/auth';
import Logo from '../../static/images/Explorer_Logo.png';

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

const menuItems = [
	{
		text: 'Dashboard',
		icon: <Dashboard />,
		path: '/'
	},
	{
		text: 'Blocks',
		icon: <AccountTree />,
		path: '/blocks'
	},
	{
		text: 'Transactions',
		icon: <Receipt />,
		path: '/transactions'
	},
	{
		text: 'Network',
		icon: <Hub />,
		path: '/network'
	},
	{
		text: 'Chaincodes',
		icon: <Code />,
		path: '/chaincodes'
	},
	{
		text: 'Channels',
		icon: <Hub />,
		path: '/channels'
	}
];

const Sidebar = ({
	mode,
	changeTheme,
	logout,
	notifications = [],
	user = {},
	currentChannel = 'mychannel',
	history,
	location
}) => {
	const [collapsed, setCollapsed] = useState(false);
	const [userMenuAnchor, setUserMenuAnchor] = useState(null);
	const [notificationsAnchor, setNotificationsAnchor] = useState(null);

	const handleNavigation = path => {
		history.push(path);
	};

	const handleThemeToggle = () => {
		changeTheme(mode === 'dark' ? 'light' : 'dark');
	};

	const handleLogout = async () => {
		await logout();
		setUserMenuAnchor(null);
	};

	const isActive = path => {
		return location.pathname === path;
	};

	return (
		<>
			<Drawer
				variant="permanent"
				sx={{
					width: collapsed ? collapsedDrawerWidth : drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: collapsed ? collapsedDrawerWidth : drawerWidth,
						transition: 'width 0.3s ease-in-out',
						overflowX: 'hidden',
						borderRight: '1px solid',
						borderColor: 'divider',
						backgroundColor: 'background.paper',
						color: 'text.primary'
					}
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: collapsed ? 'center' : 'space-between',
						p: 2,
						minHeight: 64,
						borderBottom: '1px solid',
						borderColor: 'divider'
					}}
				>
					{!collapsed && (
						<div className="sidebar-logo">
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<img src={Logo} alt="Logo" style={{ height: 48, width: 'auto' }} />
							</Box>
						</div>
					)}
					<IconButton
						onClick={() => setCollapsed(!collapsed)}
						sx={{ color: 'text.secondary' }}
					>
						{collapsed ? <ChevronRight /> : <ChevronLeft />}
					</IconButton>
				</Box>

				<Box sx={{ flex: 1, overflow: 'auto' }}>
					<List sx={{ pt: 1 }}>
						{menuItems.map(item => (
							<ListItem key={item.text} disablePadding>
								<ListItemButton
									onClick={() => handleNavigation(item.path)}
									selected={isActive(item.path)}
									sx={{
										mx: 1,
										borderRadius: 2,
										mb: 0.5,
										'&.Mui-selected': {
											backgroundColor: 'primary.main',
											color: 'primary.contrastText',
											'&:hover': {
												backgroundColor: 'primary.dark'
											},
											'& .MuiListItemIcon-root': {
												color: 'primary.contrastText'
											}
										},
										'&:hover': {
											backgroundColor: 'action.hover'
										}
									}}
								>
									<ListItemIcon
										sx={{
											minWidth: collapsed ? 0 : 40,
											color: isActive(item.path)
												? 'primary.contrastText'
												: 'text.secondary'
										}}
									>
										{item.icon}
									</ListItemIcon>
									{!collapsed && (
										<ListItemText
											primary={item.text}
											primaryTypographyProps={{
												fontSize: '0.875rem',
												fontWeight: isActive(item.path) ? 600 : 500
											}}
										/>
									)}
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>

				<Divider />

				<Box sx={{ p: 2 }}>
					{!collapsed && (
						<Box sx={{ mb: 2 }}>
							<Typography
								variant="caption"
								color="text.secondary"
								sx={{ mb: 1, display: 'block' }}
							>
								Current Channel
							</Typography>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								mychannel
							</Typography>
						</Box>
					)}

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
						<FormControlLabel
							control={
								<Switch
									checked={mode === 'dark'}
									onChange={handleThemeToggle}
									size="small"
								/>
							}
							label={!collapsed ? (mode === 'dark' ? 'Dark' : 'Light') : ''}
							sx={{
								m: 0,
								'& .MuiFormControlLabel-label': {
									fontSize: '0.75rem'
								}
							}}
						/>
						{!collapsed && (
							<IconButton
								size="small"
								onClick={e => setNotificationsAnchor(e.currentTarget)}
								sx={{ ml: 'auto' }}
							>
								<Badge badgeContent={notifications.length} color="error">
									<Notifications fontSize="small" />
								</Badge>
							</IconButton>
						)}
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Avatar
							sx={{
								width: collapsed ? 32 : 40,
								height: collapsed ? 32 : 40,
								cursor: 'pointer',
								bgcolor: 'primary.main'
							}}
							onClick={e => setUserMenuAnchor(e.currentTarget)}
						>
							<Person />
						</Avatar>
						{!collapsed && (
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Typography variant="body2" sx={{ fontWeight: 600, truncate: true }}>
									{user.name || 'User'}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									{user.role || 'Admin'}
								</Typography>
							</Box>
						)}
					</Box>
				</Box>
			</Drawer>

			{/* Notifications Menu */}
			<Menu
				anchorEl={notificationsAnchor}
				open={Boolean(notificationsAnchor)}
				onClose={() => setNotificationsAnchor(null)}
				PaperProps={{
					sx: { minWidth: 300, maxHeight: 400 }
				}}
			>
				{notifications.length === 0 ? (
					<MenuItem>
						<Typography variant="body2" color="text.secondary">
							No new notifications
						</Typography>
					</MenuItem>
				) : (
					notifications.map((notification, index) => (
						<MenuItem key={index}>
							<Box>
								<Typography variant="body2" sx={{ fontWeight: 500 }}>
									{notification.title}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									{notification.message}
								</Typography>
							</Box>
						</MenuItem>
					))
				)}
			</Menu>

			{/* User Menu */}
			<Menu
				anchorEl={userMenuAnchor}
				open={Boolean(userMenuAnchor)}
				onClose={() => setUserMenuAnchor(null)}
				PaperProps={{
					sx: { minWidth: 200 }
				}}
			>
				<MenuItem onClick={() => setUserMenuAnchor(null)}>
					<ListItemIcon>
						<Person fontSize="small" />
					</ListItemIcon>
					Profile
				</MenuItem>
				<MenuItem onClick={() => setUserMenuAnchor(null)}>
					<ListItemIcon>
						<Settings fontSize="small" />
					</ListItemIcon>
					Settings
				</MenuItem>
				<Divider />
			</Menu>
		</>
	);
};

const { modeSelector } = themeSelectors;
const { changeTheme } = themeActions;
const { logout } = authOperations;

const mapStateToProps = state => ({
	mode: modeSelector(state)
	// Add other selectors as needed
});

const mapDispatchToProps = {
	changeTheme,
	logout
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Sidebar)
);
