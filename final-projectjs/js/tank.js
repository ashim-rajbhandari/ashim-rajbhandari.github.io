function drawTank(x,y){
    ctx.beginPath();
    ctx.drawImage(tank,0, tank.height-50, tank.width, spritUnitHeight, x, y, tankWidth, tankHeight );
    ctx.closePath();
}
  
function drawBullet(bx,by){
  ctx.beginPath();       // Start a new path
  ctx.moveTo(bx, by);    // Move the pen to (30, 50)
  ctx.lineTo(bx, by-bullet_height);  // Draw a line to (150, 100)
  ctx.lineWidth = bullet_width+2;
  ctx.strokeStyle = "red";
  ctx.stroke();
}
  
function fireTankBullet(){
  tankBullet_x = tankX + tankWidth/2 ;
  tankBullet_y = canvas.height - tank_bottomOffset;
  drawBullet(tankBullet_x,tankBullet_y);
  moveTankBullet();
  shouldMoveTankBullet = true;
}
  
function moveTankBullet(){
  if(tankBullet_y < 0){
    shouldMoveTankBullet= false;      
  }
  //check if a invader is hit by the bullet
  for (let i = 0; i < armyRows; i++) {
    for(let j = 0; j < armyColumns; j++){
      let soldier = armyArray[i][j];
      if(
        tankBullet_x > soldier.x &&
        tankBullet_x < soldier.x + invaderWidth &&
        tankBullet_y > soldier.y &&
        tankBullet_y < soldier.y + invaderHeight &&
        soldier.status == 'alive'
        )
        { 
          soldier.life -= 1;
          if(soldier.life == 0 ){
            soldier.status='dead';
            shouldMoveTankBullet=false;
            aliveInvaders--;
            score++; 
          }           
        }
                    
      }
    }  
    tankBullet_y -= tankBullet_dy;
}
  