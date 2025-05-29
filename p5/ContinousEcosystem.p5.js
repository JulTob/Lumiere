let cellSize = 5;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];

function setup() {
  frameRate(600);
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
      fill(cell[0], cell[1], cell[2]);
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
      currentCells[x][y] = [
        int(random(0, 256)), // R
        int(random(0, 256)), // G
        int(random(0, 256))  // B
      ];
      nextCells[x][y] = [0, 0, 0];
    }
  }
}

// Sum neighbor values for a specific channel
function sumTypeNeighbors(x, y, type) {
  let sum = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      //if (dx === 0 && dy === 0) continue;
      let nx = (x + dx + columnCount) % columnCount;
      let ny = (y + dy + rowCount) % rowCount;
      sum += currentCells[nx][ny][type];
    }
  }
  return sum;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function generate() {
  for (let x = 0; x < columnCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      let curr = currentCells[x][y];

      let nR = sumTypeNeighbors(x, y, 0);
      let nG = sumTypeNeighbors(x, y, 1);
      let nB = sumTypeNeighbors(x, y, 2);

      let newR = curr[0];
      let newG = curr[1];
      let newB = curr[2];

      // --- PLANTS (G) ---
      // Overgrazed? Decay. Otherwise, grow if enough plant neighbors
      if (nB > nG || nG < 7*255) {
        newG -= int(random(0, 1));  // decay rate; 
      } else if (nG > 3 * 255 ) {
        newG += int(random(0, 1));  // growth rate; 
      }

      // --- HERBIVORES (B) ---
      if (nR > nB || nB > nG) {
        newB -= int(random(0, 10));
      } else if (nB > 3 * 255) {
        newB += int(random(0, 10));
      }

      // --- CARNIVORES (R) ---
      if (nB < nR || nR > 7 * 255 || nB < 2*255) {
        newR -= int(random(0, 20));
      } else if ( nR > 2 * 255) {
        newR += int(random(0, 20));
      }

      // Clamp to [0,255]
      nextCells[x][y][0] = clamp(newR, 0, 255);
      nextCells[x][y][1] = clamp(newG, 0, 255);
      nextCells[x][y][2] = clamp(newB, 0, 255);
    }
  }
  // Deep copy nextCells into currentCells
  for (let x = 0; x < columnCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      currentCells[x][y][0] = nextCells[x][y][0];
      currentCells[x][y][1] = nextCells[x][y][1];
      currentCells[x][y][2] = nextCells[x][y][2];
    }
  }
}


