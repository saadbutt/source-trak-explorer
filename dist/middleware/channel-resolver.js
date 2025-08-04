"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelResolver = void 0;
/**
 * Middleware to resolve channel name to channel_genesis_hash
 * This middleware checks if the channel_genesis_hash parameter is actually a channel name
 * and converts it to the actual channel_genesis_hash from the database
 */
function channelResolver(platform) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        console.log(`[Channel Resolver] MIDDLEWARE CALLED for URL: ${req.url}`);
        console.log(`[Channel Resolver] Method: ${req.method}`);
        console.log(`[Channel Resolver] Params:`, req.params);
        const extReq = req;
        // Handle both channel_genesis_hash and channel parameters
        let channelParam = req.params.channel_genesis_hash || req.params.channel;
        if (!channelParam) {
            return next();
        }
        // Check if the parameter looks like a channel name (not a hash)
        // Channel names are typically simple strings like "mychannel"
        // Channel genesis hashes are long hex strings
        const isLikelyChannelName = !channelParam.match(/^[a-fA-F0-9]{64}$/);
        console.log(`[Channel Resolver] URL: ${req.url}`);
        console.log(`[Channel Resolver] Channel Param: ${channelParam}`);
        console.log(`[Channel Resolver] Is Likely Channel Name: ${isLikelyChannelName}`);
        if (isLikelyChannelName) {
            try {
                const dbCrudService = platform.getPersistence().getCrudService();
                console.log(`[Channel Resolver] Looking up channel: ${channelParam} in network: ${extReq.network}`);
                const channelResult = yield dbCrudService.getChannelGenesisHashByName(extReq.network, channelParam);
                console.log(`[Channel Resolver] Database result:`, channelResult);
                if (channelResult && channelResult.channel_genesis_hash) {
                    // Replace the parameter with the actual channel_genesis_hash
                    if (req.params.channel_genesis_hash) {
                        req.params.channel_genesis_hash = channelResult.channel_genesis_hash;
                    }
                    if (req.params.channel) {
                        req.params.channel = channelResult.channel_genesis_hash;
                    }
                    extReq.resolvedChannelGenesisHash = channelResult.channel_genesis_hash;
                    console.log(`[Channel Resolver] Converted ${channelParam} to ${channelResult.channel_genesis_hash}`);
                }
                else {
                    // Channel not found in database
                    console.log(`[Channel Resolver] Channel '${channelParam}' not found in database`);
                    return res.status(404).json({
                        status: 404,
                        error: `Channel '${channelParam}' not found in database`
                    });
                }
            }
            catch (error) {
                console.error('[Channel Resolver] Error resolving channel name to genesis hash:', error);
                return res.status(500).json({
                    status: 500,
                    error: 'Internal server error while resolving channel'
                });
            }
        }
        else {
            console.log(`[Channel Resolver] Parameter ${channelParam} is already a genesis hash, skipping conversion`);
        }
        next();
    });
}
exports.channelResolver = channelResolver;
//# sourceMappingURL=channel-resolver.js.map