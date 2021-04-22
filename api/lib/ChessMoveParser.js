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
        this.attack = null;
        this.attackMove = null;
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

        if (this.move.search(/x/gi) == -1) {
            if (this.gameBoard[this.move].state.occupied) {
                throw 'Destination square is occupied by another piece';
            }

            this.attack = false;
        } else {
            this.attack = true;
        }

        // we have columns and a pawn
        if (this.#columns.includes(this.move.charAt(0)) && 
            (this.#rows.includes(parseInt(this.move.charAt(1))) 
                || this.#rows.includes(parseInt(this.move.charAt(3)))) // checks both attacks and non-attacks
        ) { 
            return this.validatePawn();
        } else {
            throw 'Move is out of bounds';
        }
    }

    validatePawn() {
        this.piece = 'P'; // needed for saving the move later on
        let squareCheck;

        if (this.attack) {
            let previousRow;

            let newColumn = this.move.charAt(2);
            let newRow = this.move.charAt(3);
            
            this.attackMove = newColumn + newRow;

            if (this.color == 'white') {
                previousRow = (parseInt(newRow) - 1).toString();
            } else if (this.color == 'black') {
                previousRow = (parseInt(newRow) + 1).toString();
            }
            
            squareCheck = this.move.charAt(0) + previousRow;

            if (this.gameBoard[squareCheck].state.occupied && this.gameBoard[squareCheck].state.piece == 'P') {
                this.originSquare = squareCheck;

                if (this.gameBoard[this.attackMove].state.occupied && this.gameBoard[this.attackMove].state.color != this.color) {
                    return true;
                } else {
                    throw 'Invalid move'
                }
            } else {
                throw 'Invalid move'
            }
        } else {
            let newColumn = this.move.charAt(0);
            let newRow = parseInt(this.move.charAt(1));

            let twoSquares;
            let twoSquareCheck;

            if (this.color == 'white') {
                twoSquares = this.#whitePawnTwoMoveSquares;
                twoSquareCheck = newColumn + (newRow - 2).toString();
                squareCheck = newColumn + (newRow - 1).toString();
            } else if (this.color == 'black') {
                twoSquares = this.#blackPawnTwoMoveSquares;
                twoSquareCheck = newColumn + (newRow + 2).toString();
                squareCheck = newColumn + (newRow + 1).toString();
            }

            if (twoSquares.includes(this.move)) {
                if (this.gameBoard[twoSquareCheck].state.occupied && this.gameBoard[twoSquareCheck].state.piece == 'P') {
                    this.originSquare = twoSquareCheck;
                    return true;
                } else {
                    throw 'Invalid move'
                }
            } else {
                if (this.gameBoard[squareCheck].state.occupied && this.gameBoard[squareCheck].state.piece == 'P') {
                    this.originSquare = squareCheck;
                    return true;
                } else {
                    throw 'Invalid move'
                }

            }
        }

    }

    movePiece() {
        let validatedMove;

        if (this.attack) {
            validatedMove = this.attackMove;
        } else {
            validatedMove = this.move;
        }

        this.updatedGame.board[this.originSquare] = { state: { occupied: false, piece: null, color: null } };
        this.updatedGame.board[validatedMove] = { state: { occupied: true, piece: this.piece, color: this.color } };

        if (this.color == 'white') {
            this.updatedGame.currentPlayer = 'black'
        } else {
            this.updatedGame.currentPlayer = 'white'
        }

        return this.updatedGame;
    }

}

module.exports = ChessMoveParser;
