/**
 *    SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */

import React from 'react';

import { Route } from 'react-router-dom';

import { connect } from 'react-redux';

import { authSelectors } from '../../state/redux/auth';

export function Private({ render, auth, ...rest }) {
	// Always render the component without authentication checks
	return (
		<Route
			{...rest}
			render={props => render(props)}
		/>
	);
}

const { authSelector } = authSelectors;

export default connect(state => ({
	auth: authSelector(state)
}))(Private);
