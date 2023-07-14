let WIDTH = 1000, HEIGHT = 500;

let bg_image, win_image, lose_image;
let platform_image, platform;
let ball_image, ball;
let bricks, banana_image, berries_image, orange_image, peach_image;
let types = ["peach", "orange", "berries", "banana"];
let winning_score = 36;

var added_speed = 0, game_state = "start", high_score = 0, score = 0, new_high = false;

function preload() {
  bg_image = loadImage("images/large_images/bg.png");
  bg_image.resize(WIDTH, HEIGHT);
  win_image = loadImage("images/large gifs/dance gif.gif");
  lose_image = loadImage("images/large gifs/disapointed monkey.gif");
  platform_image = loadImage("images/fruit/bananabasket.png");
  ball_image = loadImage("images/fruit/peachfruit.png");
  banana_image = loadImage("images/fruit/bananabasket.png");
  berries_image = loadImage("images/fruit/berriesbasket.png");
  orange_image = loadImage("images/fruit/orangebasket.png");
  peach_image = loadImage("images/fruit/peachbasket.png");
  mc_font = loadFont("Minecraft.ttf");
}

class Platform {
  constructor() {
    this.width = 150;
    this.height = 25;
    this.location = createVector((WIDTH / 2) - (this.width / 2), HEIGHT - 50);
    this.s = 4;
    this.speed = {
      right: createVector(this.s, 0),
      left: createVector(this.s * -1, 0)
    };
    platform_image.resize(this.width, this.height);
  }

  draw() {
    image(platform_image, this.location.x, this.location.y);
  }

  move(direction) {
    this.location.add(this.speed[direction]);

    if(this.location.x < 0) {
      this.location.x = 0;
    }
    if(this.location.x > WIDTH - this.width) {
      this.location.x = WIDTH - this.width;
    }
  }
}

class Ball {
  constructor(platform) {
    this.radius = 15;
    this.location = createVector(platform.location.x + (platform.width / 2), (platform.location.y - this.radius));
    this.s = 3;
    this.velocity = createVector(this.s, this.s * -1);
    this.platform = platform;
    ball_image.resize(this.radius, this.radius);
  }

  draw() {
    image(ball_image, this.location.x, this.location.y);
  }

  move() {
    if (this.location.x + this.radius >= this.platform.location.x && this.location.x - this.radius <= this.platform.location.x + this.platform.width) {          
      if (this.location.y + this.radius > this.platform.location.y) {
        this.velocity['y'] *= -1;
        this.location.y = this.platform.location.y - this.radius - 1;
      }
    } // bounce off the platform
    
    if (this.location.x + this.radius >= width) { 
      this.velocity['x'] *= -1;
    } else if(this.location.x - this.radius <= 0) {
      this.velocity['x'] *= -1;
    } else if(this.location.y - this.radius <= 0) { 
      this.velocity['y'] *= -1;
    } // bounce off the walls

    this.location.add(this.velocity);
  }
}

class Brick {
  constructor(location, width, height, type) {
    this.location = location;
    this.width = width;
    this.height = height;
    this.type = type;
    this.points = 1;
    this.life = 1;
    banana_image.resize(this.width, this.height);
    berries_image.resize(this.width, this.height);
    orange_image.resize(this.width, this.height);
    peach_image.resize(this.width, this.height);
  }

  draw() {
    if(this.type == 3) {
      image(banana_image, this.location.x, this.location.y);
    }
    else if(this.type == 2) {
      image(berries_image, this.location.x, this.location.y);
      this.life = 2;
    }
    else if(this.type == 1) {
      image(orange_image, this.location.x, this.location.y);
      this.life = 3;
    }
    else {
      image(peach_image, this.location.x, this.location.y);
      this.life = 4;
    }
  }

  hit(ball) {
    if(ball.location.y - ball.radius <= this.location.y + this.height &&
        ball.location.y + ball.radius >= this.location.y &&
        ball.location.x + ball.radius >= this.location.x &&
        ball.location.x - ball.radius <= this.location.x + this.width) {
          this.num_hits++;
          return true;
        }
  }
}

function createBricks() {
  const bricks = [];
  const rows = types.length;
  const bricksPerRow = 9;
  const brickWidth = WIDTH / bricksPerRow;
  const height = 75;
  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < bricksPerRow; i++) {
      let brick = new Brick(createVector(brickWidth * i, height * row), brickWidth, height, row);
      bricks.push(brick);
    }
  }
  return bricks;
}

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('sketch-holder');

  platform = new Platform();
  ball = new Ball(platform);
  bricks = createBricks();
}

function draw() {
  if(game_state == "play") {
    background(bg_image);
  
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      platform.move('left');
    } 
    else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      platform.move('right');
    }
    platform.draw();

    for (let i = bricks.length - 1; i >= 0; i--) {
      const brick = bricks[i];
      if(brick.hit(ball)) {
        ball.velocity['y'] *= -1;
        brick.life -= 1;
        brick.type += 1;
      }
      if (brick.life == 0) {
        ball.velocity['y'] *= -1;
        bricks.splice(i, 1);
        score += brick.points;
        added_speed += 0.01;

        platform.speed = {
          right: createVector(platform.s += added_speed, 0),
          left: createVector((platform.s += added_speed) * -1, 0)
        };

        ball.velocity = createVector(ball.s += added_speed, (ball.s += added_speed) * -1);
      } 
      else {
        brick.draw();
      }
    }

    ball.move();
    ball.draw();
    if (ball.location.y > HEIGHT) {
      if (score > high_score) {
        high_score = score;
        new_high = true;
      }

      platform = new Platform();
      ball = new Ball(platform);
      bricks = createBricks();
      added_speed = 0;

      game_state = "lose";
    }

    if (score >= winning_score) {
      if (score > high_score) {
        high_score = score;
        new_high = true;
      }
       
      platform = new Platform();
      ball = new Ball(platform);
      bricks = createBricks();
      added_speed = 0;

      game_state = "win";
    }

    textSize(20);
    textFont(mc_font);
    fill(255);
    text(`Score: ${score}`, WIDTH - 100, HEIGHT - 5);
    text(`High Score: ${high_score}`, 10, HEIGHT - 5);
  }
  else if(game_state == "start") {
      background(bg_image);
      textSize(75);
      textFont(mc_font);
      fill(0);
      text(`BOUNCE GAME`, 230, HEIGHT - 200);
      text(`PRESS SPACE TO PLAY!`, 50, HEIGHT - 100);
      if (keyIsDown(32)) {
        game_state = "play"; 
      }
    }
  else if(game_state == "win") {
    background(bg_image);
    image(win_image, 360, 50);
    textSize(50);
    textFont(mc_font);
    fill(0);
    text(`YOU WIN!`, 360, HEIGHT - 180);
    text(`PRESS SPACE TO PLAY AGAIN.`, 110, HEIGHT - 120);
    text(`Score: ${score}`, 370, HEIGHT - 30);
    if (keyIsDown(32)) {
      game_state = "play"; 
      score = 0;
    }
  }
  else if(game_state == "lose") {
    background(bg_image);
    image(lose_image, 400, 50);
    textSize(50);
    textFont(mc_font);
    fill(0);
    text(`YOU LOSE!`, 360, HEIGHT - 180);
    text(`PRESS SPACE TO TRY AGAIN.`, 120, HEIGHT - 120);
    text(`Score: ${score}`, WIDTH - 270, HEIGHT - 30);
    if(new_high) {
      fill(255, 0, 0);
      text(`*NEW* High Score: ${high_score}`, 50, HEIGHT - 30);
    }
    else{
      text(`High Score: ${high_score}`, 50, HEIGHT - 30);
    }
    
    if (keyIsDown(32)) {
      game_state = "play"; 
      new_high = false;
      score = 0;
    }
  }
}
