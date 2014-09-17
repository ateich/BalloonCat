var Chopper = function(yPosition){
  this.lives = 3;
  this.health = 3;
  this.y = $('body').height()/2-50;
  this.x = 100;
  this.points = 0;
  this.alive = true;

  this.$node = $('<div class="chopper shadow"></div>');
  $('body').append(this.$node);
  //this.$node.addClass('explosion');
  // this.$node.toggleClass('explosion');
  $('.stats').text("Lives: " + this.lives + " Health: " + this.health + " Points: " + this.points);

  // this.chopper = document.getElementsByClassName("chopper")[0];

  $('.chopper').css({left: this.x, top: this.y});
};

Chopper.prototype.moveUp = function(){
  if(this.y-10 > 0){
    this.y -= 20;
    $('.chopper').css({top: this.y});
  }
};

Chopper.prototype.moveDown = function(){
  if(this.y+100 < $('body').height()){
    this.y += 20;
    $('.chopper').css({top: this.y});
  }
};

Chopper.prototype.loseLife = function(livesLost){
  // var chopper = $('.chopper');

  if(!livesLost){
    livesLost = 1;
  }
  if(this.lives-livesLost< 0)
  {
    this.lives=0;
    this.health = 0;
  }else{
    this.lives-=livesLost;
  }
  if(this.health < 0)
  {
    this.health = 0;
  }
  $('.stats').text("Lives: " + this.lives + " Health: " + this.health + " Points: " + this.points);
  if(this.lives <= 0)
  {
    //this.$node.toggleClass('explosion');
     this.$node.addClass('explosion shadow');
     // console.log(document.getElementsByClassName("chopper"));
    // this.chopper.setAttribute('class', 'explosion');
    //Game Over

    setTimeout(function(){
      $('.stats').html("GAME OVER <br> Final Score: " + this.points);
      if(this.alive){
        gameOver();
      }
      this.alive = false;
    }.bind(this), 1000);

  } else {
    this.health = 3;
  $('.stats').text("Lives: " + this.lives + " Health: " + this.health + " Points: " + this.points);
    //Restart level
  }
};

Chopper.prototype.loseHealth = function(){
  if(this.health-1 >= 0)
  {
    this.health--;
  }
  $('.stats').text("Lives: " + this.lives + " Health: " + this.health + " Points: " + this.points);
  if(this.health === 0)
  {
    this.loseLife();
  }
  if(this.lives === 1){
     this.$node.removeClass('shadow');
     this.$node.addClass('redShadow pulse');
  }
};

Chopper.prototype.gainPoints = function(points){
  if(this.lives > 0){
    this.points += points;
    $('.stats').text("Lives: " + this.lives + " Health: " + this.health + " Points: " + this.points);
  }
};

