var Projectiles = function() {
  this.x = $('body').width();
  this.y = Math.random() * ($('body').height()-50);

  this.moveAmount = 4;
  this.moveTime = 18;
  if(chopper.points > 100){
    this.moveAmount = 6;
  } else if(chopper.points > 200){
    this.moveAmount = 8;
  } else if(chopper.points > 400){
    this.moveAmount = 8;
    this.moveTime = 8;
    projectileTime = 750;
  } else if(chopper.points > 800){
    this.moveAmount = 8;
    this.moveTime = 8;
    projectileTime = 500;
  }  else if(chopper.points > 1000){
    this.moveAmount = 8;
    this.moveTime = 8;
    projectileTime = 250;
  }


  this.$node = $('<div class="projectiles cupcake shadow"></div>');
  $('body').append(this.$node);
  this.$node.css('left', this.x);
  this.$node.css('top', this.y);
  this.moveInterval = setInterval(this.move.bind(this, function(){
    chopper.loseHealth();
  }), this.moveTime);
};

Projectiles.prototype.move = function(hitCall) {
  this.x -= this.moveAmount;
  this.$node.css('left', this.x);

  var chopperPos = $('.chopper').position();

  if(!chopperPos){
    clearInterval(this.moveInterval);
    return;
  }

  if(this.x < chopperPos.left + $('.chopper').width() && this.x > chopperPos.left){
    if(this.y > chopperPos.top && this.y < chopperPos.top + $('.chopper').height()){
      hitCall();
      this.$node.remove();
      clearInterval(this.moveInterval);
    }
  } else if(this.x < -50){
    this.$node.remove();
    clearInterval(this.moveInterval);
  }
};
