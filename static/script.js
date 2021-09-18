const GAME_WIDTH = 800; // ширина поля в пикселях
const GAME_HEIGHT = 600; // высота поля в пикселях

const BLOCK_SIZE = 20; // размер одной клетки поля в пикселях

const GAME_HEIGHT_IN_BLOCKS = GAME_HEIGHT / BLOCK_SIZE - 1; // ширина поля в клетках
const GAME_WIDTH_IN_BLOCKS = GAME_WIDTH / BLOCK_SIZE - 1; // высота поля в клетках

const TIME_INTERVAL = 100; // интервал времени перерисовки игрового экрана в милисекундах
const COLOR_SNAKE = "#000000";

const MODAL = document.querySelector('.modal')
const INPUT = document.querySelector('.input-field')
const MODAL_BUTTON = document.querySelector('.modal-button')

import Helpers from './components/helpers.js';
const HELPERS = new Helpers();

const socket = io()
let mainHero 
//---------------------modal actions----------------
function preventDefaultInput(event) {
  if(event.keyCode === 13) {
    event.preventDefault() 
   }
}

function checkName(event) {
  if(INPUT.value !== '' && (event.type === 'click' ||  (event.type === 'keyup' && event.keyCode === 13))) {
    socket.emit('check-name-match', INPUT.value)    
    INPUT.blur()
  } 
}

INPUT.addEventListener('keypress', preventDefaultInput)
MODAL_BUTTON.addEventListener('click', checkName)
document.addEventListener('keyup', checkName)


socket.on('change-name', () => {
  alert('change your name buddy')
})
 
socket.on('name-confirmed', () => {
  MODAL.classList.add('modal-hidden')
  INPUT.removeEventListener('keypress', preventDefaultInput)
  MODAL_BUTTON.removeEventListener('click', checkName)
  document.removeEventListener('keyup', checkName)
  HELPERS.READY_TO_PLAY = true    
})
//----------------------------------playing process----------

if(HELPERS.READY_TO_PLAY = true) {
 

  socket.on('initial-players', (data) => { 
   
    mainHero = data.find((el) => el.uniqueId === socket.id)     
    if(HELPERS.INITIAL_PLAYERS.length === 0) {      
      HELPERS.ALL_PLAYERS = [...data]
      HELPERS.INITIAL_PLAYERS = [...data]
      HELPERS.INITIAL_PLAYERS.forEach(player =>  HELPERS.addInfoOnBoard(player))     
      socket.emit('player-client', mainHero)
    } 
  })

  socket.on('new-player', data => {
    HELPERS.ALL_PLAYERS.push(data)
    HELPERS.addInfoOnBoard(data) 
  }) 

  socket.on('player-disconnected', data => {
    HELPERS.removeInfoFromBoard(data)
  })
    
  socket.on('fresh-positions', data => {
    HELPERS.clearField();   
    HELPERS.ALL_PLAYERS_SCORES = document.querySelectorAll('.player-scores')
    HELPERS.ALL_PLAYERS = data
    mainHero = data.find((el) => el.uniqueId === socket.id) 

     
    data.forEach(item => {
     HELPERS.ALL_PLAYERS_SCORES.forEach(el => {
       if(el.getAttribute('id') === item.uniqueId) {
         el.innerText = `SCORES: ${item.scores};`
       }
     })
 
     HELPERS.ALL_PLAYERS.forEach(player => {
      switch(item.type) {
        case 'player': 
          if(item.uniqueId === player.uniqueId) {
            player.itemParts = item.itemParts
          
          }
          item.itemParts.forEach(part => {        
            HELPERS.drawSnakeSegment(part.x, part.y, item.color);   
          })
             HELPERS.drawHead(item.itemParts[0].x,  item.itemParts[0].y, item.headColor);
          break;
  
        case 'target':
          HELPERS.drawApple(item.itemParts[0].x,  item.itemParts[0].y)
          break;
          
        case 'bot':
          item.itemParts.forEach(part => {        
            HELPERS.drawSnakeSegment(part.x, part.y, COLOR_SNAKE);   
          })
             HELPERS.drawHead( item.itemParts[0].x,  item.itemParts[0].y, item.headColor);
          break;
      }
     })
       
     
    })    
    
    if(mainHero === undefined && HELPERS.INITIAL_PLAYERS.length > 0) { 
      mainHero = HELPERS.INITIAL_PLAYERS.find((el) => el.uniqueId === socket.id)
      socket.emit('removed-player', mainHero)
      HELPERS.READY_TO_PLAY = false
        //alert('sorry bro')     
        location.reload() 
    }
  })    
 
  document.addEventListener('keyup', (e) => {
  
   HELPERS.setDirection(mainHero, e.keyCode, GAME_WIDTH_IN_BLOCKS, GAME_HEIGHT_IN_BLOCKS)
   socket.emit('change-direction', mainHero.direction)
  })

 socket.on('delete-looser-info', data => {
   HELPERS.removeInfoFromBoard(data)
 })
}   

   
     


 


  
  
 
 
