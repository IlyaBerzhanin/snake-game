//import Player from "../../modules/player";
  
const GAME_WIDTH = 800; // ширина поля в пикселях
const GAME_HEIGHT = 600; // высота поля в пикселях

const BLOCK_SIZE = 20; // размер одной клетки поля в пикселях

const GAME_HEIGHT_IN_BLOCKS = GAME_HEIGHT / BLOCK_SIZE - 1; // ширина поля в клетках
const GAME_WIDTH_IN_BLOCKS = GAME_WIDTH / BLOCK_SIZE - 1; // высота поля в клетках

const COLOR_BACKGROUND = "#c5f0a7";
const COLOR_SNAKE = "#000000";
const COLOR_PLAYER = '#8dad34';
const COLOR_APPLE = "#8aa173"; 

export default function Helpers() {
    const BLOCK_BORDER_RADIUS = 5;
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
  
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    this.ALL_PLAYERS_SCORES_BLOCK = document.querySelector("#points");    
    this.READY_TO_PLAY = false
    this.ALL_PLAYERS = []
    this.INITIAL_PLAYERS = []

    this.addInfoOnBoard = addInfoOnBoard
    this.removeInfoFromBoard = removeInfoFromBoard
    this.setDirection = setDirection
    this.drawHead = drawHead 
    this.clearField = clearField;
    this.drawSnakeSegment = drawSnakeSegment;
    this.drawApple = drawApple; 
    this.random = {
      getX: getRandomX,
      getY: getRandomY,
    };  

    this.moveSnake = moveSnake
  
   

    function addInfoOnBoard(player) {
      if(player.type === 'player') {
       let playerInfo = document.createElement('div')
      let playerName = document.createElement('p')
      let playerScores = document.createElement('p')
      playerName.innerText = `PLAYER: ${player.name};`
      playerScores.innerText = `SCORES: ${player.scores};`
      playerScores.setAttribute('id', player.uniqueId)   
      playerScores.classList.add('player-scores')
      playerInfo.append(playerName, playerScores)
     this.ALL_PLAYERS_SCORES_BLOCK.append(playerInfo)
      }
    }

    function removeInfoFromBoard(player) {
      let boardChildren = [...this.ALL_PLAYERS_SCORES_BLOCK.children]
      boardChildren.forEach(child => {
        if(child.innerText.includes(player.name)) {
          child.remove()
        }
      })      
    }
 
     function setDirection(snake, key, fieldWidthInBlocks, fieldHeightInBlocks) {
  
      let headX = snake.itemParts[0].x;
      let headY = snake.itemParts[0].y;
      switch (key) {
        case snake.up:
          if (headY > 0 && snake.direction !== "down") {
            snake.direction = "up";
          }
          break;
  
        case snake.down:
          if (headY < fieldHeightInBlocks && snake.direction !== "up") {
            snake.direction = "down";
          }
          break;
  
        case snake.left:
          if (headX > 0 && snake.direction !== "right") {
            snake.direction = "left";
          } 
          break;   
   
        case snake.right:
          if (headX < fieldWidthInBlocks && snake.direction !== "left") {
            snake.direction = "right";
          }
          break;
      }
    }
  
    function clearField() {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    } 

    function drawSnakeSegment(x, y, color) {
      roundRect(x, y, color);
    }
    
    function drawHead(x, y, color) {
      roundRect(x, y, color);
    }

    function drawApple(x, y) {
      x = x * BLOCK_SIZE;
      y = y * BLOCK_SIZE;
  
      ctx.fillStyle = COLOR_APPLE;
      ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    }
    function roundRect(x, y, color) {
      x = x * BLOCK_SIZE;
      y = y * BLOCK_SIZE;
  
      ctx.beginPath();
      ctx.moveTo(x + BLOCK_BORDER_RADIUS, y);
      ctx.lineTo(x + BLOCK_SIZE - BLOCK_BORDER_RADIUS, y);
      ctx.quadraticCurveTo(
        x + BLOCK_SIZE,
        y,
        x + BLOCK_SIZE,
        y + BLOCK_BORDER_RADIUS
      );
      ctx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE - BLOCK_BORDER_RADIUS);
      ctx.quadraticCurveTo(
        x + BLOCK_SIZE,
        y + BLOCK_SIZE,
        x + BLOCK_SIZE - BLOCK_BORDER_RADIUS,
        y + BLOCK_SIZE
      );
      ctx.lineTo(x + BLOCK_BORDER_RADIUS, y + BLOCK_SIZE);
      ctx.quadraticCurveTo(
        x,
        y + BLOCK_SIZE,
        x,
        y + BLOCK_SIZE - BLOCK_BORDER_RADIUS
      );
      ctx.lineTo(x, y + BLOCK_BORDER_RADIUS);
      ctx.quadraticCurveTo(x, y, x + BLOCK_BORDER_RADIUS, y);
      ctx.closePath();
  
      ctx.strokeStyle = COLOR_BACKGROUND;
      ctx.fillStyle = color;
  
      ctx.fill();
      ctx.stroke();
    }
  
    function getRandomX() {
      return getRandomNumber(GAME_WIDTH_IN_BLOCKS);
    }
  
    function getRandomY() {
      return getRandomNumber(GAME_HEIGHT_IN_BLOCKS);
    }
  
    function getRandomNumber(max) {
      return Math.floor(Math.random() * (max + 1));
    }

    function moveSnake(snake) {
      let itemHeadX = snake.itemParts[0].x;
      let itemHeadY = snake.itemParts[0].y;
        
  
      switch (snake.direction) {
        case "left":
          itemHeadX -= 1;
          break;
        case "right":
          itemHeadX += 1;
          break;
        case "up":
          itemHeadY -= 1;
          break;
        case "down":
          itemHeadY += 1;
          break; 
      }
  
      let newHead = {
        color: snake.color,
        uniqueId: snake.uniqueId,
        type: snake.type,
        x: itemHeadX,
        y: itemHeadY,
        playerOrderNumber: snake.playerOrderNumber,
      };

      
      snake.itemParts.unshift(newHead); 
      snake.itemParts.pop();
          
        
    }
  } 