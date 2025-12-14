/**
 * ConnectFour game class managing game state, board, and AI logic
 */
class ConnectFour {
    /**
     * Initializes the Connect Four game
     * @param {string} gameMode - 'pvp' for player vs player, 'pvc' for player vs computer
     */
    constructor(gameMode = 'pvp') {
        this.rows = 6;
        this.columns = 7;
        this.board = Array(this.rows).fill(null).map(() => Array(this.columns).fill(null));
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.winner = null;
        this.moveCount = 0;
        this.totalCells = this.rows * this.columns;
        this.gameMode = gameMode;
        this.computerPlayer = 'yellow';
        
        this.initBoard();
        this.setupEventListeners();
        this.updateCurrentPlayerDisplay();
    }

    /**
     * Creates and renders the game board grid in the DOM
     * Cells are created in row-major order with data attributes for position tracking
     */
    initBoard() {
        const boardElement = document.getElementById('gameBoard');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                boardElement.appendChild(cell);
            }
        }
    }

    /**
     * Sets up click event listeners for board cells and control buttons
     * Prevents player interaction during computer's turn in PVC mode
     */
    setupEventListeners() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (!this.gameOver) {
                    if (this.gameMode === 'pvc' && this.currentPlayer === this.computerPlayer) {
                        return;
                    }
                    const col = parseInt(cell.dataset.col);
                    this.dropDisc(col);
                }
            });
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });

        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }

    /**
     * Drops a disc into the specified column and handles game flow
     * @param {number} column - Column index (0-6) where disc should be dropped
     * @param {boolean} isComputerMove - True if this is an AI move, false for player move
     */
    dropDisc(column, isComputerMove = false) {
        if (this.gameOver) return;
        
        if (this.gameMode === 'pvc' && this.currentPlayer === this.computerPlayer && !isComputerMove) {
            return;
        }
        
        let row = this.rows - 1;
        while (row >= 0 && this.board[row][column] !== null) {
            row--;
        }

        if (row < 0) {
            this.showMessage('This column is full!', 'info');
            return;
        }

        this.board[row][column] = this.currentPlayer;
        this.moveCount++;
        this.updateCell(row, column, this.currentPlayer);
        
        if (this.checkWin(row, column)) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            this.highlightWinningCells(row, column);
            const winnerName = (this.gameMode === 'pvc' && this.currentPlayer === this.computerPlayer) 
                ? 'Computer' 
                : this.currentPlayer.toUpperCase();
            this.showMessage(`${winnerName} wins!`, 'win');
            return;
        }

        if (this.moveCount >= this.totalCells) {
            this.gameOver = true;
            this.showMessage("It's a draw! All spots are filled.", 'draw');
            return;
        }

        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        this.updateCurrentPlayerDisplay();
        this.clearMessage();
        
        if (this.gameMode === 'pvc' && this.currentPlayer === this.computerPlayer && !this.gameOver) {
            setTimeout(() => {
                this.makeComputerMove();
            }, 500);
        }
    }

    /**
     * Updates the visual representation of a cell on the board
     * @param {number} row - Row index of the cell
     * @param {number} column - Column index of the cell
     * @param {string} player - Player color ('red' or 'yellow')
     */
    updateCell(row, column, player) {
        const cells = document.querySelectorAll('.cell');
        const cellIndex = row * this.columns + column;
        const cell = cells[cellIndex];
        cell.classList.add('filled', player);
    }

    /**
     * Checks if the last move resulted in a win by checking all four directions
     * @param {number} row - Row index of the last placed disc
     * @param {number} column - Column index of the last placed disc
     * @returns {boolean} True if four in a row is found
     */
    checkWin(row, column) {
        const player = this.board[row][column];
        
        return this.checkDirection(row, column, player, 0, 1) ||   // Horizontal
               this.checkDirection(row, column, player, 1, 0) ||   // Vertical
               this.checkDirection(row, column, player, 1, 1) ||   // Diagonal (top-left to bottom-right)
               this.checkDirection(row, column, player, 1, -1);    // Diagonal (top-right to bottom-left)
    }

    /**
     * Checks for consecutive discs in a specific direction from a given position
     * @param {number} row - Starting row position
     * @param {number} column - Starting column position
     * @param {string} player - Player color to check for
     * @param {number} deltaRow - Row direction (-1, 0, or 1)
     * @param {number} deltaCol - Column direction (-1, 0, or 1)
     * @returns {boolean} True if 4 or more consecutive discs found
     */
    checkDirection(row, column, player, deltaRow, deltaCol) {
        let count = 1;
        
        let r = row + deltaRow;
        let c = column + deltaCol;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.columns && 
               this.board[r][c] === player) {
            count++;
            r += deltaRow;
            c += deltaCol;
        }
        
        r = row - deltaRow;
        c = column - deltaCol;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.columns && 
               this.board[r][c] === player) {
            count++;
            r -= deltaRow;
            c -= deltaCol;
        }
        
        return count >= 4;
    }

    /**
     * Highlights the winning line of four discs with a pulsing animation
     * @param {number} row - Row index of the last placed disc
     * @param {number} column - Column index of the last placed disc
     */
    highlightWinningCells(row, column) {
        const player = this.board[row][column];
        const winningCells = [];
        
        const directions = [
            { dr: 0, dc: 1 },   // Horizontal
            { dr: 1, dc: 0 },   // Vertical
            { dr: 1, dc: 1 },   // Diagonal (top-left to bottom-right)
            { dr: 1, dc: -1 }   // Diagonal (top-right to bottom-left)
        ];
        
        for (const dir of directions) {
            const cells = this.getWinningCells(row, column, player, dir.dr, dir.dc);
            if (cells.length >= 4) {
                winningCells.push(...cells);
                break;
            }
        }
        
        const allCells = document.querySelectorAll('.cell');
        winningCells.forEach((cell) => {
            const cellRow = cell.row;
            const cellCol = cell.col;
            const cellIndex = cellRow * this.columns + cellCol;
            if (cellIndex >= 0 && cellIndex < allCells.length) {
                allCells[cellIndex].classList.add('winning');
            }
        });
    }

    /**
     * Gets all cell positions that form a winning line in a specific direction
     * @param {number} row - Starting row position
     * @param {number} column - Starting column position
     * @param {string} player - Player color to check for
     * @param {number} deltaRow - Row direction increment
     * @param {number} deltaCol - Column direction increment
     * @returns {Array} Array of cell objects with row and col properties, or empty array if no win
     */
    getWinningCells(row, column, player, deltaRow, deltaCol) {
        const cells = [{ row, col: column }];
        
        let r = row + deltaRow;
        let c = column + deltaCol;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.columns && 
               this.board[r][c] === player) {
            cells.push({ row: r, col: c });
            r += deltaRow;
            c += deltaCol;
        }
        
        r = row - deltaRow;
        c = column - deltaCol;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.columns && 
               this.board[r][c] === player) {
            cells.unshift({ row: r, col: c });
            r -= deltaRow;
            c -= deltaCol;
        }
        
        return cells.length >= 4 ? cells : [];
    }

    /**
     * Updates the UI to show the current player's color and name
     */
    updateCurrentPlayerDisplay() {
        const discPreview = document.getElementById('currentPlayerDisc');
        const playerName = document.getElementById('currentPlayerName');
        
        discPreview.className = `disc-preview ${this.currentPlayer}`;
        if (this.gameMode === 'pvc' && this.currentPlayer === this.computerPlayer) {
            playerName.textContent = 'Computer';
        } else {
            playerName.textContent = this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);
        }
    }

    /**
     * Displays a message to the user with optional styling
     * @param {string} text - Message text to display
     * @param {string} type - Message type: 'info', 'win', or 'draw'
     */
    showMessage(text, type = 'info') {
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = text;
            messageElement.className = `message ${type}`;
        }
    }

    /**
     * Clears any displayed message
     */
    clearMessage() {
        const messageElement = document.getElementById('message');
        messageElement.textContent = '';
        messageElement.className = 'message';
    }

    /**
     * Resets the game to initial state while preserving the game mode
     */
    resetGame() {
        const currentMode = this.gameMode;
        this.board = Array(this.rows).fill(null).map(() => Array(this.columns).fill(null));
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.winner = null;
        this.moveCount = 0;
        this.gameMode = currentMode;
        
        this.initBoard();
        this.setupEventListeners();
        this.updateCurrentPlayerDisplay();
        this.clearMessage();
    }

    /**
     * Executes the computer's move using AI strategy
     * Only called when it's the computer's turn in PVC mode
     */
    makeComputerMove() {
        if (this.gameOver || this.currentPlayer !== this.computerPlayer) return;
        
        const column = this.getBestMove();
        if (column !== -1) {
            this.dropDisc(column, true);
        }
    }

    /**
     * Determines the best move for the computer using a priority-based strategy:
     * 1. Win if possible
     * 2. Block opponent from winning
     * 3. Create a threat (3 in a row)
     * 4. Block opponent's threats
     * 5. Prefer center columns for better positioning
     * 6. Fallback to any valid move
     * @returns {number} Column index for best move, or -1 if no valid moves
     */
    getBestMove() {
        const opponent = this.currentPlayer === 'red' ? 'yellow' : 'red';
        
        for (let col = 0; col < this.columns; col++) {
            if (this.isValidMove(col)) {
                const row = this.getNextAvailableRow(col);
                if (row !== -1) {
                    this.board[row][col] = this.computerPlayer;
                    if (this.checkWin(row, col)) {
                        this.board[row][col] = null;
                        return col;
                    }
                    this.board[row][col] = null;
                }
            }
        }
        
        for (let col = 0; col < this.columns; col++) {
            if (this.isValidMove(col)) {
                const row = this.getNextAvailableRow(col);
                if (row !== -1) {
                    this.board[row][col] = opponent;
                    if (this.checkWin(row, col)) {
                        this.board[row][col] = null;
                        return col;
                    }
                    this.board[row][col] = null;
                }
            }
        }
        
        for (let col = 0; col < this.columns; col++) {
            if (this.isValidMove(col)) {
                const row = this.getNextAvailableRow(col);
                if (row !== -1) {
                    this.board[row][col] = this.computerPlayer;
                    if (this.countThreats(this.computerPlayer) > 0) {
                        this.board[row][col] = null;
                        return col;
                    }
                    this.board[row][col] = null;
                }
            }
        }
        
        for (let col = 0; col < this.columns; col++) {
            if (this.isValidMove(col)) {
                const row = this.getNextAvailableRow(col);
                if (row !== -1) {
                    this.board[row][col] = opponent;
                    if (this.countThreats(opponent) > 0) {
                        this.board[row][col] = null;
                        return col;
                    }
                    this.board[row][col] = null;
                }
            }
        }
        
        const centerColumns = [3, 2, 4, 1, 5, 0, 6];
        for (const col of centerColumns) {
            if (this.isValidMove(col)) {
                return col;
            }
        }
        
        for (let col = 0; col < this.columns; col++) {
            if (this.isValidMove(col)) {
                return col;
            }
        }
        
        return -1;
    }

    /**
     * Checks if a column has space for a new disc
     * @param {number} column - Column index to check
     * @returns {boolean} True if column is not full
     */
    isValidMove(column) {
        return column >= 0 && column < this.columns && this.board[0][column] === null;
    }

    /**
     * Finds the lowest available row in a column (where disc would land)
     * @param {number} column - Column index to check
     * @returns {number} Row index of available position, or -1 if column is full
     */
    getNextAvailableRow(column) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][column] === null) {
                return row;
            }
        }
        return -1;
    }

    /**
     * Counts the number of threats (3 in a row) for a given player
     * Used by AI to identify strategic positions
     * @param {string} player - Player color to check threats for
     * @returns {number} Number of threats found
     */
    countThreats(player) {
        let threatCount = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.board[row][col] === player) {
                    const directions = [
                        { dr: 0, dc: 1 },   // Horizontal
                        { dr: 1, dc: 0 },   // Vertical
                        { dr: 1, dc: 1 },   // Diagonal
                        { dr: 1, dc: -1 }   // Diagonal
                    ];
                    
                    for (const dir of directions) {
                        let count = 1;
                        let r = row + dir.dr;
                        let c = col + dir.dc;
                        while (r >= 0 && r < this.rows && c >= 0 && c < this.columns && 
                               this.board[r][c] === player) {
                            count++;
                            r += dir.dr;
                            c += dir.dc;
                        }
                        r = row - dir.dr;
                        c = col - dir.dc;
                        while (r >= 0 && r < this.rows && c >= 0 && c < this.columns && 
                               this.board[r][c] === player) {
                            count++;
                            r -= dir.dr;
                            c -= dir.dc;
                        }
                        if (count >= 3) {
                            threatCount++;
                        }
                    }
                }
            }
        }
        return threatCount;
    }
}

/**
 * Initializes the game when the DOM is loaded
 * Reads the game mode from URL parameters and creates a new game instance
 */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || 'pvp';
    
    window.game = new ConnectFour(mode);
});

