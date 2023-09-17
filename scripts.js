const rows = 10;   
const columns = 10;
const explorationDelay = 100;  // Delay for normal exploration
const backtrackingDelay = 100;  // Faster delay for backtracking

function createGrid() {
    const table = document.getElementById('mazeTable');
    table.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            let td = document.createElement('td');
            td.onclick = function() {
                this.classList.toggle('obstacle');
            };
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function isSafe(row, col, solution) {
    return (row >= 0 && row < rows && col >= 0 && col < columns && !document.getElementById('mazeTable').rows[row].cells[col].classList.contains('obstacle') && !solution[row][col]);
}

async function solveMazeUtil(row, col, solution) {
    if (row === rows - 1 && col === columns - 1) {
        solution[row][col] = 1;
        displayPath(solution);
        await new Promise(resolve => setTimeout(resolve, explorationDelay));
        return true;
    }

    if (isSafe(row, col, solution)) {
        solution[row][col] = 1;
        displayCurrent(row, col);

        await new Promise(resolve => setTimeout(resolve, explorationDelay));

        if (await solveMazeUtil(row, col + 1, solution)) return true;
        if (await solveMazeUtil(row + 1, col, solution)) return true;
        if (await solveMazeUtil(row - 1, col, solution)) return true;
        if (await solveMazeUtil(row, col - 1, solution)) return true;

        solution[row][col] = 0;
        displayBacktrack(row, col);

        await new Promise(resolve => setTimeout(resolve, backtrackingDelay));
    }
    return false;
}

function displayCurrent(row, col) {
    const table = document.getElementById('mazeTable');
    table.rows[row].cells[col].classList.add('current');
    table.rows[row].cells[col].classList.add('path');
}

function displayBacktrack(row, col) {
    const table = document.getElementById('mazeTable');
    table.rows[row].cells[col].classList.remove('current');
    table.rows[row].cells[col].classList.remove('path');
}

function displayPath(solution) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (solution[i][j] === 1) {
                document.getElementById('mazeTable').rows[i].cells[j].classList.add('path');
            }
        }
    }
}

async function solveMaze() {
    const solution = Array(rows).fill(0).map(() => Array(columns).fill(0));

    if (!await solveMazeUtil(0, 0, solution)) {
        alert('Solution does not exist!');
    }
}

// Create the grid when the script loads
createGrid();
