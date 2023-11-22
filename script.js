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

    this.direction = "right";

    this.snakeRendering();
  }

  snakeRendering() {
    const fieldElement = document.getElementById("gameField");
    this.clearSnakeFromField();

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

  clearSnakeFromField() {
    const fieldElement = document.getElementById("gameField");
    for (let i = 0; i < fieldElement.children.length; i++) {
      const cell = fieldElement.children[i];
      cell.classList.remove("snake", "snakeInnerSquare");
    }
  }

  moving() {
    const head = this.body[0];

    let newHead;

    switch (this.direction) {
      case "up":
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case "down":
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case "left":
        newHead = { x: head.x - 1, y: head.y };
        break;
      case "right":
        newHead = { x: head.x + 1, y: head.y };
        break;
      default:
        break;
    }

    if (newHead.x < 0) {
      newHead.x = this.gameField.columns - 1;
    } else if (newHead.x >= this.gameField.columns) {
      newHead.x = 0;
    }

    if (newHead.y < 0) {
      newHead.y = this.gameField.rows - 1;
    } else if (newHead.y >= this.gameField.rows) {
      newHead.y = 0;
    }

    this.body.unshift(newHead);

    if (this.body.length > 1) {
      const tail = this.body.pop();
      const tailIndex = tail.y * this.gameField.columns + tail.x;
      const tailCell = document.getElementById("gameField").children[tailIndex];
      tailCell.classList.remove("snake");
      const innerSquare = tailCell.children[0];
      innerSquare.classList.remove("snakeInnerSquare");
    }

    this.snakeRendering();
  }

  listeningForKeydown() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp":
        this.setDirection("up");
        break;
      case "ArrowDown":
        this.setDirection("down");
        break;
      case "ArrowLeft":
        this.setDirection("left");
        break;
      case "ArrowRight":
        this.setDirection("right");
        break;
    }
  }

  setDirection(newDirection) {
    if (
      (newDirection === "up" && this.direction !== "down") ||
      (newDirection === "down" && this.direction !== "up") ||
      (newDirection === "left" && this.direction !== "right") ||
      (newDirection === "right" && this.direction !== "left")
    ) {
      this.direction = newDirection;
    }
  }
}

const gameField = new GameField(30, 30);

const snake = new Snake(gameField);
snake.listeningForKeydown();

setInterval(() => {
  snake.moving();
}, 300);
