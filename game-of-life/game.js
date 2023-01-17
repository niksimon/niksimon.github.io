const grid = document.getElementById("grid");
const size = 50;
const cells = [];
const states = [];

for(let i = 0; i < size; i++) {
    cells[i] = [];
    states[i] = [];
    for(let j = 0; j < size; j++) {
        const cell = document.createElement("div");
        cells[i].push(cell);
        const randomState = Math.random() < 0.5;
        states[i].push(randomState);
        cell.setAttribute("class", randomState ? "dead" : "alive");
        grid.appendChild(cell);
    }
}

function countNeighbours(x, y) {
    let count = 0;
    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
            if(i === 0 && j === 0) {
                continue;
            }
            const nx = (x + j + size) % size;
            const ny = (y + i + size) % size;
            if(states[ny][nx]) {
                count++;
            }
        }
    }
    return count;
}

function game() {
    const newStates = [];
    for(let i = 0; i < size; i++) {
        newStates[i] = new Array(size).fill(false);
        for(let j = 0; j < size; j++) {
            if(!states[i][j] && countNeighbours(j, i) === 3) {
                newStates[i][j] = true;
            }
            if(states[i][j] && (countNeighbours(j, i) === 2 || countNeighbours(j, i) === 3)) {
                newStates[i][j] = true;
            }
        }
    }

    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            states[i][j] = newStates[i][j];
            cells[i][j].setAttribute("class", states[i][j] ? "alive" : "dead");
        }
    }
}

const speedEl = document.getElementById("speed");
let gameInterval = setInterval(game, 100);

speedEl.addEventListener("change", (event) => {
    const speed = event.target.value;
    clearInterval(gameInterval);
    gameInterval = setInterval(game, 1000 - speed);
});