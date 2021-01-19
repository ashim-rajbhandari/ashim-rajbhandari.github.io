var canvas = {
    element: document.getElementById('canvas'),
    width: 800,
    height: 600,
    initialize: function () {
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        document.body.appendChild(this.element);
    }
};

var Ball = {
    create: function (color) {
        var newBall = Object.create(this);
        newBall.dx = 3;
        newBall.dy = 2;
        newBall.width = 40;
        newBall.height = 40;
        newBall.element = document.createElement('div');
        newBall.element.style.backgroundColor = color;
        newBall.element.style.width = newBall.width + 'px';
        newBall.element.style.height = newBall.height + 'px';
        newBall.element.className += ' ball';
        newBall.width = parseInt(newBall.element.style.width);
        newBall.height = parseInt(newBall.element.style.height);
        canvas.element.appendChild(newBall.element);
        return newBall;
    },
    move: function (x, y) {
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
    },
    changeDirection: function (x, y) {
        if (x < 0 || x > canvas.width - this.width) {
            this.dx = -this.dx;
        }
        if (y < 0 || y > canvas.height - this.height) {
            this.dy = -this.dy;
        }
    },
    draw: function (x, y) {
        this.move(x, y);
        var ball = this;
        setTimeout(function () {
            ball.changeDirection(x, y);
            ball.draw(x + ball.dx, y + ball.dy);
        }, 1000 / 60);
    }
};

canvas.initialize();
var ball1 =  Ball.create("red");
var ball2 =  Ball.create("green");
var ball3 =  Ball.create("blue");
var ball4 =  Ball.create("orange");
var ball5 =  Ball.create("yellow");
var ball6 =  Ball.create("pink");
var ball7 =  Ball.create("skyblue");
var ball8 =  Ball.create("purple");
var ball9 =  Ball.create("blue");
var ball10 =  Ball.create("green");
ball1.draw(70, 0);
ball2.draw(20, 200);
ball3.draw(300, 330); 
ball4.draw(70, 270);
ball5.draw(400, 220);
ball6.draw(300, 30); 
ball7.draw(90, 200);
ball8.draw(120, 300);
ball9.draw(400, 330);
ball10.draw(80, 100);
