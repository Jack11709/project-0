$(() => {
  // List of variables needed for the game
  const $move = $('.move');
  const $boost = $('.boost');
  const $turnText = $('.turn');
  const $finish1 = $('.finish1');
  const $finish2 = $('.finish2');
  // Variables that update during the game, based on turn/abilties used.
  let $track = $('.track1');
  let playerOneTurn = true;
  let PlayerOneBoostRemaining = 1;
  let PlayerTwoBoostRemaining = 1;
  let index = null;

  // function that checks to see if either player is in a winning position, postion is determines if the index of the occupied space is equal to or greater than 21(the finish line), there are hidden run off boxes that also evaulate the winner if the final move would of take then player passed index 21.
  function checkWinner(){
    if(playerOneTurn){
      index = $('.track1.player').index();
      console.log(index);
      if(index >= 21){
        alert('Player 1 wins!');
        $finish1.addClass('player');
        $move.addClass('hide');
        $boost.addClass('hide');
        $turnText.addClass('hide');
      }
    } else if(!playerOneTurn){
      index = $('.track2.player').index();
      console.log(index);
      if(index >= 21){
        alert('Player 2 wins!');
        $finish2.addClass('player');
        $move.addClass('hide');
        $boost.addClass('hide');
        $turnText.addClass('hide');
      }
    }
  }

// this function determines whos turn it is and updates the on screen pormpt accordingly, it is fired directly after the click event on move, and it fired if a boost happens after updating the boost boolean, it works on the one variable which gets updated of playerOneTurn from true to false.
  function determineTurn(){
    if(playerOneTurn){
      locateGary();
      playerOneTurn = false;
      $track = $('.track2');
      $turnText.text('Player 2\'s Turn');
    } else if(!playerOneTurn){
      locateGary();
      playerOneTurn = true;
      $track = $('.track1');
      $turnText.text('Player 1\'s Turn');
    }
  }

// This function locates gary on the board, the seperate parts of the if else statement run based on which players turn it is, once doing so it fires off the moveGary function. Or if it detects the boost has been used(by it updating from 1 to 0 on the boost button click) if fires off the boostGary function instead, it then updates the boost count to 2 which informs the user the boost has been used when clicked.
  function locateGary(){
    if(playerOneTurn){
      index = $('.track1.player').index();
      if(PlayerOneBoostRemaining > 0){
        moveGary();
      } else if(PlayerOneBoostRemaining === 0) {
        boostGary();
        PlayerOneBoostRemaining = 2;
      }
    } else if (!playerOneTurn){
      index = $('.track2.player').index();
      if(PlayerTwoBoostRemaining > 0){
        moveGary();
      }else if(PlayerTwoBoostRemaining === 0) {
        boostGary();
        PlayerTwoBoostRemaining = 2;
      }
    }
  }

  // This function moves gary, it first determines if it is a regular move or a boost move, if it is a regular move it moves the current players Gary between 1 and 3 index spaces along, finally, it runs the checkWinner function to see if a win condition has been met.
  function moveGary() {
    $track.eq(index).removeClass('player');
    $track.eq(index + (Math.floor(Math.random() * 3) + 1 ) ).addClass('player');
    checkWinner();
  }

// This function fires off if the boost button is clicked on, the click event updates the boost count and this function is called when the locateGary is running. It guarentees the user a move of 5 spaces then runs the check winner function to see if a win condition has been met.
  function boostGary() {
    $track.eq(index).removeClass('player');
    $track.eq(index + 5).addClass('player');
    checkWinner();
  }
// various event listeners below.

// This is the click event for the move button, when clicked it fires off the determineTurn function which sets in motion the locateGary and moveGary functions.
  $move.on('click', determineTurn);

// this is the click event for the boost button, when clicked it checks first to see if the player has already used their boost, if not it updates that information and runs the determineTurn function like a normal move, when this reaches the locateGary function, it takes note that the boost has been used to fire off the boostGary function instead of the moveGary function. It then updates the boost remaining again, so that if another boost is attempted, it informs the user that their boost has already been used.
  $boost.on('click', () =>{
    if(playerOneTurn){
      if(PlayerOneBoostRemaining === 1){
        PlayerOneBoostRemaining = 0;
        determineTurn();
      } else if(PlayerOneBoostRemaining === 2){
        alert('Player 1 boost already used!');
      }
    } else if (!playerOneTurn){
      if(PlayerTwoBoostRemaining === 1){
        PlayerTwoBoostRemaining = 0;
        determineTurn();
      } else if(PlayerTwoBoostRemaining === 2){
        alert('Player 2 boost already used!');
      }
    }
  });
});
