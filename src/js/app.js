$(() => {
  const $move = $('.move');
  let $track = $('.track1');
  const $boost = $('.boost');
  const $turnText = $('.turn');
  let playerOneTurn = true;
  let boostUsed = false;
  let index = null;

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

  function locateGary(){
    if(playerOneTurn){
      index = $('.track1.player').index();
      moveGary();
    } else if (!playerOneTurn){
      index = $('.track2.player').index();
      moveGary();
    }

  }

  function moveGary() {
    if(!boostUsed){
      $track.eq(index).removeClass('player');
      $track.eq(index + (Math.floor(Math.random() * 3) + 1 ) ).addClass('player');
    } else if(boostUsed){
      $track.eq(index).removeClass('player');
      $track.eq(index + 5).addClass('player');
      boostUsed = false;
    }
  }

  function boostGary() {
    boostUsed = true;
    locateGary();
  }

  $move.on('click', determineTurn);
  $boost.one('click', boostGary);
});
