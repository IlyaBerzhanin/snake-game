const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const PORT = process.env.PORT || 5000;

////-------game data------------------------
const TIME_INTERVAL = 150; 

//---------------modules---------------------
const Game = require("./modules/game");
const Player = require("./modules/player");
const Bot = require("./modules/bot");
const GAME = new Game({});
initGame()

//--------------------------------------------

//---------server connection---------------------
app.set("port", PORT);
app.use("/static", express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(PORT, () => {
  console.log(`I am launching the server on port: ${PORT}...`);
});

io.on("connection", (socket) => {
 
  console.log("new user is here", socket.id);
  

  socket.on('check-name-match', (data) => {
    
  let matchPlayer = GAME.PLAYERS.find((player) => {
      return player.name === data
    })
    if(matchPlayer !== undefined) {
      socket.emit('change-name')
    }
    else {
      const FIRST_PLAYER = new Player({
        uniqueId: socket.id,
        type: "player",
        playerOrderNumber: 1,
        headColor: "black",
        color: "red",
        x: 20,
        y: 15,  
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        length: 6,
      });
      FIRST_PLAYER.name = data
      socket.emit('name-confirmed')
      GAME.PLAYERS.push(FIRST_PLAYER); 
      GAME.ALL_SNAKES_ONLY.push(FIRST_PLAYER);
      GAME.ALL_PLAY_ITEMS.push(FIRST_PLAYER);

      FIRST_PLAYER.gatherItemFromParts()
      FIRST_PLAYER.color = `${GAME.COLORS[Math.floor(Math.random() * GAME.COLORS.length)]}`;

      io.sockets.emit("initial-players", GAME.ALL_PLAY_ITEMS);          
    }
    
  })   

  socket.on('player-client', data => {
      socket.broadcast.emit('new-player', data)
      GAME.startGame(gameLoop)
  })  

  socket.on("change-direction", (data) => {
    let playerToChangeDirection = GAME.PLAYERS.find(
      (el) => el.uniqueId === socket.id
    );
    if(playerToChangeDirection !== undefined) {
      playerToChangeDirection.direction = data;
    }
    io.sockets.emit("fresh-positions", GAME.ALL_PLAY_ITEMS);
   // socket.broadcast.emit('fresh-positions', GAME.ALL_PLAY_ITEMS)
  });

  socket.on('removed-player', data => {
    socket.broadcast.emit('delete-looser-info', data)
  })

  socket.on("disconnect", () => {
    let discoPlayer = GAME.PLAYERS.find((el) => el.uniqueId === socket.id)
    if(discoPlayer !== undefined) {
    discoPlayer.isEatenByItself = true
    discoPlayer.dissappear([GAME.ALL_PLAY_ITEMS, GAME.PLAYERS, GAME.ALL_SNAKES_ONLY])
    }

    socket.broadcast.emit('player-disconnected', discoPlayer)
    GAME.finishGame() 
  });
});


 
////-------------------------functions-------------------------
function createBots() {
  for(let i = 0; i < GAME.numberOfBots; i++) {
    const BOT = new Bot({
      type: `bot`,
      headColor: `${GAME.COLORS[Math.floor(Math.random() * GAME.COLORS.length)]}`,
      length: 5,
      playerOrderNumber: `bot ${i + 1}`,    
      x: GAME.getRandomX(),
      y: GAME.getRandomY(),
    });
    GAME.BOTS.push(BOT);
    GAME.ALL_PLAY_ITEMS.push(BOT);    
    GAME.ALL_SNAKES_ONLY.push(BOT); 
  }  
}

function initGame() {
  GAME.addColors();

  GAME.createTargets(GAME.numberOfTargets, () => {
    const APPLE = new Player({
      type: "target",
      length: 1,
      x: GAME.getRandomX(),
      y: GAME.getRandomY(),
    });
    GAME.TARGETS.push(APPLE);
    GAME.ALL_PLAY_ITEMS.push(APPLE);
  });
 
  createBots()

  GAME.ALL_PLAY_ITEMS.forEach((item) => {
    item.gatherItemFromParts();
  });

  //gameLoop()
}

function gameLoop() {
 

  GAME.ALL_SNAKES_ONLY.forEach(snake => {
    snake.eatItself();
    snake.dissappear([GAME.ALL_PLAY_ITEMS, GAME.PLAYERS, GAME.ALL_SNAKES_ONLY]); 
    GAME.move(snake, GAME.ALL_PLAY_ITEMS, GAME.GAME_WIDTH_IN_BLOCKS,
        GAME.GAME_HEIGHT_IN_BLOCKS, GAME.getRandomX(), GAME.getRandomY()
   );
    snake.countScores();     
  })

  GAME.BOTS.forEach((bot) => {     

    bot.sortedTargets = GAME.getArrayofElementsSortedByRange(bot ,bot.itemParts[0].x,
      bot.itemParts[0].y, GAME.TARGETS)

    bot.sortedSnakes = GAME.getArrayofElementsSortedByRange(bot ,bot.itemParts[0].x,
      bot.itemParts[0].y, GAME.ALL_SNAKES_ONLY)

  
    bot.avoidWallsAndPlayers(GAME.GAME_WIDTH_IN_BLOCKS, GAME.GAME_HEIGHT_IN_BLOCKS, bot.sortedTargets, bot.sortedSnakes) 

     //console.log(JSON.parse(JSON.stringify(bot.sortedTargets)));
     //console.log(JSON.parse(JSON.stringify(bot.sortedSnakes)));

       
  });

  GAME.rebornBots(createBots)
  
  
  io.sockets.emit("fresh-positions", GAME.ALL_PLAY_ITEMS);
    if(GAME.IS_GAME_OVER === false) {
      setTimeout(gameLoop, TIME_INTERVAL);
    } 
}
 

    