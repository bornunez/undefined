'use strict';

const KNOCK_VEL = 500;

function Character(game, spriteName, x, y, vel, health, damage){
    this.game = game; 
    //Hacemos el sprite
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
    this.scale.setTo(4.5,4.5);
    this.anchor.setTo(0.5, 0.5)
    this.smoothed = false;
    //Inicializamos las fisicas
    this.initPhysics();
    //Rellenamos e inicializamos los fields
    this.x = x;
    this.y = y;
    this.vel = vel;
    this.velX = 0;
    this.velY = 0;
    this.dmg = damage;
    this.dir = 'Down';
    this.health = health;
    //Knockback
    this.control = true;
    this.knockback = false;
    this.game.world.addChild(this);
}
//Herencia
Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.walk = function(){
  //Movemos
  if(this.control){
    if(this.move){
        this.body.velocity.x = this.velX*this.vel;
        this.body.velocity.y = this.velY*this.vel; 
    }
    else {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
    }
  }
}

Character.prototype.update = function(){
  if(this.health <= 0)
    this.destroy();
  if(this.knockback)
    checkKnocked();
}

Character.prototype.damage= function(character){
    character.health -= this.dmg;
}

Character.prototype.die = function(){
    if(this.health <= 0)
        this.destroy();
}

  //Fisicas
Character.prototype.initPhysics = function(){
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;
  this.body.moves = true;
}

Character.prototype.applyKnockback = function(enemy){

  var distance = 200;

  if(!this.knockback){
    //Quita vida
    enemy.damage(this);
    //Nos volvemos invulnerables
    this.inmortal = true;
    this.control = false;
    //Vector de direccion del knockback
    this.knockedDir (enemy);	
    //Empuje
    var knockedVelocityX = this.knockDirX * KNOCK_VEL;	
    var knockedVelocityY = this.knockDirY * KNOCK_VEL;	
    this.body.velocity.x = knockedVelocityX;
    this.body.velocity.y = knockedVelocityY;
    //Y nos ponemos translucidos
    this.alpha = 0.5;
    this.knockback = true;
    this.game.time.events.add(Phaser.Timer.SECOND  * 0.2, this.stopKnocked, this);
  }
}

Character.prototype.knockedDir = function(enemy){
  //Vector direccion del knockback
  var dx = this.x - enemy.x;
  var dy = this.y - enemy.y;
  if(Math.abs(dx) > Math.abs(dy)){
    this.knockDirX = dx / Math.abs(dx);
    this.knockDirY = 0;
  }
  else{
    this.knockDirY = dy / Math.abs(dy);
    this.knockDirX = 0;
  }
}

//Vemos si hemos acabado el knockback (*KNOCK* *KNOCK* *KNOCK* PENNY...)
Character.prototype.stopKnocked = function(){
  if(this.body !== null){
    //Si hemos sido empujados tan lejos como tendriamos, se vuelve al estado normal
    this.knockback = false;
    //La velocidad
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    //Y activamos el flag de control
    this.control = true;
    this.knockedToX = 0;
    this.knockedToY = 0;
    //Y si es un enemigo se pone normal, el heroe no ya que es invulnerable despues de que acabe el knockback
    if(this.target != null)
      this.alpha = 1;
      
    this.x = Math.trunc(this.x);
    this.y = Math.trunc(this.y);
  }
}

Character.prototype.spawn = function(x,y){
  this.x = x;
  this.y = y;
}

module.exports = Character;