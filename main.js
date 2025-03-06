import { ChessBoard } from './board.js';
import { ChessAI } from './ai.js';
import { PieceRenderer } from './pieces.js';
import { SoundManager } from './sound.js';
import { ConfettiCelebration } from './confetti.js';

class ChessGame {
  constructor() {
    this.game = new Chess();
    this.pieceRenderer = new PieceRenderer();
    this.soundManager = new SoundManager();
    this.board = new ChessBoard(this.pieceRenderer, this.onMove.bind(this));
    this.ai = new ChessAI();
    this.confetti = new ConfettiCelebration();
    
    this.initializeControls();
    this.newGame();
    
    // Add disco theme animation
    this.discoInterval = null;
    this.initDiscoAnimation();
    
    this.snowInterval = null;
    this.initSnowAnimation();
    
    // Add laser container
    this.initLaserShow();
    
    this.initDiscoBall();

    this.tutorialMode = false;
    this.tutorialStep = 0;
    this.initializeTutorialControls();
    this.tutorialSteps = [
      {
        title: "Welcome to Chess!",
        text: "Chess is a game of strategy between two players. White moves first. Let's learn how each piece moves!",
        highlight: [],
        pieces: []
      },
      {
        title: "The Pawn",
        text: "Pawns move forward one square at a time. On their first move, they can move two squares. They capture diagonally.",
        highlight: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
        pieces: [{ type: 'p', color: 'w' }, { type: 'p', color: 'b' }]
      },
      {
        title: "The Rook",
        text: "Rooks move any number of squares horizontally or vertically.",
        highlight: ['a1', 'h1'],
        pieces: [{ type: 'r', color: 'w' }, { type: 'r', color: 'b' }]
      },
      {
        title: "The Knight",
        text: "Knights move in an L-shape: two squares in one direction and then one square perpendicular to that direction.",
        highlight: ['b1', 'g1'],
        pieces: [{ type: 'n', color: 'w' }, { type: 'n', color: 'b' }]
      },
      {
        title: "The Bishop",
        text: "Bishops move any number of squares diagonally.",
        highlight: ['c1', 'f1'],
        pieces: [{ type: 'b', color: 'w' }, { type: 'b', color: 'b' }]
      },
      {
        title: "The Queen",
        text: "The Queen is the most powerful piece. She can move any number of squares in any direction (horizontally, vertically, or diagonally).",
        highlight: ['d1'],
        pieces: [{ type: 'q', color: 'w' }, { type: 'q', color: 'b' }]
      },
      {
        title: "The King",
        text: "The King can move one square in any direction. Protect your King at all costs - if it's captured (checkmate), you lose!",
        highlight: ['e1'],
        pieces: [{ type: 'k', color: 'w' }, { type: 'k', color: 'b' }]
      },
      {
        title: "Special Moves",
        text: "There are special moves like castling (King & Rook swap) and en passant (special Pawn capture). You'll learn these as you play!",
        highlight: [],
        pieces: []
      },
      {
        title: "Ready to Play!",
        text: "The goal is to checkmate your opponent's King. Good luck!",
        highlight: [],
        pieces: []
      }
    ];
  }

  initializeControls() {
    document.getElementById('newGame').addEventListener('click', () => this.newGame());
    document.getElementById('difficulty').addEventListener('change', (e) => {
      this.ai.setDepth(parseInt(e.target.value));
    });
    document.getElementById('theme').addEventListener('change', (e) => {
      this.setTheme(e.target.value);
    });
  }

  setTheme(theme) {
    const board = document.getElementById('board');
    board.className = `board ${theme}`;
    
    // Remove all theme classes from body
    document.body.classList.remove('disco-theme', 'snow-theme', 'desert-theme');
    
    // Clear any existing snowflakes
    document.querySelectorAll('.snowflake').forEach(flake => flake.remove());
    
    // Stop existing intervals
    if (this.snowInterval) {
      clearInterval(this.snowInterval);
      this.snowInterval = null;
    }
    
    // Add appropriate theme class and start animations
    if (theme === 'disco') {
      document.body.classList.add('disco-theme');
    } else if (theme === 'snow') {
      document.body.classList.add('snow-theme');
      this.startSnowAnimation();
    } else if (theme === 'desert') {
      document.body.classList.add('desert-theme');
    }
  }

  createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.style.left = `${Math.random() * 100}%`;
    snowflake.style.width = `${Math.random() * 4 + 2}px`;
    snowflake.style.height = snowflake.style.width;
    snowflake.style.opacity = Math.random() * 0.7 + 0.3;
    snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // Random duration between 5-10s
    snowflake.style.filter = `blur(${Math.random()}px)`;
    document.body.appendChild(snowflake);
    
    // Remove snowflake after animation completes
    setTimeout(() => {
      snowflake.remove();
    }, 10000);
  }

  startSnowAnimation() {
    // Create new snowflakes periodically
    this.snowInterval = setInterval(() => {
      if (document.body.classList.contains('snow-theme')) {
        for (let i = 0; i < 3; i++) { // Create multiple snowflakes per interval
          this.createSnowflake();
        }
      }
    }, 200); // Create new snowflakes every 200ms
  }

  newGame() {
    this.game.reset();
    this.board.updatePosition(this.game.board());
    this.updateStatus();
    this.updateMoveHistory();
    this.updateCapturedPieces();
  }

  onMove(from, to) {
    const prevBoard = this.game.board();
    const move = this.game.move({
      from: from,
      to: to,
      promotion: 'q'
    });

    if (move) {
      const currentBoard = this.game.board();
      const pieceWasCaptured = this.detectCapture(prevBoard, currentBoard);
      
      if (pieceWasCaptured) {
        this.soundManager.playCapture();
      } else {
        this.soundManager.playMove();
      }

      this.board.updatePosition(this.game.board());
      this.updateStatus();
      this.updateMoveHistory();
      this.updateCapturedPieces();

      // Check if white player won
      if (this.game.in_checkmate() && this.game.turn() === 'b') {
        this.soundManager.playWin();
        setTimeout(() => this.confetti.start(), 100); // Ensure confetti starts after the board updates
        return true;
      }

      // AI move
      if (!this.game.game_over()) {
        setTimeout(() => {
          const prevBoardAI = this.game.board();
          const aiMove = this.ai.getBestMove(this.game);
          this.game.move(aiMove);
          
          const currentBoardAI = this.game.board();
          const aiCaptured = this.detectCapture(prevBoardAI, currentBoardAI);
          
          if (aiCaptured) {
            this.soundManager.playCapture();
          } else {
            this.soundManager.playMove();
          }

          this.board.updatePosition(this.game.board());
          this.updateStatus();
          this.updateMoveHistory();
          this.updateCapturedPieces();

          if (this.game.game_over()) {
            if (this.game.in_checkmate()) {
              this.soundManager.playLose();
            }
          }
        }, 250);
      }
    }

    return !!move;
  }

  initDiscoAnimation() {
    const animateDiscoSquares = () => {
      if (document.getElementById('board').classList.contains('disco')) {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => square.classList.remove('glow'));
        
        // Randomly select squares to glow
        const numGlowingSquares = 5;
        for (let i = 0; i < numGlowingSquares; i++) {
          const randomIndex = Math.floor(Math.random() * squares.length);
          squares[randomIndex].classList.add('glow');
        }
      }
    };

    // Start disco animation
    this.discoInterval = setInterval(animateDiscoSquares, 1000);
  }

  initLaserShow() {
    const laserContainer = document.createElement('div');
    laserContainer.className = 'laser-container';
    
    // Create 6 laser beams for left side
    for (let i = 0; i < 6; i++) {
      const laser = document.createElement('div');
      laser.className = 'laser left';
      laserContainer.appendChild(laser);
    }
    
    // Create 6 laser beams for right side
    for (let i = 0; i < 6; i++) {
      const laser = document.createElement('div');
      laser.className = 'laser right';
      laserContainer.appendChild(laser);
    }
    
    document.body.appendChild(laserContainer);
  }

  detectCapture(prevBoard, currentBoard) {
    const prevPieces = this.countPieces(prevBoard);
    const currentPieces = this.countPieces(currentBoard);
    return prevPieces > currentPieces;
  }

  countPieces(board) {
    return board.flat().filter(piece => piece !== null).length;
  }

  updateStatus() {
    let status = '';
    if (this.game.in_checkmate()) {
      status = 'Game Over - Checkmate!';
    } else if (this.game.in_draw()) {
      status = 'Game Over - Draw!';
    } else if (this.game.in_check()) {
      status = 'Check!';
    } else {
      status = `${this.game.turn() === 'w' ? 'White' : 'Black'} to move`;
    }
    document.getElementById('status').textContent = status;
  }

  updateMoveHistory() {
    const history = this.game.history();
    const moveHistory = document.getElementById('move-history');
    moveHistory.innerHTML = '';
    
    for (let i = 0; i < history.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = history[i];
      const blackMove = history[i + 1] || '';
      
      const moveElement = document.createElement('div');
      moveElement.textContent = `${moveNumber}. ${whiteMove} ${blackMove}`;
      moveHistory.appendChild(moveElement);
    }
    
    moveHistory.scrollTop = moveHistory.scrollHeight;
  }

  updateCapturedPieces() {
    const captured = {
      w: [],
      b: []
    };
    
    const initialPieces = {
      p: 8, n: 2, b: 2, r: 2, q: 1, k: 1
    };
    
    const currentPieces = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
    };
    
    // Count current pieces
    this.game.board().forEach(row => {
      row.forEach(piece => {
        if (piece) {
          currentPieces[piece.color][piece.type]++;
        }
      });
    });
    
    // Calculate captured pieces
    ['w', 'b'].forEach(color => {
      Object.keys(initialPieces).forEach(type => {
        const diff = initialPieces[type] - currentPieces[color][type];
        for (let i = 0; i < diff; i++) {
          captured[color].push(type);
        }
      });
    });
    
    // Update UI
    document.getElementById('captured-white').innerHTML = 
      captured.w.map(type => this.pieceRenderer.renderPiece({ type, color: 'w' })).join('');
    document.getElementById('captured-black').innerHTML = 
      captured.b.map(type => this.pieceRenderer.renderPiece({ type, color: 'b' })).join('');
  }

  initSnowAnimation() {
    // This function doesn't do anything in the provided plan
  }

  initDiscoBall() {
    // Create disco ball container
    const discoBallContainer = document.createElement('div');
    discoBallContainer.className = 'disco-ball-container';
    
    // Create disco ball
    const discoBall = document.createElement('div');
    discoBall.className = 'disco-ball';
    
    // Create facets container
    const facetsContainer = document.createElement('div');
    facetsContainer.className = 'disco-ball-facets';
    
    // Generate 50 random facets
    for (let i = 0; i < 50; i++) {
      const facet = document.createElement('div');
      facet.className = 'disco-ball-facet';
      facet.style.left = `${Math.random() * 90}%`;
      facet.style.top = `${Math.random() * 90}%`;
      facet.style.animationDelay = `${Math.random() * 2}s`;
      facetsContainer.appendChild(facet);
    }
    
    // Create light beams container
    const beamsContainer = document.createElement('div');
    beamsContainer.className = 'disco-ball-beams';
    
    // Generate 20 light beams
    for (let i = 0; i < 20; i++) {
      const beam = document.createElement('div');
      beam.className = 'disco-beam';
      beam.style.left = `${Math.random() * 100}%`;
      beam.style.animationDelay = `${Math.random() * 8}s`;
      beam.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
      beamsContainer.appendChild(beam);
    }
    
    discoBall.appendChild(facetsContainer);
    discoBallContainer.appendChild(discoBall);
    document.body.appendChild(discoBallContainer);
    document.body.appendChild(beamsContainer);
  }

  initializeTutorialControls() {
    const tutorialBtn = document.createElement('button');
    tutorialBtn.id = 'tutorialBtn';
    tutorialBtn.textContent = 'Start Tutorial';
    tutorialBtn.addEventListener('click', () => this.toggleTutorial());
    
    const tutorialOverlay = document.createElement('div');
    tutorialOverlay.id = 'tutorialOverlay';
    tutorialOverlay.innerHTML = `
      <div class="tutorial-content">
        <h2 id="tutorialTitle"></h2>
        <div id="tutorialPieces" class="tutorial-pieces"></div>
        <p id="tutorialText"></p>
        <div class="tutorial-controls">
          <button id="prevTutorial">Previous</button>
          <button id="nextTutorial">Next</button>
          <button id="closeTutorial">Close Tutorial</button>
        </div>
      </div>
    `;
    
    const controls = document.querySelector('.game-controls');
    controls.appendChild(tutorialBtn);
    document.body.appendChild(tutorialOverlay);
    
    document.getElementById('prevTutorial').addEventListener('click', () => this.previousTutorialStep());
    document.getElementById('nextTutorial').addEventListener('click', () => this.nextTutorialStep());
    document.getElementById('closeTutorial').addEventListener('click', () => this.endTutorial());
  }

  toggleTutorial() {
    if (!this.tutorialMode) {
      this.startTutorial();
    } else {
      this.endTutorial();
    }
  }

  startTutorial() {
    this.tutorialMode = true;
    this.tutorialStep = 0;
    this.game.reset();
    this.board.updatePosition(this.game.board());
    document.getElementById('tutorialOverlay').style.display = 'flex';
    this.updateTutorialContent();
  }

  endTutorial() {
    this.tutorialMode = false;
    this.tutorialStep = 0;
    document.getElementById('tutorialOverlay').style.display = 'none';
    this.clearHighlights();
    this.newGame();
  }

  previousTutorialStep() {
    if (this.tutorialStep > 0) {
      this.tutorialStep--;
      this.updateTutorialContent();
    }
  }

  nextTutorialStep() {
    if (this.tutorialStep < this.tutorialSteps.length - 1) {
      this.tutorialStep++;
      this.updateTutorialContent();
    }
  }

  updateTutorialContent() {
    const step = this.tutorialSteps[this.tutorialStep];
    document.getElementById('tutorialTitle').textContent = step.title;
    document.getElementById('tutorialText').textContent = step.text;
    
    // Update piece examples
    const piecesContainer = document.getElementById('tutorialPieces');
    piecesContainer.innerHTML = '';
    if (step.pieces.length > 0) {
      step.pieces.forEach(piece => {
        const pieceHtml = this.pieceRenderer.renderPiece(piece);
        const pieceContainer = document.createElement('div');
        pieceContainer.className = 'tutorial-piece';
        pieceContainer.innerHTML = pieceHtml;
        piecesContainer.appendChild(pieceContainer);
      });
    }
    
    // Update highlight squares
    this.clearHighlights();
    step.highlight.forEach(square => {
      const squareEl = document.querySelector(`[data-square="${square}"]`);
      if (squareEl) {
        squareEl.classList.add('tutorial-highlight');
      }
    });
    
    // Update navigation buttons
    document.getElementById('prevTutorial').disabled = this.tutorialStep === 0;
    document.getElementById('nextTutorial').disabled = this.tutorialStep === this.tutorialSteps.length - 1;
  }

  clearHighlights() {
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
  }
}

new ChessGame();