  class Game {
    constructor(options) {
      this.IS_GAME_OVER = true;
      
       this.GAME_WIDTH = 800; // ширина поля в пикселях
       this.GAME_HEIGHT = 600; // высота поля в пикселях
       this.BLOCK_SIZE = 20; // размер одной клетки поля в пикселях

       this.GAME_HEIGHT_IN_BLOCKS = this.GAME_HEIGHT / this.BLOCK_SIZE - 1; // ширина поля в клетках
       this.GAME_WIDTH_IN_BLOCKS = this.GAME_WIDTH / this.BLOCK_SIZE - 1; // высота поля в клетках
  
      this.numberOfTargets = 3;
      this.numberOfBots = 2; 

      this.COLORS = []
  
      this.ALL_PLAY_ITEMS = [];
      this.PLAYERS = [];
      this.TARGETS = [];
      this.BOTS = [];
      this.ALL_SNAKES_ONLY = []

      this.thereArePlayersOnTheField = true
    } 

    startGame(callback) {
      if(this.PLAYERS.length === 1 && this.IS_GAME_OVER === true) {
        this.IS_GAME_OVER = false
        callback()
      }
    }

    addScoreBoards(arrayOfAllSnakes) {
      arrayOfAllSnakes.forEach(snake => {
        this.ALL_PLAYERS_SCORES.append(snake.scoreBoard)
      })
    }

    compare(a, b) {
      if (a.rangeFromCenters < b.rangeFromCenters) {
          return -1;  // первый сравниваемый элемент будет расположен по меньшему индексу
      }
      if (a.rangeFromCenters > b.rangeFromCenters) {
          return 1;  // второй сравниваемый элемент будет расположен по меньшему индексу
      }
      // если первый аргумент равен второму, то элементы массива останутся неизменными 
      // по отношению друг к другу но будут отсортированы по отношению ко всем другим элементам
      return 0;   
    }
  
    createTargets(numberOfItems, callback) {
      for (let i = 0; i < numberOfItems; i++) {
        callback();
      }
    }

    rebornBots(callback) {
      if(this.BOTS.length === 0) {callback()}
    }

    getArrayofElementsSortedByRange(snake, snakeHeadX, snakeHeadY, arrayOfAllObjects) {
      const elementsToSort = []
  
      for(let i = 0; i < arrayOfAllObjects.length; i++) {
        for(let k = 0; k < arrayOfAllObjects[i].itemParts.length; k++) {
          let target = arrayOfAllObjects[i]         
          if(snake.playerOrderNumber !== target.playerOrderNumber) {
            let targetX = target.itemParts[k].x
            let targetY = target.itemParts[k].y
            let dX = targetX - snakeHeadX
            let dY = targetY - snakeHeadY
    
            let rangeFromCenters = Math.floor((Math.sqrt((dX * dX) + (dY * dY))) * 1000) / 1000
            target.itemParts[k].rangeFromCenters = rangeFromCenters
            
            elementsToSort.push(target.itemParts[k])    
          }
               
        }
      }
      elementsToSort.sort(this.compare)
      return elementsToSort
  }

    getRandomNumberofColor(from, to) {
      return (Math.random() * (to - from)) + from;
    }

    addColors() {
      while (this.COLORS.length < 100) {
        this.COLORS.push(`rgb(${this.getRandomNumberofColor(0, 255)}, ${this.getRandomNumberofColor(0, 255)}, ${this.getRandomNumber(0, 255)})`);
    }
    }

    getRandomNumber(max) {
      return Math.floor(Math.random() * (max + 1));
    }

     getRandomX() {
      return this.getRandomNumber(this.GAME_WIDTH_IN_BLOCKS);
    }
  
     getRandomY() {
      return this.getRandomNumber(this.GAME_HEIGHT_IN_BLOCKS);
    }
  
    finishGame() {
      if(this.PLAYERS.length < 1) {
        this.IS_GAME_OVER = true
      }   
      
      if(this.BOTS.length === 1 && this.PLAYERS.length === 0) {
        this.IS_GAME_OVER = true
      }
    }

    setDirection(snake, key, fieldWidthInBlocks, fieldHeightInBlocks) {
  
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

    setRandomCoordinates(item, newRandomX, newRandomY) {
      item.x = newRandomX
      item.y = newRandomY    
    }

    touchWallsWithCasualties(snake, fieldWidthInBlocks, fieldHeightInBlocks) {
      let itemHeadX = snake.itemParts[0].x;
      let itemHeadY = snake.itemParts[0].y;

      if (
        (itemHeadX > fieldWidthInBlocks && snake.direction === "right") ||
        (itemHeadX < 0 && snake.direction === "left")
      ) {               
       
        snake.itemParts.shift();
        //GAME.IS_GAME_OVER = true;
        if (itemHeadY > fieldHeightInBlocks / 2) {
          snake.direction = "up";
        } else {
          snake.direction = "down";
        }

        
        snake.isWallReached = true;
        

      } else if (
        (itemHeadY > fieldHeightInBlocks && snake.direction === "down") ||
        (itemHeadY < 0 && snake.direction === "up")
      ) {

        snake.itemParts.shift();
     
        //GAME.IS_GAME_OVER = true;
        if (itemHeadX > fieldWidthInBlocks / 2) {
          snake.direction = "left";
        } else {
          snake.direction = "right";
        }

        
        snake.isWallReached = true;
        
      }  
    }

    move(snake, arrayWithAllItems, fieldWidthInBlocks, fieldHeightInBlocks, randomX, randomY) {
   
      if(snake.isKilled === false) {
        let itemHeadX = snake.itemParts[0].x;
        let itemHeadY = snake.itemParts[0].y;
        let currentLength = snake.itemParts.length;
  
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
  
      if (snake.isEating === false) {
        snake.itemParts.pop();
      }
  
      if (snake.itemParts.length > currentLength) {
        snake.isEating = false;
        currentLength++;
      }
  
      //-----------------checking of eating apple
      for (let i = 0; i < arrayWithAllItems.length; i++) {
        for (let k = 0; k < snake.itemParts.length; k++) {
          if (
            itemHeadX === arrayWithAllItems[i].itemParts[0].x &&
            itemHeadY === arrayWithAllItems[i].itemParts[0].y
          ) {
            if (arrayWithAllItems[i].type === "target") {
              snake.isEating = true;
           
              this.setRandomCoordinates(arrayWithAllItems[i].itemParts[0], randomX, randomY);
            }
          }
          //-----------------------------here is checking apple's coords with snake and snake and another snake
          else if (
            snake.itemParts[k].x === arrayWithAllItems[i].itemParts[0].x &&
            snake.itemParts[k].y === arrayWithAllItems[i].itemParts[0].y
          ) {
            if (arrayWithAllItems[i].type !== "target" && arrayWithAllItems[i].itemParts.length > 1) {
              //GAME.IS_GAME_OVER = true
              arrayWithAllItems[i].isAnotherPlayerReached = true;
  
              //snake.itemParts.pop()
              
              arrayWithAllItems[i].itemParts.pop();
           
            } else {
            
              arrayWithAllItems[i].itemParts.forEach((part) => {
                this.setRandomCoordinates(part, randomX, randomY);
              });
            }
          }
        }
      }
  
      //here we are checking field borders
     this.touchWallsWithCasualties(snake, fieldWidthInBlocks, fieldHeightInBlocks)
      }
    }

    informClientsWhenChanges(snake, callback) {
      if(snake.isEating === true || snake.isAnotherPlayerReached === true || 
        snake.isWallReached === true || snake.isReadyToAvoidObstacle === true ||
        snake.isReadyToChangeDirection === true || snake.isReadyToAvoidWall === true) {
          callback()          
        }
      // if(snake.isEating === true) {
      //   callback()
      //  // console.log('eating');
      // }
      // if(snake.isAnotherPlayerReached === true) {
      //   callback()
      //  // console.log('another player');
      // }
      // if(snake.isWallReached === true) {
      //   callback()
      //   console.log('casualty wall');
      // }
      // if(snake.isReadyToAvoidObstacle === true) {
      //   callback()
      //  // console.log('obstacle');
      // }
      // if(snake.isReadyToChangeDirection === true) {
      //   callback()
      //  // console.log('changeD');
      // }
      // if(snake.isReadyToAvoidWall === true) {
      //   callback()
      //  // console.log('avoid wall');
      // }
    }
  }

module.exports = Game
