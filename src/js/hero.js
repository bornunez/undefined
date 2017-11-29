'use strict';
var Character = require('./character.js');
var Shot = require('./shot.js');

function Hero(game){
    this.game = game;
    this.keyboard = this.game.input.keyboard;
}

//Enlazamos las propiedades prototype   
Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

//La funcion para inicializar, crear el sprite y sus variables
Hero.prototype.create = function(){
    //Hacemos el Personaje
    Character.call(this,this.game,'link',0,0,3,3);
    this.scaleSprite(2,2);
    this.keyBindings();
}
//Update, lee input y se mueve / dispara
Hero.prototype.update = function(){
  this.input();
  this.walk();
  //Objeto(Disparar)
  if(this.space.isDown){
    if(this.canShoot)
      this.shoot();
  }
}

//Input del Heroe ////FEOOO////
Hero.prototype.input = function(){
      //Y axis
      if(this.upKey.isDown){
        if(this.dir === 'None')
          this.dir = 'Up'
        this.velY = -200;
        this.move = true;
      }
      else if(this.downKey.isDown){
        if(this.dir === 'None')
          this.dir = 'Down'
        this.velY = 200;
        this.move = true;
      }
      else {
        if(this.velX != 0)
          this.velY = 0;
        else
          this.move = false; 
      }
      //X Axis
      if(this.leftKey.isDown){
        this.move = true;
        this.velX = -200;
      }
      else if (this.rightKey.isDown){
        this.move = true;
        this.velX = 200;
      }
      else{
        if(this.velY != 0)
          this.velX = 0;
        else
          this.move = false;  
      }
}
//Disparo
Hero.prototype.shoot = function(){
  console.log("PIUUM");
  var arrow = new Shot(this.game,this.x,this.y,5,this.velX,this.velY,'link');
  this.game.world.addChild(arrow);
}
//Crea las teclas de input
Hero.prototype.keyBindings = function(){
  //KeyBindings
  this.upKey = this.keyboard.addKey(Phaser.Keyboard.UP);
  this.downKey = this.keyboard.addKey(Phaser.Keyboard.DOWN);
  this.leftKey = this.keyboard.addKey(Phaser.Keyboard.LEFT);
  this.rightKey = this.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.space = this.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.eKey = this.keyboard.addKey(Phaser.Keyboard.E);
  this.canShoot = true;
}
module.exports = Hero;