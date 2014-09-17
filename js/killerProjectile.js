var KillerProjectile = function() {
  Projectiles.apply(this, arguments);
  clearInterval(this.moveInterval);
  this.hitCall = function(){
    chopper.loseLife(100);
  };

  this.$node.removeClass('cupcake');
  this.$node.addClass('death pulse');
};

KillerProjectile.prototype = Object.create(Projectiles.prototype);
KillerProjectile.prototype.contructor = KillerProjectile;
