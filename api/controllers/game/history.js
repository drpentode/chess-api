module.exports = {


    friendlyName: 'History',


    description: 'Not Implemented - Returns the move history of a game in algebraic notation',


    inputs: {
        gameId: {
            description: 'The ID of the game',
            type: 'string',
            required: true
        }

    },


    exits: {
        notImplemented: {
            description: 'Feature not implemented',
            statusCode: 501
        }

    },


    fn: async function (inputs) {
        throw 'notImplemented';
    }


};
