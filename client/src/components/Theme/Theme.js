/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeSelectors } from '../../state/redux/theme';
import '../../static/css/main.css';
import '../../static/css/main-dark.css';
import '../../static/css/media-queries.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'font-awesome/css/font-awesome.min.css';

class Theme extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}

	render() {
		const { mode, children } = this.props;
		return (
			<ThemeProvider theme={this.getTheme(mode)}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		);
	}

	getTheme(mode) {
		const isDark = mode === 'dark';

		return createTheme({
			palette: {
				mode: isDark ? 'dark' : 'light',
				primary: {
					main: isDark ? '#6366f1' : '#3b82f6',
					light: isDark ? '#818cf8' : '#60a5fa',
					dark: isDark ? '#4f46e5' : '#2563eb',
					contrastText: '#ffffff'
				},
				secondary: {
					main: isDark ? '#10b981' : '#059669',
					light: isDark ? '#34d399' : '#10b981',
					dark: isDark ? '#059669' : '#047857',
					contrastText: '#ffffff'
				},
				background: {
					default: isDark ? '#0f172a' : '#f8fafc',
					paper: isDark ? '#1e293b' : '#ffffff'
				},
				text: {
					primary: isDark ? '#f1f5f9' : '#1e293b',
					secondary: isDark ? '#94a3b8' : '#64748b'
				},
				divider: isDark ? '#334155' : '#e2e8f0',
				error: {
					main: '#ef4444',
					light: '#f87171',
					dark: '#dc2626'
				},
				warning: {
					main: '#f59e0b',
					light: '#fbbf24',
					dark: '#d97706'
				},
				success: {
					main: '#10b981',
					light: '#34d399',
					dark: '#059669'
				},
				info: {
					main: '#3b82f6',
					light: '#60a5fa',
					dark: '#2563eb'
				}
			},
			typography: {
				fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
				h1: {
					fontSize: '2.5rem',
					fontWeight: 700,
					lineHeight: 1.2
				},
				h2: {
					fontSize: '2rem',
					fontWeight: 600,
					lineHeight: 1.3
				},
				h3: {
					fontSize: '1.5rem',
					fontWeight: 600,
					lineHeight: 1.4
				},
				h4: {
					fontSize: '1.25rem',
					fontWeight: 600,
					lineHeight: 1.4
				},
				h5: {
					fontSize: '1.125rem',
					fontWeight: 600,
					lineHeight: 1.4
				},
				h6: {
					fontSize: '1rem',
					fontWeight: 600,
					lineHeight: 1.4
				},
				body1: {
					fontSize: '1rem',
					lineHeight: 1.6
				},
				body2: {
					fontSize: '0.875rem',
					lineHeight: 1.6
				},
				button: {
					textTransform: 'none',
					fontWeight: 600
				}
			},
			shape: {
				borderRadius: 12
			},
			shadows: [
				'none',
				'0px 1px 2px rgba(0, 0, 0, 0.05)',
				'0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
				'0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'0px 25px 50px -12px rgba(0, 0, 0, 0.25)'
			],
			components: {
				MuiButton: {
					styleOverrides: {
						root: {
							borderRadius: 8,
							padding: '8px 16px',
							fontWeight: 600
						},
						contained: {
							boxShadow: 'none',
							'&:hover': {
								boxShadow:
									'0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)'
							}
						}
					}
				},
				MuiCard: {
					styleOverrides: {
						root: {
							borderRadius: 16,
							boxShadow:
								'0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
							border: '1px solid',
							borderColor: isDark ? '#334155' : '#e2e8f0',
							backgroundColor: isDark ? '#1e293b' : '#ffffff',
							color: isDark ? '#f1f5f9' : '#1e293b'
						}
					}
				},
				MuiPaper: {
					styleOverrides: {
						root: {
							borderRadius: 12,
							backgroundColor: isDark ? '#1e293b' : '#ffffff',
							color: isDark ? '#f1f5f9' : '#1e293b'
						}
					}
				},
				MuiAppBar: {
					styleOverrides: {
						root: {
							backgroundColor: isDark ? '#1e293b' : '#ffffff',
							color: isDark ? '#f1f5f9' : '#1e293b',
							boxShadow:
								'0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
							'& .MuiToolbar-root': {
								backgroundColor: isDark ? '#1e293b' : '#ffffff',
								color: isDark ? '#f1f5f9' : '#1e293b'
							}
						}
					}
				},
				MuiDrawer: {
					styleOverrides: {
						paper: {
							backgroundColor: isDark ? '#1e293b' : '#ffffff',
							borderRight: '1px solid',
							borderColor: isDark ? '#334155' : '#e2e8f0'
						}
					}
				}
			}
		});
	}
}

const { modeSelector } = themeSelectors;

export default connect(state => ({
	mode: modeSelector(state)
}))(Theme);
