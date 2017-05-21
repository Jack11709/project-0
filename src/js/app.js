$(() => {
  // List of variables needed for the game
  const $move = $('.move');
  let $track = $('.track1');
  const $boost = $('.boost');
  const $turnText = $('.turn');
  const $finish1 = $('.finish1');
  const $finish2 = $('.finish2');
  // Variables that updates during the game, based on turn/abilties used.
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
// This function locates gary on the board, the seperate parts of the if else statement run based onw hich places turn it is, once doing so it fires off the moveGary function.
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

  // This function moves gary, it first determines if it is a regular move or a boost move, if it is a regular move it moves the current players Gary between 1 and 3 index spaces along, if boost is used it gives a guarenteed 5 space move.
  function moveGary() {
    $track.eq(index).removeClass('player');
    $track.eq(index + (Math.floor(Math.random() * 3) + 1 ) ).addClass('player');
    checkWinner();
  }

// This function fires off if the boost button is clicked. it updates each players boostUsed boolean, then runs the other functions as normal.
  function boostGary() {
    $track.eq(index).removeClass('player');
    $track.eq(index + 5).addClass('player');
    checkWinner();
  }
// various event listeners below.
  $move.on('click', determineTurn);

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
