document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const currentScore = document.getElementById('score');
    const restartButton = document.getElementById('restart-btn');
    const tryAgainButton = document.getElementById('try-again-btn');
    const overlay = document.getElementById('game-over-overlay');
    const endMessage = document.getElementById('game-over-message');

    const GRID_SIZE = 4;
    let gameGrid = [];
    let playerScore = 0;
    let hasWon = false;

    function setupNewGame() {
        playerScore = 0;
        hasWon = false;
        gameGrid = [];
        
        for (let i = 0; i < GRID_SIZE; i++) {
            gameGrid[i] = new Array(GRID_SIZE).fill(0);
        }
        
        overlay.classList.remove('visible');
        createGridCells();
        spawnRandomTile();
        spawnRandomTile();
        refreshDisplay();
    }

    function createGridCells() {
        gameBoard.innerHTML = '';
        gameBoard.style.setProperty('--board-size', GRID_SIZE);
        
        let cellCount = GRID_SIZE * GRID_SIZE;
        while (cellCount > 0) {
            const gridCell = document.createElement('div');
            gridCell.className = 'grid-cell';
            gameBoard.appendChild(gridCell);
            cellCount--;
        }
    }

    function refreshDisplay() {
        document.querySelectorAll('.tile').forEach(tile => tile.remove());

        gameGrid.forEach((row, rowIndex) => {
            row.forEach((cellValue, colIndex) => {
                if (cellValue !== 0) {
                    createTileElement(cellValue, rowIndex, colIndex);
                }
            });
        });
        
        currentScore.textContent = playerScore;
    }

    function createTileElement(value, row, col) {
        const tileElement = document.createElement('div');
        tileElement.className = `tile tile-${value}`;
        tileElement.textContent = value;
        
        const topPosition = `calc(${row} * (var(--tile-size) + var(--grid-gap)) + var(--grid-gap))`;
        const leftPosition = `calc(${col} * (var(--tile-size) + var(--grid-gap)) + var(--grid-gap))`;
        
        tileElement.style.top = topPosition;
        tileElement.style.left = leftPosition;
        
        gameBoard.appendChild(tileElement);
    }

    function spawnRandomTile() {
        const availableSpots = [];
        
        gameGrid.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell === 0) {
                    availableSpots.push([r, c]);
                }
            });
        });

        if (availableSpots.length === 0) return;
        
        const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
        const newValue = Math.random() < 0.9 ? 2 : 4;
        gameGrid[randomSpot[0]][randomSpot[1]] = newValue;
    }

    function slideRowLeft(row) {
        const nonZeroValues = row.filter(cell => cell !== 0);
        return nonZeroValues;
    }

    function mergeRow(row) {
        const result = [];
        let i = 0;
        
        while (i < row.length) {
            if (i < row.length - 1 && row[i] === row[i + 1]) {
                const mergedValue = row[i] * 2;
                result.push(mergedValue);
                playerScore += mergedValue;
                i += 2;
            } else {
                result.push(row[i]);
                i++;
            }
        }
        
        return result;
    }

    function processRowMovement(row) {
        let slidRow = slideRowLeft(row);
        let mergedRow = mergeRow(slidRow);
        
        const paddedRow = [...mergedRow];
        while (paddedRow.length < GRID_SIZE) {
            paddedRow.push(0);
        }
        
        return paddedRow;
    }

    function rotateGridClockwise(grid) {
        const rotated = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
        
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                rotated[c][GRID_SIZE - 1 - r] = grid[r][c];
            }
        }
        
        return rotated;
    }

    function executeMove(direction) {
        const previousState = JSON.stringify(gameGrid);
        let workingGrid = gameGrid.map(row => [...row]);

        switch (direction) {
            case 'up':
                workingGrid = rotateGridClockwise(rotateGridClockwise(rotateGridClockwise(workingGrid)));
                break;
            case 'right':
                workingGrid = workingGrid.map(row => [...row].reverse());
                break;
            case 'down':
                workingGrid = rotateGridClockwise(workingGrid);
                break;
        }

        workingGrid = workingGrid.map(row => processRowMovement(row));
        
        switch (direction) {
            case 'up':
                workingGrid = rotateGridClockwise(workingGrid);
                break;
            case 'right':
                workingGrid = workingGrid.map(row => [...row].reverse());
                break;
            case 'down':
                workingGrid = rotateGridClockwise(rotateGridClockwise(rotateGridClockwise(workingGrid)));
                break;
        }

        const hasChanged = JSON.stringify(workingGrid) !== previousState;
        
        if (hasChanged) {
            gameGrid = workingGrid;
            spawnRandomTile();
            refreshDisplay();
            evaluateGameState();
        }
    }

    function evaluateGameState() {
        const flatGrid = gameGrid.flat();
        
        if (!hasWon && flatGrid.includes(2048)) {
            hasWon = true;
            endMessage.textContent = 'You Win!';
            overlay.classList.add('visible');
            return;
        }

        if (flatGrid.includes(0)) return;

        let canMove = false;
        for (let r = 0; r < GRID_SIZE && !canMove; r++) {
            for (let c = 0; c < GRID_SIZE && !canMove; c++) {
                if (r < GRID_SIZE - 1 && gameGrid[r][c] === gameGrid[r + 1][c]) {
                    canMove = true;
                }
                if (c < GRID_SIZE - 1 && gameGrid[r][c] === gameGrid[r][c + 1]) {
                    canMove = true;
                }
            }
        }

        if (!canMove) {
            endMessage.textContent = 'Game Over!';
            overlay.classList.add('visible');
        }
    }

    const keyMappings = {
        'ArrowUp': 'up',
        'ArrowDown': 'down', 
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };

    document.addEventListener('keyup', (event) => {
        if (overlay.classList.contains('visible')) return;
        
        const direction = keyMappings[event.key];
        if (direction) {
            executeMove(direction);
        }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    function handleTouchStart(event) {
        if (overlay.classList.contains('visible')) return;
        
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    function handleTouchEnd(event) {
        if (overlay.classList.contains('visible')) return;
        
        const touch = event.changedTouches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
        
        handleSwipe();
    }

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 30;
        
        if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
            return;
        }
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                executeMove('right');
            } else {
                executeMove('left');
            }
        } else {
            if (deltaY > 0) {
                executeMove('down');
            } else {
                executeMove('up');
            }
        }
    }

    gameBoard.addEventListener('touchstart', handleTouchStart, { passive: true });
    gameBoard.addEventListener('touchend', handleTouchEnd, { passive: true });

    document.addEventListener('touchmove', (event) => {
        event.preventDefault();
    }, { passive: false });

    restartButton.onclick = setupNewGame;
    tryAgainButton.onclick = setupNewGame;

    setupNewGame();
});