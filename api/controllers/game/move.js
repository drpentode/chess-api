const Parser = require('../../lib/ChessMoveParser');

module.exports = {


    friendlyName: 'Move',


    description: 'Move a chess piece',


    inputs: {
        gameId: {
            description: 'The ID of the game for the move',
            type: 'string',
            required: true
        },
        moveStatement: {
            description: 'The game move written in algebraic notation',
            type: 'string',
            required: true
        }
    },

    exits: {
        notFound: {
            description: 'No game found with the specified ID was found in the database',
            responseType: 'notFound'
        }
    },

    fn: async function (inputs) {
        let updatedGameBoard = {};

        let game = await Game.findOne({ id: inputs.gameId });
        if (!game) { throw 'notFound' };

        let parser = new Parser(inputs.moveStatement, game.board);
        let parsedMove = parser.parse();

        // All done.
        return updatedGameBoard;

    }


};
