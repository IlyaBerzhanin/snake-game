const GameItem = require('./gameitem')



 class Target extends GameItem {
    constructor(options) {
      super(options);
      this.x = options.x
      this.y = options.y
    }
  }

  exports.Target = Target