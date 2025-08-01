/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import ListIcon from '@material-ui/icons/List';
import PersonIcon from '@material-ui/icons/Person';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { shape, string } from 'prop-types';

import { authSelectors, authOperations } from '../../state/redux/auth';

const styles = theme => ({
	container: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	paper: {
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4}px ${theme
			.spacing.unit * 4}px`,
		background: 'rgba(255, 255, 255, 0.95)',
		backdropFilter: 'blur(10px)',
		borderRadius: '16px',
		boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
		border: '1px solid rgba(0, 0, 0, 0.05)',
		'& .dark-theme &': {
			background: 'rgba(26, 32, 44, 0.95)',
			border: '1px solid rgba(74, 85, 104, 0.3)',
			boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
		}
	},
	avatar: {
		margin: theme.spacing.unit,
		background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		width: '64px',
		height: '64px',
		'& .dark-theme &': {
			background: 'linear-gradient(135deg, #4c51bf 0%, #667eea 100%)'
		}
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit * 2
	},
	submit: {
		marginTop: theme.spacing.unit * 3,
		background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		color: 'white',
		padding: '12px 24px',
		borderRadius: '8px',
		fontWeight: 600,
		textTransform: 'none',
		fontSize: '1rem',
		'&:hover': {
			background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
			transform: 'translateY(-1px)',
			boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
		},
		'& .dark-theme &': {
			background: 'linear-gradient(135deg, #4c51bf 0%, #667eea 100%)',
			'&:hover': {
				background: 'linear-gradient(135deg, #5a67d8 0%, #7c3aed 100%)'
			}
		}
	},
	errortext: {
		fontSize: 16,
		fontWeight: 600,
		color: '#e53e3e',
		textAlign: 'center',
		padding: '8px',
		borderRadius: '6px',
		background: 'rgba(229, 62, 62, 0.1)',
		border: '1px solid rgba(229, 62, 62, 0.2)'
	}
});

export class Login extends Component {
	static propTypes = {
		classes: shape({
			avatar: string,
			form: string,
			container: string,
			paper: string,
			submit: string
		}).isRequired
	};

	constructor(props) {
		super(props);
		const { networks = [] } = props;
		this.state = {
			info: null,
			user: {
				error: null,
				value: ''
			},
			password: {
				error: null,
				value: ''
			},
			network: {
				error: null,
				value: '',
				id: ''
			},
			autoLoginAttempted: true,
			error: '',
			networks,
			authEnabled: false,
			isLoading: false
		};
	}

	async componentDidMount() {
		const { networks = [] } = this.state;
		console.log("mount first", networks);
		// If only one network and auth is disabled, skip login
//		if (networks.length === 1 && !networks[0].authEnabled) {
	//		this.performLogin({  network: networks[0].id });
			await this.performLogin({user:"exploreradmin", password:"exploreradminpw", network: 'test-network' });

//		}
	}


	componentWillReceiveProps(nextProps) {
		const { networks = [] } = nextProps;
		this.setState(() => ({
			networks,
			network: {
				error: null,
				value: networks[0].name || '',
				id: networks[0].id
			},
			authEnabled: networks[0].authEnabled
		}));
	}

	handleChange = event => {
		const { target } = event;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const { name } = target;

		const newState = {
			[name]: { value }
		};
		if (name === 'network') {
			const { networks } = this.state;
			newState.authEnabled = (
				networks.find(n => n.name === value) || {}
			).authEnabled;
			newState.network.id = (networks.find(n => n.name === value) || {}).id;
		}

		this.setState(newState);
	};

	async performLogin({ user, password, network }) {
		const { login } = this.props;
		const { authEnabled } = this.state;

		const info = await login(
			{
				user: 'exploreradmin',
				password: 'exploreradminpw'
			},
			network
		);

		this.setState(() => ({ info }));
		if (info.status === 'Success') {
			const { history } = this.props;
			history.replace('/');
			return true;
		}
	}

	submitForm = async e => {
		e.preventDefault();

		const { user, password, network } = this.state;

		await this.performLogin({
			user: user.value,
			password: password.value,
			network: network.id
		});
	};



	async componentDidUpdate() {
		const { networks, autoLoginAttempted } = this.state;
		console.log("networks, autoLoginAttempted",networks, autoLoginAttempted);

		/*
		 * If we have only one network and it doesn't have auth enabled, perform a login
		 * autoLoginAttempted is a safety to prevent multiple tries
		 */
		if (
			networks.length === 1 &&
			!networks[0].authEnabled &&
			!autoLoginAttempted
		) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState(() => ({
				autoLoginAttempted: true
			}));
			await this.performLogin({ network: networks[0].id });
		}
	}
	render() {
		const {
			info,
			user,
			password,
			network,
			networks,
			authEnabled,
			isLoading
		} = this.state;

		if (!authEnabled) {
			return <div>Loading...</div>; // or redirect logic
		}
		
		const { classes, error } = this.props;

		return (
			<div className={classes.container}>
				<Paper className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h5" variant="headline">
						Sign in
					</Typography>
					<form className={classes.form} onSubmit={this.submitForm}>
						<FormControl margin="normal" required fullWidth>
							<TextField
								required
								fullWidth
								select
								id="network"
								name="network"
								label="Network"
								disabled={isLoading}
								value={network.value}
								onChange={e => this.handleChange(e)}
								margin="normal"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<ListIcon />
										</InputAdornment>
									),
									shrink: 'true'
								}}
							>
								{networks.map(item => (
									<MenuItem key={item.name} value={item.name}>
										{item.name}
									</MenuItem>
								))}
							</TextField>
							{network.error && (
								<FormHelperText id="component-error-text" error>
									{network.error}
								</FormHelperText>
							)}
						</FormControl>
						{authEnabled && (
							<FormControl margin="normal" required fullWidth>
								<TextField
									error={!!user.error}
									required
									fullWidth
									id="user"
									name="user"
									label="User"
									disabled={isLoading}
									value={user.value}
									onChange={e => this.handleChange(e)}
									margin="normal"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<PersonIcon />
											</InputAdornment>
										),
										shrink: 'true'
									}}
								/>
								{user.error && (
									<FormHelperText id="component-error-text" error>
										{user.error}
									</FormHelperText>
								)}
							</FormControl>
						)}
						{authEnabled && (
							<FormControl margin="normal" required fullWidth>
								<TextField
									required
									fullWidth
									error={!!password.error}
									id="password"
									type="password"
									name="password"
									label="Password"
									disabled={isLoading}
									value={password.value}
									onChange={e => this.handleChange(e)}
									margin="normal"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<LockOutlinedIcon />
											</InputAdornment>
										),
										shrink: 'true'
									}}
								/>
								{password.error && (
									<FormHelperText id="component-error-text" error>
										{password.error}
									</FormHelperText>
								)}
							</FormControl>
						)}
						{error && (
							<FormHelperText id="component-error-text" error>
								{error}
							</FormHelperText>
						)}
						{info && (
							<FormHelperText id="component-error-text" className={classes.errortext}>
								{info.message}
							</FormHelperText>
						)}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							{authEnabled ? 'Sign in' : 'Connect'}
						</Button>
					</form>
				</Paper>
			</div>
		);
	}
}

const { authSelector, errorSelector, networkSelector } = authSelectors;

const mapStateToProps = state => {
	return {
		auth: authSelector(state),
		error: errorSelector(state),
		networks: networkSelector(state)
	};
};

const mapDispatchToProps = {
	login: authOperations.login
};

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(Login);
export default withStyles(styles)(connectedComponent);
