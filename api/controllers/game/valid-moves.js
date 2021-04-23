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
        },
        parserError: {
            description: 'There was an error parsing the move',
            statusCode: 422
        }
    },


    fn: async function (inputs) {
        let validMoves;

        let game = await Game.findOne({ id: inputs.gameId });
        if (!game) { throw 'notFound' };

        let parser = new Parser(inputs.square, game);

        try {
            validMoves = parser.validMoves();
        } catch {
            throw 'parserError';
        }


        // All done.
        return { validMoves: validMoves };
    }

};
