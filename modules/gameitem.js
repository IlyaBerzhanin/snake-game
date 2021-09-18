 class GameItem {
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
  
      this.keys = {
        up: this.up,
        down: this.down,
        left: this.left,
        right: this.right,
      };
  
      this.itemParts = [];
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
  
    eatItself(callback) {

      for (let i = 1; i < this.itemParts.length; i++) {
        if (
          this.itemParts[0].x === this.itemParts[i].x &&
          this.itemParts[0].y === this.itemParts[i].y
        ) {
          if (this.type === "player") {
            callback()
          } else {
            this.isAnotherPlayerReached = true;
            this.itemParts.pop()      
          }
        }
      }
    }
  
    
  }

  exports.GameItem = GameItem