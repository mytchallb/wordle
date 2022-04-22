import './style.scss'



let activeRow = 0
let activeCell = 0
let canPlay = 1
let endOfRow = 0
const answer = "cutie"

const date = new Date()
const day = date.getDate() // 22

let canSave = 1
// Check local storage for saved data
const checkLocalStorage = () => {
  if (localStorage.getItem('wordle')) {
    const savedData = JSON.parse(localStorage.getItem('wordle'))
    if (savedData.day == day) {
      activeRow = savedData.activeRow
      activeCell = savedData.activeCell
      canPlay = savedData.canPlay
      endOfRow = savedData.endOfRow
      const letters = savedData.letters
      // Set letters
      const cell = document.querySelectorAll('.board-cell')
      for (let i = 0; i < cell.length; i++) {
        cell[i].innerHTML = letters[i]
      }
      // Loop through activeRow variable
      for (let i = 0; i <= activeRow; i++) {
        verifyLine(i)
      }
      if (activeRow != answer.length) {
        activeCell = 0
        endOfRow = 0
        activeRow++
      }

      
    }
  }
}



// Save data to localstorage
const saveData = () => {
  // Save letters
  const letters = document.querySelectorAll('.board-cell')
  let lettersArray = []
  letters.forEach(letter => {
    lettersArray.push(letter.innerHTML)
  })

  console.log("letters to save", lettersArray)

  const data = {
    activeRow: activeRow,
    activeCell: activeCell,
    endOfRow: endOfRow,
    canPlay: canPlay,
    day: day,
    letters: lettersArray
  }
  localStorage.setItem('wordle', JSON.stringify(data))
}




// Create keyboard
const createKeyboard = () => {
  const keyboard = document.querySelector('.keyboard')
  const keys = [
    'q','w','e','r','t','y','u','i','o','p',
    'a','s','d','f','g','h','j','k','l',
    'z','x','c','v','b','n','m'
  ]
  keys.forEach(key => {
    const button = document.createElement('button')
    button.classList.add('key')
    button.innerHTML = key
    button.addEventListener('click', () => {
      pressedKey(key)
    })
    keyboard.appendChild(button)
    if (key === 'p' || key === 'l') {
      const breakEl = document.createElement('div')
      breakEl.classList.add('break')
      keyboard.appendChild(breakEl)
    }
  })
}

createKeyboard()




window.addEventListener('keydown',e => {
  const key = e.key;
  if(key.length > 1 && key.charCodeAt(0) < 128) {
      console.log("Named attribute value: %s", key)
  }
  else {
    pressedKey(key)
      console.log("Unicode character '%s'", key);
  }
});

const pressedKey = (key) => {
  console.log("active row: %s", activeRow)
  console.log("active cell: %s", activeCell)

  if(canPlay && !endOfRow) {
    const row = document.querySelectorAll('.board-row')[activeRow]
    const cell = row.querySelectorAll('.board-cell')[activeCell]
    cell.querySelector('span').innerHTML = key;
    
    if (activeCell < answer.length - 1) {
      activeCell++
    } else {
      endOfRow = 1
    }
  }
}

// Press delete
/*
document.querySelector('.btn-delete').addEventListener('click', () => {
  if (canPlay) {
    const row = document.querySelectorAll('.board-row')[activeRow]
    const cellIndex = (endOfRow) ? activeCell-1 : activeCell-1
    const cell = row.querySelectorAll('.board-cell')[cellIndex]
    cell.querySelector('span').innerHTML = ""
    activeCell--
    if (activeCell < 0) {
      activeCell = 0
    }
  }
});
*/

// Press Enter
document.querySelector(".btn-check").addEventListener("click", function () {
  checkRow()
});



const verifyLine = (rowIndexToCheck) => {

  console.log("checking line", rowIndexToCheck)
  // Loop through row checking letter, if correct apply colour, afterwards move to next row
  const row = document.querySelectorAll('.board-row')[rowIndexToCheck]
  const cell = row.querySelectorAll('.board-cell')
  let correct = 0
  for (let i = 0; i < cell.length; i++) {
    const letter = cell[i].querySelector('span').innerHTML.toLowerCase()
    cell[i].classList.add('wrong')
    
    // Loop through answer
    let classToAdd = 'fail'
    for (let j = 0; j < answer.length; j++) {

      
      if (letter === answer[j]) {
        if (letter === answer[i]) {
          classToAdd = 'correct'
          correct++
        } else {
          classToAdd = 'hint'
        }
      }
    }
    cell[i].classList.add(classToAdd)
    if (classToAdd == 'fail') {
      greyOutKey(letter)
    }
  }
  return correct;
}


const checkRow = () => {
  if (endOfRow && canPlay) {

    let correct = verifyLine(activeRow)
    saveData()

    console.log("correct", correct)
      console.log("answer", answer.length)

    // See if we've won, otherwise move to next row, or lose
    if (correct == answer.length) {
      canPlay = 0
      wonGame()
    } else {
      if (activeRow < answer.length) {
        activeRow++
        activeCell = 0
        endOfRow = 0
      } else {
        canPlay = 0
        lostGame()
      }
    }

  }
}

const greyOutKey = (letter) => {
  const keys = document.querySelectorAll('.key')
  keys.forEach(key => {
    if (key.innerHTML.toLowerCase() === letter) {
      key.classList.add('fail')
    }
  })
}


const wonGame = () => {
  console.log("won")
  alert("You Won!!!!!!")
  canPlay=0;
  saveData()
}
const lostGame = () => {
  console.log("lost")
  alert("You lost! :(")
  canPlay=0;
  saveData()
  /*
  canPlay = 1
  activeCell = 0
  activeRow = 0
  endOfRow = 0
  
  document.querySelectorAll('.board-cell').forEach(cell => {
    cell.classList.remove('correct', 'hint')
    const span = cell.querySelector('span')
    span.innerHTML = ""
  })*/

}




// Press input box
const cells = document.querySelectorAll(".board-cell")
for (const cell of cells) {
  cell.addEventListener("click", function () {
    clickBox()
  });
}

const clickBox = () => {
  console.log("clicked")
  document.querySelector('.control-input').focus()
}

/* Increase row
if (activeCell < answer.length - 1) {
      activeCell++
    } else {
      activeCell=0
      activeRow++; 
    }   
    if (activeRow == 6) {
      canPlay = 0
      console.log("game end")
    }
 */

// board-row
// board-cell

// Store state after pressing check
// Add backspace

checkLocalStorage();