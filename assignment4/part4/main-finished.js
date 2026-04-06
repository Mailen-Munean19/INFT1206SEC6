// SETUP CANVAS

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// paragraph for ball counter
const para = document.querySelector("p");


// FUNCTIONS 


function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}


//  CREATING SHAPE CLASS

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}


// BALL CLASS MODIFIED

class Ball extends Shape {
  constructor(x, y, velX, velY, size, color) {
    super(x, y, velX, velY);
    this.size = size;
    this.color = color;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if ((this.x + this.size) >= canvas.width) {
      this.velX = -this.velX;
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -this.velX;
    }

    if ((this.y + this.size) >= canvas.height) {
      this.velY = -this.velY;
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // Updated collisionDetect 
  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}


// EVil circle class

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);

    this.color = "white";
    this.size = 10;

    // movement controls
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  // draw as OUTLINE (stroke not fill)
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // keep inside screen
  checkBounds() {
    if ((this.x + this.size) >= canvas.width) {
      this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
      this.x += this.size;
    }

    if ((this.y + this.size) >= canvas.height) {
      this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
      this.y += this.size;
    }
  }

  // eat balls
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;   // remove ball
          ballCount--;           // update counter
          para.textContent = `Ball count: ${ballCount}`;
        }
      }
    }
  }
}


// Ball setup


const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);

  const ball = new Ball(
    random(0 + size, canvas.width - size),
    random(0 + size, canvas.height - size),
    random(-7, 7),
    random(-7, 7),
    size,
    randomRGB()
  );

  balls.push(ball);
}

// =========================
// SCORE COUNTER
// =========================
let ballCount = balls.length;
para.textContent = `Ball count: ${ballCount}`;

// =========================
// EVIL CIRCLE INSTANCE
// =========================
const evil = new EvilCircle(100, 100);

// =========================
// MAIN LOOP (FROM STARTER + MODIFIED)
// =========================
function loop() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();

  requestAnimationFrame(loop);
}

loop();