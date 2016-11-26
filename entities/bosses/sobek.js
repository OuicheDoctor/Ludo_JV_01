var Sobek = function(phaser, life) {
  	Boss.call(this, phaser, life);
	this.image = "sobek";
}

Sobek.prototype = Object.create(Boss.prototype);