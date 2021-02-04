let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext("2d");
var animationID;

let sound = document.getElementById('laser');
let blast = document.getElementById('blast');

//  load sprites
let sprite =  "image/sprite.png";
const tank = new Image();
tank.src = sprite;
const invader = new Image();
invader.src = sprite;
var startScreenTimeout;

//  tank and sprite
var frameCount=0;
var armyPrevFrameCount=0;
var spritUnitHeight = 35;
var spriteUnitWidth = 64;
var scoreBarHeight = 50;
var tank_bottomOffset = (spritUnitHeight/2) + scoreBarHeight;
var tankX=canvas.width/2;
var tankdX = 4;
var tankY=canvas.height-(tank_bottomOffset);
var tankWidth= spriteUnitWidth/2;
var tankHeight =spritUnitHeight/2
var keys =[];

// score and lives
var score = 0;
var allowedLives = 5;
var lives = allowedLives;
var hasLifeDecreased = false;
var gameRunning = false;

// invaders rows columns
var invaderWidth = spriteUnitWidth/2.5;
var invaderHeight = spritUnitHeight/2.5;
var invaderSpriteHeight = spritUnitHeight;
var invaderSpriteHeightsArray = [[68,102],[102,134],[102,134],[0,34],[0,34]];
var spriteSelector =0;
var armyRows = 1;
var armyColumns = 10;
var armyX = 60;
var armyY = 60;
var invaderLeftOffset = 15;
var invaderTopOffset = 20;
var armyDirection = "right";
var armyDx = 10;
var armyDy = 10;
var armySpeed = 60;  
var armySpeed_decrement = 10;
let aliveInvaders = armyColumns* armyRows;
var armyInvaderBulletsSpeed = 4;
var armyArray = [];

// bullet
var bullet_height = 10;
var bullet_width = 3;
var tankBullet_x;
var tankBullet_x1;
var tankBullet_y;
var shouldMoveTankBullet = false;
var tankBullet_dy = 10;

var invaderBulletsArray = [];
var invBullet_dy = 5;
var invBullet_prevFrameCount=0;

var level = 0;

//  main game loop
window.addEventListener('load', function() {
  drawStartScreen();  
})

function startGame(){
    clearInterval(startScreenTimeout);
    gameRunning=true;
    gameInit();
    constructArmy(armyX,armyY); 
    gameLoop();
}

function gameInit(){
  invaderBulletsArray = [];
  armyArray = [];
  score =score + 0;
  lives = lives;
  armyDirection = "right";  
  aliveInvaders = armyColumns* armyRows;
  frameCount=0;
  armyPrevFrameCount=0;
  invBullet_prevFrameCount=0;
  hasLifeDecreased = false;
  armySpeed = 60;
  level = level + 1;
}

function gameLoop(){
  //game lost by losing lives
  if(lives <= 0 || !gameRunning){
    gameRunning=false;
    ctx.clearRect(0,0,canvas.width,canvas.height);    
    drawScore();
    drawLives();    
    drawGameOver("you lost");
    drawBottomHelper();
    return false;
  }
  //next level
  if(aliveInvaders == 0){    
    startGame(); 
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
   helperHandler();
  drawScoreSeprateLine();
  drawScore();
  drawLives();
  moveArmy();
  drawArmyOfInvaders();
  keyPressed();
  drawTank(tankX,tankY);  
  if(shouldMoveTankBullet) {
    drawBullet(tankBullet_x,tankBullet_y);
    moveTankBullet();
    if(level == 2){
      drawBullet(tankBullet_x,tankBullet_y);
      drawBullet1(tankBullet_x1, tankBullet_y);
      moveTankBullet();
    }
  }
  invadersBulletHandler();
  animationID =  requestAnimationFrame(gameLoop);
  frameCount++;
  
}

//event listeners
window.addEventListener("keydown", ()=>keys[event.keyCode] = true);
window.addEventListener("keyup", ()=>keys[event.keyCode] = false);
window.addEventListener("keypress", keypressedHandler);
function keyPressed() {
  if (keys[37]) {     
    if (tankX-tankdX>0) {
      tankX-=tankdX;
    }
  }
  if (keys[39]) {
    if(canvas.width - (tankX+tankWidth) > tankdX) {
      tankX+=tankdX;
    }  
  }
  if (keys[88] || keys[32]) {    
    if(!shouldMoveTankBullet){
      fireTankBullet();
      sound.play();
      
    }
  }
}
function keypressedHandler(){
  if(keys[13] && !gameRunning){
    startGame();
  }
}

function helperHandler(){
  if(aliveInvaders == armyColumns* armyRows){
    drawBottomMessage("press SPACE to fire bullet", 125);
  }  else
  if(hasLifeDecreased){
    drawBottomMessage(`HIT. Lives Left: ${lives}`, 150);
    setTimeout(() => {
    hasLifeDecreased=false;
    drawBottomMessage(``, 150);      
    }, 2000);
  }

}

function drawScoreSeprateLine(){
  ctx.beginPath();       // Start a new path
  ctx.moveTo(0, canvas.height- (scoreBarHeight-15));    // Move the pen to (30, 50)
  ctx.lineTo(canvas.width, canvas.height - (scoreBarHeight-15));  // Draw a line to (150, 100)
  ctx.lineWidth = 2;
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY=1;
  ctx.shadowOffsetY=-1;
  ctx.shadowColor="red";
  ctx.strokeStyle = "green";
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY=0;
  ctx.shadowOffsetY=0;  
}

function drawBottomMessage(message,sx){
  ctx.beginPath();
  ctx.font = "20px Play";
  ctx.fillStyle="white";
  ctx.fillText(message, sx, canvas.height-10);  
  ctx.closePath();
}

function drawScore(){
  drawBottomMessage("Score: "+score,canvas.width - 90)
}

function drawLives(){
  drawBottomMessage("Lives: "+lives,10)
}

function drawBottomHelper(){
  drawBottomMessage("Press enter to play",150)
}

function drawGameOver(message){
  drawScreen_line1("Game Over ");
  drawScreen_line2(message);
}
  
function drawStartScreen(){
  drawScreen_line1("Space Wars") ;
  drawScreen_line2("press enter to play") ;
  drawScreen_line3('Note: For animated moving aliens hit 2 bullets');
}

function drawScreen_line1(message){
    ctx.save();
    ctx.beginPath();
    ctx.font = "60px Play";
    ctx.fillStyle="white";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width/2,canvas.height/2);  
    ctx.closePath();
    ctx.restore();
}

function drawScreen_line2(message){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle="green";
    ctx.textAlign = "center";
    ctx.font = "40px Play";
    ctx.fillText(message, canvas.width/2,canvas.height/2+60);  
    ctx.closePath();
    ctx.restore();
}

function drawScreen_line3(message){
  ctx.save();
  ctx.beginPath();
  ctx.font = "20px Play";
  ctx.fillStyle="white";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width/2, canvas.height-150);  
  ctx.closePath();
  ctx.restore();
}