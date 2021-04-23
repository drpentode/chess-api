# Chess API

This API simulates a chess game using RESTful API endpoints.

## Endpoints

* `POST /game/new` - Creates new game - returns game ID and a pre-populated board
* `GET /game/:game_id` - current state of the gameboard
* `PUT /game/:game_id` - uses Chess Notation to make a move - ex. `{ "moveStatement": "e4" }` - Moves the white pawn on e2 to e4
* `GET /game/:game_id/possibleMoves/:move` - Uses Chess Notation to see possible moves - ex. `/game/608209c4480e828b83f020bd/possibleMoves/e4` - Shows an array of possible moves from that point on the board
* `GET /game/:game_id/history` - history of the game - not implemented

## Example Game Board Data Object

```
{
  "createdAt": <<unix time>>,
  "updatedAt": <<unix time>>,
  "id": << auto generated id >>,
  "currentPlayer": "white",
  "board": {
    "a1": {
      "state": {
        "occupied": true,
        "color": "W",
        "piece": "R"
      }
    },
    "a2": {
      "state": {
        "occupied": true,
        "color": "W",
        "piece": "P"
      }
    },
    "a3": {
      "state": {
        "occupied": false,
        "color": null,
        "piece": null
      }
    }
  }
}
```

## Example Possible Moves Data Object
```
{
    "validMoves": [
        "e5",
        "exd5"
    ]
}
```

## Understanding Chess Notation

https://www.chess.com/article/view/chess-notation#algebraic-notation

## External Libraries

1. sails-mongo - Used to connect to mongodb

## System Requirements

1. Node.js 14
2. MongoDB

## Usage

To use this app, check it out from Github, then do the following:

1. `npm install`
2. `sails lift`
3. Use http://localhost:1337/ as the host name in all your requests.

This is an API-only application. There is no UI.

