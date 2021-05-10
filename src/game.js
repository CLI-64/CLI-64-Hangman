'use strict';

const Player = require('./newplayer.js')
let Queue = require('./queue.js')
const words = require('./words.js')
const io = require('socket.io-client');
const host = 'http://localhost:3333';
const socket = io.connect(host);

let rotation = new Queue()
let currentWord;
let currentPlayer;
let guesses = []
let wrongGuesses = []
let blankWord = '';
let bodyPart = 1;
const players = {
  // this is where players are listed
}

socket.on('newPlayer', payload => {
  // Creates a new player
  players[payload] = new Player(payload)
})


socket.on('connect', payload => {
  openingScreen()
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
  Object.keys(players).forEach((value) => {
    rotation.enqueue(players[value].name)
  })
  currentWord = words[Math.floor(Math.random() * words.length)]
  startGame(currentWord);
})

// Resets game
// Starts turn based queue
// Renders Empty Picture
function startGame() {
  resetGame()
  if (!currentPlayer) {
    currentPlayer = rotation.dequeue()
  }
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

function guessedLetter(guess) {
  socket.emit('clear', 'x')

  // Correct guess logic
  if (guesses.includes(guess)) {
    socket.emit('play', `                                        ${guess} has already been guessed. Guess Again!`)
  } else {
    for (var i = 0; i < currentWord.length; i++) {
      // Swaps '_' for letter
      if (guess === currentWord.charAt(i)) {
        blankWord = blankWord.split('');
        blankWord[i] = guess;
        blankWord = blankWord.join('');
        // Ensures that a letter will only be added to 'guesses' ONCE
        if (!guesses.includes(guess)) {
          guesses.push(guess)
        }
      }
    }
    if (currentWord.split('').includes(guess)) {
      // If guess is right, change player
      changePlayer()
    }
  }

  // Wrong guess logic
  if (wrongGuesses.includes(guess)) {
    socket.emit('play', `                                        ${guess} has already been guessed. Guess Again!`)
  } else if (!currentWord.split('').includes(guess)) { // If guess is wrong
    bodyPart++;
    changePlayer()
    wrongGuesses.push(guess)
  }

  // Winning logic
  if (!blankWord.split('').includes('_')) {
    winScreen(currentWord)
  } else {
    renderBodyParts(guesses, wrongGuesses, blankWord, currentWord);
    if (bodyPart !== 7) {
      socket.emit('play', `It is ${currentPlayer}'s turn!`)
    }
  }
}

function changePlayer() {
  rotation.enqueue(currentPlayer)
  currentPlayer = rotation.dequeue()
}

function winScreen(word) {

  socket.emit('play', `               _____.___.________   ____ ___   __      __.___ _______ ._.`)
  socket.emit('play', `               \\__  |   |\\       \\ |    |   \\ /  \\    /  \\   |\\      \\| |`)
  socket.emit('play', `                /   |   | /       \\|    |   / \\   \\/\\/   /   |/   |   \\ |`)
  socket.emit('play', `                \\____   |/   X     \\    |  /   \\        /|   /    |    \\|`)
  socket.emit('play', `                / ______|\\_________/______/     \\__/\\  / |___\\____|__  /_`)
  socket.emit('play', `                \\/                                    \\/              \\/`)
  socket.emit('play', `                                      The word was: '${word}'`)
  spacing()
  setTimeout(() => {
    socket.emit('clear', 'x')
    spacing('playagain')
    spacing()
  }, 3000)
}

function openingScreen() {
  socket.emit('play', `                  ___ ___    _____    _______    ________    _____      _____    _______ `)
  socket.emit('play', `                 /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
  socket.emit('play', `                /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
  socket.emit('play', `                \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
  socket.emit('play', `                 \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
  socket.emit('play', `                       \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
  socket.emit('play', `                         __   _                             `)
  socket.emit('play', `                       _(  )_( )_                     __   _ /\\                        __   _   `)
  socket.emit('play', `                      (_   _    _)                  _(  )_( )_ \\                     _(  )_( )_`)
  socket.emit('play', `                        (_) (__)      /\\           (_   _    _) \\                   (_   _    _)      `)
  socket.emit('play', `                                     /  \\            (_) (__)    \\          /\\        (_) (__)   `)
  socket.emit('play', `                                /\\  /    \\    __   _     /        \\        /  \\  /\\           `)
  socket.emit('play', `                               /  \\/      \\ _(  )_( )_  /          \\  /\\  /    \\/  \\`)
  socket.emit('play', `                              /    \\       (_   _    _)/\\           \\/  \\/     /    \\`)
  socket.emit('play', `                             /      \\       \\(_) (__) /  \\           \\   \\           \\`)
  socket.emit('play', `                                     `)
  socket.emit('play', `                                     `)
  socket.emit('play', `                                    ______________`)
  socket.emit('play', `                                    |           |                 `)
  socket.emit('play', `                                    |            `)
  socket.emit('play', `                                    |                             `)
  socket.emit('play', `                                    |           `)
  socket.emit('play', `                                   _|________`)
  socket.emit('play', `                                   |         |______`)
  socket.emit('play', `                                   |                |`)
  socket.emit('play', `                                   |                |`)
  socket.emit('play', `                                     `)
  socket.emit('play', `                                     `)
  socket.emit('play', `                                     `)
}

function renderBodyParts(guesses, wrongGuesses, blankWord, word) {
  if (bodyPart === 1) {
    socket.emit('play', `                  ___ ___    _____    _______    ________    _____      _____    _______ `)
    socket.emit('play', `                 /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', `                /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', `                \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `                 \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `                       \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', `                         __   _                             `)
    socket.emit('play', `                       _(  )_( )_                     __   _ /\\                        __   _   `)
    socket.emit('play', `                      (_   _    _)                  _(  )_( )_ \\                     _(  )_( )_`)
    socket.emit('play', `                        (_) (__)      /\\           (_   _    _) \\                   (_   _    _)      `)
    socket.emit('play', `                                     /  \\            (_) (__)    \\          /\\        (_) (__)   `)
    socket.emit('play', `                                /\\  /    \\    __   _     /        \\        /  \\  /\\           `)
    socket.emit('play', `                               /  \\/      \\ _(  )_( )_  /          \\  /\\  /    \\/  \\`)
    socket.emit('play', `                              /    \\       (_   _    _)/\\           \\/  \\/     /    \\`)
    socket.emit('play', `                             /      \\       \\(_) (__) /  \\           \\   \\           \\`)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                    ______________`)
    socket.emit('play', `                                    |           |                  GUESSES: ${guesses} `)
    socket.emit('play', `                                    |            `)
    socket.emit('play', `                                    |                             WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', `                                    |           `)
    socket.emit('play', `                                   _|________`)
    socket.emit('play', `                                   |         |______`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                                                 ${blankWord}`)
  } else if (bodyPart === 2) {

    socket.emit('play', `                  ___ ___    _____    _______    ________    _____      _____    _______ `)
    socket.emit('play', `                 /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', `                /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', `                \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `                 \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `                       \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', `                         __   _                             `)
    socket.emit('play', `                       _(  )_( )_                     __   _ /\\                        __   _   `)
    socket.emit('play', `                      (_   _    _)                  _(  )_( )_ \\                     _(  )_( )_`)
    socket.emit('play', `                        (_) (__)      /\\           (_   _    _) \\                   (_   _    _)      `)
    socket.emit('play', `                                     /  \\            (_) (__)    \\          /\\        (_) (__)   `)
    socket.emit('play', `                                /\\  /    \\    __   _     /        \\        /  \\  /\\           `)
    socket.emit('play', `                               /  \\/      \\ _(  )_( )_  /          \\  /\\  /    \\/  \\`)
    socket.emit('play', `                              /    \\       (_   _    _)/\\           \\/  \\/     /    \\`)
    socket.emit('play', `                             /      \\       \\(_) (__) /  \\           \\   \\           \\`)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                    ______________`)
    socket.emit('play', `                                    |           |                  GUESSES: ${guesses} `)
    socket.emit('play', `                                    |           O `)
    socket.emit('play', `                                    |                             WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', `                                    |           `)
    socket.emit('play', `                                   _|________`)
    socket.emit('play', `                                   |         |______`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                                                 ${blankWord}`)
  } else if (bodyPart === 3) {
    socket.emit('play', `                  ___ ___    _____    _______    ________    _____      _____    _______ `)
    socket.emit('play', `                 /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', `                /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', `                \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `                 \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `                       \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', `                         __   _                             `)
    socket.emit('play', `                       _(  )_( )_                     __   _ /\\                        __   _   `)
    socket.emit('play', `                      (_   _    _)                  _(  )_( )_ \\                     _(  )_( )_`)
    socket.emit('play', `                        (_) (__)      /\\           (_   _    _) \\                   (_   _    _)      `)
    socket.emit('play', `                                     /  \\            (_) (__)    \\          /\\        (_) (__)   `)
    socket.emit('play', `                                /\\  /    \\    __   _     /        \\        /  \\  /\\           `)
    socket.emit('play', `                               /  \\/      \\ _(  )_( )_  /          \\  /\\  /    \\/  \\`)
    socket.emit('play', `                              /    \\       (_   _    _)/\\           \\/  \\/     /    \\`)
    socket.emit('play', `                             /      \\       \\(_) (__) /  \\           \\   \\           \\`)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                    ______________`)
    socket.emit('play', `                                    |           |                  GUESSES: ${guesses} `)
    socket.emit('play', `                                    |           O `)
    socket.emit('play', `                                    |           |                 WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', `                                    |           `)
    socket.emit('play', `                                   _|________`)
    socket.emit('play', `                                   |         |______`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                                                 ${blankWord}`)
  } else if (bodyPart === 4) {
    socket.emit('play', `                  ___ ___    _____    _______    ________    _____      _____    _______ `)
    socket.emit('play', `                 /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', `                /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', `                \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `                 \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `                       \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', `                         __   _                             `)
    socket.emit('play', `                       _(  )_( )_                     __   _ /\\                        __   _   `)
    socket.emit('play', `                      (_   _    _)                  _(  )_( )_ \\                     _(  )_( )_`)
    socket.emit('play', `                        (_) (__)      /\\           (_   _    _) \\                   (_   _    _)      `)
    socket.emit('play', `                                     /  \\            (_) (__)    \\          /\\        (_) (__)   `)
    socket.emit('play', `                                /\\  /    \\    __   _     /        \\        /  \\  /\\           `)
    socket.emit('play', `                               /  \\/      \\ _(  )_( )_  /          \\  /\\  /    \\/  \\`)
    socket.emit('play', `                              /    \\       (_   _    _)/\\           \\/  \\/     /    \\`)
    socket.emit('play', `                             /      \\       \\(_) (__) /  \\           \\   \\           \\`)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                    ______________`)
    socket.emit('play', `                                    |           |                  GUESSES: ${guesses} `)
    socket.emit('play', `                                    |           O `)
    socket.emit('play', `                                    |          /|                 WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', `                                    |           `)
    socket.emit('play', `                                   _|________`)
    socket.emit('play', `                                   |         |______`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                                                ${blankWord}`)
  } else if (bodyPart === 5) {
    socket.emit('play', `                  ___ ___    _____    _______    ________    _____      _____    _______ `)
    socket.emit('play', `                 /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', `                /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', `                \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `                 \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `                       \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', `                         __   _                             `)
    socket.emit('play', `                       _(  )_( )_                     __   _ /\\                        __   _   `)
    socket.emit('play', `                      (_   _    _)                  _(  )_( )_ \\                     _(  )_( )_`)
    socket.emit('play', `                        (_) (__)      /\\           (_   _    _) \\                   (_   _    _)      `)
    socket.emit('play', `                                     /  \\            (_) (__)    \\          /\\        (_) (__)   `)
    socket.emit('play', `                                /\\  /    \\    __   _     /        \\        /  \\  /\\           `)
    socket.emit('play', `                               /  \\/      \\ _(  )_( )_  /          \\  /\\  /    \\/  \\`)
    socket.emit('play', `                              /    \\       (_   _    _)/\\           \\/  \\/     /    \\`)
    socket.emit('play', `                             /      \\       \\(_) (__) /  \\           \\   \\           \\`)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                    ______________`)
    socket.emit('play', `                                    |           |                  GUESSES: ${guesses} `)
    socket.emit('play', `                                    |           O `)
    socket.emit('play', `                                    |          /|\\               WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', `                                    |             `)
    socket.emit('play', `                                   _|________`)
    socket.emit('play', `                                   |         |______`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                                                 ${blankWord}`)
  } else if (bodyPart === 6) {

    socket.emit('play', `                  ___ ___    _____    _______    ________    _____      _____    _______ `)
    socket.emit('play', `                 /   |   \\  /  _  \\   \\      \\  /  _____/   /     \\    /  _  \\   \\      \\`)
    socket.emit('play', `                /    ~    \\/  /_\\  \\  /   |   \\/   \\  ___  /  \\ /  \\  /  /_\\  \\  /   |   \\ `)
    socket.emit('play', `                \\    Y    /    |    \\/    |    \\    \\_\\  \\/    Y    \\/    |    \\/    |    \\`)
    socket.emit('play', `                 \\___|_  /\\____|__  /\\____|__  /\\______  /\\____|__  /\\____|__  /\\____|__  /`)
    socket.emit('play', `                       \\/         \\/         \\/        \\/         \\/         \\/         \\/ `)
    socket.emit('play', `                         __   _                             `)
    socket.emit('play', `                       _(  )_( )_                     __   _ /\\                        __   _   `)
    socket.emit('play', `                      (_   _    _)                  _(  )_( )_ \\                     _(  )_( )_`)
    socket.emit('play', `                        (_) (__)      /\\           (_   _    _) \\                   (_   _    _)      `)
    socket.emit('play', `                                     /  \\            (_) (__)    \\          /\\        (_) (__)   `)
    socket.emit('play', `                                /\\  /    \\    __   _     /        \\        /  \\  /\\           `)
    socket.emit('play', `                               /  \\/      \\ _(  )_( )_  /          \\  /\\  /    \\/  \\`)
    socket.emit('play', `                              /    \\       (_   _    _)/\\           \\/  \\/     /    \\`)
    socket.emit('play', `                             /      \\       \\(_) (__) /  \\           \\   \\           \\`)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                    ______________`)
    socket.emit('play', `                                    |           |                  GUESSES: ${guesses} `)
    socket.emit('play', `                                    |           O `)
    socket.emit('play', `                                    |          /|\\               WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', `                                    |          / `)
    socket.emit('play', `                                   _|________`)
    socket.emit('play', `                                   |         |______`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                                                 ${blankWord}`)
  } else if (bodyPart === 7) {
    socket.emit('play', `                  _____.___.________   ____ ___  .____    ________    ___________________._.`)
    socket.emit('play', `                  \\__  |   |\\_____  \\ |    |   \\ |    |   \\       \\  /   _____|_   _____/| |`)
    socket.emit('play', `                   /   |   | /   |   \\|    |   / |    |    /       \\ \\_____  \\ |    __)_ | |`)
    socket.emit('play', `                   \\____   |/    |    \\\    |  /  |    |___/    X    \\/        \]|        \\ \\|`)
    socket.emit('play', `                   / ______|\\_________/______/   |_______ \__________/_______  /_______  / __`)
    socket.emit('play', `                   \\/                                    \\/                 \\/        \\/\\/`)
    socket.emit('play', `                         __   _                             `)
    socket.emit('play', `                       _(  )_( )_                     __   _ /\\                        __   _   `)
    socket.emit('play', `                      (_   _    _)                  _(  )_( )_ \\                     _(  )_( )_`)
    socket.emit('play', `                        (_) (__)      /\\           (_   _    _) \\                   (_   _    _)      `)
    socket.emit('play', `                                     /  \\            (_) (__)    \\          /\\        (_) (__)   `)
    socket.emit('play', `                                /\\  /    \\    __   _     /        \\        /  \\  /\\           `)
    socket.emit('play', `                               /  \\/      \\ _(  )_( )_  /          \\  /\\  /    \\/  \\`)
    socket.emit('play', `                              /    \\       (_   _    _)/\\           \\/  \\/     /    \\`)
    socket.emit('play', `                             /      \\       \\(_) (__) /  \\           \\   \\           \\`)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                    ______________`)
    socket.emit('play', `                                    |           |                  GUESSES: ${guesses} `)
    socket.emit('play', `                                    |           O `)
    socket.emit('play', `                                    |          /|\\               WRONG GUESSES: ${wrongGuesses}`)
    socket.emit('play', `                                    |          / \\`)
    socket.emit('play', `                                   _|________`)
    socket.emit('play', `                                   |         |______`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                   |                |`)
    socket.emit('play', `                                                          The word was: '${word}'`)
    setTimeout(() => {
      socket.emit('clear', 'x')
      spacing('playagain')
      spacing()
    }, 6000)
  }
}

function spacing(playagain) {
  if (playagain) {
    socket.emit('play', `                  __________.__                   _____                .__     _________ `)
    socket.emit('play', `                  \\______   \\  |_____  ___.__.   /  _  \\    _________  |__| ___\\_____   \\`)
    socket.emit('play', `                  |     ___/  | \\__  \\<   |  |  /  /_\\  \\  / ___\\__  \\ |  |/    \\ /   __/`)
    socket.emit('play', `                  |    |   |  |__/ __ \\___   | /    |    \\/ /_/  > __ \\|  |   |  \\   |   `)
    socket.emit('play', `                  |____|   |____(____  / ____| \\____|__  /\\___  (____  /__|___|  /___|   `)
    socket.emit('play', `                                     \\/\\/              \\//_____/     \\/        \\/<___> `)
    socket.emit('play', `                                  (Want to play again? Type 'play again')                 `)
  } else {
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
    socket.emit('play', `                                     `)
  }
}

