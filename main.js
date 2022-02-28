document.addEventListener('DOMContentLoaded', () => {

  let shared, my, participants;
  let client, room;

  async function init() {
    //create a new client and connect to server
    client = new party.Client("wss://deepstream-server-1.herokuapp.com");
    await client.whenReady();

    //create a room
    room = new party.Room(client, "bs4", "main");
    await room.whenReady();

    //join the room and remove any clients who are no longer present
    room.join();
    room.removeDisconnectedClients();

    //create a record that will be used for transporting data between users
    const record = room.getRecord("test");
    await record.whenReady();
    //console.log(record.shared);

    //get the shared object from the record
    shared = record.getShared();
    //participants = room.getParticipantShareds();
    //shared.log = [];
    //console.log(room.getHostName() === client.getUid());

    const myrecord = room.getMyRecord();
    await myrecord.whenReady();

    my = myrecord.getShared();


    //clean up on exit
    window.addEventListener("beforeunload", () => {
      shared.log = [];
      room.leave();
      client.close();
    });

    setup();
    //record.watchShared(onChange);
  }
  
  init();

  function setup() {
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

      if(room.getHostName() === client.getUid()){
        // destroyer2.style.opacity = 0;
        // submarine2.style.opacity = 0;
        // cruiser2.style.opacity = 0;
        // battleship2.style.opacity = 0;
        // carrier2.style.opacity = 0;
        console.log('you host')
      }else{
        // destroyer1.style.opacity = 0;
        // submarine1.style.opacity = 0;
        // cruiser1.style.opacity = 0;
        // battleship1.style.opacity = 0;
        // carrier1.style.opacity = 0;
        console.log('you not host');
      }
    
      const startButton = document.querySelector('#start');
      const entangleButton = document.querySelector('#entangle');
      const rotateButton = document.querySelector('#rotate');
    
    
      const turnDisplay = document.querySelector('#whose-go');
      const infoDisplay = document.querySelector('#info');
      //const chooseTeam = document.querySelector('#chooseteam');
    
    
      let p1Squares = [];
      let p2Squares = [];
    
    
      let isHorizontal = true;
      let isGameOver = false;
    
      let currentPlayer = 'p1';
      shared.p1placed = [false, false, false, false, false];
      shared.p2placed = [false, false, false, false, false];
      shared.dest1pos = [];
      shared.subm1pos = [];
      shared.crui1pos = [];
      shared.batt1pos = [];
      shared.carr1pos = [];
      shared.dest2pos = [];
      shared.subm2pos = [];
      shared.crui2pos = [];
      shared.batt2pos = [];
      shared.carr2pos = [];
      // setInterval(() => {
      //   console.log(shared);
      // }, 1000);


      // chooseTeam.addEventListener('change',() => {
      //   //console.log(chooseTeam.value);
      //   my.selectedTeam = chooseTeam.value;
      //   console.log(shared, my);
      // });
    
      //shared.log.push("sadkjb");
      if(room.getHostName() === client.getUid()) {
        shared.currentTurn = "Player1";
      }
      shared.currentTurn = shared.currentTurn || "Player1";
    
      let totalShipCount = 5;
      const width = 16;
    
      //Create Board
      function createBoard(grid, squares, pname) {
        for (let i = 0; i < width*width; i++) {
          const square = document.createElement('div');
          if(pname == 'p1'){
            square.dataset.id = i;
          }else if(pname == 'p2'){
            square.dataset.id = 255+i;
          }
          
          grid.appendChild(square);
          squares.push(square);
        }
      }
      createBoard(p1Grid, p1Squares, 'p1');
      createBoard(p2Grid, p2Squares, 'p2');
      //console.log(p1Squares);

      // function turnChange() {
      //   if(shared.currentTurn == "p1") {
      //     shared.currentTurn = "p2";
      //   } else if(shared.currentTurn == "p2") {
      //     shared.currentTurn = "p1";
      //   }
      //   console.log(shared.currentTurn);
      // }

      function replaceShip(ship, posarray){
        let shipPlaces = [];
        let temp;
        let place;
        for (let i = 0; i < posarray.length; i++) {
          temp = posarray[i];
          //console.log(temp);
          place = document.querySelector(`[data-id='${temp}']`);
          shipPlaces.push(place);
        }           
        
        //console.log(shipPlaces);
        for (let p = 0; p < shipPlaces.length; p++) {
          shipPlaces[p].classList.add('taken', ship); 
        }
        console.log(shared);
        
      }

      let destroyer1Placed = false;
      let submarine1Placed = false;
      let cruiser1Placed = false;
      let battleship1Placed = false;
      let carrier1Placed = false;

      let destroyer2Placed = false;
      let submarine2Placed = false;
      let cruiser2Placed = false;
      let battleship2Placed = false;
      let carrier2Placed = false;

      setInterval(() => {
        checkDestroyer1Placed();
        checkSubmarine1Placed();
        checkCruiser1Placed();
        checkBattleship1Placed();
        checkCarrier1Placed();
        checkDestroyer2Placed();
        checkSubmarine2Placed();
        checkCruiser2Placed();
        checkBattleship2Placed();
        checkCarrier2Placed();
      }, 1000);
    
      function checkDestroyer1Placed(){
        if(!(room.getHostName() === client.getUid())){
          if(shared.p1placed[0]){

            if(!destroyer1Placed){
              replaceShip('destroyer', shared.dest1pos);
              //console.log(shared);
              displayGrid1.removeChild(destroyer1);
              destroyer1Placed = true;
            }
            
          }
        }
      }

      function checkSubmarine1Placed(){
        if(!(room.getHostName() === client.getUid())){
          if(shared.p1placed[1]){

            if(!submarine1Placed){
              replaceShip('submarine', shared.subm1pos);
              displayGrid1.removeChild(submarine1);
              submarine1Placed = true;
            }
            
          }
        }
      }

      function checkCruiser1Placed(){
        if(!(room.getHostName() === client.getUid())){
          if(shared.p1placed[2]){

            if(!cruiser1Placed){
              replaceShip('cruiser', shared.crui1pos);
              displayGrid1.removeChild(cruiser1);
              cruiser1Placed = true;
            }
            
          }
        }
      }

      function checkBattleship1Placed(){
        if(!(room.getHostName() === client.getUid())){
          if(shared.p1placed[3]){

            if(!battleship1Placed){
              replaceShip('battleship', shared.batt1pos);
              displayGrid1.removeChild(battleship1);
              battleship1Placed = true;
            }
            
          }
        }
      }

      function checkCarrier1Placed(){
        if(!(room.getHostName() === client.getUid())){
          if(shared.p1placed[4]){

            if(!carrier1Placed){
              replaceShip('carrier', shared.carr1pos);
              displayGrid1.removeChild(carrier1);
              carrier1Placed = true;
            }
            
          }
        }
      }

      function checkDestroyer2Placed(){
        if((room.getHostName() === client.getUid())){
          if(shared.p2placed[0]){

            if(!destroyer2Placed){
              replaceShip('destroyer', shared.dest2pos);
              //console.log(shared);
              displayGrid2.removeChild(destroyer2);
              destroyer2Placed = true;
            }
            
          }
        }
      }

      function checkSubmarine2Placed(){
        if((room.getHostName() === client.getUid())){
          if(shared.p2placed[1]){

            if(!submarine2Placed){
              replaceShip('submarine', shared.subm2pos);
              displayGrid2.removeChild(submarine2);
              submarine2Placed = true;
            }
            
          }
        }
      }

      function checkCruiser2Placed(){
        if((room.getHostName() === client.getUid())){
          if(shared.p2placed[2]){

            if(!cruiser2Placed){
              replaceShip('cruiser', shared.crui2pos);
              displayGrid2.removeChild(cruiser2);
              cruiser2Placed = true;
            }
            
          }
        }
      }

      function checkBattleship2Placed(){
        if((room.getHostName() === client.getUid())){
          if(shared.p2placed[3]){

            if(!battleship2Placed){
              replaceShip('battleship', shared.batt2pos);
              displayGrid2.removeChild(battleship2);
              battleship2Placed = true;
            }
            
          }
        }
      }

      function checkCarrier2Placed(){
        if((room.getHostName() === client.getUid())){
          if(shared.p2placed[4]){

            if(!carrier2Placed){
              replaceShip('carrier', shared.carr2pos);
              displayGrid2.removeChild(carrier2);
              carrier2Placed = true;
            }
            
          }
        }
      }

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
      let numberOfShipsDropped = 0;
      //move around user ship
      // let parsedP1Sq = JSON.parse(JSON.stringify(shared.p1Squares));
      // let parsedP2Sq = JSON.parse(JSON.stringify(shared.p2Squares));
      // console.log(parsedP1Sq, parsedP2Sq);

      ships.forEach(ship => ship.addEventListener('dragstart', dragStart));
      p1Squares.forEach(square => square.addEventListener('dragstart', dragStart));
      p1Squares.forEach(square => square.addEventListener('dragover', dragOver));
      p1Squares.forEach(square => square.addEventListener('dragenter', dragEnter));
      p1Squares.forEach(square => square.addEventListener('dragleave', dragLeave))
      p1Squares.forEach(square => square.addEventListener('drop', p1DragDrop));
      p1Squares.forEach(square => square.addEventListener('dragend', dragEnd));
      p2Squares.forEach(square => square.addEventListener('dragstart', dragStart));
      p2Squares.forEach(square => square.addEventListener('dragover', dragOver));
      p2Squares.forEach(square => square.addEventListener('dragenter', dragEnter));
      p2Squares.forEach(square => square.addEventListener('dragleave', dragLeave));
      p2Squares.forEach(square => square.addEventListener('drop', p2DragDrop));
      p2Squares.forEach(square => square.addEventListener('dragend', dragEnd));
    
    
      ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectedShipNameWithIndex = e.target.id;
        //console.log(selectedShipNameWithIndex);
      }))
    
      function dragStart() {
        //console.log('drag start');
        draggedShip = this;
        draggedShipLength = this.childNodes.length;
        //console.log(draggedShip);
        console.log(shared);
      }
    
      function dragOver(e) {
        e.preventDefault();
      }
    
      function dragEnter(e) {
        e.preventDefault();
      }
    
      function dragLeave() {
        //console.log('drag leave');
      }
    
      function p1DragDrop() {
            //console.log($(this).attr("data-pname"), isHorizontal);
            let shipNameWithLastId = draggedShip.lastChild.id;
            let shipClass = shipNameWithLastId.slice(0, -2);
            //console.log(shipClass);

            //console.log(this == document.querySelector(`[data-id='${parseInt($(this).attr("data-id"))}']`));
            //this.append(draggedShip);
            let shipPlaces = [];
        
            let temp;
            let tempPlaces = [];
            let place;
            if(isHorizontal){
              for (let i = 0; i < draggedShipLength; i++) {
                temp = parseInt($(this).attr("data-id")) + i;
                console.log(temp);
                place = document.querySelector(`[data-id='${temp}']`);
                shipPlaces.push(place);
                tempPlaces.push(temp);
              }
            }else if(!isHorizontal){
              for (let i = 0; i < draggedShipLength; i++) {
                temp = parseInt($(this).attr("data-id")) + (16 * i);
                console.log(temp);
                place = document.querySelector(`[data-id='${temp}']`);
                shipPlaces.push(place);
                tempPlaces.push(temp);
              }
            }
            
            console.log(shipPlaces);
            for (let p = 0; p < shipPlaces.length; p++) {
              shipPlaces[p].classList.add('taken', shipClass); 
            }

            let classes = $(draggedShip).attr('class').split(/\s+/);
            if(classes[1] == 'p1-destroyer-container') {
              shared.p1placed[0] = true;
              shared.dest1pos[0] = tempPlaces[0];
              shared.dest1pos[1] = tempPlaces[1];
            } else if(classes[1] == 'p1-submarine-container') {
              shared.p1placed[1] = true;
              shared.subm1pos[0] = tempPlaces[0];
              shared.subm1pos[1] = tempPlaces[1];
              shared.subm1pos[2] = tempPlaces[2];
            } else if(classes[1] == 'p1-cruiser-container') {
              shared.p1placed[2] = true;
              shared.crui1pos[0] = tempPlaces[0];
              shared.crui1pos[1] = tempPlaces[1];
              shared.crui1pos[2] = tempPlaces[2];
            } else if(classes[1] == 'p1-battleship-container') {
              shared.p1placed[3] = true;
              shared.batt1pos[0] = tempPlaces[0];
              shared.batt1pos[1] = tempPlaces[1];
              shared.batt1pos[2] = tempPlaces[2];
              shared.batt1pos[3] = tempPlaces[3];
            } else if(classes[1] == 'p1-carrier-container') {
              shared.p1placed[4] = true;
              shared.carr1pos[0] = tempPlaces[0];
              shared.carr1pos[1] = tempPlaces[1];
              shared.carr1pos[2] = tempPlaces[2];
              shared.carr1pos[3] = tempPlaces[3];
              shared.carr1pos[4] = tempPlaces[4];
            }
            console.log(shared);
            displayGrid1.removeChild(draggedShip);
        
    
        // let shipNameWithLastId = draggedShip.lastChild.id;
        // let shipClass = shipNameWithLastId.slice(0, -2);
        // //console.log(shipClass);
        
        // let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
        // let shipLastId = lastShipIndex + parseInt(this.dataset.id);
        // //console.log(shipLastId);
        // const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93];
        // const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60];
        
        // let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
        // let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);
    
        // selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
    
        // shipLastId = shipLastId - selectedShipIndex;
        // //console.log(shipLastId);
    
        // if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
        //   for (let i=0; i < draggedShipLength; i++) {
        //     p1Squares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass);
        //     p1Squares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('p1', shipClass);
            
        //   }numberOfShipsDropped ++;
        //     console.log(numberOfShipsDropped);
        // //As long as the index of the ship you are dragging is not in the newNotAllowedVertical array! This means that sometimes if you drag the ship by its
        // //index-1 , index-2 and so on, the ship will rebound back to the displayGrid.
        // } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
        //   for (let i=0; i < draggedShipLength; i++) {
        //     p1Squares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', shipClass);
        //     p1Squares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('p1', shipClass);
        //   }
        //   numberOfShipsDropped ++;
        //     console.log(numberOfShipsDropped);
        // } else return;
    
        // displayGrid1.removeChild(draggedShip);
      }
    
      function p2DragDrop() {
            console.log($(this).attr("data-id"), isHorizontal);
            let shipNameWithLastId = draggedShip.lastChild.id;
            let shipClass = shipNameWithLastId.slice(0, -2);
            //console.log(this == document.querySelector(`[data-id='${parseInt($(this).attr("data-id"))}']`));
            //this.append(draggedShip);
            let shipPlaces = [];
        
            let temp;
            let tempPlaces = [];
            let place;
            if(isHorizontal){
              for (let i = 0; i < draggedShipLength; i++) {
                temp = parseInt($(this).attr("data-id")) + i;
                console.log(temp);
                place = document.querySelector(`[data-id='${temp}']`);
                shipPlaces.push(place);
                tempPlaces.push(temp);
              }
            }else if(!isHorizontal){
              for (let i = 0; i < draggedShipLength; i++) {
                temp = parseInt($(this).attr("data-id")) + (16 * i);
                console.log(temp);
                place = document.querySelector(`[data-id='${temp}']`);
                shipPlaces.push(place);
                tempPlaces.push(temp);
              }
            }
            
            console.log(shipPlaces);
            for (let p = 0; p < shipPlaces.length; p++) {
              shipPlaces[p].classList.add('taken', shipClass);      
            }

            let classes = $(draggedShip).attr('class').split(/\s+/);
            if(classes[1] == 'p2-destroyer-container') {
              shared.p2placed[0] = true;
              shared.dest2pos[0] = tempPlaces[0];
              shared.dest2pos[1] = tempPlaces[1];
            } else if(classes[1] == 'p2-submarine-container') {
              shared.p2placed[1] = true;
              shared.subm2pos[0] = tempPlaces[0];
              shared.subm2pos[1] = tempPlaces[1];
              shared.subm2pos[2] = tempPlaces[2];
            } else if(classes[1] == 'p2-cruiser-container') {
              shared.p2placed[2] = true;
              shared.crui2pos[0] = tempPlaces[0];
              shared.crui2pos[1] = tempPlaces[1];
              shared.crui2pos[2] = tempPlaces[2];
            } else if(classes[1] == 'p2-battleship-container') {
              shared.p2placed[3] = true;
              shared.batt2pos[0] = tempPlaces[0];
              shared.batt2pos[1] = tempPlaces[1];
              shared.batt2pos[2] = tempPlaces[2];
              shared.batt2pos[3] = tempPlaces[3];
            } else if(classes[1] == 'p2-carrier-container') {
              shared.p2placed[4] = true;
              shared.carr2pos[0] = tempPlaces[0];
              shared.carr2pos[1] = tempPlaces[1];
              shared.carr2pos[2] = tempPlaces[2];
              shared.carr2pos[3] = tempPlaces[3];
              shared.carr2pos[4] = tempPlaces[4];
            }

            displayGrid2.removeChild(draggedShip);
        
      }
    
      function dragEnd() {
        console.log('dragend');
      }
    
      
      function entanleBegin(){
        setInterval(()=> {
          chooseEntanglePoints();
        }, 500);
      }
      function begin(){
        if(entangleCount>=entangleMax){
          entangleButton.removeEventListener('click', entanleBegin);
          setInterval(()=> {
            playGame();
          }, 500);
        }
        else
          infoDisplay.innerHTML = 'Waiting for all 7 entangled squares'; 
      }
      
      let turnState = 'p1';
      //Game Logic
      function playGame() {
        //console.log(currentPlayer);
    
        if (isGameOver) return;
        if(numberOfShipsDropped>=totalShipCount){
          //infoDisplay.innerHTML = ''
          if (currentPlayer === 'p1') {
            turnDisplay.innerHTML = 'Player 1 Go';
            p2Squares.forEach(square => square.addEventListener('click', function(e) {
            revealSquare(square, 'p1');
            currentPlayer = 'p2';
          }))
          
          }else if (currentPlayer === 'p2') {
            turnDisplay.innerHTML = 'Player 2 Go';
            p1Squares.forEach(square => square.addEventListener('click', function(e) {
              revealSquare(square, 'p2');
              currentPlayer = 'p1';
            }))
          }
        }
        else
        infoDisplay.innerHTML = 'All Ships Not Placed'
        
      }
      startButton.addEventListener('click', begin);
      entangleButton.addEventListener('click', entanleBegin);
    
      let destroyerCount = 0;
      let submarineCount = 0;
      let cruiserCount = 0;
      let battleshipCount = 0;
      let carrierCount = 0;
    
      let p2DestroyerCount = 0;
      let p2SubmarineCount = 0;
      let p2CruiserCount = 0;
      let p2BattleshipCount = 0;
      let p2CarrierCount = 0;
    
      function revealSquare(square, turnState) {
        if (!square.classList.contains('boom') && square.classList.contains('p1')) { //p2 since player incrememnts before this check.. but it is actually checking for p1
          if (square.classList.contains('destroyer')) {destroyerCount++; console.log( "player 1 destroyer count:", destroyerCount)}
          if (square.classList.contains('submarine')) {submarineCount++; console.log( "player 1 sub count:", submarineCount)}
          if (square.classList.contains('cruiser')) {cruiserCount++; console.log( "player 1 cruiser count:", cruiserCount)}
          if (square.classList.contains('battleship')) {battleshipCount++; console.log( "player 1 battleship count:", battleshipCount)}
          if (square.classList.contains('carrier')) {carrierCount++; console.log( "player 1 carrier count:", carrierCount)}
        }
        else if (!square.classList.contains('boom') && square.classList.contains('p2')) {
          if (square.classList.contains('destroyer')) {p2DestroyerCount++;}
          if (square.classList.contains('submarine')) p2SubmarineCount++;
          if (square.classList.contains('cruiser')) p2CruiserCount++;
          if (square.classList.contains('battleship')) p2BattleshipCount++;
          if (square.classList.contains('carrier')) p2CarrierCount++;
        }
    
        if(square.classList.contains('boom') || square.classList.contains('miss')) return;
        if (square.classList.contains('taken') && square.classList.contains('entangled') && square.classList.contains('p1')) {
          square.classList.add('boom');
          for(let i=0; i<entangleMax; i++){
            if(square.classList.contains(i)){
              tempIndex = i;
              console.log("for p1: ", tempIndex);
              boomEntangledPair(tempIndex);
              break;
            }
          }
        }else if(square.classList.contains('taken')) { 
          square.classList.add('boom');
        } else {
          square.classList.add('miss');
        }
      
    
        // if(turnState==='p1'){
        //   if(square.classList.contains('boom') || square.classList.contains('miss')) return;
        //   if (square.classList.contains('taken') && square.classList.contains('p1')) {
        //     square.classList.add('boom');
        //   } else {
        //     square.classList.add('miss');
        //   }
        // }
        // else if(turnState==='p2'){
        //   if(square.classList.contains('boom') || square.classList.contains('miss')) return;
        //   if (square.classList.contains('taken') && square.classList.contains('p2')) {
        //     square.classList.add('boom');
        //   } else {
        //     square.classList.add('miss');
        //   }
        // }
    
        checkForWins();
        playGame();
      }
    
      let entangleCount=0;
      let entangleMax=5;
      let paired=false;
      let i=0;
      function chooseEntanglePoints(){
        p1Squares.forEach(square => square.addEventListener('dblclick', function(e){
          //console.log("entangle this point");
          if (square.classList.contains('taken') && !square.classList.contains('entangled') && entangleCount<entangleMax) {
            square.classList.add('entangled');
            square.classList.add(entangleCount);
            assignEntanglePair();
            entangleCount++;
            //console.log(entangleCount);
            //console.log(p1Squares.findIndex(square));
            infoDisplay.innerHTML ="";
          }else if(entangleCount>=entangleMax){
            infoDisplay.innerHTML ="You can't entangle any more, don't be greedy";
          }else if(!square.classList.contains('taken')){
            infoDisplay.innerHTML ="You're trying to entangle the sea";
          }
        }));
        // p2Squares.forEach(square => square.addEventListener('dblclick', function(e){
        //   console.log("entangle this point");
        //   square.style.backgroundColor = "grey";
        // }));
      }
      function assignEntanglePair(){
        randomPoint= Math.floor(Math.random() * (width*width));
        while(paired===false){
          if (p2Squares[randomPoint].classList.contains('taken') && !p2Squares[randomPoint].classList.contains('entangled')){
            p2Squares[randomPoint].classList.add('entangled');
            p2Squares[randomPoint].classList.add(entangleCount);
            console.log(entangleCount);
            break;
          }
          else
            randomPoint= Math.floor(Math.random() * (width*width));
        }
      }
      function boomEntangledPair(i){
        console.log("for p2: ", i);
        p2Squares.forEach(p2sqr => {
          console.log('ENTERED')
          if(p2sqr.classList.contains(i)){
            p2sqr.classList.add('boom');
            console.log("pair is blown");
          }
        })
      }
      function checkForWins() {
        if (destroyerCount === 2) {
          infoDisplay.innerHTML = 'You sunk player 1 \'s destroyer'
          destroyerCount = 10
        }
        if (submarineCount === 3) {
          infoDisplay.innerHTML = 'You sunk player 1 \'s submarine'
          submarineCount = 10
        }
        if (cruiserCount === 3) {
          infoDisplay.innerHTML = 'You sunk player 1 \'s cruiser'
          cruiserCount = 10
        }
        if (battleshipCount === 4) {
          infoDisplay.innerHTML = 'You sunk player 1 \'s battleship'
          battleshipCount = 10
        }
        if (carrierCount === 5) {
          infoDisplay.innerHTML = 'You sunk player 1 \'s carrier'
          carrierCount = 10
        }
        if (p2DestroyerCount === 2) {
          infoDisplay.innerHTML = 'You sunk player 2 \'s Destroyer'
          p2DestroyerCount = 10
        }
        if (p2SubmarineCount === 3) {
          infoDisplay.innerHTML = 'You sunk player 2 \'s Submarine'
          p2SubmarineCount = 10
        }
        if (p2CruiserCount === 3) {
          infoDisplay.innerHTML = 'You sunk player 2 \'s Cruiser'
          cpuCruiserCount = 10
        }
        if (p2BattleshipCount === 4) {
          infoDisplay.innerHTML = 'You sunk player 2 \'s Battleship'
          p2BattleshipCount = 10
        }
        if (p2CarrierCount === 5) {
          infoDisplay.innerHTML = 'You sunk player 2 \'s Carrier'
          p2CarrierCount = 10
        }
        if ((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 50) {
          infoDisplay.innerHTML = "PLAYER 1 WINS"
          gameOver()
        }
        if ((p2DestroyerCount + p2SubmarineCount + p2CruiserCount + p2BattleshipCount + p2CarrierCount) === 50) {
          infoDisplay.innerHTML = "PLAYER 2 WINS"
          gameOver()
        }
      }
    
      function gameOver() {
        isGameOver = true;
        startButton.removeEventListener('click', begin);
      }
  }

  
})
