var chopper;
var gameOver;
var lobbyWindow;
var showLobby;
var makeProjectiles = [];
var projectileTime = 2000;
var instructionWindow;
var myDataRef = new Firebase('https://glowing-heat-1852.firebaseio.com//scoreList');

$(document).ready(function() {
  var startGame = function(){

    instructionWindow.remove();
    $('.newGameButton').remove();
    $('.newGameMulti').remove();
    $('.inputBox').remove();

    chopper = new Chopper(100);

    makeProjectiles.push(setInterval(function() {
      var projectile = new Projectiles();//CUPCAKE
    }, projectileTime/4));

    makeProjectiles.push(setInterval(function() {
      var projectile = new Projectile1();
    }, projectileTime));//CHEEZBURGER

    makeProjectiles.push(setInterval(function() {
      var projectile = new KillerProjectile();
    }, projectileTime/2));//DEATH
  };

  var instructions = function(){
    $('.highScores').remove();
    $('#mainMenu').remove();
    $('#newGame').remove();
    $('.inputBox').remove();
    $('.stats').empty();

    instructionWindow = $('<div class="instructions"></div>');
    instructionWindow.append('<h3>Instructions</h3>');
    instructionWindow.append('<div>Use the Up and Down Arrow Keys to Move <img class="shadow" height="75px" src="assets/cat.gif"/></div>');
    instructionWindow.append('<div>Eat yummy cheezburgers to gain points! <img class="shadow" src = "assets/cheeseburger.gif"/></div>');
    instructionWindow.append('<div>Avoid the Poisonous Cupcakes! They cause diabetes... <img class="shadow" width="40px" src = "assets/cupcake.gif"/></div>');
    instructionWindow.append('<div>Hide from DEATH! He will kill you! <img class="pulse shadow" width="40px" src = "assets/death.gif"/></div>');
    $('body').append(instructionWindow);
    $('body').append($('<button style="height:100px; margin-top:10;" class="newGameButton">Start Game</button>'));
    $('.newGameButton').on('click', function(){
      // console.log('NEW GAME');
      startGame();
    });

    //Multiplayer Button
    $('body').append($('<br><button style="height:100px; margin-top:10;" class="newGameMulti">Multiplayer</button>'));
    $('.newGameMulti').on('click', function(){
      showLobby();
    });
    //Multiplayer Button
    //
    //Highscore Button
    $('body').append($('<br><button style="height:100px; margin-top:10;" id="scores" class="newGameMulti">Leaderboard</button>'));
    $('#scores').on('click', function(){
      showScores();
    });
    //Highscore Button

  };

  instructions();
  // startGame();

  $( "body" ).keydown(function(e) {
    if(e.keyCode === 38){
      chopper.moveUp();
    }
    if(e.keyCode === 40){
      chopper.moveDown();
    }
  });


  showLobby = function(){
    console.log("LOBBY");
    instructionWindow.remove();
    $('.newGameButton').remove();
    $('.newGameMulti').remove();
    $('.inputBox').remove();
    $('.stats').remove();

    lobbyWindow = $('<div class="lobby"></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    $('body').append(lobbyWindow);
  };

  showScores = function(){
    instructionWindow.remove();
    $('.newGameButton').remove();
    $('.newGameMulti').remove();

    var scoreListView = myDataRef.limit(5);
    console.log(scoreListView);

    lobbyWindow = $('<div class="highScores"></div>');
    lobbyWindow.append('<div class="highScores">High Scores</div>');

    var leaders = [];
    myDataRef.once('value', function(data) {
        //console.log(data.val());
        for(var key in data.val()){
          leaders.push(data.val()[key]);
        }
        for(var i=leaders.length-1; i>=leaders.length-5; i--){
          lobbyWindow.append('<div class="score">' + leaders[i].name +' : ' + leaders[i].score + '</div>');
        }
        // console.log(leaders);
        lobbyWindow.append('<div><button id="scoreBackButton" style="height:100px; margin-top:10px; font-size:2.25em" class="newGameMulti">Back</button></div>');
        $('#scoreBackButton').on('click', function(){instructions();});
    });

    $('body').append(lobbyWindow);

  };

  gameOver = function(){
    for(var i =0; i<makeProjectiles.length; i++){
    clearInterval(makeProjectiles[i]);
    }


    $('body').append($('<div class="inputBox"><input autofocus id="playerName" placeholder="Your Name Goes Here" type="text"></input></div>'));
      $(".inputBox").keydown(function(e){
        if(e.keyCode == 13){
            var playerName = $("#playerName").val();
            console.log(chopper.points);
            var playerNode = myDataRef.child(playerName);
            playerNode.setWithPriority({ name:playerName, score:chopper.points }, chopper.points);
            $('#playerName').attr('placeholder', 'Added to Leaderboard');
            $('#playerName').prop('disabled', true);
            $("#playerName").val('');
       }

    });

    $('body').append($('<button id="newGame"class="newGameButton">New Game</button>'));
    $('body').append($('<br><button id="mainMenu" class="newGameButton">Main Menu</button>'));
    $('.projectiles').remove();
    $('.chopper').remove();

    $('#newGame').on('click', function(){
      console.log('NEW GAME');
      startGame();
    });
    $('#mainMenu').on('click', function(){
      // console.log('NEW GAME');
      instructions();
    });
  }

});
