'use strict'

function Door(game, hero,x,y,MAPSCALE,boss){
    this.game = game;
    this.hero = hero;
    this.boss = boss;
    var spriteName;
    
    if(this.boss)
        spriteName = 'bossDoor';
    else
        spriteName = 'lockedDoor';
    //Creamos el objeto y le damos cuerpo
    Phaser.Sprite.call(this,this.game,x,y,spriteName);
    this.smoothed = false;
    this.scale.setTo(MAPSCALE,MAPSCALE);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
    this.game.Puertas.add(this);
    this.game.world.bringToTop(this.game.Puertas);
    this.open_door = this.game.add.audio('open_door');
}
Door.prototype =  Object.create(Phaser.Sprite.prototype);
Door.prototype.constructor = Door;

Door.prototype.update = function(){
    this.game.physics.arcade.collide(this,this.hero,this.checkOpen,null,this);
}
Door.prototype.checkOpen = function(){
    if(this.boss){
        if(this.hero.keyboss){
            this.open_door.play();
            this.destroy();
        }
    }
    else{
        if(this.hero.items[3] > 0){
            this.destroy();
            this.hero.items[3]--;
            this.open_door.play();
        }
    }
}

module.exports = Door;