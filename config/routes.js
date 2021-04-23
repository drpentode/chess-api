/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
    'GET /game/:gameId': { action: 'game/status' },
    'PUT /game/:gameId': { action: 'game/move' },
    'GET /game/:gameId/history': { action: 'game/history' },
    'GET /game/:gameId/possibleMoves/:square' : { action: 'game/valid-moves' }
};
