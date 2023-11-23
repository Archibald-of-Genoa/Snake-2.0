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

  checkCollisionWithSelf() {
    const head = this.body[0];
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        apple.clearAppleFromField();
        return true;
      }
    }
    return false;
  }

  moving() {
    const head = this.body[0];

    if (this.checkCollisionWithSelf()) {
      alert("Опаньки!!! Кажется, змей укусил сам себя за яйку =( ");
      runAnimation();
      this.resetGame();
      return;
    }

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

    if (this.isEatingApple(apple.position)) {
      apple.clearAppleFromField();
      apple.position = apple.generateApplePosition();
      apple.appleRendering();
    } else {
      if (this.body.length > 1) {
        const tail = this.body.pop();
        const tailIndex = tail.y * this.gameField.columns + tail.x;
        const tailCell =
          document.getElementById("gameField").children[tailIndex];
        tailCell.classList.remove("snake");
        tailCell.classList.remove("apple");
      }
    }

    this.snakeRendering();
  }

  isEatingApple(applePosition) {
    const head = this.body[0];
    return head.x === applePosition.x && head.y === applePosition.y;
  }

  resetGame() {
    this.clearSnakeFromField();

    const centerX = this.gameField.center.x;
    const centerY = this.gameField.center.y;
    this.body = [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
    ];
    this.direction = "right";

    apple.position = apple.generateApplePosition();
    this.snakeRendering();
    apple.appleRendering();
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

class Apple {
  constructor(gameField) {
    this.gameField = gameField;
    this.position = this.generateApplePosition();
  }

  generateApplePosition() {
    while (true) {
      const position = {
        x: Math.floor(Math.random() * gameField.rows),
        y: Math.floor(Math.random() * gameField.columns),
      };

      if (!this.isAppleOnSnake(position)) {
        return position;
      }
    }
  }

  isAppleOnSnake(position) {
    return snake.body.some((segment) => {
      return segment.x === position.x && segment.y === position.y;
    });
  }

  appleRendering() {
    const fieldElement = document.getElementById("gameField");
    const cellIndex = this.position.y * gameField.columns + this.position.x;
    const cell = fieldElement.children[cellIndex];
    cell.classList.add("apple");
  }

  clearAppleFromField() {
    const fieldElement = document.getElementById("gameField");
    const cellIndex = this.position.y * gameField.columns + this.position.x;
    const cell = fieldElement.children[cellIndex];
    cell.classList.remove("apple");
  }
}

const gameField = new GameField(30, 30);

const snake = new Snake(gameField);
snake.listeningForKeydown();

const apple = new Apple(gameField);
apple.appleRendering();

setInterval(() => {
  snake.moving();
}, 100);

document.getElementById("resetBtn").addEventListener("click", handleResetClick);

async function handleResetClick() {
  // Запускаем анимацию
  await runAnimation();

  // Даем задержку перед сбросом яблока и игры
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Теперь сбрасываем яблоко и игру
  apple.clearAppleFromField();
  snake.resetGame();
}

async function runAnimation() {
  const cells = document.querySelectorAll(".outerSquare");
  const rows = gameField.rows;

  function colorRow(rowIndex) {
    const currentRowIndexes = Array.from(
      { length: gameField.columns },
      (_, index) => rowIndex * gameField.columns + index
    );

    currentRowIndexes.forEach((index) => {
      cells[index].classList.add("coloringRow");
    });
  }

  function resetRow(rowIndex) {
    const currentRowIndexes = Array.from(
      { length: gameField.columns },
      (_, index) => rowIndex * gameField.columns + index
    );

    currentRowIndexes.forEach((index) => {
      cells[index].classList.remove("coloringRow");
    });
  }

  let currentRow = rows - 1;

  const intervalId = setInterval(() => {
    colorRow(currentRow);

    currentRow--;

    if (currentRow < 0) {
      clearInterval(intervalId);

      // Обратная реакция: начинаем обратное окрашивание, начиная с самого верхнего ряда
      let resetRowInterval = setInterval(() => {
        if (currentRow >= 0 && currentRow < rows) {
          resetRow(currentRow);
        }

        currentRow++;

        if (currentRow === rows) {
          clearInterval(resetRowInterval);
        }
      }, 5);
    }
  }, 5);
}
