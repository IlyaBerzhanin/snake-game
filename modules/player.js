

 class Player {
    constructor(options) {
      this.uniqueId = options.uniqueId

      this.direction = 'right'
      this.isKilled = false;
      this.type = options.type;
      this.headColor = options.headColor;
      this.x = options.x;
      this.y = options.y;
  
      this.length = options.length;
  
      this.up = options.up;
      this.down = options.down;
      this.left = options.left;
      this.right = options.right;  
   
      this.itemParts = [];


      this.isEating = false;
      this.isAnotherPlayerReached = false;
      this.isWallReached = false;
      this.playerOrderNumber = options.playerOrderNumber;
      this.isEatenByItself = false

      this.isReadyToDissappear = false
      

     this.color = options.color
   
      this.eatingStep = 10; 
      this.wallTouchingStep = -5;
      this.anotherPlayerTouchingStep = -10;
      this.scores = 0; 
  
      // this.scoreBoard = document.createElement("span");
      // this.scoreBoard.innerText = `Player ${this.playerOrderNumber}: ${this.scores}.`;  
    }

    gatherItemFromParts() {
      for (let i = 0; i < this.length; i++) {
        let obj = {
          color: this.color,
          uniqueId: this.uniqueId,
          type: this.type,
          x: this.x - i,
          y: this.y,
          playerOrderNumber: this.playerOrderNumber,
        };
        this.itemParts[i] = obj;        
      }      
    }
  
    countScores() {
      if (this.isEating === true) {
        this.scores += this.eatingStep;
      } else if (this.isWallReached === true) {
        this.scores += this.wallTouchingStep;
        this.isWallReached = false;
      } else if (this.isAnotherPlayerReached === true) {
        this.scores += this.anotherPlayerTouchingStep;
        this.isAnotherPlayerReached = false;
      }
  
     // this.scoreBoard.innerText = `Player ${this.playerOrderNumber}: ${this.scores}.`;      
    }
  
    setDirection(key, fieldWidthInBlocks, fieldHeightInBlocks) {
      let headX = this.itemParts[0].x;
      let headY = this.itemParts[0].y;
      switch (key) {
        case this.up:
          if (headY > 0 && this.direction !== "down") {
            this.direction = "up";
          }
          break;
  
        case this.down:
          if (headY < fieldHeightInBlocks && this.direction !== "up") {
            this.direction = "down";
          }
          break;
  
        case this.left:
          if (headX > 0 && this.direction !== "right") {
            this.direction = "left";
          }
          break;
  
        case this.right:
          if (headX < fieldWidthInBlocks && this.direction !== "left") {
            this.direction = "right";
          }
          break;
      }
    }

    touchWallsWithCasualties(fieldWidthInBlocks, fieldHeightInBlocks) {
      let itemHeadX = this.itemParts[0].x;
      let itemHeadY = this.itemParts[0].y;

      if (
        (itemHeadX > fieldWidthInBlocks && this.direction === "right") ||
        (itemHeadX < 0 && this.direction === "left")
      ) {
        this.isWallReached = true;
        this.itemParts.shift();
        //GAME.IS_GAME_OVER = true;
        if (itemHeadY > fieldHeightInBlocks / 2) {
          this.direction = "up";
        } else {
          this.direction = "down";
        }
      } else if (
        (itemHeadY > fieldHeightInBlocks && this.direction === "down") ||
        (itemHeadY < 0 && this.direction === "up")
      ) {
        this.isWallReached = true;
        this.itemParts.shift();
        //GAME.IS_GAME_OVER = true;
        if (itemHeadX > fieldWidthInBlocks / 2) {
          this.direction = "left";
        } else {
          this.direction = "right";
        }
      }  
    }
  
    moveAndEat(arrayWithAllItems, fieldWidthInBlocks, fieldHeightInBlocks, randomX, randomY) {
      if(this.isKilled === false) {
        let itemHeadX = this.itemParts[0].x;
        let itemHeadY = this.itemParts[0].y;
        let currentLength = this.length;
  
      switch (this.direction) {
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
        color: this.color,
        uniqueId: this.uniqueId,
        type: this.type,
        x: itemHeadX,
        y: itemHeadY,
        playerOrderNumber: this.playerOrderNumber,
      };
  
      this.itemParts.unshift(newHead);
  
      if (this.isEating === false) {
        this.itemParts.pop();
      }
  
      if (this.itemParts.length > currentLength) {
        this.isEating = false;
        currentLength++;
      }
  
      //-----------------checking of eating apple
      for (let i = 0; i < arrayWithAllItems.length; i++) {
        for (let k = 0; k < this.itemParts.length; k++) {
          if (
            itemHeadX === arrayWithAllItems[i].itemParts[0].x &&
            itemHeadY === arrayWithAllItems[i].itemParts[0].y
          ) {
            if (arrayWithAllItems[i].type === "target") {
              this.isEating = true;
  
              this.setRandomCoordinates(arrayWithAllItems[i].itemParts[0], randomX, randomY);
            }
          }
          //-----------------------------here is checking apple's coords with snake and snake and another snake
          else if (
            this.itemParts[k].x === arrayWithAllItems[i].itemParts[0].x &&
            this.itemParts[k].y === arrayWithAllItems[i].itemParts[0].y
          ) {
            if (arrayWithAllItems[i].type !== "target" && arrayWithAllItems[i].itemParts.length > 1) {
              //GAME.IS_GAME_OVER = true
              arrayWithAllItems[i].isAnotherPlayerReached = true;
  
              //this.itemParts.pop()
              
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
      this.touchWallsWithCasualties(fieldWidthInBlocks, fieldHeightInBlocks)
      }
    }
    
    dissappear(arrayWithArraysFromWhichToRemove) {
      if (this.itemParts.length === 1 || this.isEatenByItself === true || this.isReadyToDissappear === true) {
        arrayWithArraysFromWhichToRemove.forEach( array => {
          array.splice(array.indexOf(this), 1)
        }) 
        this.isKilled = true;     
      }     
    }

    eatItself() {

      for (let i = 1; i < this.itemParts.length; i++) {
        if (
          this.itemParts[0].x === this.itemParts[i].x &&
          this.itemParts[0].y === this.itemParts[i].y
        ) {
          if (this.type === "player") {
          this.isEatenByItself = true
          } else {
            this.isAnotherPlayerReached = true;
            this.itemParts.pop()      
          }
        }
      }
    }
  }


module.exports = Player    