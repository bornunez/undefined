'use strict'

function Chest(game, hero, x, y, MAPSCALE){
    this.game = game;
    this.hero = hero;
    this.open = false;
    console.log("Spawned Item: " + this.itType);
    //Creamos el objeto y le damos cuerpo
    Phaser.Sprite.call(this,this.game, x, y, 'chest');
    this.smoothed = false;
    this.scale.setTo(MAPSCALE,MAPSCALE);
    this.initPhysics();

    this.game.items.add(this);
    this.game.world.bringToTop(this.game.items);
}

//Las cosas de herencia
Chest.prototype = Object.create(Phaser.Sprite.prototype);
Chest.prototype.constructor = Chest;

Chest.prototype.update = function (){
    this.game.debug.body(this);
    this.game.physics.arcade.collide(this, this.hero);

    //Cuando estas realizando el ataque prueba el overlap
    /*
    if(this.hero.anim === 'Attack') {
        this.game.physics.arcade.overlap(this.hero.topAttack, this, function() { this.frame = 1; }, null, this);
        this.hero.animations.play('win');
    }
    */
}

Chest.prototype.initPhysics = function() {
    this.game.physics.arcade.enable(this);
    //Fisicas!
    this.body.collideWorldBounds = true;
    this.body.bounce.setTo(1, 1);
    this.body.moves = true;
    this.body.immovable = true;
  }


module.exports = Chest;