const Parser = require('../../lib/ChessMoveParser');

module.exports = {


    friendlyName: 'Valid moves',


    description: 'Shows possible valid moves for a piece, including potential captures',


    inputs: {
        gameId: {
            description: 'The ID of the game',
            type: 'string',
            required: true
        },
        square: {
            description: 'Occupied square to investigate',
            type: 'string',
            required: true
        }
    },


    exits: {
        notFound: {
            description: 'No game found with the specified ID was found in the database',
            statusCode: 404
        }
    },


    fn: async function (inputs) {
        let game = await Game.findOne({ id: inputs.gameId });
        if (!game) { throw 'notFound' };

        let parser = new Parser(inputs.square, game);
        validMoves = parser.validMoves();

        // All done.
        return { validMoves: validMoves };

    }


};
