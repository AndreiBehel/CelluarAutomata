let canvas = document.getElementById('field');
let ctx = canvas.getContext('2d');
let raf;

let blockWidth = 20;
let blockHeight = 20;

let xBlocks = 30;
let yBlocks = 30;

let field = createMatrix(xBlocks, yBlocks);

let updateInterval = 1000;
let prevTime = 0;

function createMatrix(x, y) {
    let matrix = new Array(y);
    for (let i = 0; i < y; i++) {
        matrix[i] = new Array(x).fill(0);
    }
    return matrix;
}

function drawBlock(x, y) {
    ctx.save();

    ctx.strokeStyle = 'rgb(0, 100, 0)';
    ctx.strokeRect(blockWidth * x, blockHeight * y, blockWidth, blockHeight);

    ctx.restore();
}
function drawFilledBlock(x, y) {
    ctx.save();

    ctx.strokeStyle = 'rgb(0, 100, 0)';
    ctx.strokeRect(blockWidth * x, blockHeight * y, blockWidth, blockHeight);
    ctx.fillStyle = 'rgb(102, 204, 0)';
    ctx.fillRect(blockWidth * x, blockHeight * y, blockWidth, blockHeight);

    ctx.restore();
}

function drawField() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    field.forEach((row, rowIndex) => {
        row.forEach((elem, columnIndex) => {
            if (elem)
                drawFilledBlock(columnIndex, rowIndex);
            else
                drawBlock(columnIndex, rowIndex);
        });
    });
}

function buttonOk() {
    raf = requestAnimationFrame(update);
}

function buttonStop() {
    cancelAnimationFrame(raf);
}

function clearField() {
    buttonStop();
    field = createMatrix(xBlocks, yBlocks);
    drawField();
}

function speedUp() {
    if (updateInterval < 2000) {
        updateInterval += 100;
    }
}

function speedDown() {
    if (updateInterval > 200) {
        updateInterval -= 100;
    }
}
function update(time = 0) {
    if (time - prevTime > updateInterval) {
        field = nextState();
        prevTime = time;
        console.log(field.join('\n '));
        console.log('#' + time + " ");
    }
    drawField();

    raf = requestAnimationFrame(update);
}

function nextState() {
    let nextMatrix = createMatrix(xBlocks, yBlocks);
    nextMatrix.forEach((row, rowIndex) => {
       row.forEach((element, colIndex) => {
           let value = 0;
          if (rowIndex >= 1 && rowIndex < yBlocks - 1) {
              if (colIndex >= 1 && colIndex < xBlocks - 1) {
                  for (let i = -1; i < 2; i++) {
                      for (let j = -1; j < 2; j++) {
                          value += field[rowIndex + i][colIndex + j];
                      }
                  }

                  value -= field[rowIndex][colIndex];
              } else {
                  if (colIndex < 1) {
                      for (let i = -1; i < 2; i++) {
                          for (let j = 0; j < 2; j++) {
                              value += field[rowIndex + i][colIndex + j];
                          }
                      }
                      value -= field[rowIndex][colIndex];

                      value += field[rowIndex - 1][xBlocks - 1];
                      value += field[rowIndex][xBlocks - 1];
                      value += field[rowIndex + 1][xBlocks - 1];
                  } else {
                      for (let i = -1; i < 2; i++) {
                          for (let j = -1; j < 1; j++) {
                              value += field[rowIndex + i][colIndex + j];
                          }
                      }
                      value -= field[rowIndex][colIndex];

                      value += field[rowIndex - 1][0];
                      value += field[rowIndex][0];
                      value += field[rowIndex + 1][0];
                  }
              }
          } else {
              if (rowIndex < 1) {
                  if (colIndex < 1) {
                      value += field[0][1];
                      value += field[1][1];
                      value += field[1][0];

                      value += field[0][xBlocks - 1];
                      value += field[1][xBlocks - 1];

                      value += field[yBlocks - 1][0];
                      value += field[yBlocks - 1][1];

                      value += field[yBlocks - 1][xBlocks - 1];
                  } else if (colIndex < xBlocks - 1) {
                      for (let i = 0; i < 2; i++) {
                          for (let j = -1; j < 2; j++) {
                              value += field[rowIndex + i][colIndex + j];
                          }
                      }
                      value -= field[rowIndex][colIndex];

                      value += field[yBlocks - 1][colIndex - 1];
                      value += field[yBlocks - 1][colIndex];
                      value += field[yBlocks - 1][colIndex + 1];

                  } else {
                      value += field[0][xBlocks - 2];
                      value += field[1][xBlocks - 2];
                      value += field[1][xBlocks - 1];

                      value += field[0][0];
                      value += field[1][0];

                      value += field[yBlocks - 1][xBlocks - 1];
                      value += field[yBlocks - 1][xBlocks - 2];

                      value += field[yBlocks - 1][0];
                  }
              } else {
                  if (colIndex < 1) {
                      value += field[yBlocks - 2][0];
                      value += field[yBlocks - 2][1];
                      value += field[yBlocks - 1][1];

                      value += field[yBlocks - 2][xBlocks - 1];
                      value += field[yBlocks - 1][xBlocks - 1];

                      value += field[0][0];
                      value += field[0][1];

                      value += field[0][xBlocks - 1];

                  } else if (colIndex < xBlocks - 1) {
                      for (let i = -1; i < 1; i++) {
                          for (let j = -1; j < 2; j++) {
                              value += field[rowIndex + i][colIndex + j];
                          }
                      }
                      value -= field[rowIndex][colIndex];

                      value += field[0][colIndex - 1];
                      value += field[0][colIndex];
                      value += field[0][colIndex + 1];
                  } else {
                      value += field[yBlocks - 2][xBlocks - 2];
                      value += field[yBlocks - 2][xBlocks - 1];
                      value += field[yBlocks - 1][xBlocks - 2];

                      value += field[yBlocks - 2][0];
                      value += field[yBlocks - 1][0];

                      value += field[0][xBlocks - 1];
                      value += field[0][xBlocks - 2];

                      value += field[0][0];

                  }
              }
          }
           nextMatrix[rowIndex][colIndex] = rule(value, field[rowIndex][colIndex]);
       });
    });
    return nextMatrix;
}

function rule(value, cellState) {
    if (( cellState && value <= 3 && value >= 2 ) || (!cellState && value == 3))
        return 1;
    else
        return 0;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function writeMessage(canvas, message) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
}

canvas.addEventListener('click', function(evt) {
    let mousePos = getMousePos(canvas, evt);
    let x = Math.floor(mousePos.x / blockWidth);
    let y = Math.floor(mousePos.y / blockHeight);
    if (x < xBlocks && y < yBlocks) {
        field[y][x] = 1;
        drawField();
    }
}, false);
canvas.addEventListener('contextmenu', function (evt) {
    evt.preventDefault();

    let mousePos = getMousePos(canvas, evt);
    let x = Math.floor(mousePos.x / blockWidth);
    let y = Math.floor(mousePos.y / blockHeight);
    if (x < xBlocks && y < yBlocks) {
        field[y][x] = 0;
        drawField();
    }
}, false);

drawField();

