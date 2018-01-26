'use strict';
var Character = require('./character.js');
var ItemType = require('./ItemType.js');
var Item = require('./Item.js');
var ItemSprite = ['arrow','rublos','hearts','keys','asciiforce',]

const NUM_POINTS = 6;
const POINT_OFFSET = 32;
const RAGEPOINT_OFFSET = 128;
const MAPSCALE = 5;

function Boss(game, x, y, target, vel, health, damage, points, spriteName, pointNumber){
    this.game = game; 
    this.target = target;
    this.pointNumber = pointNumber;
    Character.call(this,this.game, spriteName, x, y, vel, 2, 1);
    this.body.setSize(32, 32, 0, 16);
    this.focus = false;
    this.invulnerable = true;
    this.enragePoint = {
      'x': [],
      'y': []
      };
    this.points = points;
    this.animations.add('bossJump', Phaser.Animation.generateFrameNames('boss', 0, 9), 18, true);
    this.animations.add('bossEnraged', Phaser.Animation.generateFrameNames('enraged', 0, 9), 9, false);
    this.animations.add('bossHit', Phaser.Animation.generateFrameNames('enraged', 9, 18), 18, false);
    this.animations.play('bossJump');
}
//Herencia
Boss.prototype =  Object.create(Character.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.update = function(){
  if (this.game.bosses.length < 2) {
    this.body.setSize(32, 32, 0, 32);
    this.enrageMode();
    if(!this.invulnerable) {
      this.game.physics.arcade.overlap(this.target, this, this.target.playerCollision, null, this.target); 
    }
  }
  else {
    this.move();
    this.game.physics.arcade.overlap(this.target, this, this.target.playerCollision, null, this.target);
  }
}

Boss.prototype.move = function() {
  if((this.x > this.points[this.pointNumber].x + POINT_OFFSET || this.x < this.points[this.pointNumber].x - POINT_OFFSET) ||
    (this.y > this.points[this.pointNumber].y + POINT_OFFSET || this.y < this.points[this.pointNumber].y - POINT_OFFSET)) {
    this.game.time.events.add(Phaser.Timer.SECOND  * 1, this.goToPoint, this);
  }
  else {
    this.pointNumber++;
    if(this.pointNumber >= NUM_POINTS)
      this.pointNumber = 0;
  }
}

Boss.prototype.goToPoint = function() {
   if(!this.knockback) {
    var rotation = this.game.math.angleBetween(this.x, this.y, this.points[this.pointNumber].x , this.points[this.pointNumber].y);
    // Calcula el vector velocidad basandose en su rotacion
    this.body.velocity.x = Math.cos(rotation) * this.vel;
    this.body.velocity.y = Math.sin(rotation) * this.vel;
   }
}

Boss.prototype.enrageMode = function() {
  if(!this.focus) {
    this.animations.play('bossEnraged'); 
    this.enragePoint.x = this.target.x;
    this.enragePoint.y = this.target.y;
    this.focus = true;
  }
  var rotation = this.game.math.angleBetween(this.x, this.y, this.enragePoint.x, this.enragePoint.y);
  // Calcula el vector velocidad basandose en su rotacion
  this.body.velocity.x = Math.cos(rotation) * this.vel;
  this.body.velocity.y = Math.sin(rotation) * this.vel;

  if(this.x < this.enragePoint.x + RAGEPOINT_OFFSET && this.x > this.enragePoint.x - RAGEPOINT_OFFSET  && this.y < this.enragePoint.y + RAGEPOINT_OFFSET && this.y > this.enragePoint.y - RAGEPOINT_OFFSET && this.invulnerable) {
      this.invulnerable = false;
      this.animations.play('bossHit');
      this.animations.currentAnim.onComplete.add(this.hit, this);
  }
}


Boss.prototype.hit = function() {
  this.game.time.events.add(Phaser.Timer.SECOND  * 1.5, this.resetFocus, this);
}

Boss.prototype.resetFocus = function() {
    this.animations.play('bossEnraged'); 
    this.focus = false; 
    this.invulnerable = true;

}

Boss.prototype.die = function(){
  this.game.bosses.remove(this);
  var drop;
  if(this.game.bosses.length > 0)
  {
    drop = new Item(this.game, this.target, ItemType.Arrows , this.x, this.y, ItemSprite[ItemType.Arrows], MAPSCALE);
  }
  else{
    drop = new Item(this.game, this.target, ItemType.ASCIIForce , this.x, this.y, ItemSprite[ItemType.ASCIIForce], MAPSCALE);
  }
  this.game.world.bringToTop(drop);
  this.kill();
}

module.exports = Boss;