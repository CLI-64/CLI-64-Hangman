'use strict';

const io = require('socket.io-client');
const host = 'http://localhost:3333';
const socket = io.connect(host);
// const gameDisplay = require('./gameDisplay.js')
let currentWord;
let currentPlayer;
let correct = false;
let guesses = ['A', 'E', 'I', 'O', 'U']
let wrongGuesses = ['X', 'Y', 'Z']

const words = [
  `Potato`,
  // `Water Bottle`,
  // `Mask`
]
let blankWord = '';
let bodyPart = 1;
let rotation = []
const Player = require('./newplayer.js')
const players = {
  // this is where players are listed
}



socket.on('joined', payload => {
  // creates a new player
  players[payload] = new Player(payload)
})

socket.on('connect', payload => {
  socket.emit('play', 'Hangman Cartridge plugged in!')
  console.log('Hangman Cartridge plugged in!')
})

// Guessing a letter
socket.on('play', payload => {
  if (payload.playerName === currentPlayer) {
    // If the player inputs a single letter
    if (payload.text) {
      if (payload.text.split('\n')[0].length === 1) {
        guessedLetter(payload.text.split('\n')[0])
      }
    }
  }
})

socket.on('runGame', payload => {
  // start game with random sentence
  currentWord = words[Math.floor(Math.random() * words.length)]
  startGame(currentWord);
})

// new player joins game
function startGame() {
  resetGame()
  Object.keys(players).forEach((value) => {
    rotation.push(players[value].name)
  })
  currentPlayer = rotation.shift()
  // socket.emit('play', `It is ${currentPlayer}'s turn!`)
  setBlankWord(currentWord)
  renderBodyParts(guesses, wrongGuesses, blankWord)
}

function randomNumber(array) {
  return Math.floor(Math.random() * array.length);
}

function setBlankWord(word) {
  for (var i = 0; i < word.length; i++) {
    if (word[i] === ' ') {
      blankWord += ' ';
    } else {
      blankWord += '_';
    }
  }
}

function resetGame() {
  blankWord = '';
  currentWord = words[randomNumber(words)];
  bodyPart = 1;
  guesses = []
  wrongGuesses = []
}

// currentWord = hello world
// guessed 'W'
function guessedLetter(guess) {
  // Add player back to Queue
  rotation.push(currentPlayer)
  // Change player that is able to insert input
  currentPlayer = rotation.shift()
  console.log('NEW CURRENT PLAUYER', currentPlayer)
  console.log(`new current player ${currentPlayer}`)
  for (var i = 0; i < currentWord.length; i++) {
    if (guess === currentWord.charAt(i)) {
      blankWord = blankWord.split(''); // potato = [p, o, t, a, t , o].includes('o')
      blankWord[i] = guess;
      blankWord = blankWord.join('');
      // Ensures that 'o' will only be added to guesses ONCE
      if (!guesses.includes(guess)) {
        guesses.push(guess)
      }
    }
  }
  if (!currentWord.split('').includes(guess)) {
    bodyPart++;
    if (!wrongGuesses.includes(guess)) {
      wrongGuesses.push(guess)
    }
  }
  renderBodyParts(guesses, wrongGuesses, blankWord);
}

function renderBodyParts(guesses, wrongGuesses, blankWord) {
  console.log(bodyPart)
  if (bodyPart === 1) {
    console.log('renderBodyParts function HIT!!!!!!')
    socket.emit('clear', 'x')
    socket.emit('play', `  /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', ` /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', ` \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `  \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `        \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', ` ______________`)
    socket.emit('play', ` |           |                  GUESSES: ${guesses} `)
    socket.emit('play', ` |            `)
    socket.emit('play', ` |                             WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', ` |           `)
    socket.emit('play', `_|________`)
    socket.emit('play', `|           |______`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `                              ${blankWord} \n \n \n`)
  } else if (bodyPart === 2) {
    socket.emit('clear', 'x')
    socket.emit('play', `  /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', ` /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', ` \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `  \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `        \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', ` ______________`)
    socket.emit('play', ` |           |                  GUESSES: ${guesses} `)
    socket.emit('play', ` |           O `)
    socket.emit('play', ` |                             WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', ` |           `)
    socket.emit('play', `_|________`)
    socket.emit('play', `|           |______`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `                              ${blankWord} \n \n \n`)
  } else if (bodyPart === 3) {
    socket.emit('clear', 'x')
    socket.emit('play', `  /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', ` /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', ` \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `  \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `        \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', ` ______________`)
    socket.emit('play', ` |           |                  GUESSES: ${guesses} `)
    socket.emit('play', ` |           O `)
    socket.emit('play', ` |           |                 WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', ` |           `)
    socket.emit('play', `_|________`)
    socket.emit('play', `|           |______`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `                              ${blankWord} \n \n \n`)
  } else if (bodyPart === 4) {
    socket.emit('clear', 'x')
    socket.emit('play', `  /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', ` /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', ` \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `  \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `        \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', ` ______________`)
    socket.emit('play', ` |           |                  GUESSES: ${guesses} `)
    socket.emit('play', ` |           O `)
    socket.emit('play', ` |          /|                 WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', ` |           `)
    socket.emit('play', `_|________`)
    socket.emit('play', `|           |______`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `                              ${blankWord} \n \n \n`)
  } else if (bodyPart === 5) {
    socket.emit('clear', 'x')
    socket.emit('play', `  /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', ` /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', ` \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `  \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `        \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', ` ______________`)
    socket.emit('play', ` |           |                  GUESSES: ${guesses} `)
    socket.emit('play', ` |           O `)
    socket.emit('play', ` |          /|\\               WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', ` |             `)
    socket.emit('play', `_|________`)
    socket.emit('play', `|           |______`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `                              ${blankWord} \n \n \n`)
  } else if (bodyPart === 6) {
    socket.emit('clear', 'x')
    socket.emit('play', `  /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', ` /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', ` \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `  \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `        \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', ` ______________`)
    socket.emit('play', ` |           |                  GUESSES: ${guesses} `)
    socket.emit('play', ` |           O `)
    socket.emit('play', ` |          /|\\               WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', ` |          / `)
    socket.emit('play', `_|________`)
    socket.emit('play', `|           |______`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `                              ${blankWord} \n \n \n`)
  } else if (bodyPart === 7) {
    socket.emit('clear', 'x')
    socket.emit('play', `  /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', ` /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', ` \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `  \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', ` ______________`)
    socket.emit('play', ` |           |                  GUESSES: ${guesses} `)
    socket.emit('play', ` |           O `)
    socket.emit('play', ` |          /|\\               WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', ` |          / \\`)
    socket.emit('play', `_|________`)
    socket.emit('play', `|           |______`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `                              ${blankWord} \n \n \n`)
    setTimeout(() => {
      socket.emit('play', `_____.___.________   ____ ___  .____    ________    ___________________._.`)
      socket.emit('play', `\\__  |   |\\_____  \\ |    |   \\ |    |   \\_____  \\  /   _____|_   _____/| |`)
      socket.emit('play', ` /   |   | /   |   \|    |   / |    |    /   |   \\ \\_____  \\ |    __)_ | |`)
      socket.emit('play', ` \\____   |/    |    \\    |  / |    |___/  |    \\/        \]|        \\ \\|`)
      socket.emit('play', ` / ______|\\_________/______/   |_______ \_________/_______  /_______  / __`)
      socket.emit('play', `\\/                                     \\/                \\/       \\/  \\/`)
    }, 5000)
  }
}