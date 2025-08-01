/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import clientJson from '../../../package.json';
import FabricVersion from '../../FabricVersion';

const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		root: {
			margin: '1rem'
		},
		footer: {
			backgroundColor: dark ? 'rgba(26, 32, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)',
			backdropFilter: 'blur(10px)',
			color: dark ? '#e2e8f0' : '#4a5568',
			textAlign: 'center',
			position: 'fixed',
			left: 0,
			right: 0,
			bottom: 0,
			padding: '1rem',
			borderTop: dark ? '1px solid rgba(74, 85, 104, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
			boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
			fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
			fontSize: '0.875rem',
			fontWeight: 500
		}
	};
};

const FooterView = ({ classes }) => (
	<div className={classes.root}>
		<div>
			<div className={classes.footer}>
				{'Hyperledger Explorer Client Version: '}
				{clientJson.version}
				&emsp;
				{'Fabric Compatibility: '} {FabricVersion.map(v => v)}
			</div>
		</div>
	</div>
);

export default withStyles(styles)(FooterView);
