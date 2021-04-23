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
            statusCode: 404
        },
        parserError: {
            description: 'There was an error parsing the move',
            statusCode: 422
        },
        saveError: {
            description: 'Game could not be saved to the server',
            statusCode: 500
        }
    },

    fn: async function (inputs) {
        let parsedGame; 

        let game = await Game.findOne({ id: inputs.gameId });
        if (!game) { throw 'notFound' };

        let parser = new Parser(inputs.moveStatement, game);

        try {
            parsedGame = parser.parse();
        } catch {
            throw 'parserError';
        }

        let updatedGame = await Game.updateOne({
            id: inputs.gameId
        }).set({
            board: parsedGame.board,
            currentPlayer: parsedGame.currentPlayer,
            history: parsedGame.history
        });

        if (updatedGame) {
            return updatedGame;
        } else {
            throw 'saveError';
        }

    }


};
