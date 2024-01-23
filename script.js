document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    const bombCount = 15;
    const board = document.getElementById('board');
    const button = document.getElementById('button');
    button.addEventListener('click', () => resetGame());
    let cells = [];

    function initializeBoard() {
        // Create empty board
        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            board.appendChild(cell);
            cells.push(cell);

            // Add click event listener
            cell.addEventListener('click', () => handleCellClick(i));
            cell.addEventListener('contextmenu', (e) => handleCellRightClick(e, i));
        }

        // Place bombs randomly
        const bombLocations = getBombLocations();
        for (const bombIndex of bombLocations) {
            cells[bombIndex].classList.add('bomb');
        }
    }

    function getBombLocations() {
        const bombLocations = [];
        while (bombLocations.length < bombCount) {
            const randomIndex = Math.floor(Math.random() * (boardSize * boardSize));
            if (!bombLocations.includes(randomIndex)) {
                bombLocations.push(randomIndex);
            }
        }
        return bombLocations;
    }

    function handleCellClick(index) {
        const cell = cells[index];
        if (cell.classList.contains('revealed') || cell.classList.contains('flagged')) {
            return;
        }

        if (cell.classList.contains('bomb')) {
            revealAllBombs();
            alert('Game Over! You hit a bomb.');
            resetGame();
        } else {
            const bombCount = countAdjacentBombs(index);
            cell.classList.add('revealed');
            if (bombCount > 0) {
                cell.textContent = bombCount;
            } else {
                revealEmptyCells(index);
            }

            checkWin();
        }
    }

    function handleCellRightClick(event, index) {
        event.preventDefault();
        const cell = cells[index];
        if (!cell.classList.contains('revealed')) {
            if (cell.classList.contains('flagged')) {
                cell.classList.remove('flagged');
            } else {
                cell.classList.add('flagged');
                
                
            }
        }
    }

    function countAdjacentBombs(index) {
        let count = 0;
        const neighbors = getNeighbors(index);

        for (const neighbor of neighbors) {
            if (cells[neighbor] && cells[neighbor].classList.contains('bomb')) {
                count++;
            }
        }

        return count;
    }

    function getNeighbors(index) {
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        const neighbors = [];

        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && !(i === row && j === col)) {
                    neighbors.push(i * boardSize + j);
                }
            }
        }

        return neighbors;
    }

    function revealEmptyCells(index) {
        const neighbors = getNeighbors(index);
        for (const neighbor of neighbors) {
            const cell = cells[neighbor];
            if (cell && !cell.classList.contains('revealed') && !cell.classList.contains('bomb')) {
                cell.classList.add('revealed');
                const bombCount = countAdjacentBombs(neighbor);
                if (bombCount === 0) {
                    revealEmptyCells(neighbor);
                } else {
                    cell.textContent = bombCount;
                }
            }
        }
    }

    function revealAllBombs() {
        cells.forEach((cell, index) => {
            if (cell.classList.contains('bomb')) {
                cell.classList.add('revealed');
            }
        });
    }

    function checkWin() {
        const revealedCount = cells.filter(cell => cell.classList.contains('revealed')).length;
        const nonBombCount = boardSize * boardSize - bombCount;

        if (revealedCount === nonBombCount) {
            alert('Congratulations! You win!');
            resetGame();
            
        }
    }

    function resetGame() {
        // Clear the board
        cells.forEach(cell => {
            board.removeChild(cell);
        });
        cells = [];

        // Initialize a new game
        initializeBoard();
    }

    // Start the game
    initializeBoard();
});
