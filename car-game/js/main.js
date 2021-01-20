const FPS = 90;
const FRAME_LIMIT = 1000 / FPS;
const LEFT_END = 185;
const RIGHT_END = 575;
const LANE_WIDTH = 130;
const OBSTACLE_POSITION = [185, 365, 530];
const CAR_WIDTH = 80;
const CAR_HEIGHT = 150;
const OBSTACLE_START_POSITION = -200;
const GAME_HEIGHT = 650;
const GAME_WIDTH = 850;

/**
 * For Shuffling Array Elements
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRandomValue(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; 
}

class Game {
  obstacleCars = [];
  score = 0;
  speed = { obstacle: 2, backgroundRoad: 5 };
  obstacleInterval = 2300;

  constructor() {
    this.createGameFields();
    this.showMenu();
  }

  
  showMenu() {
    this.playButton = document.createElement('button');
    this.highScoreDisplay = document.createElement('div');
    this.scoreDisplay = document.createElement('div');
    this.playButton.innerText = 'CLICK TO START';
    this.playButton.classList.add('play-button');
    this.highScoreDisplay.classList.add('high-score');
    this.scoreDisplay.classList.add('score');
    this.gameContainer.appendChild(this.playButton);
    this.gameContainer.appendChild(this.highScoreDisplay);
    this.gameContainer.appendChild(this.scoreDisplay);
    this.getHighScore();

    this.playButton.onclick = () => {
      this.playgame();
    };
  }

  playgame() {
    this.playButton.style.display = 'none'; //hide the play button and highscore display
    this.highScoreDisplay.style.display = 'none';
    this.scoreDisplay.style.display = 'block';

    //Updating score per second
    this.updateScore = setInterval(
      function() {
        this.score++;
        this.scoreDisplay.innerText = `SCORE : ${this.score}`;
      }.bind(this),
      1000
    );

    this.createPlayerCar();
    this.moveBackground = setInterval(
      function() {
        this.moveRoadBackground();
        this.moveObstacles();
      }.bind(this),
      FRAME_LIMIT
    );
    this.createObstacles = setInterval(
      function() {
        this.createObstacleCars();
      }.bind(this),
      this.obstacleInterval
    );
    this.checkKeyPress();
  }
  
  createGameFields() {
    this.body = document.querySelector('body');
    this.gameContainer = document.createElement('div');
    this.gameContainer.classList.add('game-container');
    this.body.appendChild(this.gameContainer);
    this.gameWrapper = document.createElement('div');
    this.gameWrapper.classList.add('wrapper');
    this.gameContainer.appendChild(this.gameWrapper);
    this.topValue = this.gameWrapper.offsetTop;
    this.defaultTopValue = this.topValue;
  }

  /**
   * Get and set highscore from the localStorage.
   */
  getHighScore() {
    if (!localStorage.getItem('highscore')) {
      localStorage.setItem('highscore', 0);
    }
    this.highScoreDisplay.innerText = `HIGHSCORE : ${localStorage.getItem('highscore')}`;
  }

  setHighScore() {
    var highscore = parseInt(localStorage.getItem('highscore'));
    if (this.score > highscore) {
      localStorage.setItem('highscore', this.score);
    }
    this.getHighScore();
  }


  
  moveRoadBackground() {
    this.topValue += this.speed.backgroundRoad;
    this.checkAndRepeatRoadBackground();
    this.updateRoadBackground();
  }

  
  updateRoadBackground() {
    this.gameWrapper.style.top = this.topValue + 'px';
  }


  checkAndRepeatRoadBackground() {
    if (this.topValue >= 0) {
      this.topValue = this.defaultTopValue;
    }
  }

  
  createPlayerCar() {
    this.car = new Car(this.gameContainer);
  }

  
  createObstacleCars() {
    var obstacleCount = getRandomValue(1, OBSTACLE_POSITION.length);
    
    for (var i = 0; i < obstacleCount; i++) {
      this.obstacle = new Obstacle(this.gameContainer);
      this.obstacle.setObstaclePosition(OBSTACLE_POSITION[i]);
      this.obstacleCars.push(this.obstacle);
    }
    shuffle(OBSTACLE_POSITION);
  }

  /**
   * Move the obstacle cars
   */
  moveObstacles() {
    for (var i = 0; i < this.obstacleCars.length; i++) {
      this.obstacleCars[i].moveObstacle(this.speed.obstacle);
      this.checkOverallCollision();
      this.checkDestroyedObstacles();
    }
  }

  
  checkOverallCollision() {
    for (var i = 0; i < this.obstacleCars.length; i++) {
      this.obstacleCars[i].checkCollisionAtEnd();
      if (this.checkCarCollision(this.car, this.obstacleCars[i])) {
        // console.log('GAME OVER');
        this.gameOver();
      }
    }
  }


  checkCarCollision(car, obstacle) {
    if (
      car.positionX < obstacle.positionX + CAR_WIDTH &&
      car.positionX + CAR_WIDTH > obstacle.positionX &&
      car.positionY < obstacle.positionY + CAR_HEIGHT &&
      car.positionY + CAR_HEIGHT > obstacle.positionY
    ) {
     
      return true;
    } else return false;
  }

 
  checkDestroyedObstacles() {
    for (var i = 0; i < this.obstacleCars.length; i++) {
      if (this.obstacleCars[i].isDestroyed) {
        this.obstacleCars[i].destroy();
        this.obstacleCars.splice(i, 1);
      }
    }
  }

  /**
   * Check which key is pressed
   */
  checkKeyPress() {
    document.onkeydown = event => {
      const keyPressed = event.code;
      if (keyPressed == 'ArrowLeft' || keyPressed == 'KeyA') {
        this.car.moveCar('left');
      } else if (keyPressed == 'ArrowRight' || keyPressed == 'KeyD') {
        this.car.moveCar('right');
      } 
    };
  }

 
  /**
   * End the game
   */

  gameOver() {
    this.car.destroy();
    clearInterval(this.moveBackground);
    clearInterval(this.createObstacles);
    clearInterval(this.updateScore);
    document.onkeydown = null;
    this.highScoreDisplay.style.display = 'block';
    var mainMenu = document.createElement('button');
    mainMenu.classList.add('play-button');
    mainMenu.style.display = 'block';
    mainMenu.innerText = 'MAIN MENU';

    mainMenu.onclick = () => {
      location.reload();
    };
    this.gameContainer.appendChild(mainMenu);
    this.setHighScore();
  }
}
var game = new Game();