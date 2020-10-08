/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var roundScore;
var activePlayer;
var scores;
var activePlayer, dice, gamePlaying;
var previousRoll;
var winningScore;
init();

document.querySelector(".btn-roll").addEventListener("click", function () {
  if (gamePlaying) {
    var dice = Math.floor(Math.random() * 6) + 1;
    console.log(dice);
    var diceShow = document.querySelector(".dice");
    diceShow.style.display = "block";

    diceShow.src = "dice-" + dice + ".png";

    if (dice !== 1) {
      roundScore += dice;

      if (dice === previousRoll && dice === 2) {
        switch_player();
      } else {
        previousRoll = dice;
      }

      document.querySelector(
        "#current-" + activePlayer
      ).textContent = roundScore;
    } else {
      // document.querySelector(".player-0-panel").classList.remove("active");
      // document.querySelector(".player-1-panel").classList.add("active");
      switch_player();
    }
  } else {
    init();
  }
});

document.querySelector(".btn-hold").addEventListener("click", function () {
  // Add current score to global score
  scores[activePlayer] += roundScore;
  if (scores[activePlayer] >= winningScore) {
    set_winner();
  } else {
    document.querySelector("#score-" + activePlayer).textContent =
      scores[activePlayer];
    switch_player();
  }
});

document.querySelector(".btn-new").addEventListener("click", init);

function switch_player() {
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  roundScore = 0;
  previousRoll = 0;

  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");

  document.querySelector(".dice").style.display = "none";
}

function set_winner() {
  gamePlaying = false;
  document.querySelector("#name-" + activePlayer).textContent = "Winner!";
  document.querySelector(".dice").style.display = "none";
  document
    .querySelector(".player-" + activePlayer + "-panel")
    .classList.add("winner");
  document
    .querySelector(".player-" + activePlayer + "-panel")
    .classList.remove("active");
}

function init() {
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  gamePlaying = true;
  previousRoll = 0;
  input = document.querySelector(".end-game-score").value;

  if (input) {
    winningScore = input;
  } else {
    winningScore = 10;
  }

  dice = Math.floor(Math.random() * 6) + 1;

  var diceShow = document.querySelector(".dice");
  diceShow.style.display = "none";

  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";
  document.querySelector("#name-0").textContent = "Player 1";
  document.querySelector("#name-1").textContent = "Player 2";
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");
}
