/**
 * Game.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

// Generates a blank game board with no pieces
function generateGameBoard() {
    let xCoords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let yCoords = [1, 2, 3, 4, 5, 6, 7, 8];
    let gameBoard = {};

    xCoords.forEach((xCoord) => {
        yCoords.forEach((yCoord) => {
            let square = {
                state: {
                    occupied: false,
                    color: null,
                    piece: null
                }
            }

            let squareName = xCoord + yCoord;
            gameBoard[squareName] = square;
        });
    });

    let populatedBoard = populateBoard(gameBoard);

    return populatedBoard;
}

function populateBoard(gameBoard) {
    let whitePawns = ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];
    let blackPawns = ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];

    whitePawns.forEach((pawn) => {
        gameBoard[pawn] = {
            state: {
                occupied: true,
                color: 'white',
                piece: 'P'
            }
        }
    });

    blackPawns.forEach((pawn) => {
        gameBoard[pawn] = {
            state: {
                occupied: true,
                color: 'black',
                piece: 'P'
            }
        }

    });

    return gameBoard;
}


module.exports = {

    attributes: {
        board: { type: 'json' }
    },

    beforeCreate: function (recordToCreate, next) {
        recordToCreate.board = generateGameBoard();
        next();
    }
};

