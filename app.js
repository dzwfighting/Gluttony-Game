const canvas = document.getElementById("myCanvas");
// getContext() : 此方法会返回一个canvas的drawing context
//drawing context可以用来在canvas内画图

// mdn CanvasRederningContext2D
const ctx = canvas.getContext("2d");

const unit = 20; //表示一个小格的长宽
const row = canvas.height / unit; //320 / 20
const column = canvas.width / unit;

let snake = []; //Array每个元素，都是一个object，存储x，y的坐标
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

// 随机在canvas上添加食物功能
class Fruit {
  constructor() {
    // 在网格格子处添加食物
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  pickALocation() {
    // 更新食物
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}
// initial snake
createSnake();
let myFruit = new Fruit();

window.addEventListener("keydown", changeDirection);
let d = "Right"; //预设蛇走的方向为右
function changeDirection(e) {
  console.log(e); //根据输出的e objrct中的属性，找到你要抓取的
  if (e.key == "ArrowRight" && d != "Left") {
    // 即蛇的方向为左时，不能一下子让他转到右边
    // console.log("按右键");
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    // 即蛇的方向为上时，不能一下子让他转到下边
    // console.log("按下键");
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    // 即蛇的方向为右时，不能一下子让他转到左边
    // console.log("按左键");
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    // 即蛇的方向为下时，不能一下子让他转到上边
    // console.log("按上键");
    d = "Up";
  }

  // 如果手速过快的话，画面没动，键盘会不断的上下左右变化，因此会出现画面显示没事儿，但是结果是由于身体碰住导致游戏结束
  // 为了避免，需每次按下上下左右键，在下一步被画出来之前，程序不接受任何感应网页键盘
  window.removeEventListener("keydown", changeDirection);
}

// 记录分数
let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "Game Score " + score;
document.getElementById("myScore2").innerHTML = "Highest Score " + highestScore;

function draw() {
  console.log("drawing snake...");
  // 游戏结束判定
  // 每次画图之前，确认蛇有没有咬到自己，咬到游戏结束
  for (let i = 1; i < snake.length; i++) {
    // 即头和任意一点重合，游戏结束
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }
  // 每次画蛇时候，需要重新覆盖一次背景，否则原来的画还在，画会一直叠加上去
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 画果实
  myFruit.drawFruit();

  // 画蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    //设置边界条件，即蛇不能出边框，碰到边框穿墙
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  //以目前的d方向决定蛇下一步走的方向，设置其坐标
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit; //当前X位置-10，即为向左走
  } else if (d == "Up") {
    snakeY -= unit; //向上走，Y-10
  } else if (d == "Right") {
    snakeX += unit; //向右走，X增加
  } else if (d == "Down") {
    snakeY += unit; //向下走，Y增加
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 吃东西变长功能
  //确认蛇有没有吃到
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    // 使这个食物消失
    //画出新果实
    //更新分数
    myFruit.pickALocation();
    // myFruit.drawFruit(); 此处不需要画，因为该方法每200s会自动调用，方法第一行就是画食物
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "Game Score " + score;
    document.getElementById("myScore2").innerHTML =
      "Highest Score " + highestScore;
  } else {
    snake.pop(); //将头pop出来
  }

  snake.unshift(newHead); //根据上述方向，添加一个新的头进入
  // 即 将画面改变后，再监听键盘，感应下一步方向
  window.addEventListener("keydown", changeDirection);
}

// 每0.1s画一次蛇
let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = localStorage.getItem("highestScore");
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
