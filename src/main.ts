const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const   MARGIN = 20;
const   ELEMENT_WIDTH = 10;

const   ENVIRONNEMENT_NEON_COLOR = "blue";
const   NEON_INTENSITY = 30;

const   LEFT_SCORE = 0;
const   RIGHT_SCORE = 0;

const   BALL_WIDTH = 20;
const   BALL_SPEED = 16;
const   BALL_ANGLE = 7 * Math.PI / 4;
const   BALL_COLOR = "white";
const   BALL_NEON_COLOR = "blue";

const   PADDLE_WIDTH = 10;
const   PADDLE_HEIGHT = 80;
const   PADDLESPEED = 12;

const   LEFT_PADDLE_COLOR = "white";
const   LEFT_PADDLE_NEON_COLOR = "green";

const   RIGHT_PADDLE_COLOR = "white"
const   RIGHT_PADDLE_NEON_COLOR = "red";

//####################
// Classes
class Ball
{
    x:      number;
    y:      number;
    dx:     number;
    dy:     number;
    radius: number;
    color:  string;

    constructor(x: number, y:number, radius: number, color: string)
    {
        this.x = x;
        this.y = y;
        this.dx = BALL_SPEED * Math.cos(BALL_ANGLE);
        this.dy = BALL_SPEED * Math.sin(BALL_ANGLE);
        this.radius = radius;
        this.color = color;
    }

    draw()
    {
        ctx?.save();
        ctx!.shadowBlur = NEON_INTENSITY;
        ctx!.shadowColor = BALL_NEON_COLOR;
        ctx!.fillStyle = this.color;
        
        ctx?.beginPath();
        ctx?.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx?.fill();
        ctx?.restore();
    }

    update(leftPaddle: Paddle, rightPaddle: Paddle)
    {
        this.x += this.dx;
        this.y += this.dy;

        // Hit right paddle
        if (this.x + this.radius >= rightPaddle.x &&
            this.y + this.radius >= rightPaddle.y &&
            this.y - this.radius <= rightPaddle.y + rightPaddle.height)
        {
            this.x = rightPaddle.x - this.radius;
            this.dx = -this.dx;
        }
        // Hit left paddle
        if (this.x - this.radius <= leftPaddle.x + leftPaddle.width &&
            this.y + this.radius >= leftPaddle.y &&
            this.y - this.radius <= leftPaddle.y + leftPaddle.height)
        {
            this.x = leftPaddle.x + leftPaddle.width + this.radius;
            this.dx = -this.dx;
        }
        // Hit ceilling
        if (this.y - this.radius <= ELEMENT_WIDTH)
        {
            this.y = ELEMENT_WIDTH + this.radius;
            this.dy = -this.dy;
        }
        // Hit floor
        if (this.y + this.radius >= canvas.height - ELEMENT_WIDTH)
        {
            this.y = canvas.height - ELEMENT_WIDTH - this.radius;
            this.dy = -this.dy;
        }
        // Hit left wall
        if (this.x - this.radius <= ELEMENT_WIDTH)
        {
            this.x = ELEMENT_WIDTH + this.radius;
            this.dx = -this.dx;
        }
        // Hit right wall
        if (this.x + this.radius >= canvas.width - ELEMENT_WIDTH)
        {
            this.x = canvas.width - ELEMENT_WIDTH - this.radius;
            this.dx = -this.dx;
        }
    }
}

class Paddle
{
    x:          number;
    y:          number;
    dx:         number;
    dy:         number;
    width:      number;
    height:     number;
    color:      string;
    neonColor:  string;

    constructor(x: number, y:number, width: number, height :number, color: string, neonColor: string)
    {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.width = width;
        this.height = height;
        this.color = color;
        this.neonColor = neonColor;
    }

    draw()
    {
        ctx?.save();
        ctx!.shadowBlur = NEON_INTENSITY;
        ctx!.shadowColor = this.neonColor;
        ctx!.fillStyle = this.color;

        ctx?.fillRect(this.x, this.y, this.width, this.height);
        ctx?.restore();
    }

    update(canvasHeight: number)
    {
        this.y += this.dy;

        if (this.y < MARGIN)
            this.y = MARGIN;
        if (this.y > (canvasHeight - this.height - MARGIN))
            this.y = (canvasHeight - this.height - MARGIN);
    }
}
//####################

const ball = new Ball(canvas.width / 2, canvas.height / 2, BALL_WIDTH / 2, BALL_COLOR);
const leftPaddle = new Paddle(MARGIN, MARGIN, PADDLE_WIDTH, PADDLE_HEIGHT, LEFT_PADDLE_COLOR, LEFT_PADDLE_NEON_COLOR);
const rightPaddle = new Paddle(canvas.width - PADDLE_WIDTH - MARGIN, MARGIN, PADDLE_WIDTH, PADDLE_HEIGHT, RIGHT_PADDLE_COLOR, RIGHT_PADDLE_NEON_COLOR);


//####################
// Event Listener
document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowUp")
        rightPaddle.dy = -PADDLESPEED;
    else if (e.key == "ArrowDown")
        rightPaddle.dy = PADDLESPEED;
    else if (e.key == "w")
        leftPaddle.dy = -PADDLESPEED;
    else if (e.key == "s")
        leftPaddle.dy = PADDLESPEED;
})

document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowUp" || e.key == "ArrowDown")
        rightPaddle.dy = 0;
    else if (e.key == "w" || e.key == "s")
        leftPaddle.dy = 0;
})
//####################

//####################
// Functions
function drawBoard()
{
    const   numNet = 8;
    const   gap = 20;
    const   netHeight = (canvas.height - gap * (numNet + 1)) / numNet;

    ctx?.save();

    ctx!.shadowBlur = NEON_INTENSITY;
    ctx!.shadowColor = ENVIRONNEMENT_NEON_COLOR;
    ctx!.lineWidth = ELEMENT_WIDTH;
    ctx!.strokeStyle = "white";
    ctx?.strokeRect(0, 0, canvas.width, canvas.height);

    ctx!.fillStyle = "white";

    for (let i = 0; i < numNet; i++)
    {
        const y = gap + i * (netHeight + gap);
        ctx?.fillRect(canvas.width / 2 - ELEMENT_WIDTH / 2, y, ELEMENT_WIDTH, netHeight);
    }

    ctx?.restore();
}

function drawScore()
{
    const y = 64;

    ctx?.save();
    ctx!.fillStyle = "white";
    ctx!.font = "64px monospace";
    ctx!.textAlign = "right";
    ctx?.fillText("0", canvas.width / 2 - MARGIN, MARGIN + y, y);
    ctx!.textAlign = "left";
    ctx?.fillText("0", canvas.width / 2 + MARGIN, MARGIN + y, y);
    ctx?.restore();
}
//####################

function gameLoop()
{
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

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
