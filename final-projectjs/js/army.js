function moveArmy(){
  if(frameCount-armyPrevFrameCount>armySpeed){
    armyPrevFrameCount=frameCount;
    if(level == 2){
      invaderSpriteHeight=spritUnitHeight-invaderSpriteHeight;
      spriteSelector= 1 - spriteSelector;
    }
  }
  else{
    return false;
  }
  let dx;
  let dy=0;
  if (armyDirection == 'right') {
      if(canvas.width - (armyX + (invaderWidth+invaderLeftOffset)*(armyColumns-1)) > invaderWidth){
      dx=1;
    }else{ 
      armyDirection='left';
      dx=-1;
      dy=armyDy;
    }           
  } else
  if (armyDirection == 'left') {
      if (armyX-armyDx>0) {
      dx=-1;        
      }else{
        armyDirection='right';
        dx=1;
        dy=armyDy;
      }    
  }

  armyX+=armyDx*(dx);
  updateArmy(dx*(armyDx),dy)
}


function constructArmy(aX,aY){
  for (let i = 0; i < armyRows; i++) {
    armyArray[i]=[];
    for(let j = 0; j < armyColumns; j++){ 
      armyArray[i][j]={
        x: aX + j*(invaderWidth + invaderLeftOffset),
        y:aY + i*(invaderHeight + invaderTopOffset),
        status:"alive",
        life: level == 2 ? 4 : 1
      };
    }
  }
}

function updateArmy(adx,ady){    
  for (let i = 0; i < armyRows; i++) {    
    for(let j = 0; j < armyColumns; j++){
      let soldier = armyArray[i][j];
      soldier.x = soldier.x+(adx);
      soldier.y = soldier.y + ady;
      
    }
  }
}

function drawArmyOfInvaders(){
  for (let i = 0; i < armyRows; i++) {
    for(let j = 0; j < armyColumns; j++){
        let soldier = armyArray[i][j];
        if (soldier.status=='alive') {
          
          // drawInvader(soldier.x,soldier.y,invaderSpriteHeight);
          drawInvader(soldier.x,soldier.y,invaderSpriteHeightsArray[i][spriteSelector]);
            
          //chekc if game over by collision
            if(soldier.y > (tankY-20)){
              gameRunning=false;
            }
        }
      
    }
  }  
}

//aliens bullet
function invadersBulletHandler(){
    if(invaderBulletsArray.length<3 &&  frameCount- invBullet_prevFrameCount>(armySpeed*armyInvaderBulletsSpeed)){
      generateInvaderRandomBullet();
      invBullet_prevFrameCount=frameCount;
    }
    moveInvaderBullets();  
}
  
function generateInvaderRandomBullet(){
  let aliveArmy = [];
  for (let i = 0; i < armyRows; i++) {    
    for(let j = 0; j < armyColumns; j++){
      let soldier = armyArray[i][j];
      if(soldier.status=='alive')        
      aliveArmy.push(armyArray[i][j]);
      }
    }
      
  let rInvader = aliveArmy[genRandomNumber(aliveArmy.length)];
  if (rInvader.status=='alive') {
    let iBullet = {
      x : rInvader.x + invaderWidth/2,
      y : rInvader.y + invaderHeight    
    };
    invaderBulletsArray.push(iBullet);
    drawInvaderBullet(iBullet.x,iBullet.y);
  }
}
  
function genRandomNumber(rng){
  return Math.floor(Math.random()*rng);
}
  
function moveInvaderBullets(){
  for(let i = 0 ; i < invaderBulletsArray.length; i++){
    let iB = invaderBulletsArray[i];    
    iB.y = iB.y + invBullet_dy;
    
    //check if bullet out of bounds
    if(iB.y > canvas.height){
      invaderBulletsArray.splice(i,1);
    }
      
    //check if game over by hit bullet
    if(
      iB.x > tankX &&
      iB.x < tankX + tankWidth &&
      iB.y > tankY && 
      iB.y < tankY + tankHeight
    )
    {
      invaderBulletsArray.splice(i,1);
      console.log("lost 1 life");            
      lives--;
      hasLifeDecreased=true;
      blast.play();
    }
    drawInvaderBullet(iB.x,iB.y);  
  }
}

// draw aliens functions
function drawInvader(x,y,sHeight){
    ctx.beginPath();
    ctx.drawImage(invader,0,sHeight,spriteUnitWidth,spritUnitHeight, x,y,invaderWidth, invaderHeight);    
    ctx.closePath();
}
  
function drawInvaderBullet(ix, iy){
  ctx.beginPath();
  ctx.beginPath();       // Start a new path
  ctx.moveTo(ix, iy);    // Move the pen to (30, 50)
  ctx.lineTo(ix, iy+bullet_height);  // Draw a line to (150, 100)
  ctx.lineWidth = bullet_width;
  ctx.strokeStyle = "#FFF";
  ctx.stroke();
}