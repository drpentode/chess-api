module.exports = {


    friendlyName: 'Status',


    description: 'Gets the gameboard status according to the game ID',


    inputs: {
        gameId: {
            description: 'The ID of the game',
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
        let game = await Game.findOne({ id: inputs.gameId });
        if (!game) { throw 'notFound' };
        
        if (game) {
            return game;
        } else {
            sails.log('Game could not be found');
        }
    }


};
