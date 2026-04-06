// Select canvas and set up context
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const para = document.querySelector("p");

// Set canvas size
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Random number helper
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random RGB color
function randomRGB() {
  return `rgb(${random(0, 255)} ${random(0, 255)} ${random(0, 255)})`;
}

// Creating Shape Class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}


// Ball class
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x,y,velX,velY,size, color)
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  // Draw ball
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Move ball and bounce off walls
  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // Detect collisions with other balls
  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          this.color = ball.color = randomRGB();
        }
      }
    }
  }
}

// Store balls
const balls = [];

// Create multiple balls
while (balls.length < 25) {
  const size = random(10, 20);

  const ball = new Ball(
    random(size, width - size),
    random(size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}

// Animation loop
function loop() {
  // Fade background (creates trail effect)
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);

  // Draw, move, and check collisions
  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  requestAnimationFrame(loop);
}

// Start animation
loop();