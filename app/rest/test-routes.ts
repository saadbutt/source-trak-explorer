import { Router } from 'express';
import { Request } from 'express-serve-static-core';
import { Platform } from '../platform/fabric/Platform';
import * as requtil from './requestutils';
import { channelResolver } from '../middleware/channel-resolver';

interface ExtRequest extends Request {
	network: string;
}

export function testRoutes(router: Router, platform: Platform) {
	const dbCrudService = platform.getPersistence().getCrudService();
	const channelResolverMiddleware = channelResolver(platform);

	router.get(
		'/blockAndTxList/:channel_genesis_hash/:blocknum',
		channelResolverMiddleware,
		async (req, res) => {
			console.log(`[Test BlockAndTxList Route] Route handler called`);
			console.log(`[Test BlockAndTxList Route] URL: ${req.url}`);
			console.log(`[Test BlockAndTxList Route] Params:`, req.params);

			const channel_genesis_hash = req.params.channel_genesis_hash;
			const blockNum = parseInt(req.params.blocknum);
			const orgs = requtil.parseOrgsArray(req.query);
			const { from, to } = requtil.queryDatevalidator(
				req.query.from as string,
				req.query.to as string
			);
			const { page, size } = req.query;

			console.log(
				`[Test BlockAndTxList Route] channel_genesis_hash: ${channel_genesis_hash}`
			);
			console.log(`[Test BlockAndTxList Route] blockNum: ${blockNum}`);
			console.log(`[Test BlockAndTxList Route] page: ${page}, size: ${size}`);

			if (channel_genesis_hash) {
				const extReq = (req as unknown) as ExtRequest;
				console.log(
					`[Test BlockAndTxList Route] Calling getBlockAndTxList with network: ${extReq.network}`
				);

				let data;
				try {
					data = await dbCrudService.getBlockAndTxList(
						extReq.network,
						channel_genesis_hash,
						blockNum,
						from,
						to,
						orgs,
						page,
						size
					);
					console.log(
						`[Test BlockAndTxList Route] getBlockAndTxList completed successfully`
					);
				} catch (error) {
					console.error(
						`[Test BlockAndTxList Route] Error calling getBlockAndTxList:`,
						error
					);
					throw error;
				}

				console.log(`[Test BlockAndTxList Route] Data returned:`, data);
				if (data) {
					return res.send({
						status: 200,
						rows: data
					});
				}
				return requtil.notFound(req, res);
			} else {
				return requtil.invalidRequest(req, res);
			}
		}
	);
}
