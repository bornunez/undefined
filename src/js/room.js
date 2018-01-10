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

//Primero creamos la informacion de cada puerta, y luego las instanciamos como objetos inmovibles.
Room.prototype.loadDoors = function(){
    //Primero queremos la info
    this.doorsInfo = this.playScene.findObjectsByType('D'+ this.number, 'Puertas');
    this.Doors = this.game.add.group();
    //Y luego los instanciamos
    this.doorsInfo.forEach(function(element) {
        //Creamos el sprite
        var door = this.createFromTiledObj(element.x,element.y,'door');
        //Y le aplicamos las fisicas
        this.game.physics.enable(door, Phaser.Physics.ARCADE);
        door.body.immovable = true;
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
            var enemy = this.playScene.addEnemy(element.x*this.MAPSCALE,element.y*this.MAPSCALE,this);    
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
Room.prototype.checkEnemies = function(){
    //Simple: Si no quedan enemigos, se abre la puerta
    if(this.enemies.length<=0)
        this.Doors.destroy(true);
}
Room.prototype.killEnemy = function(enemy){
    //Borramos al enemigo del array, pero sin destruir su entidad, 
    //,ya que esta sera enviada de nuevo a la pool de enemigos
    var enemyN = this.enemies.indexOf(enemy);
    if(enemyN >= 0)
        this.enemies.splice(enemyN,1);
}
  module.exports = Room;