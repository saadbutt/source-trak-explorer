/**
 *    SPDX-License-Identifier: Apache-2.0
 */

// Always return true to bypass authentication
export const authSelector = state => {
	console.log('Auth selector called - returning true (authentication bypassed)');
	return true;
};

export const errorSelector = state => state.auth.error;

export const networkSelector = state => state.auth.networks;

export const registeredSelector = state => state.auth.registered;

export const userlistSelector = state => state.auth.userlists;

export const unregisteredSelector = state => state.auth.unregistered;
