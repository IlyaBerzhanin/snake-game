 const Player = require('./player')

  class Bot extends Player {
  constructor(options) {
    super(options);
    this.probability = 0.15;
    this.directions = ["left", "right", "up", "down"];
    this.isLackOfDistance = false;
    this.isReadyToChangeDirection = false
    this.isReadyToAvoidObstacle = false
    this.isReadyToAvoidWall = false
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

  getNewDirectionToApproachApple(sortedArrayOfTargets) {
   
    let itemHeadX = this.itemParts[0].x;
    let itemHeadY = this.itemParts[0].y;
    let nearestTarget = sortedArrayOfTargets[0];
    let newDirection;

    if (this.direction === "left" || this.direction === "right") {
      if (nearestTarget.y < itemHeadY) {
        newDirection = "up";
      } else if (nearestTarget.y > itemHeadY) {
        newDirection = "down";
      } else if (nearestTarget.y === itemHeadY) {
        newDirection = this.direction;
      }
    } else if (this.direction === "up" || this.direction === "down") {
      if (nearestTarget.x < itemHeadX) {
        newDirection = "left";
      } else if (nearestTarget.x > itemHeadX) {
        newDirection = "right";
      } else if (nearestTarget.x === itemHeadX) {
        newDirection = this.direction;
      }
    }
    return newDirection;
    
  }  

  changeDirectionWhileMoving(sortedArrayOfTargets) {
    if (Math.random() < this.probability && this.isLackOfDistance === false) {
      this.direction = this.getNewDirectionToApproachApple(sortedArrayOfTargets);
      this.isReadyToChangeDirection = true
    }
    else{this.isReadyToChangeDirection = false}
  }

  avoidWallsAndPlayers(fieldWidthInBlocks, fieldHeightInBlocks, sortedArrayOfTargets, sortedArrayOfAllSnakes) {
    let headX = this.itemParts[0].x;
    let headY = this.itemParts[0].y;      
   
    let closestPart = sortedArrayOfAllSnakes[0];
    let closestRange = closestPart.rangeFromCenters;    
    let partX = closestPart.x;
    let partY = closestPart.y;
    let newDeltaX = partX - headX;
    let newDeltaY = partY - headY;
    

       //------------------------checking the walls------------------
    if (
      (headX > fieldWidthInBlocks - 1 && this.direction === "right") ||
      (headX < 1 && this.direction === "left") ||
      (headY > fieldHeightInBlocks - 1 && this.direction === "down") ||
      (headY < 1 && this.direction === "up")
    ) {
      this.isLackOfDistance = true;
      this.direction = this.getNewDirectionToApproachApple(sortedArrayOfTargets);
      this.isReadyToAvoidWall = true
    } 

    //---------checking the distance-----------

   else if (closestRange < 7 ) {
      this.isLackOfDistance = true;      

      if (closestRange < 6) {

        this.isReadyToAvoidObstacle = true
      
        if (this.direction === "up" && newDeltaY <= 0) {
          if (headX === 0 && newDeltaX === 0) {
            this.direction = "right";
          } else if (headX === fieldWidthInBlocks && newDeltaX === 0) {
            this.direction = "left";
          } else if (headX > 0 && headX < fieldWidthInBlocks) {
            if (newDeltaX >= 0) {
              this.direction = "left";
            } else if (newDeltaX < 0) {
              this.direction = "right";
            }
          }
       
        } else if (this.direction === "down" && newDeltaY >= 0) {
          if (headX === 0 && newDeltaX === 0) {
            this.direction = "right";
          } else if (headX === fieldWidthInBlocks && newDeltaX === 0) {
            this.direction = "left";
          } else if (headX > 0 && headX < fieldWidthInBlocks) {
            if (newDeltaX > 0) {
              this.direction = "left";
            } else if (newDeltaX <= 0) {
              this.direction = "right";
            }
          }

      
        } else if (this.direction === "left" && newDeltaX <= 0) {
          if (headY === 0 && newDeltaY === 0) {
            this.direction = "down";
          } else if (headY === fieldHeightInBlocks && newDeltaY === 0) {
            this.direction = "up";
          } else if (headY > 0 && headY < fieldHeightInBlocks) {
            if (newDeltaY <= 0) {
              this.direction = "down";
            } else if (newDeltaY > 0) {
              this.direction = "up";
            }
          }
    
        } else if (this.direction === "right" && newDeltaX >= 0) {
          if (headY === 0 && newDeltaY === 0) {
            this.direction = "down";
          } else if (headY === fieldHeightInBlocks && newDeltaY === 0) {
            this.direction = "up";
          } else if (headY > 0 && headY < fieldHeightInBlocks) {
            if (newDeltaY < 0) {
              this.direction = "down";
            } else if (newDeltaY >= 0) {
              this.direction = "up";
            }
          }

        }       
      }
    }
 
    else if(closestRange > 7) {
      this.isReadyToAvoidObstacle = false
      this.isLackOfDistance = false;
      this.changeDirectionWhileMoving(sortedArrayOfTargets)
    }   
    else {this.isReadyToAvoidWall = false}
  } 
}

module.exports = Bot

