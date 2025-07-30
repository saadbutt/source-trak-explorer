// SPDX-License-Identifier: Apache-2.0
export default class Auth {
	/**
	 * Authenticate a user. Save a token string in Local Storage
	 *
	 * @param {string} token
	 */
	static authenticateUser(token) {
		// Authentication bypassed - no token needed
	}

	/**
	 * Check if a user is authenticated - check if a token is saved in Local Storage
	 *
	 * @returns {boolean}
	 */
	static isUserAuthenticated() {
		// Always return true since authentication is bypassed
		return true;
	}

	/**
	 * Deauthenticate a user. Remove a token from Local Storage.
	 *
	 */
	static deauthenticateUser() {
		// Authentication bypassed - no token to remove
	}

	/**
	 * Get a token value.
	 *
	 * @returns {string}
	 */

	static getToken() {
		// Return empty string since authentication is bypassed
		return '';
	}
}
