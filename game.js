'use strict';

const io = require('socket.io-client');
const host = 'http://localhost:3333';
const words = require('./words.js')
const socket = io.connect(host);
// const gameDisplay = require('./gameDisplay.js')
let currentWord;
let currentPlayer;
let guesses = []
let wrongGuesses = []
let blankWord = '';
let bodyPart = 1;
let rotation = []
const Player = require('./newplayer.js')
const players = {
  // this is where players are listed
}

socket.on('newPlayer', payload => {
  // creates a new player
  players[payload] = new Player(payload)
})


socket.on('connect', payload => {
  socket.emit('play', 'Hangman Cartridge plugged in! Type \'start\' when you are ready to play!')
  socket.emit('insert cartridge')
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
  if (payload.text) {
    if (payload.text.split('\n')[0] === 'play again') {
      currentWord = words[Math.floor(Math.random() * words.length)]
      startGame(currentWord);
    }
  }
})

socket.on('runGame', payload => {
  // Starts game with a random word/phrase
  currentWord = words[Math.floor(Math.random() * words.length)]
  startGame(currentWord);
})

// Resets game
// Starts turn based queue
// Renders Empty Picture
function startGame() {
  resetGame()
  Object.keys(players).forEach((value) => {
    rotation.push(players[value].name)
  })
  currentPlayer = rotation.shift()
  setBlankWord(currentWord)
  renderBodyParts(guesses, wrongGuesses, blankWord)
  socket.emit('play', `It is ${currentPlayer}'s turn!`)
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
  if (!blankWord.split('').includes('_')) {
    winScreen(currentWord)
  } else {
    renderBodyParts(guesses, wrongGuesses, blankWord, currentWord);
    socket.emit('play', `It is ${currentPlayer}'s turn!`)
  }
}


function winScreen(word) {
  socket.emit('clear', 'x')
  socket.emit('play', `_____.___.________   ____ ___   __      __.___ _______ ._.`)
  socket.emit('play', `\\__  |   |\\       \\ |    |   \\ /  \\    /  \\   |\\      \\| |`)
  socket.emit('play', ` /   |   | /       \\|    |   / \\   \\/\\/   /   |/   |   \\ |`)
  socket.emit('play', ` \\____   |/   X     \\    |  /   \\        /|   /    |    \\|`)
  socket.emit('play', ` / ______|\\_________/______/     \\__/\\  / |___\\____|__  /_`)
  socket.emit('play', ` \\/                                    \\/              \\/`)
  socket.emit('play', `                       The word was: '${word}'`)
  setTimeout(() => {
    socket.emit('clear', 'x')
    socket.emit('play', `__________.__                   _____                .__     _________ `)
    socket.emit('play', `\\______   \\  |_____  ___.__.   /  _  \\    _________  |__| ___\\_____   \\`)
    socket.emit('play', `|     ___/  | \\__  \\<   |  |  /  /_\\  \\  / ___\\__  \\ |  |/    \\ /   __/`)
    socket.emit('play', `|    |   |  |__/ __ \\___   | /    |    \\/ /_/  > __ \\|  |   |  \\   |   `)
    socket.emit('play', `|____|   |____(____  / ____| \\____|__  /\\___  (____  /__|___|  /___|   `)
    socket.emit('play', `                   \\/\\/              \\//_____/     \\/        \\/<___> `)
    socket.emit('play', `                      (Want to play again? Type 'play again')                 `)
  }, 3000)
}

function renderBodyParts(guesses, wrongGuesses, blankWord, word) {
  if (bodyPart === 1) {
    socket.emit('clear', 'x')
    socket.emit('play', `   ___ ___    _____    _______    ________    _____      _____    _______ `)
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
    socket.emit('play', `                              ${blankWord}`)
  } else if (bodyPart === 2) {
    socket.emit('clear', 'x')
    socket.emit('play', `   ___ ___    _____    _______    ________    _____      _____    _______ `)
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
    socket.emit('play', `                              ${blankWord}`)
  } else if (bodyPart === 3) {
    socket.emit('clear', 'x')
    socket.emit('play', `   ___ ___    _____    _______    ________    _____      _____    _______ `)
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
    socket.emit('play', `                              ${blankWord}`)
  } else if (bodyPart === 4) {
    socket.emit('clear', 'x')
    socket.emit('play', `   ___ ___    _____    _______    ________    _____      _____    _______ `)
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
    socket.emit('play', `                              ${blankWord}`)
  } else if (bodyPart === 5) {
    socket.emit('clear', 'x')
    socket.emit('play', `   ___ ___    _____    _______    ________    _____      _____    _______ `)
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
    socket.emit('play', `                              ${blankWord}`)
  } else if (bodyPart === 6) {
    socket.emit('clear', 'x')
    socket.emit('play', `   ___ ___    _____    _______    ________    _____      _____    _______ `)
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
    socket.emit('play', `                              ${blankWord}`)
  } else if (bodyPart === 7) {
    socket.emit('clear', 'x')
    socket.emit('play', `_____.___.________   ____ ___  .____    ________    ___________________._.`)
    socket.emit('play', `\\__  |   |\\_____  \\ |    |   \\ |    |   \\       \\  /   _____|_   _____/| |`)
    socket.emit('play', ` /   |   | /   |   \\|    |   / |    |    /       \\ \\_____  \\ |    __)_ | |`)
    socket.emit('play', ` \\____   |/    |    \\\    |  /  |    |___/    X    \\/        \]|        \\ \\|`)
    socket.emit('play', ` / ______|\\_________/______/   |_______ \__________/_______  /_______  / __`)
    socket.emit('play', ` \\/                                    \\/                 \\/        \\/\\/`)
    socket.emit('play', ` ______________`)
    socket.emit('play', ` |           |                  GUESSES: ${guesses} `)
    socket.emit('play', ` |           O `)
    socket.emit('play', ` |          /|\\               WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', ` |          / \\`)
    socket.emit('play', `_|________`)
    socket.emit('play', `|           |______`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `|                   |`)
    socket.emit('play', `                       The word was: '${word}'`)
    setTimeout(() => {
      socket.emit('clear', 'x')
      socket.emit('play', `__________.__                   _____                .__     _________ `)
      socket.emit('play', `\\______   \\  |_____  ___.__.   /  _  \\    _________  |__| ___\\_____   \\`)
      socket.emit('play', `|     ___/  | \\__  \\<   |  |  /  /_\\  \\  / ___\\__  \\ |  |/    \\ /   __/`)
      socket.emit('play', `|    |   |  |__/ __ \\___   | /    |    \\/ /_/  > __ \\|  |   |  \\   |   `)
      socket.emit('play', `|____|   |____(____  / ____| \\____|__  /\\___  (____  /__|___|  /___|   `)
      socket.emit('play', `                   \\/\\/              \\//_____/     \\/        \\/<___> `)
      socket.emit('play', `                      (Want to play again? Type 'play again')                 `)
    }, 6000)
  }
}