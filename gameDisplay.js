const guesses = ['A', 'E', 'I', 'O', 'U']
const wrongGuesses = ['X', 'Y', 'Z']
// let words = ['Apple']
// word = word[Math.floor(Math.random() * word.length)]
// let blankWord = '';
// let currentWord;
// let chances = 7;
// let bodyPart = 0;
// let topScores = [];

module.exports = {
  empty: () => {
    console.log(` \n \n \n ------------`)
    console.log(` |           |                  GUESSES: ${guesses} `)
    console.log(` |            `)
    console.log(` |                             WRONG GUESSES: ${wrongGuesses}`)
    console.log(` |           `)
    console.log(`_|________`)
    console.log(`|           |______`)
    console.log(`|                   |`)
    console.log(`|                   |`)
    console.log(`                              _ _ _ _ _ _ _ _ _ \n \n \n`)
  },

  // Wrong Guess 1
  head: () => {
    console.log(`\n \n \n ------------`)
    console.log(` |           |                  GUESSES: ${guesses} `)
    console.log(` |           O `)
    console.log(` |                             WRONG GUESSES: ${wrongGuesses}`)
    console.log(` |           `)
    console.log(`_|________`)
    console.log(`|           |______`)
    console.log(`|                   |`)
    console.log(`|                   |`)
    console.log(`                             _ _ _ _ _ _ _ _ _ \n \n \n`)
  },

  // Wrong Guess 2
  body: () => {
    console.log(`\n \n \n ------------`)
    console.log(` |           |                  GUESSES: ${guesses} `)
    console.log(` |           O `)
    console.log(` |           |                 WRONG GUESSES: ${wrongGuesses}`)
    console.log(` |           `)
    console.log(`_|________`)
    console.log(`|           |______`)
    console.log(`|                   |`)
    console.log(`|                   |`)
    console.log(`                             _ _ _ _ _ _ _ _ _ \n \n \n`)
  },

  // Wrong Guess 3
  armOne: () => {
    console.log(`\n \n \n ------------`)
    console.log(` |           |                  GUESSES: ${guesses} `)
    console.log(` |           O `)
    console.log(` |          /|                 WRONG GUESSES: ${wrongGuesses}`)
    console.log(` |           `)
    console.log(`_|________`)
    console.log(`|           |______`)
    console.log(`|                   |`)
    console.log(`|                   |`)
    console.log(`                             _ _ _ _ _ _ _ _ _ \n \n \n`)
  },

  // Wrong Guess 4
  armTwo: () => {
    console.log(`\n \n \n ------------`)
    console.log(` |           |                  GUESSES: ${guesses} `)
    console.log(` |           O `)
    console.log(` |          /|\\               WRONG GUESSES: ${wrongGuesses}`)
    console.log(` |             `)
    console.log(`_|________`)
    console.log(`|           |______`)
    console.log(`|                   |`)
    console.log(`|                   |`)
    console.log(`                             _ _ _ _ _ _ _ _ _ \n \n \n`)
  },

  // Wrong Guess 5
  legOne: () => {
    console.log(`\n \n \n ------------`)
    console.log(` |           |                  GUESSES: ${guesses} `)
    console.log(` |           O `)
    console.log(` |          /|\\               WRONG GUESSES: ${wrongGuesses}`)
    console.log(` |          / `)
    console.log(`_|________`)
    console.log(`|           |______`)
    console.log(`|                   |`)
    console.log(`|                   |`)
    console.log(`                             _ _ _ _ _ _ _ _ _ \n \n \n`)
  },

  // Wrong Guess 6
  legTwo: () => {
    console.log(`\n \n \n ------------`)
    console.log(` |           |                  GUESSES: ${guesses} `)
    console.log(` |           O `)
    console.log(` |          /|\\               WRONG GUESSES: ${wrongGuesses}`)
    console.log(` |          / \\`)
    console.log(`_|________`)
    console.log(`|           |______`)
    console.log(`|                   |`)
    console.log(`|                   |`)
    console.log(`                             _ _ _ _ _ _ _ _ _ \n \n \n`)
  }
}

function renderBodyParts() {
  //   if (bodyPart === 1) {
  //     gameDisplay.head()
  //   } else if (bodyPart === 2) {
  //     gameDisplay.body()
  //   } else if (bodyPart === 3) {
  //     gameDisplay.armOne()
  //   } else if (bodyPart === 4) {
  //     gameDisplay.armTwo()
  //   } else if (bodyPart === 5) {
  //     gameDisplay.legOne()
  //   } else if (bodyPart === 6) {
  //     gameDisplay.legTwo()
  //   }
  // }