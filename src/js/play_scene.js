'use strict';

var PlayScene = {
  create: function () {
    //Prepare the keyboard so that the human player can move link arround
    this.keyboard = this.game.input.keyboard;
    
    //Bindeos de teclas
    this.upKey = this.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = this.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.leftKey = this.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.space = this.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //Create the player sprite and enable the physics
    this.link = new Hero("Link",this.game.world.centerX,this.world.game.world.centerY,3);
    this.game.world.addChild(this.link);
  },
  update: function(){
    //this.link.update();
  }
};

function Hero(name, nx, ny, vel){
  
  Phaser.Sprite.call(this, PlayScene.game, nx, ny, 'link');
  this.x = nx;
  this.y = ny;
  //Datos del sprite 
  this.width *= 4;
  this.height *= 4;
  this.smoothed = false;
  //Datos de Link
  this._name = name;
  this._vel = vel;
  this._velX = 0;
  this._velY = 0;
  this.dir = 'None';
  this.move = false;
  this.canShoot = true;
};
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.constructor = Hero;

Hero.prototype.update= function(){
  console.log("Link update");
  //Y axis
  if(PlayScene.upKey.isDown){
    if(this.dir === 'None')
      this.dir = 'Up'
    this._velY = -1;
    this.move = true;
  }
  else if(PlayScene.downKey.isDown){
    if(this.dir === 'None')
      this.dir = 'Down'
    this._velY = 1;
    this.move = true;
  }
  else {
    if(this._velX != 0)
      this._velY = 0;
    else
      this.move = false; 
  }
  //X Axis
  if(PlayScene.leftKey.isDown){
    this.move = true;
    this._velX = -1;
  }
  else if (PlayScene.rightKey.isDown){
    this.move = true;
    this._velX = 1;
  }
  else{
    if(this._velY != 0)
      this._velX = 0;
    else
    this.move = false;  
  }
  //Movemos
  if(this.move){
    this.x += this._velX * this._vel;
    this.y += this._velY * this._vel;
  }
  //Objeto(Disparar)
  if(PlayScene.space.isDown){
    if(this.canShoot)
      this.shoot();
  }
}
Hero.prototype.shoot = function(){
  var arrow = new Arrow(PlayScene.game,this.x,this.y,this._velX,this._velY);
  PlayScene.game.world.addChild(arrow);
  this.canShoot = false;
  PlayScene.game.time.events.add(Phaser.Timer.SECOND * 1, this.shootCD, this);
}
Hero.prototype.shootCD = function(){
  this.canShoot = true;
}


function Arrow(game,X, Y, VELX, VELY){

  Phaser.Sprite.call(this,game, X, Y, 'link');

  this.vel = 5;
  this.x = X;
  this.y = Y;
  this.velX = VELX;
  this.velY = VELY;

  //Llamamos al timer para destruir
  game.time.events.add(Phaser.Timer.SECOND * 1, this.arrowdestroy, this);
}
Arrow.prototype = Object.create(Phaser.Sprite.prototype);
Arrow.constructor = Arrow;
Arrow.prototype.update = function(){
  this.y += this.velY*this.vel;
  this.x += this.velX*this.vel;
}
Arrow.prototype.arrowdestroy = function(){
  this.destroy();
}
module.exports = PlayScene;
