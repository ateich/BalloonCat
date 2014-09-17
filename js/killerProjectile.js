var KillerProjectile = function() {
  Projectiles.apply(this, arguments);
  clearInterval(this.moveInterval);
  this.moveInterval = setInterval(this.move.bind(this, function(){
    chopper.loseLife(100);
  }), this.moveTime);

  this.$node.removeClass('cupcake');
  this.$node.addClass('death pulse');
};

KillerProjectile.prototype = Object.create(Projectiles.prototype);
KillerProjectile.prototype.contructor = KillerProjectile;
