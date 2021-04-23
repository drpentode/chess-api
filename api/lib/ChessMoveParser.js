class ChessMoveParser {
    #chessPieces = ['K', 'Q', 'B', 'N', 'R'];
    #columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    #rows = [1, 2, 3, 4, 5, 6, 7, 8];

    #whitePawnSquares = ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'];
    #whitePawnTwoMoveSquares = ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'];

    #blackPawnSquares = ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'];
    #blackPawnTwoMoveSquares = ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'];

    constructor(moveOrPiece, game) {
        this.gameBoard = game.board;
        this.color = game.currentPlayer;
        this.move = moveOrPiece;

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

    validMoves() {
        let gameSquare = this.gameBoard[this.move].state;

        if (!gameSquare.occupied) {
            throw 'Square is not occupied';
        }

        if (gameSquare.piece != 'P') {
            throw 'Only pawns are implemented';
        }

        if (!this.#columns.includes(this.move.charAt(0)) || !this.#rows.includes(parseInt(this.move.charAt(1)))) {
            throw 'Square is out of bounds';
        }

        this.piece = gameSquare.piece;
        this.color = gameSquare.color;

        switch (this.piece) {
            case 'P':
                return this.validPawnMoves();
                break;
            default:
                throw 'Only pawns are implemented';
        }
    }

    validPawnMoves() {
        let column =  this.move.charAt(0);
        let row = parseInt(this.move.charAt(1));

        let pawnSquares;
        let validMoves = [];

        // home row check
        if (this.color == 'white') {
            pawnSquares = this.#whitePawnSquares;
        } else if (this.color == 'black') {
            pawnSquares = this.#blackPawnSquares;
        }

        if (pawnSquares.includes(this.move)) {
            let move1;
            let move2;

            if (this.color == 'white') {
                move1 = column + (row + 1).toString();
                move2 = column + (row + 2).toString();
            } else if (this.color == 'black') {
                move1 = column + (row - 1).toString();
                move2 = column + (row - 2).toString();
            }

            if (this.gameBoard[move1].state.occupied == false) {
                validMoves.push(move1);
            }

            if (this.gameBoard[move2].state.occupied == false) {
                validMoves.push(move2);
            }
        } else {
            // pawns anywhere
            if ((this.color == 'white' && row == 9) || (this.color == 'black' && row == 1)) {
                throw 'You are at the end of the board. No more moves.'
            }

            let forwardSquare;
            let leftDiagSquare;
            let rightDiagSquare;

            let leftCheck = this.#columns.indexOf(column) - 1;
            let rightCheck = this.#columns.indexOf(column) + 1;

            if (this.color == 'white') {
                forwardSquare = column + (row + 1).toString();

                if (this.gameBoard[forwardSquare].state.occupied == false) {
                    validMoves.push(forwardSquare);
                }

                if (leftCheck != -1) {
                    leftDiagSquare = this.#columns[leftCheck] + (row + 1).toString();

                    if (this.gameBoard[leftDiagSquare].state.occupied == true && this.gameBoard[leftDiagSquare].state.color == 'black') {
                        let formattedLeftDiagSquare = column + 'x' + leftDiagSquare;
                        validMoves.push(formattedLeftDiagSquare);
                    }
                }

                if (rightCheck != -1) {
                    rightDiagSquare = this.#columns[rightCheck] + (row + 1).toString();

                    if (this.gameBoard[rightDiagSquare].state.occupied == true && this.gameBoard[rightDiagSquare].state.color == 'black') {
                        let formattedRightDiagSquare = column + 'x' + rightDiagSquare;
                        validMoves.push(formattedRightDiagSquare);
                    }
                }

            } else if (this.color == 'black') {
                forwardSquare = column + (row - 1).toString();

                if (this.gameBoard[forwardSquare].state.occupied == false) {
                    validMoves.push(forwardSquare);
                }

                if (leftCheck != -1) {
                    leftDiagSquare = pawnSquares[leftCheck] + (row - 1).toString();

                    if (this.gameBoard[leftDiagSquare].state.occupied == true && this.gameBoard[leftDiagSquare].state.color == 'white') {
                        let formattedRightDiagSquare = column + 'x' + rightDiagSquare;
                        validMoves.push(formattedLeftDiagSquare);
                    }
                }

                if (rightCheck != -1) {
                    rightDiagSquare = pawnSquares[rightCheck] + (row - 1).toString();

                    if (this.gameBoard[rightDiagSquare].state.occupied == true && this.gameBoard[rightDiagSquare].state.color == 'white') {
                        let formattedRightDiagSquare = column + 'x' + rightDiagSquare;
                        validMoves.push(formattedRightDiagSquare);
                    }
                }
            }
        }

        return validMoves;
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
