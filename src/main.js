var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var MARGIN = 20;
var ELEMENT_WIDTH = 10;
var ENVIRONNEMENT_NEON_COLOR = "blue";
var NEON_INTENSITY = 30;
var LEFT_SCORE = 0;
var RIGHT_SCORE = 0;
var BALL_WIDTH = 20;
var BALL_SPEED = 16;
var BALL_ANGLE = 7 * Math.PI / 4;
var BALL_COLOR = "white";
var BALL_NEON_COLOR = "blue";
var PADDLE_WIDTH = 10;
var PADDLE_HEIGHT = 80;
var PADDLESPEED = 12;
var LEFT_PADDLE_COLOR = "white";
var LEFT_PADDLE_NEON_COLOR = "green";
var RIGHT_PADDLE_COLOR = "white";
var RIGHT_PADDLE_NEON_COLOR = "red";
//####################
// Classes
var Ball = /** @class */ (function () {
    function Ball(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = BALL_SPEED * Math.cos(BALL_ANGLE);
        this.dy = BALL_SPEED * Math.sin(BALL_ANGLE);
        this.radius = radius;
        this.color = color;
    }
    Ball.prototype.draw = function () {
        ctx === null || ctx === void 0 ? void 0 : ctx.save();
        ctx.shadowBlur = NEON_INTENSITY;
        ctx.shadowColor = BALL_NEON_COLOR;
        ctx.fillStyle = this.color;
        ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        ctx === null || ctx === void 0 ? void 0 : ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx === null || ctx === void 0 ? void 0 : ctx.fill();
        ctx === null || ctx === void 0 ? void 0 : ctx.restore();
    };
    Ball.prototype.update = function (leftPaddle, rightPaddle) {
        this.x += this.dx;
        this.y += this.dy;
        // Hit right paddle
        if (this.x + this.radius >= rightPaddle.x &&
            this.y + this.radius >= rightPaddle.y &&
            this.y - this.radius <= rightPaddle.y + rightPaddle.height) {
            this.x = rightPaddle.x - this.radius;
            this.dx = -this.dx;
        }
        // Hit left paddle
        if (this.x - this.radius <= leftPaddle.x + leftPaddle.width &&
            this.y + this.radius >= leftPaddle.y &&
            this.y - this.radius <= leftPaddle.y + leftPaddle.height) {
            this.x = leftPaddle.x + leftPaddle.width + this.radius;
            this.dx = -this.dx;
        }
        // Hit ceilling
        if (this.y - this.radius <= ELEMENT_WIDTH) {
            this.y = ELEMENT_WIDTH + this.radius;
            this.dy = -this.dy;
        }
        // Hit floor
        if (this.y + this.radius >= canvas.height - ELEMENT_WIDTH) {
            this.y = canvas.height - ELEMENT_WIDTH - this.radius;
            this.dy = -this.dy;
        }
        // Hit left wall
        if (this.x - this.radius <= ELEMENT_WIDTH) {
            this.x = ELEMENT_WIDTH + this.radius;
            this.dx = -this.dx;
        }
        // Hit right wall
        if (this.x + this.radius >= canvas.width - ELEMENT_WIDTH) {
            this.x = canvas.width - ELEMENT_WIDTH - this.radius;
            this.dx = -this.dx;
        }
    };
    return Ball;
}());
var Paddle = /** @class */ (function () {
    function Paddle(x, y, width, height, color, neonColor) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.width = width;
        this.height = height;
        this.color = color;
        this.neonColor = neonColor;
    }
    Paddle.prototype.draw = function () {
        ctx === null || ctx === void 0 ? void 0 : ctx.save();
        ctx.shadowBlur = NEON_INTENSITY;
        ctx.shadowColor = this.neonColor;
        ctx.fillStyle = this.color;
        ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx === null || ctx === void 0 ? void 0 : ctx.restore();
    };
    Paddle.prototype.update = function (canvasHeight) {
        this.y += this.dy;
        if (this.y < MARGIN)
            this.y = MARGIN;
        if (this.y > (canvasHeight - this.height - MARGIN))
            this.y = (canvasHeight - this.height - MARGIN);
    };
    return Paddle;
}());
//####################
var ball = new Ball(canvas.width / 2, canvas.height / 2, BALL_WIDTH / 2, BALL_COLOR);
var leftPaddle = new Paddle(MARGIN, MARGIN, PADDLE_WIDTH, PADDLE_HEIGHT, LEFT_PADDLE_COLOR, LEFT_PADDLE_NEON_COLOR);
var rightPaddle = new Paddle(canvas.width - PADDLE_WIDTH - MARGIN, MARGIN, PADDLE_WIDTH, PADDLE_HEIGHT, RIGHT_PADDLE_COLOR, RIGHT_PADDLE_NEON_COLOR);
//####################
// Event Listener
document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp")
        rightPaddle.dy = -PADDLESPEED;
    else if (e.key == "ArrowDown")
        rightPaddle.dy = PADDLESPEED;
    else if (e.key == "w")
        leftPaddle.dy = -PADDLESPEED;
    else if (e.key == "s")
        leftPaddle.dy = PADDLESPEED;
});
document.addEventListener("keyup", function (e) {
    if (e.key == "ArrowUp" || e.key == "ArrowDown")
        rightPaddle.dy = 0;
    else if (e.key == "w" || e.key == "s")
        leftPaddle.dy = 0;
});
//####################
//####################
// Functions
function drawBoard() {
    var numNet = 8;
    var gap = 20;
    var netHeight = (canvas.height - gap * (numNet + 1)) / numNet;
    ctx === null || ctx === void 0 ? void 0 : ctx.save();
    ctx.shadowBlur = NEON_INTENSITY;
    ctx.shadowColor = ENVIRONNEMENT_NEON_COLOR;
    ctx.lineWidth = ELEMENT_WIDTH;
    ctx.strokeStyle = "white";
    ctx === null || ctx === void 0 ? void 0 : ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    for (var i = 0; i < numNet; i++) {
        var y = gap + i * (netHeight + gap);
        ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(canvas.width / 2 - ELEMENT_WIDTH / 2, y, ELEMENT_WIDTH, netHeight);
    }
    ctx === null || ctx === void 0 ? void 0 : ctx.restore();
}
function drawScore() {
    var y = 64;
    ctx === null || ctx === void 0 ? void 0 : ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "64px monospace";
    ctx.textAlign = "right";
    ctx === null || ctx === void 0 ? void 0 : ctx.fillText("0", canvas.width / 2 - MARGIN, MARGIN + y, y);
    ctx.textAlign = "left";
    ctx === null || ctx === void 0 ? void 0 : ctx.fillText("0", canvas.width / 2 + MARGIN, MARGIN + y, y);
    ctx === null || ctx === void 0 ? void 0 : ctx.restore();
}
//####################
function gameLoop() {
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawScore();
    ball.update(leftPaddle, rightPaddle);
    ball.draw();
    rightPaddle.update(canvas.height);
    rightPaddle.draw();
    leftPaddle.update(canvas.height);
    leftPaddle.draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
