class GameField {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this._gameField = document.getElementById("gameField");
    this._center = {
      x: Math.floor(columns / 2),
      y: Math.floor(rows / 2),
    };
    this._createGameField();
  }

  _createGameField() {
    this._gameField.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    for (let i = 0; i < this.columns * this.rows; i++) {
      const outerSquare = document.createElement("div");
      outerSquare.classList.add("outerSquare");
      const innerSquare = document.createElement("div");
      innerSquare.classList.add("innerSquare");

      outerSquare.appendChild(innerSquare);

      this._gameField.appendChild(outerSquare);
    }
  }
}

class Snake {
  constructor(gameField) {
    this._gameField = gameField;
    const centerX = gameField._center.x;
    const centerY = gameField._center.y;
    this._body = [
      {
        x: centerX,
        y: centerY,
      },
      { x: centerX - 1, y: centerY },
    ];
    this._direction = "right";
    this._snakeRendering();
    this._score = 0;
    this._highScore = localStorage.getItem("snakeHighScore") || 0;
    this._updateScoreDisplay();
  }

  _isEatingApple(applePosition) {
    const head = this._body[0];
    const isEating = head.x === applePosition.x && head.y === applePosition.y;

    if (isEating) {
      this._score += 10;
      if (this._score > this._highScore) {
        this._highScore = this._score;
        localStorage.setItem("snakeHighScore", this._highScore);
      }
      this._updateScoreDisplay();
    }

    return isEating;
  }

  _updateScoreDisplay() {
    const scoreNums = document.querySelector(".scoreNums");
    const hiScoreNums = document.querySelector(".hiScoreNums");

    if (scoreNums && hiScoreNums) {
      scoreNums.textContent = this._score;
      hiScoreNums.textContent = this._highScore;
    }
  }

  _snakeRendering() {
    const fieldElement = document.getElementById("gameField");
    this._clearSnakeFromField();

    this._body.forEach((segment, index) => {
      const cellIndex = segment.y * this._gameField.columns + segment.x;

      if (cellIndex >= 0 && cellIndex < fieldElement.children.length) {
        const cell = fieldElement.children[cellIndex];
        cell.classList.add("snake");
        const innerSquare = cell.children[0];
        innerSquare.classList.add("snakeInnerSquare");
      }
    });
  }

  _clearSnakeFromField() {
    const fieldElement = document.getElementById("gameField");
    for (let i = 0; i < fieldElement.children.length; i++) {
      const cell = fieldElement.children[i];
      cell.classList.remove("snake", "snakeInnerSquare");
    }
  }

  _checkCollisionWithSelf() {
    const head = this._body[0];
    for (let i = 1; i < this._body.length; i++) {
      if (head.x === this._body[i].x && head.y === this._body[i].y) {
        apple._clearAppleFromField();
        return true;
      }
    }
    return false;
  }

  _moving() {
    const head = this._body[0];

    if (this._checkCollisionWithSelf()) {
      alert("Опаньки!!! Кажется, змей укусил сам себя за яйку =( ");
      _runAnimation();
      this._resetGame();
      return;
    }

    let newHead;

    switch (this._direction) {
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
      newHead.x = this._gameField.columns - 1;
    } else if (newHead.x >= this._gameField.columns) {
      newHead.x = 0;
    }

    if (newHead.y < 0) {
      newHead.y = this._gameField.rows - 1;
    } else if (newHead.y >= this._gameField.rows) {
      newHead.y = 0;
    }

    this._body.unshift(newHead);

    if (this._isEatingApple(apple._position)) {
      apple._clearAppleFromField();
      apple._position = apple._generateApplePosition();
      apple._appleRendering();
    } else {
      if (this._body.length > 1) {
        const tail = this._body.pop();
        const tailIndex = tail.y * this._gameField.columns + tail.x;
        const tailCell =
          document.getElementById("gameField").children[tailIndex];
        tailCell.classList.remove("snake");
        tailCell.classList.remove("apple");
      }
    }

    this._snakeRendering();
  }

  _resetGame() {
    this._clearSnakeFromField();

    const centerX = this._gameField._center.x;
    const centerY = this._gameField._center.y;
    this._body = [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
    ];
    this._direction = "right";

    this._score = 0;
    this._updateScoreDisplay();

    apple._position = apple._generateApplePosition();
    this._snakeRendering();
    apple._appleRendering();
  }

  _listeningForKeydown() {
    document.addEventListener("keydown", this._handleKeyDown.bind(this));
  }

  _handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp":
        this._setDirection("up");
        break;
      case "ArrowDown":
        this._setDirection("down");
        break;
      case "ArrowLeft":
        this._setDirection("left");
        break;
      case "ArrowRight":
        this._setDirection("right");
        break;
    }
  }

  _setDirection(newDirection) {
    if (
      (newDirection === "up" && this._direction !== "down") ||
      (newDirection === "down" && this._direction !== "up") ||
      (newDirection === "left" && this._direction !== "right") ||
      (newDirection === "right" && this._direction !== "left")
    ) {
      this._direction = newDirection;
    }
  }
}

class Apple {
  constructor(gameField) {
    this._gameField = gameField;
    this._position = this._generateApplePosition();
  }

  _generateApplePosition() {
    while (true) {
      const position = {
        x: Math.floor(Math.random() * this._gameField.rows),
        y: Math.floor(Math.random() * this._gameField.columns),
      };

      if (!this._isAppleOnSnake(position)) {
        return position;
      }
    }
  }

  _isAppleOnSnake(position) {
    return snake._body.some((segment) => {
      return segment.x === position.x && segment.y === position.y;
    });
  }

  _appleRendering() {
    const fieldElement = document.getElementById("gameField");
    const cellIndex =
      this._position.y * this._gameField.columns + this._position.x;
    const cell = fieldElement.children[cellIndex];
    cell.classList.add("apple");
  }

  _clearAppleFromField() {
    const fieldElement = document.getElementById("gameField");
    const cellIndex =
      this._position.y * this._gameField.columns + this._position.x;
    const cell = fieldElement.children[cellIndex];
    cell.classList.remove("apple");
  }
}

const gameField = new GameField(30, 30);

const snake = new Snake(gameField);
snake._listeningForKeydown();

const apple = new Apple(gameField);
apple._appleRendering();

setInterval(() => {
  snake._moving();
}, 100);

document
  .getElementById("resetBtn")
  .addEventListener("click", _handleResetClick);

  async function _handleResetClick() {
    await _runAnimation();
    await new Promise((resolve) => setTimeout(resolve, 300));
    apple._clearAppleFromField();
    snake._resetGame();
  }

async function _runAnimation() {
  const cells = document.querySelectorAll(".outerSquare");
  const rows = gameField.rows;

  function _colorRow(rowIndex) {
    const currentRowIndexes = Array.from(
      { length: gameField.columns },
      (_, index) => rowIndex * gameField.columns + index
    );

    currentRowIndexes.forEach((index) => {
      cells[index].classList.add("coloringRow");
    });
  }

  function _resetRow(rowIndex) {
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
    _colorRow(currentRow);

    currentRow--;

    if (currentRow < 0) {
      clearInterval(intervalId);

      let resetRowInterval = setInterval(() => {
        if (currentRow >= 0 && currentRow < rows) {
          _resetRow(currentRow);
        }

        currentRow++;

        if (currentRow === rows) {
          clearInterval(resetRowInterval);
        }
      }, 5);
    }
  }, 5);
}
