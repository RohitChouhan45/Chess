export class ChessAI {
  constructor() {
    this.depth = 2;
    this.pieceValues = {
      p: 100,
      n: 320,
      b: 330,
      r: 500,
      q: 900,
      k: 20000
    };
  }

  setDepth(depth) {
    this.depth = depth;
  }

  getBestMove(game) {
    const moves = game.moves({ verbose: true });
    let bestMove = null;
    let bestValue = -Infinity;
    
    for (const move of moves) {
      game.move(move);
      const value = -this.minimax(game, this.depth - 1, -Infinity, Infinity, false);
      game.undo();
      
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }
    
    return bestMove;
  }

  minimax(game, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0) {
      return this.evaluatePosition(game);
    }

    const moves = game.moves();
    
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of moves) {
        game.move(move);
        const evalScore = this.minimax(game, depth - 1, alpha, beta, false);
        game.undo();
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        game.move(move);
        const evalScore = this.minimax(game, depth - 1, alpha, beta, true);
        game.undo();
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  evaluatePosition(game) {
    let value = 0;
    
    // Game over conditions
    if (game.in_checkmate()) {
      return game.turn() === 'w' ? -20000 : 20000;
    }
    if (game.in_draw()) {
      return 0;
    }

    // Material counting
    const board = game.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const pieceValue = this.pieceValues[piece.type];
          value += piece.color === 'w' ? pieceValue : -pieceValue;
          
          // Position bonus
          value += this.getPositionBonus(piece, row, col);
        }
      }
    }
    
    return value;
  }

  getPositionBonus(piece, row, col) {
    const bonus = {
      p: [ // Pawn position bonus
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
      ],
      n: [ // Knight position bonus
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
      ]
    };
    
    if (bonus[piece.type]) {
      const position = piece.color === 'w' ? bonus[piece.type][row][col] : bonus[piece.type][7-row][7-col];
      return position * 0.1;
    }
    
    return 0;
  }
}