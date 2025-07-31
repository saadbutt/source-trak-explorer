/**
 *    SPDX-License-Identifier: Apache-2.0
 */
import { helper } from '../common/helper';
import { responder } from './requestutils';

const logger = helper.getLogger('Auth');

/**
 *
 *
 * @param {*} router
 * @param {*} platform
 */
export async function authroutes(router: any, platform: any) {
	const proxy = platform.getProxy();

	/**
	 * *
	 * Network list
	 * GET /networklist -> /login
	 * curl -i 'http://<host>:<port>/networklist'
	 */

	router.get(
		'/networklist',
		responder(async (req: any) => {
			const networkList = await proxy.networkList(req);
			return { networkList };
		})
	);

	/**
	 * *
	 * Login - Modified to bypass authentication
	 * POST /login -> /login
	 * curl -X POST -H 'Content-Type: application/json' -d '{ 'user': '<user>', 'password': '<password>', 'network': '<network>' }' -i 'http://<host>:<port>/login'
	 */
	router.post('/login', async (req, res, next) => {
		logger.debug('req.body', req.body);
		// Bypass authentication - return mock success response
		return res.status(200).json({
			success: true,
			message: 'Authentication bypassed - login successful!',
			token: 'mock-jwt-token',
			user: {
				user: req.body.user || 'anonymous',
				network: req.body.network || 'default'
			}
		});
	});

	router.post(
		'/logout',
		async (req: { body: any; logout: () => void }, res: { send: () => void; status: (code: number) => { json: (data: any) => void } }) => {
			logger.debug('req.body', req.body);
			// Bypass logout - return mock success response
			return res.status(200).json({
				success: true,
				message: 'Authentication bypassed - logout successful!'
			});
		}
	);
}
