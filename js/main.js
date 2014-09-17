var chopper;
var gameOver;
var lobbyWindow;
var showLobby;
var makeProjectiles = [];
var projectileTime = 2000;
var instructionWindow;
var myDataRef = new Firebase('https://glowing-heat-1852.firebaseio.com//scoreList');
var projectiles = [];
var moveProjectileTime = 18;
var projectileInterval;

$(document).ready(function() {

  //Moves the projectiles across the screen at a set speed
  var moveProjectiles = function(){
    for(var i=0; i<projectiles.length; i++){
      projectiles[i].iPosition = i;
      projectiles[i].move(this.hitCall);
    }
  };

  var clearScreen = function(){
    $('.newGameButton').remove();
    $('.newGameMulti').remove();
    $('.inputBox').remove();
    $('.highScores').remove();
    $('#mainMenu').remove();
    $('#newGame').remove();

    $('br').remove();//This make cause issues in the future if we want breaklines to stay

    //Not sure if this is necessary
    var stats = $('.stats');
    for(var i=1; i<stats.length; i++)
    {
      stats[i].remove();
    }
    stats.empty();
  };

  //Starts a New Game
  var startGame = function(){
    instructionWindow.remove();
    clearScreen();
    chopper = new Chopper(100);

    //Sets the speed of the projectiles and tells them to move
    projectileInterval = setInterval(function(){
      if(chopper && chopper.points > 100){
        moveProjectileTime = 6;
      } else if(chopper && chopper.points > 200){
        moveProjectileTime = 8;
      }
      moveProjectiles();
    }, moveProjectileTime);

    //Makes the various projectiles at staggered intervals
    makeProjectiles.push(setInterval(function() {
      projectiles.push( new Projectiles())
    }, projectileTime/4));

    makeProjectiles.push(setInterval(function() {
      projectiles.push( new Projectile1())
    }, projectileTime));//CHEEZBURGER

    makeProjectiles.push(setInterval(function() {
      projectiles.push( new KillerProjectile())
    }, projectileTime/2));//DEATH
  };

  //Instructions / Welcome Window
  var instructions = function(){
    clearScreen();

    //The instructions
    instructionWindow = $('<div class="instructions"></div>');
    instructionWindow.append('<h3>Instructions</h3>');
    instructionWindow.append('<div>Use the Up and Down Arrow Keys to Move <img class="shadow" height="75px" src="assets/cat.gif"/></div>');
    instructionWindow.append('<div>Eat yummy cheezburgers to gain points! <img class="shadow" src = "assets/cheeseburger.gif"/></div>');
    instructionWindow.append('<div>Avoid the Poisonous Cupcakes! They cause diabetes... <img class="shadow" width="40px" src = "assets/cupcake.gif"/></div>');
    instructionWindow.append('<div>Hide from DEATH! He will kill you! <img class="pulse shadow" width="40px" src = "assets/death.gif"/></div>');

    $('body').append(instructionWindow);
    $('body').append($('<button style="height:100px; margin-top:10;" class="newGameButton">Start Game</button>'));

    $('.newGameButton').on('click', function(){
      startGame();
    });

    //Multiplayer Button
    $('body').append($('<br><button style="height:100px; margin-top:10;" class="newGameMulti">Multiplayer</button>'));
    $('.newGameMulti').on('click', function(){
      showLobby();
    });

    //Highscore Button
    $('body').append($('<br><button style="height:100px; margin-top:10;" id="scores" class="newGameMulti">Leaderboard</button>'));
    $('#scores').on('click', function(){
      showScores();
    });

  };

  //Open the game to the instructions / welcome screen
  instructions();

  // During the game, keep track of keystrokes for player movement
  $( "body" ).keydown(function(e) {
    if(e.keyCode === 38){
      chopper.moveUp();
    }
    if(e.keyCode === 40){
      chopper.moveDown();
    }
  });


  // Multiplayer Lobby - Under Development
  showLobby = function(){
    clearScreen();

    lobbyWindow = $('<div class="lobby"></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    lobbyWindow.append('<div><button class="joinMulti">Join Game</button></div>');
    $('body').append(lobbyWindow);
  };

  // High Score Page
  showScores = function(){
    instructionWindow.remove();
    $('.newGameButton').remove();
    $('.newGameMulti').remove();

    lobbyWindow = $('<div class="highScores"></div>');
    lobbyWindow.append('<div class="highScores">High Scores</div>');

    //Get the 5 highest scores from Firebase and add them the the window
    var leaders = [];
    myDataRef.once('value', function(data) {

        for(var key in data.val()){
          leaders.push(data.val()[key]);
        }
        for(var i=leaders.length-1; i>=leaders.length-5; i--){
          lobbyWindow.append('<div class="score">' + leaders[i].name +' : ' + leaders[i].score + '</div>');
        }

        lobbyWindow.append('<div><button id="scoreBackButton" style="height:100px; margin-top:10px; font-size:2.25em" class="newGameMulti">Back</button></div>');
        $('#scoreBackButton').on('click', function(){instructions();});
    });

    $('body').append(lobbyWindow);

  };

  // Game is Over, move to screen with Final Score
  gameOver = function(){
    for(var i =0; i<makeProjectiles.length; i++){
     clearInterval(makeProjectiles[i]);
    }
    projectiles = [];
    clearInterval(projectileInterval);

    $('body').append($('<div class="inputBox"><input autofocus id="playerName" placeholder="Your Name Goes Here" type="text"></input></div>'));
    $(".inputBox").keydown(function(e){
      if(e.keyCode == 13){
        addPlayerScore();
      }
    });

    // Add player name and score to Firebase
    var addPlayerScore = function(){
      var playerName = $("#playerName").val();

      // Make sure the player entered a name
      if(playerName){
        var playerNode = myDataRef.child(playerName);
        playerNode.setWithPriority({ name:playerName, score:chopper.points }, chopper.points);

        $('#playerName').attr('placeholder', 'Added to Leaderboard');
        $('#playerName').prop('disabled', true);
        $("#playerName").val('');

        console.log("ADDED SCORE TO FB");
      }
    };

    // Buttons to start a new game, or return to the main menu
    $('body').append($('<button id="newGame"class="newGameButton">New Game</button>'));
    $('body').append($('<br><button id="mainMenu" class="newGameButton">Main Menu</button>'));
    $('.projectiles').remove();
    $('.chopper').remove();

    $('#newGame').on('click', function(){
      addPlayerScore();
      startGame();
    });
    $('#mainMenu').on('click', function(){
      addPlayerScore();
      instructions();
    });
  }

});
