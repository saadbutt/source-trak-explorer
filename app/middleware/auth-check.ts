/*
 * SPDX-License-Identifier: Apache-2.0
 */

import * as jwt from 'jsonwebtoken';
import config from '../explorerconfig.json';

/**
 *  The Auth Checker middleware function.
 *  Modified to bypass authentication while maintaining API compatibility.
 */
export const authCheckMiddleware = (req, res, next) => {
	// Bypass authentication - always allow access
	// Set default values to maintain API compatibility
	req.requestUserId = 'anonymous';
	req.network = 'default';
	
	// Continue to the next middleware/route handler
	return next();
};
