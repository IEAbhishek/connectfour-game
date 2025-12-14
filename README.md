# Connect Four Game

A classic Connect Four game built with HTML, CSS, and JavaScript with support for both Player vs Player and Player vs Computer modes.

## Game Rules

- **Board**: 7 columns × 6 rows (42 total cells)
- **Players**: Two players (Red and Yellow) or Player vs Computer
- **Starting Player**: Red goes first
- **Gameplay**: Players alternate turns, dropping one disc from the top into any column
- **Gravity**: Discs automatically fall to the lowest available spot in the selected column
- **Win Condition**: First player to connect four discs in a row (horizontal, vertical, or diagonal) wins
- **Draw Condition**: If all 42 spots are filled without a winner, the game ends in a draw

## How to Play

1. Open https://ieabhishek.github.io/connectfour-game/ in a web browser to select your game mode
2. Choose between:
   - **Player vs Player**: Two players take turns on the same device
   - **Player vs Computer**: Play against an AI opponent (you play as Red, computer plays as Yellow)
3. Click on any column to drop your disc
4. The disc will fall to the lowest available position in that column
5. Players alternate turns automatically (computer moves automatically in PVC mode)
6. The first player to get four in a row wins!
7. Click "New Game" to start over, or "Back to Menu" to return to mode selection

## Features

- Beautiful, modern UI with smooth animations
- Two game modes: Player vs Player and Player vs Computer
- Intelligent AI opponent with strategic gameplay
- Visual feedback for current player
- Winning cells are highlighted with a pulsing animation
- Responsive design that works on different screen sizes
- Column full detection (prevents dropping in full columns)
- Automatic win and draw detection

