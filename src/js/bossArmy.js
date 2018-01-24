'use strict';
var Character = require('./character.js');
var Boss = require('./boss.js');

const NUM_POINTS = 6;
const NUM_BOSS = 6;
const BOSS_VEL = 200;


function BossArmy(game, x, y, target, health,damage,spriteName){
    this.game = game; 
    this.target = target;
    this.pointNumber = 0;
    this.points =new Array(); 
    this.game.bosses = this.game.add.group();

}

//Herencia
BossArmy.prototype =  Object.create(Phaser.Sprite.prototype);
BossArmy.prototype.constructor = Boss;

BossArmy.prototype.create = function(){
  var numPoint = 0;   //Variable que maneja en que punto aparece cada Boss
  this.points.forEach(function(element) {
    var boss =  new Boss(this.game, element.x , element.y , this.target, BOSS_VEL, 1, 1, this.points, 'bossAnimations', numPoint);
    numPoint++; 
    this.game.bosses.add(boss);
      }, this);
    this.game.world.bringToTop(this.game.bosses);
}




module.exports = BossArmy;