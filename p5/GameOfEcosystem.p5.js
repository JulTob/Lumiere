let cellSize = 5;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];

function setup() {
  frameRate(100);
  createCanvas(720, 400);
  columnCount = floor(width / cellSize);
  rowCount = floor(height / cellSize);
  for (let x = 0; x < columnCount; x++) {
    currentCells[x] = [];
    nextCells[x] = [];
    for (let y = 0; y < rowCount; y++) {
      // Each cell is [R,G,B] where each is 0 or 1
      currentCells[x][y] = [random([0,1]), random([0,1]), random([0,1])];
      nextCells[x][y] = [0,0,0];
    }
  }
  noLoop(); // start paused
}

function draw() {
  background(30);
  generate();
  for (let x = 0; x < columnCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      let cell = currentCells[x][y];
      fill(cell[0]*255, cell[1]*255, cell[2]*255);
      stroke(60);
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function mousePressed() {
  randomizeBoard();
  loop();
}

function randomizeBoard() {
  for (let x = 0; x < columnCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      currentCells[x][y] = [random([0,1]), random([0,1]), random([0,1])];
    }
  }
}

// Count neighbors alive for a specific color channel
function countTypeNeighbors(x, y, type) {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      let nx = (x + dx + columnCount) % columnCount;
      let ny = (y + dy + rowCount) % rowCount;
      if (currentCells[nx][ny][type]) count++;
    }
  }
  return count;
}


function generate() {
  for (let x = 0; x < columnCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      let nG = countTypeNeighbors(x, y, 1); 
      // Green - Plants
      let nB = countTypeNeighbors(x, y, 2); 
      // Blue - Herbivores
      let nR = countTypeNeighbors(x, y, 0); 
      // Red - Carnivores

      // ------- PLANTS (Green channel) -------
      {
        let alive = currentCells[x][y][1];
        if (alive) {
          // Dies if overgrazed (too many B), else normal Life rules
          if (nB >= nG) {
            nextCells[x][y][1] = 0;
          } else {
            nextCells[x][y][1] = 1;
          }
        } else {
          // New plant if lots of nearby plants
          if (nG >= 3 && nB<nG) {
            nextCells[x][y][1] = 1;
          } else {
            nextCells[x][y][1] = 0;
          }
        }
      }

      // ------- HERBIVORES (Blue channel) -------
      {
        let alive = currentCells[x][y][2];
        if (alive) {
          // Dies if outnumbered by carnivores or if not enough plants
          if (nR >= nB || nB >= nG) {
            nextCells[x][y][2] = 0;
          } else {
            nextCells[x][y][2] = 1;
          }
        } else {
          // Born if more plants than herbivores
          if (nG >= nB && nB >= 3) {
            nextCells[x][y][2] = 1;
          } else {
            nextCells[x][y][2] = 0;
          }
        }
      }

      // ------- CARNIVORES (Red channel) -------
      {
        let alive = currentCells[x][y][0];
        if (alive) {
          // Dies if not enough herbivores
          if (nR > nB || nB <= 2) {
            nextCells[x][y][0] = 0;
          } else {
            nextCells[x][y][0] = 1;
          }
        } else {
          // Born if more herbivores than carnivores
          if (nB >= nR && nR >= 2) {
            nextCells[x][y][0] = 1;
          } else {
            nextCells[x][y][0] = 0;
          }
        }
      }
    }
  }
  // Swap arrays
  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;
}

