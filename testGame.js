let game = require('./gameDisplay.js')

Object.keys(game).forEach(value => {
  game[value]()
})