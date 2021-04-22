class ChessMoveParser {
    #chessPieces = ['K', 'Q', 'B', 'N', 'R'];
    #columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    #rows = [1, 2, 3, 4, 5, 6, 7, 8];

    #whitePawnSquares = ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];
    #whitePawnTwoMoveSquares = ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'];

    #blackPawnStartSquares = ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];
    #blackPawnTwoMoveSquares = ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'];

    constructor(move, game) {
        this.gameBoard = game.board;
        this.color = game.currentPlayer;
        this.move = move;
        
        this.updatedGame = Object.assign({}, game);
        this.originSquare = null;
        this.piece = null;
    }

    parse() {
        if (this.validate()) {
            return this.movePiece();
        };
    }

    validate() {
        if (this.move.charAt(0) == 'P') {
            throw 'P as an abbreviation for a pawn is not supported by algebraic notation. Please see https://www.chess.com/terms/chess-notation';
        }

        if (this.#chessPieces.includes(this.move.charAt(0))) {
            throw 'Only pawns are implemented. Other chess pieces will be supported later.';
        }

        // we have columns and a pawn
        if (this.#columns.includes(this.move.charAt(0)) && this.#rows.includes(parseInt(this.move.charAt(1)))) {
            this.piece = 'P'; // needed for saving the move later on
            let newColumn = this.move.charAt(0);
            let newRow = parseInt(this.move.charAt(1));

            if (this.gameBoard[this.move].state.occupied) {
                throw 'Destination square is occupied by another piece';
            } else {
                //confirm originating square
                // is it two rows back?
                if (this.#whitePawnTwoMoveSquares.includes(this.move) || this.#blackPawnTwoMoveSquares.includes(this.move)) {
                    let whiteSquareCheck = newColumn + (newRow - 2).toString();
                    let blackSquareCheck = newColumn + (newRow + 2).toString();

                    if (this.color == 'white' && this.gameBoard[whiteSquareCheck].state.occupied && this.gameBoard[whiteSquareCheck].state.piece == 'P') {
                        this.originSquare = whiteSquareCheck;
                        return true;
                    } else if (this.color == 'black' && this.gameBoard[blackSquareCheck].state.occupied && this.gameBoard[blackSquareCheck].state.piece == 'P') {
                        this.originSquare = blackSquareCheck;
                        return true;
                    } else {
                        throw 'The move is invalid because there is no Pawn on the originating square';
                    }
                // is it one row back?
                } else {
                    let whiteSquareCheck = newColumn + (newRow - 1).toString();
                    let blackSquareCheck = newColumn + (newRow + 1).toString();

                    if (this.color == 'white' && this.gameBoard[whiteSquareCheck].state.occupied && this.gameBoard[whiteSquareCheck].state.piece == 'P') {
                        this.originSquare = whiteSquareCheck;
                        return true;
                    } else if (this.color == 'black' && this.gameBoard[blackSquareCheck].state.occupied && this.gameBoard[blackSquareCheck].state.piece == 'P') {
                        this.originSquare = blackSquareCheck;
                        return true;
                    } else {
                        throw 'The move is invalid because there is no Pawn on the originating square'
                    }
                }
            }
        } else {
            throw 'Move is out of bounds';
        }
    }

    validatePawn() {
        return false;
    }

    movePiece() {
        this.updatedGame.board[this.originSquare] = { state: { occupied: false, piece: null, color: null } };
        this.updatedGame.board[this.move] = { state: { occupied: true, piece: this.piece, color: this.color } };

        if (this.color == 'white') {
            this.updatedGame.currentPlayer = 'black'
        } else {
            this.updatedGame.currentPlayer = 'white'
        }

        return this.updatedGame;
    }

}

module.exports = ChessMoveParser;
