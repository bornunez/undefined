'use strict';
var Character = require('./character.js');
const NUM_POINTS = 2

function Boss(game,x,y, target, MAPSCALE, vel,health,damage,spriteName){
    this.game = game; 
    this.target = target;
    this.pointNumber = 0;
    Character.call(this,this.game, spriteName,x,y,1,3,1);
    this.body.setSize(32, 32, 0, 16);
    this.focus = false;
    this.invulnerable = true;
    this.enragePoint = {
      'x': [],
      'y': []
      };

    this.points = {
      'x': [ this.target.x, this.target.x+200],
      'y': [ this.target.y, this.target.y+200 ]
      };

    this.animations.add('bossJump', Phaser.Animation.generateFrameNames('boss', 0, 9), 18, true);
    this.animations.add('bossEnraged', Phaser.Animation.generateFrameNames('enraged', 0, 9), 9, false);
    this.animations.add('bossHit', Phaser.Animation.generateFrameNames('enraged', 9, 18), 9, false);
   this.animations.play('bossJump');
  //this.animations.play('bossEnraged');
}
//Herencia
Boss.prototype =  Object.create(Character.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.update = function(){
  this.game.debug.body(this);

  //MODO NORMAL
  this.move();
  //LLAMAR CUANDO QUEDA UNO
  //this.enrageMode();
}

Boss.prototype.move = function() {

  if(this.x != this.points.x[this.pointNumber]  || this.y != this.points.y[this.pointNumber]) {
    this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.goToPoint, this);
  }
  else {
    this.pointNumber++;
    if(this.pointNumber >= NUM_POINTS)
      this.pointNumber = 0;
  }
}

Boss.prototype.goToPoint = function() {
  if(this.x < this.points.x[this.pointNumber])
    this.x++;
  else if(this.x > this.points.x[this.pointNumber])
    this.x--;

  if(this.y < this.points.y[this.pointNumber])
    this.y++;
  else if(this.y > this.points.y[this.pointNumber])
    this.y--;
}

Boss.prototype.enrageMode = function() {
  if(!this.focus) {
    this.enragePoint.x = this.target.x;
    this.enragePoint.y = this.target.y;
    this.focus = true;
  }

  if(this.x < this.enragePoint.x)
    this.x++;
  else if(this.x >  this.enragePoint.x)
    this.x--;

  if(this.y <  this.enragePoint.y)
    this.y++;
  else if(this.y >  this.enragePoint.y)
    this.y--;

  if(this.x === this.enragePoint.x  && this.y === this.enragePoint.y && this.invulnerable) {
    this.invulnerable = false;
    this.animations.play('bossHit');
    this.animations.currentAnim.onComplete.add(this.hit, this);
  }
}


Boss.prototype.hit = function() {
  this.body.enable = true; 
  this.game.time.events.add(Phaser.Timer.SECOND  * 4, this.resetFocus, this);
}

Boss.prototype.resetFocus = function() {
  this.animations.play('bossEnraged'); 
  this.body.enable = false; 
  this.focus = false; 
  this.invulnerable = true;

}

module.exports = Boss;