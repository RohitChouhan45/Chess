export class ChessBoard {
  constructor(pieceRenderer, onMove) {
    this.pieceRenderer = pieceRenderer;
    this.onMove = onMove;
    this.selectedSquare = null;
    this.validMoves = [];
    
    this.initializeBoard();
  }

  initializeBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
        square.dataset.row = row;
        square.dataset.col = col;
        square.dataset.square = this.coordsToSquare(col, row);
        
        square.addEventListener('click', () => this.handleSquareClick(square));
        board.appendChild(square);
      }
    }
  }

  updatePosition(position) {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
      const row = parseInt(square.dataset.row);
      const col = parseInt(square.dataset.col);
      const piece = position[row][col];
      
      square.innerHTML = piece ? this.pieceRenderer.renderPiece(piece) : '';
    });
  }

  handleSquareClick(square) {
    if (this.selectedSquare === square) {
      this.clearSelection();
      return;
    }

    if (this.selectedSquare) {
      const from = this.selectedSquare.dataset.square;
      const to = square.dataset.square;
      
      if (this.onMove(from, to)) {
        this.clearSelection();
        return;
      }
    }

    if (square.querySelector('.piece')) {
      this.selectSquare(square);
    }
  }

  selectSquare(square) {
    this.clearSelection();
    this.selectedSquare = square;
    square.classList.add('selected');
    
    // Highlight valid moves
    const from = square.dataset.square;
    document.querySelectorAll('.square').forEach(s => {
      const to = s.dataset.square;
      if (this.isValidMove(from, to)) {
        s.classList.add('valid-move');
      }
    });
  }

  clearSelection() {
    if (this.selectedSquare) {
      this.selectedSquare.classList.remove('selected');
      this.selectedSquare = null;
      document.querySelectorAll('.valid-move').forEach(s => {
        s.classList.remove('valid-move');
      });
    }
  }

  coordsToSquare(col, row) {
    return `${'abcdefgh'[col]}${8 - row}`;
  }

  isValidMove(from, to) {
    try {
      const game = new Chess();
      game.load_pgn(window.game.pgn());
      const move = game.move({ from, to, promotion: 'q' });
      return !!move;
    } catch {
      return false;
    }
  }
}