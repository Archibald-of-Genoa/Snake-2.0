class GameField {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.gameField = document.getElementById("gameField");
    this.center = {
      x: Math.floor(columns / 2),
      y: Math.floor(rows / 2),
    };
    this.createGameField();
  }

  createGameField() {
    this.gameField.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    for (let i = 0; i < this.columns * this.rows; i++) {
      const outerSquare = document.createElement("div");
      outerSquare.classList.add("outerSquare");
      const innerSquare = document.createElement("div");
      innerSquare.classList.add("innerSquare");

      outerSquare.appendChild(innerSquare);

      this.gameField.appendChild(outerSquare);
    }
  }
}

class Snake {
  constructor(gameField) {
    this.gameField = gameField;

    const centerX = gameField.center.x;
    const centerY = gameField.center.y;

    this.body = [
      {
        x: centerX,
        y: centerY,
      },

      { x: centerX - 1, y: centerY },
    ];

    this.snakeRendering();
  }

  snakeRendering() {
    const fieldElement = document.getElementById("gameField");

    this.body.forEach((segment, index) => {
      const cellIndex = segment.y * gameField.columns + segment.x;

      if (cellIndex >= 0 && cellIndex < fieldElement.children.length) {
        const cell = fieldElement.children[cellIndex];
        cell.classList.add("snake");
        const innerSquare = cell.children[0];
        innerSquare.classList.add("snakeInnerSquare");
      }
    });
  }
}

const gameField = new GameField(30, 30);

const snake = new Snake(gameField);
