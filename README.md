# Chess API

This API simulates a chess game using RESTful API endpoints.

## Endpoints

* `POST /game/new` - Creates new game - returns game ID and a pre-populated board
* `GET /game/:game_id/status` - current state of the gameboard
* `PUT /game/:game_id/move/:move_dsl` - uses Chess Notation to make a move
* `GET /game/:game_id/history` - history of the game

## Example Game Board Data Object

```
{
  "board": {
    "a1": {
      "state": {
        "occupied": "true",
        "color": "W",
        "piece": "R"
      }
    },
    "a2": {
      "state": {
        "occupied": "true",
        "color": "W",
        "piece": "P"
      }
    },
    "a3": {
      "state": {
        "occupied": "false"
        "color": "null",
        "piece": "null"
      }
    }
  }
}
```

## Example of Game History

Game history uses algebraic chess notation. Pawns do not have an abbreviation in this notation.

```
{
  "game": {
    { "id": "xyz123",
      "moves": [
        "e4 e5",
        "d3 d6"
      ]
    }
  }
}
```


## Understanding Chess Notation

https://www.chess.com/article/view/chess-notation#algebraic-notation

## External Libraries

1. sails-mongo - Used to connect to mongodb

