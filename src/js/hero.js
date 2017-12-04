'use strict';
var Character = require('./character.js');

function Hero(game){
    this.game = game;
    this.keyboard = this.game.input.keyboard;
}

//Enlazamos las propiedades prototype   
Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.create = function(){
    //Hacemos el Personaje
    Character.call(this,this.game,'link',0,0,3,3);
    this.keyBindings();
    this.width *=2;
    this.height *=2;
}
Hero.prototype.update = function(){
  this.input();
  this.walk();
  //Objeto(Disparar)
  if(this.space.isDown){
    if(this.canShoot)
      this.shoot();
  }
}

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

Hero.prototype.keyBindings = function(){
    //KeyBindings
    this.upKey = this.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = this.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.leftKey = this.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.space = this.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

module.exports = Hero;