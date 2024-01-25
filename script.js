document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    const bombCount = 15;
    const board = document.getElementById('board');
    const button = document.getElementById('button');
    const bomcounter = document.getElementById('bom');
    const highscoreTable = document.getElementById('highscore-table');
    button.addEventListener('click', () => resetGame());
    let cells = [];
    let highscores = [];

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
                bomcounter.textContent = parseInt(bomcounter.textContent) + 1;
            } else {
                cell.classList.add('flagged');
                bomcounter.textContent = parseInt(bomcounter.textContent) - 1;
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
                if (cell.classList.contains('flagged')) {
                    cell.classList.remove('flagged');
                    bomcounter.textContent = parseInt(bomcounter.textContent) + 1;
                }
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
            const playerName = prompt('Congratulations! You win! Enter your name:');
            const gameTime = getFormattedTime();
            const highscoreEntry = { name: playerName, time: gameTime };
            highscores.push(highscoreEntry);
            displayHighscores();
            resetGame();
        }
    }

    function getFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString();
    }

    function displayHighscores() {
        // Sort highscores by time
        highscores.sort((a, b) => {
            return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
        });

        // Display highscores in the table
        highscoreTable.innerHTML = '<tr><th>Name</th><th>Time</th></tr>';
        for (const entry of highscores) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${entry.name}</td><td>${entry.time}</td>`;
            highscoreTable.appendChild(row);
        }
    }

    function resetGame() {
        bomcounter.textContent = "15";
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
