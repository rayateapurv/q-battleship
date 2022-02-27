document.addEventListener('DOMContentLoaded', () => {

  const p1Grid = document.querySelector('.grid-p1');
  const p2Grid = document.querySelector('.grid-p2');

  const displayGrid1 = document.querySelector('.p1-grid-display');
  const displayGrid2 = document.querySelector('.p2-grid-display');

  const ships = document.querySelectorAll('.ship');

  const destroyer1 = document.querySelector('.p1-destroyer-container');
  const submarine1 = document.querySelector('.p1-submarine-container');
  const cruiser1 = document.querySelector('.p1-cruiser-container');
  const battleship1 = document.querySelector('.p1-battleship-container');
  const carrier1 = document.querySelector('.p1-carrier-container');


  const destroyer2 = document.querySelector('.p2-destroyer-container');
  const submarine2 = document.querySelector('.p2-submarine-container');
  const cruiser2 = document.querySelector('.p2-cruiser-container');
  const battleship2 = document.querySelector('.p2-battleship-container');
  const carrier2 = document.querySelector('.p2-carrier-container');


  const startButton = document.querySelector('#start');
  const rotateButton = document.querySelector('#rotate');


  const turnDisplay = document.querySelector('#whose-go');
  const infoDisplay = document.querySelector('#info');


  const p1Squares = [];
  const p2Squares = [];


  let isHorizontal = true;
  let isGameOver = false;

  let currentPlayer = 'p1';

  const width = 10;

  //Create Board
  function createBoard(grid, squares) {
    for (let i = 0; i < width*width; i++) {
      const square = document.createElement('div');
      square.dataset.id = i;
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard(p1Grid, p1Squares);
  createBoard(p2Grid, p2Squares);

  //Ships
  // const shipArray = [
  //   {
  //     name: 'destroyer',;
  //     directions: [
  //       [0, 1],
  //       [0, width]
  //     ]
  //   },
  //   {
  //     name: 'submarine',
  //     directions: [
  //       [0, 1, 2],
  //       [0, width, width*2]
  //     ]
  //   },
  //   {
  //     name: 'cruiser',
  //     directions: [
  //       [0, 1, 2],
  //       [0, width, width*2]
  //     ]
  //   },
  //   {
  //     name: 'battleship',
  //     directions: [
  //       [0, 1, 2, 3],
  //       [0, width, width*2, width*3]
  //     ]
  //   },
  //   {
  //     name: 'carrier',
  //     directions: [
  //       [0, 1, 2, 3, 4],
  //       [0, width, width*2, width*3, width*4]
  //     ]
  //   },
  // ]

  //Draw the computers ships in random locations
  // function generate(ship) {
  //   let randomDirection = Math.floor(Math.random() * ship.directions.length)
  //   let current = ship.directions[randomDirection]
  //   if (randomDirection === 0) direction = 1
  //   if (randomDirection === 1) direction = 10
  //   let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)))

  //   const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'))
  //   const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
  //   const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

  //   if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name))

  //   else generate(ship)
  // }
  // generate(shipArray[0])
  // generate(shipArray[1])
  // generate(shipArray[2])
  // generate(shipArray[3])
  // generate(shipArray[4])

  //Rotate the ships
  function rotate() {
    if (isHorizontal) {
      destroyer1.classList.toggle('p1-destroyer-container-vertical');
      submarine1.classList.toggle('p1-submarine-container-vertical');
      cruiser1.classList.toggle('p1-cruiser-container-vertical');
      battleship1.classList.toggle('p1-battleship-container-vertical');
      carrier1.classList.toggle('p1-carrier-container-vertical');
      destroyer2.classList.toggle('p2-destroyer-container-vertical');
      submarine2.classList.toggle('p2-submarine-container-vertical');
      cruiser2.classList.toggle('p2-cruiser-container-vertical');
      battleship2.classList.toggle('p2-battleship-container-vertical');
      carrier2.classList.toggle('p2-carrier-container-vertical');
      isHorizontal = false;
      console.log(isHorizontal);
      return;
    }
    if (!isHorizontal) {
      destroyer1.classList.toggle('p1-destroyer-container-vertical');
      submarine1.classList.toggle('p1-submarine-container-vertical');
      cruiser1.classList.toggle('p1-cruiser-container-vertical');
      battleship1.classList.toggle('p1-battleship-container-vertical');
      carrier1.classList.toggle('p1-carrier-container-vertical');
      destroyer2.classList.toggle('p2-destroyer-container-vertical');
      submarine2.classList.toggle('p2-submarine-container-vertical');
      cruiser2.classList.toggle('p2-cruiser-container-vertical');
      battleship2.classList.toggle('p2-battleship-container-vertical');
      carrier2.classList.toggle('p2-carrier-container-vertical');
      isHorizontal = true;
      console.log(isHorizontal);
      return;
    }
  }
  rotateButton.addEventListener('click', rotate);

  let selectedShipNameWithIndex;
  let draggedShip;
  let draggedShipLength;

  //move around user ship
  ships.forEach(ship => ship.addEventListener('dragstart', dragStart));
  p1Squares.forEach(square => square.addEventListener('dragstart', dragStart));
  p1Squares.forEach(square => square.addEventListener('dragover', dragOver));
  p1Squares.forEach(square => square.addEventListener('dragenter', dragEnter));
  p1Squares.forEach(square => square.addEventListener('dragleave', dragLeave))
  p1Squares.forEach(square => square.addEventListener('drop', dragDrop));
  p1Squares.forEach(square => square.addEventListener('dragend', dragEnd));
  p2Squares.forEach(square => square.addEventListener('dragstart', dragStart));
  p2Squares.forEach(square => square.addEventListener('dragover', dragOver));
  p2Squares.forEach(square => square.addEventListener('dragenter', dragEnter));
  p2Squares.forEach(square => square.addEventListener('dragleave', dragLeave));
  p2Squares.forEach(square => square.addEventListener('drop', p2DragDrop));
  p2Squares.forEach(square => square.addEventListener('dragend', dragEnd));


  ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
    selectedShipNameWithIndex = e.target.id;
    console.log(selectedShipNameWithIndex);
  }))

  function dragStart() {
    console.log('drag start');
    draggedShip = this;
    draggedShipLength = this.childNodes.length;
    console.log(draggedShip);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {
    console.log('drag leave');
  }

  function dragDrop() {
    let shipNameWithLastId = draggedShip.lastChild.id;
    let shipClass = shipNameWithLastId.slice(0, -2);
    console.log(shipClass);
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    let shipLastId = lastShipIndex + parseInt(this.dataset.id);
    console.log(shipLastId);
    const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93];
    const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60];
    
    let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
    let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);

    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

    shipLastId = shipLastId - selectedShipIndex;
    console.log(shipLastId);

    if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
      for (let i=0; i < draggedShipLength; i++) {
        p1Squares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass);
      }
    //As long as the index of the ship you are dragging is not in the newNotAllowedVertical array! This means that sometimes if you drag the ship by its
    //index-1 , index-2 and so on, the ship will rebound back to the displayGrid.
    } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
      for (let i=0; i < draggedShipLength; i++) {
        p1Squares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', shipClass);
      }
    } else return;

    displayGrid1.removeChild(draggedShip);
  }

  function p2DragDrop() {
    let shipNameWithLastId = draggedShip.lastChild.id;
    let shipClass = shipNameWithLastId.slice(0, -2);
    console.log(shipClass);
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    let shipLastId = lastShipIndex + parseInt(this.dataset.id);
    console.log(shipLastId);
    const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93];
    const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60];
    
    let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
    let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);

    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

    shipLastId = shipLastId - selectedShipIndex;
    console.log(shipLastId);

    if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
      for (let i=0; i < draggedShipLength; i++) {
        p2Squares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass);
      }
    //As long as the index of the ship you are dragging is not in the newNotAllowedVertical array! This means that sometimes if you drag the ship by its
    //index-1 , index-2 and so on, the ship will rebound back to the displayGrid.
    } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
      for (let i=0; i < draggedShipLength; i++) {
        p2Squares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', shipClass);
      }
    } else return;

    displayGrid2.removeChild(draggedShip);
  }

  function dragEnd() {
    console.log('dragend');;
  }

  //console.log(computerSquares);

  function begin(){
    setInterval(()=> {
      playGame();
    }, 500);
  }

  //Game Logic
  function playGame() {
    //console.log(currentPlayer);

    if (isGameOver) return;


    if (currentPlayer === 'p1') {
      p2Squares.forEach(square => square.addEventListener('click', function(e) {
        revealSquare(square);
        currentPlayer = 'p2';
        turnDisplay.innerHTML = 'Player2 Go';
      }))
      
    }else if (currentPlayer === 'p2') {
      //setTimeout(computerGo, 1000)
      p1Squares.forEach(square => square.addEventListener('click', function(e) {
        revealSquare(square);
        currentPlayer = 'p1';
        turnDisplay.innerHTML = 'Player1 Go';
      }))

    }
  }


  startButton.addEventListener('click', begin);

  // let destroyerCount = 0
  // let submarineCount = 0
  // let cruiserCount = 0
  // let battleshipCount = 0
  // let carrierCount = 0

  // let cpuDestroyerCount = 0
  // let cpuSubmarineCount = 0
  // let cpuCruiserCount = 0
  // let cpuBattleshipCount = 0
  // let cpuCarrierCount = 0

  function revealSquare(square) {
    //console.log(square.id);
    // if (!square.classList.contains('boom')) {
    //   if (square.classList.contains('destroyer')) destroyerCount++
    //   if (square.classList.contains('submarine')) submarineCount++
    //   if (square.classList.contains('cruiser')) cruiserCount++
    //   if (square.classList.contains('battleship')) battleshipCount++
    //   if (square.classList.contains('carrier')) carrierCount++
    // }
    if(square.classList.contains('boom') || square.classList.contains('miss')) return;
    if (square.classList.contains('taken')) {
      square.classList.add('boom');
    } else {
      square.classList.add('miss');
    }

    //checkForWins()

    //playGame()
  }


  // function computerGo() {
  //   let random = Math.floor(Math.random() * userSquares.length)
  //   if (!userSquares[random].classList.contains('boom')) {
  //     userSquares[random].classList.add('boom')
  //     if (userSquares[random].classList.contains('destroyer')) cpuDestroyerCount++
  //     if (userSquares[random].classList.contains('submarine')) cpuSubmarineCount++
  //     if (userSquares[random].classList.contains('cruiser')) cpuCruiserCount++
  //     if (userSquares[random].classList.contains('battleship')) cpuBattleshipCount++
  //     if (userSquares[random].classList.contains('carrier')) cpuCarrierCount++
  //     checkForWins()
  //   } else computerGo()
  //   currentPlayer = 'user'
  //   turnDisplay.innerHTML = 'Your Go'
  // }

  // function checkForWins() {
  //   if (destroyerCount === 2) {
  //     infoDisplay.innerHTML = 'You sunk the computers destroyer'
  //     destroyerCount = 10
  //   }
  //   if (submarineCount === 3) {
  //     infoDisplay.innerHTML = 'You sunk the computers submarine'
  //     submarineCount = 10
  //   }
  //   if (cruiserCount === 3) {
  //     infoDisplay.innerHTML = 'You sunk the computers cruiser'
  //     cruiserCount = 10
  //   }
  //   if (battleshipCount === 4) {
  //     infoDisplay.innerHTML = 'You sunk the computers battleship'
  //     battleshipCount = 10
  //   }
  //   if (carrierCount === 5) {
  //     infoDisplay.innerHTML = 'You sunk the computers carrier'
  //     carrierCount = 10
  //   }
  //   if (cpuDestroyerCount === 2) {
  //     infoDisplay.innerHTML = 'You sunk the computers Destroyer'
  //     cpuDestroyerCount = 10
  //   }
  //   if (cpuSubmarineCount === 3) {
  //     infoDisplay.innerHTML = 'You sunk the computers Submarine'
  //     cpuSubmarineCount = 10
  //   }
  //   if (cpuCruiserCount === 3) {
  //     infoDisplay.innerHTML = 'You sunk the computers Cruiser'
  //     cpuCruiserCount = 10
  //   }
  //   if (cpuBattleshipCount === 4) {
  //     infoDisplay.innerHTML = 'You sunk the computers Battleship'
  //     cpuBattleshipCount = 10
  //   }
  //   if (cpuCarrierCount === 5) {
  //     infoDisplay.innerHTML = 'You sunk the computers Carrier'
  //     cpuCarrierCount = 10
  //   }
  //   if ((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 50) {
  //     infoDisplay.innerHTML = "YOU WIN"
  //     gameOver()
  //   }
  //   if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
  //     infoDisplay.innerHTML = "COMPUTER WINS"
  //     gameOver()
  //   }
  // }

  function gameOver() {
    isGameOver = true;
    startButton.removeEventListener('click', begin);
  }
})
