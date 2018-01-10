'use strict'
function Room(game,playScene,MAPSCALE,number){
    this.playScene = playScene;
    this.game = game;
    this.number = number;
    this.MAPSCALE = MAPSCALE;
    this.init();
    this.active = true;
}
Room.prototype.constructor = Room;

Room.prototype.init = function(){
    this.loadTriggers();
    this.loadEnemies();
    this.loadDoors();
}
//Vamos a guardar todos los trigger de la sala en el array
Room.prototype.loadTriggers = function(){
    this.TriggersInfo = this.playScene.findObjectsByType('T'+this.number,'Triggers');
    this.Triggers = this.game.add.group();
    //Usando la informacion de los Triggers ,creamos el trigger en si, y lo guardamos en el Array Triggers.
    this.TriggersInfo.forEach(function(element) {
        var trigger = this.createFromTiledObj(element.x,element.y,'trigger');
        
        this.game.physics.arcade.enable(trigger);
        this.Triggers.add(trigger);
    }, this);
}
Room.prototype.loadEnemies = function(){
    this.enemiesInfo = this.playScene.findObjectsByType('spawn'+this.number,'Esqueletos');
    this.enemies = new Array();
}
Room.prototype.loadDoors = function(){
    this.doorsInfo = this.playScene.findObjectsByType('D'+ this.number, 'Puertas');
    this.Doors = this.game.add.group();
    this.doorsInfo.forEach(function(element) {
        var door = this.createFromTiledObj(element.x,element.y,'door');
        this.game.physics.arcade.enable(door);
        //door.body.inmovable = true;
        door.body.moves = false;
        this.Doors.add(door);
    }, this);
}

//Primero borramos todos los triggers que haya. Luego spawneamos todos los enemigos que hubiera en las posiciones
Room.prototype.Spawn = function(){
    this.Triggers.forEach(function(element) {
        element.destroy();
    }, this);
    if(this.active === true){ 
        this.enemiesInfo.forEach(function(element) {
            var enemy = this.playScene.addEnemy(element.x*this.MAPSCALE,element.y*this.MAPSCALE,this.enemies);    
            this.enemies.push(enemy);
        }, this);
        this.active = false;    
    }
    console.log(this.enemies.length);
}
Room.prototype.update = function(){
    this.game.debug.body(this.Doors);
    this.game.physics.arcade.overlap(this.playScene.link,this.Triggers,this.Spawn,null,this);
    this.game.physics.arcade.collide(this.playScene.link,this.Doors);
}
Room.prototype.createFromTiledObj = function(x,y,spritename){
    var obj = this.game.add.sprite(x*this.MAPSCALE,y*this.MAPSCALE,spritename);
    obj.width *=this.MAPSCALE; obj.height *=this.MAPSCALE;
    obj.smoothed = false;
    return obj;
}

  module.exports = Room;