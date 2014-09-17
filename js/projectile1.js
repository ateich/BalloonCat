var Projectile1 = function() {
  Projectiles.apply(this, arguments);
  clearInterval(this.moveInterval);
  this.moveInterval = setInterval(this.move.bind(this, function(){
    chopper.gainPoints(10);
  }), this.moveTime);


  this.$node.removeClass('cupcake');
  this.$node.addClass('cheezburger');
};

Projectile1.prototype = Object.create(Projectiles.prototype);
Projectile1.prototype.contructor = Projectile1;
