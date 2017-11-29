'using strict';
function Character(game,spriteName,x,y,vel,life,damage){
    this.game = game; 
    //Hacemos el sprite
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
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
    this.dir = 'None';
    this.life = life;
}
//Herencia
Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.walk = function(){
  //Movemos
  if(this.move){
    this.body.velocity.x = this.velX;
    this.body.velocity.y = this.velY;
  }
  else {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }
}
Character.prototype.damage= function(character){
    character.life -= this.dmg;
}
Character.prototype.die = function(){
    if(this.life <= 0)
        this.destroy();
}
Character.prototype.initPhysics = function(){
  //Fisicas!
  this.game.physics.enable(this);
  this.body.collideWorldBounds = true;
  this.body.bounce.setTo(1, 1);

  this.body.moves = true;

  this.body.checkCollision.up = true;
  this.body.checkCollision.down = true;
  this.body.immovable = true;
}
Character.prototype.scaleSprite = function(w,h){
  this.width *=w;
  this.height *=h;
}
module.exports = Character;