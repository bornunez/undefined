'use strict'
var Item = require('./Item.js');
var ItemType = require('./ItemType.js');
var BossArmy = require('./BossArmy.js');
var Door = require('./door.js');

function Room(game,playScene,MAPSCALE,number){
    this.playScene = playScene;
    this.game = game;
    this.number = number;
    this.MAPSCALE = MAPSCALE;
    this.init();
    this.active = true;

    this.open_door = this.game.add.audio('open_door');
}
Room.prototype.constructor = Room;

Room.prototype.init = function(){
    this.loadTriggers();
    this.loadEnemies();
    this.loadDoors();

    if(this.bossRoom)
        this.loadBossPoint();
    
}
//Vamos a guardar todos los trigger de la sala en el array
Room.prototype.loadTriggers = function(){
    this.TriggersInfo = this.playScene.findObjectsByType('T'+this.number,'Triggers');
    this.Triggers = this.game.add.group();
    //Usando la informacion de los Triggers ,creamos el trigger en si, y lo guardamos en el Array Triggers.
    this.TriggersInfo.forEach(function(element) {
        var trigger = this.createFromTiledObj(element.x,element.y,'trigger');
        this.bossRoom = element.name === 'BossTrigger';
        
        this.game.physics.arcade.enable(trigger);
        this.Triggers.add(trigger);
    }, this);
}
Room.prototype.loadBossDoor = function(){
    this.bossDoorInfo = this.playScene.findObjectsByType("BIND",'Puertas');
    console.log("Boss info [0] : " + this.bossDoorInfo[0].x);
    console.log("Boss info : " + this.bossDoorInfo.x);
    this.bossDoor = new Door(this.game,this.playScene.link,this.bossDoorInfo[0].x * this.MAPSCALE, this.bossDoorInfo[0].y * this.MAPSCALE,this.MAPSCALE, false);
    this.game.Puertas.add(this.bossDoor);
    this.game.world.bringToTop(this.bossDoor);
    console.log(this.bossDoor);
}

//Aqui solo vamos a leer y guardar la posicion de los enemigos de esta sala
Room.prototype.loadEnemies = function(){
    this.enemiesInfo = this.playScene.findObjectsByType('spawn'+this.number,'Esqueletos');
    this.cicloInfo = this.playScene.findObjectsByType('ciclo'+this.number,'Esqueletos');
    this.enemies = new Array();
}

Room.prototype.loadBossPoint = function(){
    this.bossPoints = this.playScene.findObjectsByType('point','Boss Points');
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

//Metodo encargado de generar a los enemigos de la sala
Room.prototype.Spawn = function(){
    //Primero borramos todos los triggers de la sala, ya que estos han sido activados
    this.Triggers.forEach(function(element) {
        element.destroy();
    }, this);
    
    if (this.active === true) {
        this.active = false;
        if(!this.bossRoom){
            //Ahora vamos a crear un enemigo a partir de la informacion que guardamos del json
            this.enemiesInfo.forEach(function (element) {
                //Los spawneamos y los metemos en el array que los manejara
                var enemy = this.playScene.addEnemy(element.x * this.MAPSCALE, element.y * this.MAPSCALE, this, 'stalker');
                this.enemies.push(enemy);
                
            }, this);
            this.cicloInfo.forEach(function (element) {
                var enemy = this.playScene.addEnemy(element.x * this.MAPSCALE, element.y * this.MAPSCALE, this, 'ciclo');
                this.enemies.push(enemy);
            }, this);
        }
        else{
            this.SpawnBoss();
        }
    }
    console.log("Enemigos activos: " + this.enemies.length);
}
Room.prototype.SpawnBoss = function(){
    this.loadBossDoor();
    this.game.music.stop();
    this.game.music = this.game.add.audio('boss_theme');
    this.game.music.play();
    
    var bossArmy = new BossArmy(this.game,0,0,this.playScene.link,this.MAPSCALE,1,1,'bossAnimations');
    this.bossPoints.forEach(function(element) {
        bossArmy.points.push({x: element.x * this.MAPSCALE, y: element.y * this.MAPSCALE});
    }, this);
    console.log(bossArmy.points);
    bossArmy.create();
}

Room.prototype.update = function(){
    //this.game.debug.body(this.Doors);
    this.game.physics.arcade.overlap(this.playScene.link,this.Triggers,this.Spawn,null,this);
    this.game.physics.arcade.collide(this.playScene.link,this.Doors);
    this.game.physics.arcade.overlap(this.playScene.link,this.Buttons,this.openDoors,null,this);
}

//Dada una x y una y de un objeto de tiled, se encargara de crear un sprite 'sprite' en la posicion correspondiente del mapa
Room.prototype.createFromTiledObj = function(x,y,spritename){
    var obj = this.game.add.sprite(x*this.MAPSCALE,y*this.MAPSCALE,spritename);
    obj.width *=this.MAPSCALE; obj.height *=this.MAPSCALE;
    obj.smoothed = false;
    return obj;
}

Room.prototype.checkEnemies = function(){
    //Simple: Si no quedan enemigos, se abre la puerta
    if(this.enemies.length<=0)
        this.openDoors();
}

Room.prototype.openDoors = function(){
    this.open_door.play();
    this.Doors.destroy(true);
}

//Esta funcion sera la encargada de manejar la muerte de un enemigo de esta sala, y la llamaran los enemigos cuando mueran
Room.prototype.killEnemy = function(enemy){
    //Borramos al enemigo del array, pero sin destruir su entidad, 
    //,ya que esta sera enviada de nuevo a la pool de enemigos
    var enemyN = this.enemies.indexOf(enemy);
    if(enemyN >= 0)
        this.enemies.splice(enemyN,1);
    //Finalmente vemos si se ha "pasado" la sala
    this.checkEnemies();
}
  module.exports = Room;