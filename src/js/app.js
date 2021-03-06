$(() => {
  // List of variables needed for the game
  const $start = $('.startbtn2');
  const $start1Player = $('.startbtn1');
  const $move = $('.move');
  const $boost = $('.boost');
  const $salt = $('.salt');
  const $turnText = $('.turn');
  const $finish1 = $('.finish1');
  const $finish2 = $('.finish2');
  const $feedback = $('.feedback');
  const $controller = $('.controller');
  const $reset = $('.reset');
  const $resultBox = $('.resultBox');
  const $instructions = $('.instructions');
  const $board = $('.board');
  // Audio variables.
  const $audioTheme = $('.theme')[0];
  $audioTheme.src = 'sounds/closing_theme.mp3';
  const $boostSound = $('.boostSound')[0];
  const $saltSound = $('.saltSound')[0];
  const $moveSound = $('.moveSound')[0];
  const $moveSoundTwo = $('.moveSound2')[0];
  const $errorSound = $('.errorSound')[0];
  const $winSound = $('.winSound')[0];
  // Variables that update during the game, based on turn/abilties used.
  let $track = $('.track1');
  let playerOneTurn = true;
  let PlayerOneBoostRemaining = 1;
  let PlayerTwoBoostRemaining = 1;
  let PlayerOneSaltRemaining = 1;
  let PlayerTwoSaltRemaining = 1;
  let index = null;
  let playerOneTracker = null;
  let isOnePlayer = false;
  let aiMoveDecider = null;

  // function that checks to see if either player is in a winning position, postion is determines if the index of the occupied space is equal to or greater than 21(the finish line), there are hidden run off boxes that also evaulate the winner if the final move would of take then player passed index 21.
  function checkWinner(){
    index = playerOneTurn ? $('.track1.player').index() : $('.track2.player').index();
    if(index >= 21) {
      alwaysOnWin();
      (playerOneTurn ? $finish1 : $finish2).addClass('player winner');

      if(playerOneTurn) {
        $('.playerOneWin').removeClass('hide');
        $('.aiWin').addClass('hide');
      } else {
        if(!isOnePlayer){
          $('.playerTwoWin').removeClass('hide');
        } else {
          $('.aiWin').removeClass('hide');
        }
      }
    }
  }
  // refactored as these events always happen regardless of who wins.
  function alwaysOnWin(){
    $winSound.play();
    $feedback.addClass('hide');
    $controller.addClass('hide');
    $reset.removeClass('hide');
    $resultBox.removeClass('hide');
  }

  // this function determines whos turn it is and updates the on screen pormpt accordingly, it is fired directly after the click event on move, and it fired if a boost happens after updating the boost boolean, it works on the one variable which gets updated of playerOneTurn from true to false.
  function determineTurn(){
    locateGary();
    $track = playerOneTurn ? $('.track2') : $('.track1');
    $turnText.text(playerOneTurn ? 'Player 2\'s Turn' : 'Player 1\'s Turn');
    playerOneTurn = !playerOneTurn;
  }

  // This function locates gary on the board, the seperate parts of the if else statement run based on which players turn it is, once doing so it fires off the moveGary function. Or if it detects the boost has been used(by it updating from 1 to 0 on the boost button click) if fires off the boostGary function instead, it then updates the boost count to 2 which informs the user the boost has been used when clicked again.
  function locateGary(){
    index = playerOneTurn ? $('.track1.player').index() : $('.track2.player').index();
    if(playerOneTurn){
      if(PlayerOneBoostRemaining > 0){
        $moveSound.play();
        moveGary();
      } else if(PlayerOneBoostRemaining === 0) {
        boostGary();
        PlayerOneBoostRemaining = 2;
      }
    } else{
      if(PlayerTwoBoostRemaining > 0){
        $moveSoundTwo.play();
        moveGary();
      }else if(PlayerTwoBoostRemaining === 0) {
        boostGary();
        PlayerTwoBoostRemaining = 2;
      }
    }
  }

  // This function moves gary, it first determines if it is a regular move or a boost move, if it is a regular move it moves the current players Gary between 1 and 3 index spaces along, finally, it runs the checkWinner function to see if a win condition has been met.
  function moveGary() {
    if(!isOnePlayer){
      $track.eq(index).removeClass('player');
      $track.eq(index + (Math.floor(Math.random() * 3) + 1 ) ).addClass('player');
      checkWinner();
    } else {
      $moveSound.play();
      $turnText.text('Player 1 get\'s moving!');
      $track.eq(index).removeClass('player');
      $track.eq(index + (Math.floor(Math.random() * 3) + 1 ) ).addClass('player');
      checkWinner();
      index = $('.track1.player').index();
      if(index < 21){
        aiMove();
      }
    }
  }

  // This function fires off if the boost button is clicked on, the click event updates the boost count and this function is called when the locateGary is running. It guarentees the user a move of 5 spaces then runs the check winner function to see if a win condition has been met. this if for the 2 player version.
  function boostGary() {
    if(!isOnePlayer){
      $track.eq(index).removeClass('player');
      $track.eq(index + 5).addClass('player');
      checkWinner();
    } else {
      $boostSound.play();
      $track.eq(index).removeClass('player');
      $track.eq(index + 5).addClass('player');
      checkWinner();
      index = $('.track1.player').index();
      if(index < 21){
        aiMove();
      }
    }
  }


  // the saltGary function. for the 2 player version.
  function saltGary() {
    if(!isOnePlayer){

      if(PlayerOneSaltRemaining === 0){
        PlayerOneSaltRemaining = 2;
        playerOneTurn = true;
        index = $('.track1.player').index();
        $turnText.text('Player 2 has been salted! Player 1 moves again!');
        moveGary();
      } else if(PlayerTwoSaltRemaining === 0){
        PlayerTwoSaltRemaining = 2;
        $turnText.text('Player 1 has been salted!   Player 2 moves again!');
        index = $('.track2.player').index();
        moveGary();
      }
    } else if(isOnePlayer){
      if(PlayerOneSaltRemaining === 0){
        playerOneTurn = true;
        $track = $('.track1');
        index = $('.track1.player').index();
        $turnText.text('Mecha Gary has been salted!   Player 1 moves again!');
        $track.eq(index).removeClass('player');
        $track.eq(index + (Math.floor(Math.random() * 3) + 1 ) ).addClass('player');
        PlayerOneSaltRemaining = 2;
        checkWinner();
      }
    }
  }
  // function below is for the one player mode, it tracks player 1s postion via the index and saves it in player 1 tracker, then makes a desicion based on that postion, the bigger the number in player tracker the more likeliness of it using one of the ability moves. The first three functions define the actual move to make it more readable in the actual ai desicion function. each move changes to player 1 turn false before calling checkWinner so can use the same function in both 1 p and 2 p version.
  function aiSalt(){
    $turnText.text('Mecha Gary has salted you, he moves again!');
    $saltSound.play();
    PlayerTwoSaltRemaining = 2;
    $track.eq(index).removeClass('player');
    $track.eq(index + (Math.floor(Math.random() * 3) + 1 ) ).addClass('player');
    setTimeout(function(){
      aiReg();
    }, 1000);
    playerOneTurn = false;
    checkWinner();
    playerOneTurn = true;
  }

  function aiBoost(){
    $boostSound.play();
    $track.eq(index).removeClass('player');
    $track.eq(index + 5).addClass('player');
    $turnText.text('Mecha Gary has boosted!   Player 1\'s turn ');
    playerOneTurn = false;
    PlayerTwoBoostRemaining = 2;
    checkWinner();
    playerOneTurn = true;
  }

  function aiReg(){
    $moveSoundTwo.play();
    $track.eq(index).removeClass('player');
    $track.eq(index + (Math.floor(Math.random() * 3) + 1 ) ).addClass('player');
    $turnText.text('Mecha Gary has made his move!   Player 1\'s turn');
    playerOneTurn = false;
    checkWinner();
    playerOneTurn = true;
  }

  function playerOneTrack(){
    index = $('.track1.player').index();
    playerOneTracker = index;
  }

  function aiMove(){
    playerOneTrack();
    $track = $('.track2');
    index = $('.track2.player').index();
    setTimeout(function(){
      if(playerOneTracker <= 4){
        aiReg();
      }else if(playerOneTracker > 4 && playerOneTracker < 15){
        aiMoveDecider = Math.floor(Math.random() * 5) + 1;
        if(aiMoveDecider <= 2){
          aiReg();
        }else if(aiMoveDecider > 2 && aiMoveDecider <=4 && PlayerTwoBoostRemaining === 1){
          aiBoost();
        } else if(aiMoveDecider > 2 && aiMoveDecider <=4 && PlayerOneBoostRemaining === 2){
          aiReg();
        } else if(aiMoveDecider === 5 && PlayerTwoSaltRemaining === 1){
          aiSalt();
        } else if(aiMoveDecider === 5 && PlayerTwoSaltRemaining === 2){
          aiReg();
        } else{
          aiReg();
        }
      }else if(playerOneTracker >= 15){
        aiMoveDecider = Math.floor(Math.random() * 5) + 1;
        if(aiMoveDecider <=3 && PlayerTwoBoostRemaining === 1){
          aiBoost();
        } else if(aiMoveDecider <=3 && PlayerTwoBoostRemaining === 2 && PlayerTwoSaltRemaining === 1){
          aiSalt();
        } else if(aiMoveDecider <=3 && PlayerTwoBoostRemaining === 2 && PlayerOneSaltRemaining === 2){
          aiReg();
        } else if(aiMoveDecider > 3 && PlayerOneSaltRemaining === 1){
          aiSalt();
        } else {
          aiReg();
        }
      }
    }, 1000);
  }
  // various event listeners below.

  // This is the click event for the move button, when clicked it fires off the determineTurn function which sets in motion the locateGary and moveGary functions. Now has a seperate part for the 1 version which skips the turn checker.
  function moveEvent(){
    if(!isOnePlayer){
      determineTurn();
    } else {
      $track = $('.track1');
      index = $('.track1.player').index();
      moveGary();
    }
  }
  $move.on('click', moveEvent);

  // this is the click event for the boost button, when clicked it checks first to see if the player has already used their boost, if not it updates that information and runs the determineTurn function like a normal move, when this reaches the locateGary function, it takes note that the boost has been used to fire off the boostGary function instead of the moveGary function. It then updates the boost remaining again, so that if another boost is attempted, it informs the user that their boost has already been used.
  function boostEvent(){
    if(!isOnePlayer){
      if(playerOneTurn){
        if(PlayerOneBoostRemaining === 1){
          $boostSound.play();
          PlayerOneBoostRemaining = 0;
          determineTurn();
        } else if(PlayerOneBoostRemaining === 2){
          $errorSound.play();
          $turnText.text('Player 1 boost already used!');
        }
      } else {
        if(PlayerTwoBoostRemaining === 1){
          $boostSound.play();
          PlayerTwoBoostRemaining = 0;
          determineTurn();
        } else if(PlayerTwoBoostRemaining === 2){
          $errorSound.play();
          $turnText.text('Player 2 boost already used!');
        }
      }
    } else {
      if(PlayerOneBoostRemaining === 1){
        $track = $('.track1');
        index = $('.track1.player').index();
        PlayerOneBoostRemaining = 2;
        $turnText.text('Player 1 uses boost!');
        boostGary();
      } else if (PlayerOneBoostRemaining === 2){
        $errorSound.play();
        $turnText.text('Player 1 has already used boost!');
      }
    }
  }
  $boost.on('click', boostEvent);
  // below is the event listener for the salt ability. Using this will stop your opponents next turn and give gary a normal garyMove while using it. If a player has already used their salt it informs them on the $turnText feedback.
  function saltEvent(){
    if(!isOnePlayer){
      if(playerOneTurn){
        if(PlayerOneSaltRemaining === 1){
          $saltSound.play();
          PlayerOneSaltRemaining = 0;
          saltGary();
        } else if(PlayerOneSaltRemaining === 2){
          $errorSound.play();
          $turnText.text('Player 1 has already used Salt!');
        }
      } else {
        if(PlayerTwoSaltRemaining === 1){
          $saltSound.play();
          PlayerTwoSaltRemaining = 0;
          saltGary();
        } else if(PlayerTwoSaltRemaining === 2){
          $errorSound.play();
          $turnText.text('Player 2 has already used Salt!');
        }
      }
    } else {
      if(PlayerOneSaltRemaining === 1){
        PlayerOneSaltRemaining = 0;
        $saltSound.play();
        saltGary();
      } else if(PlayerOneSaltRemaining ===2){
        $errorSound.play();
        $turnText.text('Player 1 has already used Salt!');
      }
    }
  }
  $salt.on('click', saltEvent);
  // Click event to start the game, removes the instruction page and then shows the racetrack, feedback box and controller. Have moved events that happen in both to the alwasy on start function.
  $start.on('click', () => {
    alwaysOnStart();
  });

  // click event to start the 1p option.
  $start1Player.on('click',() => {
    isOnePlayer = true;
    alwaysOnStart();
    $turnText.text('Make your first move!');

  });

  function alwaysOnStart(){
    $instructions.addClass('hide');
    $board.removeClass('hide');
    $controller.removeClass('hide');
    $feedback.removeClass('hide');
    $audioTheme.play();
  }

  // Event listener for the reset button, it basically hides all of the feedback from the remaining game and moves both player icons back to the start line, it also resets the salt and boost counters to 1 so that they can now be used again. funnction below that is some refactoring for commands that happen regardless of 1p or 2p mode.
  function reset(){
    alwaysOnReset();
    !isOnePlayer ? $('.playerTwoWin').addClass('hide') : $('.aiWin').addClass('hide');
  }
  $reset.on('click', reset);

  function alwaysOnReset(){
    $('.track1').removeClass('player winner');
    $('.start1').addClass('player');
    PlayerOneBoostRemaining = 1;
    PlayerOneSaltRemaining =1;
    $('.track2').removeClass('player winner');
    $('.start2').addClass('player');
    PlayerTwoBoostRemaining = 1;
    PlayerTwoSaltRemaining = 1;
    playerOneTracker = null;
    $('.controller').removeClass('hide');
    $('.feedback').removeClass('hide');
    $('.resultBox').addClass('hide');
    $('.playerOneWin').addClass('hide');
    $audioTheme.src = '';
    $audioTheme.src = 'sounds/closing_theme.mp3';
    $audioTheme.play();
  }
});
